import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { fetchAds, fetchAdsGrouped, AD_CATEGORIES, CATEGORY_ROUTES } from './ads/ad-fetcher.js'
import { scrapeVisitEgyptTrips, refreshVisitEgyptTrips } from './ads/visitegypt-scraper.js'

// ─── Configuration ───────────────────────────────────────────
const PORT = process.env.SERVER_PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

// Paymob configuration
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET
const PAYMOB_BASE_URL = 'https://accept.paymob.com/api'

// Validate required env vars
if (!STRIPE_SECRET_KEY) {
  console.error('⚠️  STRIPE_SECRET_KEY is missing in .env — Stripe payments disabled')
}

if (!PAYMOB_API_KEY) {
  console.error('⚠️  PAYMOB_API_KEY is missing in .env — Paymob payments disabled')
}

// ─── Initialize Stripe ───────────────────────────────────────
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' })
  : null

// ─── Initialize Supabase ─────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Express App ─────────────────────────────────────────────
const app = express()

// CORS — allow frontend origin
app.use(cors({
  origin: CLIENT_URL,
  methods: ['GET', 'POST'],
  credentials: true,
}))

// ─── Paymob Helper Functions ─────────────────────────────────
async function paymobAuthenticate() {
  const res = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  })
  const data = await res.json()
  if (!data.token) throw new Error('Paymob authentication failed')
  return data.token
}

async function paymobCreateOrder(authToken, { amountCents, merchantOrderId, items }) {
  const res = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: 'EGP',
      merchant_order_id: merchantOrderId,
      items: items || [],
    }),
  })
  const data = await res.json()
  if (!data.id) throw new Error('Paymob order creation failed')
  return data
}

async function paymobCreatePaymentKey(authToken, {
  orderId,
  amountCents,
  billingData,
  integrationId,
  currency = 'EGP',
  lockOrderWhenPaid = true,
}) {
  const res = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600, // 1 hour
      order_id: orderId,
      billing_data: billingData,
      currency,
      integration_id: integrationId,
      lock_order_when_paid: lockOrderWhenPaid,
    }),
  })
  const data = await res.json()
  if (!data.token) throw new Error('Paymob payment key creation failed')
  return data.token
}

function verifyPaymobHmac(reqBody) {
  if (!PAYMOB_HMAC_SECRET) return true // skip in dev
  const obj = reqBody.obj
  // Paymob HMAC concatenation order (alphabetical by key)
  const hmacString = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id || obj.order,
    obj.owner,
    obj.pending,
    obj.source_data?.pan || '',
    obj.source_data?.sub_type || '',
    obj.source_data?.type || '',
    obj.success,
  ].join('')

  const computed = crypto
    .createHmac('sha512', PAYMOB_HMAC_SECRET)
    .update(hmacString)
    .digest('hex')

  return computed === reqBody.hmac
}

// ─── Stripe Webhook endpoint MUST use raw body (before json middleware) ───
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' })
  const sig = req.headers['stripe-signature']

  let event
  try {
    if (STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET)
    } else {
      // In development without webhook secret, parse manually
      event = JSON.parse(req.body.toString())
      console.warn('⚠️  No STRIPE_WEBHOOK_SECRET set — skipping signature verification')
    }
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      console.log('✅ Payment successful:', session.id)

      // Update payment record in Supabase
      try {
        const { error } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            stripe_payment_intent: session.payment_intent,
            customer_email: session.customer_details?.email || session.customer_email,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)

        if (error) {
          console.error('❌ Supabase update error:', error)
        } else {
          console.log('✅ Payment record updated in database')
        }
      } catch (err) {
        console.error('❌ Database update failed:', err)
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object
      console.log('⏰ Session expired:', session.id)

      try {
        await supabase
          .from('payments')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)
      } catch (err) {
        console.error('❌ Database update failed:', err)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object
      console.log('❌ Payment failed:', paymentIntent.id)
      break
    }

    default:
      console.log(`ℹ️  Unhandled event type: ${event.type}`)
  }

  res.json({ received: true })
})

// ─── JSON body parser for all other routes ───────────────────
app.use(express.json())

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    stripe: !!STRIPE_SECRET_KEY,
    supabase: !!SUPABASE_URL,
  })
})

// ═══════════════════════════════════════════════════════════════
// ─── ADS ENDPOINTS ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/ads
 * Returns all 50 ads.  Optional query params:
 *   ?category=Day+Tours   — filter by category
 *   ?limit=10             — limit results
 */
app.get('/api/ads', async (req, res) => {
  try {
    const { category, limit } = req.query
    const ads = await fetchAds({
      category: category || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    })
    res.json({ success: true, count: ads.length, ads })
  } catch (err) {
    console.error('❌ Ads fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch ads', message: err.message })
  }
})

/**
 * GET /api/ads/grouped
 * Returns ads grouped by category.
 */
app.get('/api/ads/grouped', async (req, res) => {
  try {
    const grouped = await fetchAdsGrouped()
    res.json({ success: true, categories: AD_CATEGORIES, routes: CATEGORY_ROUTES, grouped })
  } catch (err) {
    console.error('❌ Ads grouped fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch grouped ads', message: err.message })
  }
})

/**
 * GET /api/ads/categories
 * Returns available categories and their frontend route paths.
 */
app.get('/api/ads/categories', (req, res) => {
  res.json({ success: true, categories: AD_CATEGORIES, routes: CATEGORY_ROUTES })
})

// ═══════════════════════════════════════════════════════════════
// ─── VISIT EGYPT SCRAPED TRIPS ───────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/visitegypt-trips
 * Returns 20 trips scraped from visitegypt.com (or curated fallback).
 * Results are cached for 1 hour.
 */
app.get('/api/visitegypt-trips', async (req, res) => {
  try {
    const trips = await scrapeVisitEgyptTrips()
    res.json({ success: true, count: trips.length, source: 'visitegypt.com', trips })
  } catch (err) {
    console.error('❌ Visit Egypt trips error:', err)
    res.status(500).json({ error: 'Failed to fetch Visit Egypt trips', message: err.message })
  }
})

/**
 * POST /api/visitegypt-trips/refresh
 * Force refresh the scraped trips cache.
 */
app.post('/api/visitegypt-trips/refresh', async (req, res) => {
  try {
    const trips = await refreshVisitEgyptTrips()
    res.json({ success: true, count: trips.length, message: 'Cache refreshed', trips })
  } catch (err) {
    console.error('❌ Visit Egypt refresh error:', err)
    res.status(500).json({ error: 'Failed to refresh trips', message: err.message })
  }
})

// ─── Create Stripe Checkout Session ──────────────────────────
app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured. Use Paymob instead.' })
  }
  try {
    const {
      carName,
      carId,
      routeFrom,
      routeTo,
      distance,
      transferDate,
      transferTime,
      passengers,
      amount, // in USD (whole dollars)
      customerEmail,
    } = req.body

    // Validate required fields
    if (!carName || !routeFrom || !routeTo || !amount || amount <= 0) {
      return res.status(400).json({
        error: 'Missing required fields: carName, routeFrom, routeTo, amount',
      })
    }

    // Build description for the line item
    const description = [
      `${routeFrom} → ${routeTo}`,
      distance > 0 ? `${distance} km` : null,
      transferDate ? `Date: ${transferDate}` : null,
      transferTime ? `Time: ${transferTime}` : null,
      `${passengers} passenger${passengers > 1 ? 's' : ''}`,
    ].filter(Boolean).join(' • ')

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Transfer: ${carName}`,
              description,
              images: [],
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      metadata: {
        car_id: carId,
        car_name: carName,
        route_from: routeFrom,
        route_to: routeTo,
        distance: String(distance),
        transfer_date: transferDate || '',
        transfer_time: transferTime || '',
        passengers: String(passengers),
      },
      success_url: `${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/payment/cancel`,
    })

    // Store payment record in Supabase (pending status)
    try {
      const { error } = await supabase.from('payments').insert({
        stripe_session_id: session.id,
        amount_usd: amount,
        currency: 'usd',
        status: 'pending',
        customer_email: customerEmail || null,
        car_name: carName,
        car_id: carId,
        route_from: routeFrom,
        route_to: routeTo,
        distance_km: distance || 0,
        transfer_date: transferDate || null,
        transfer_time: transferTime || null,
        passengers: passengers || 1,
      })

      if (error) {
        console.error('⚠️  Failed to store payment record:', error)
        // Don't block checkout — payment record is secondary
      }
    } catch (dbErr) {
      console.error('⚠️  Database insert failed:', dbErr)
    }

    res.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (err) {
    console.error('❌ Stripe checkout session error:', err)
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: err.message,
    })
  }
})

// ─── Get Payment Status (Stripe) ─────────────────────────────
app.get('/api/payment-status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    // Try Stripe first
    if (stripe) {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      // Also fetch from database
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single()

      return res.json({
        status: session.payment_status,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total / 100,
        currency: session.currency,
        metadata: session.metadata,
        dbRecord: payment || null,
        provider: 'stripe',
      })
    }

    // Fallback: check Supabase for Paymob records
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('paymob_order_id', sessionId)
      .single()

    if (payment) {
      return res.json({
        status: payment.status,
        customerEmail: payment.customer_email,
        amountTotal: payment.amount_usd,
        currency: payment.currency,
        dbRecord: payment,
        provider: 'paymob',
      })
    }

    res.status(404).json({ error: 'Payment not found' })
  } catch (err) {
    console.error('❌ Payment status error:', err)
    res.status(500).json({
      error: 'Failed to retrieve payment status',
      message: err.message,
    })
  }
})

// ═══════════════════════════════════════════════════════════════
// ─── PAYMOB ENDPOINTS ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/paymob/create-payment
 * Creates a Paymob checkout session and returns the iframe URL.
 *
 * Body: {
 *   carName, carId, routeFrom, routeTo, distance,
 *   transferDate, transferTime, passengers, amount (USD),
 *   customerEmail, customerFirstName, customerLastName, customerPhone
 * }
 */
app.post('/api/paymob/create-payment', async (req, res) => {
  if (!PAYMOB_API_KEY || !PAYMOB_INTEGRATION_ID || !PAYMOB_IFRAME_ID) {
    return res.status(503).json({ error: 'Paymob is not configured' })
  }

  try {
    const {
      carName,
      carId,
      routeFrom,
      routeTo,
      distance,
      transferDate,
      transferTime,
      passengers,
      amount, // in USD
      customerEmail,
      customerFirstName,
      customerLastName,
      customerPhone,
    } = req.body

    // Validate required fields
    if (!carName || !routeFrom || !routeTo || !amount || amount <= 0) {
      return res.status(400).json({
        error: 'Missing required fields: carName, routeFrom, routeTo, amount',
      })
    }

    // Convert USD to EGP cents (approximate rate — update as needed or use live rate)
    const USD_TO_EGP_RATE = 50 // Update this to current rate
    const amountEGP = Math.round(amount * USD_TO_EGP_RATE)
    const amountCents = amountEGP * 100

    const merchantOrderId = `ETP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`

    // Step 1: Authenticate
    const authToken = await paymobAuthenticate()

    // Step 2: Create order
    const order = await paymobCreateOrder(authToken, {
      amountCents,
      merchantOrderId,
      items: [
        {
          name: `Transfer: ${carName}`,
          amount_cents: amountCents,
          description: `${routeFrom} → ${routeTo} | ${distance || 0} km | ${passengers || 1} pax`,
          quantity: 1,
        },
      ],
    })

    // Step 3: Create payment key
    const billingData = {
      first_name: customerFirstName || 'Guest',
      last_name: customerLastName || 'Traveler',
      email: customerEmail || 'guest@egypttravelpro.com',
      phone_number: customerPhone || '+201000000000',
      apartment: 'N/A',
      floor: 'N/A',
      street: 'N/A',
      building: 'N/A',
      shipping_method: 'N/A',
      postal_code: 'N/A',
      city: 'Cairo',
      country: 'EG',
      state: 'Cairo',
    }

    const paymentKey = await paymobCreatePaymentKey(authToken, {
      orderId: order.id,
      amountCents,
      billingData,
      integrationId: parseInt(PAYMOB_INTEGRATION_ID),
    })

    // Build iframe URL
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`

    // Store payment record in Supabase
    try {
      await supabase.from('payments').insert({
        paymob_order_id: String(order.id),
        merchant_order_id: merchantOrderId,
        amount_usd: amount,
        amount_egp: amountEGP,
        currency: 'EGP',
        status: 'pending',
        payment_provider: 'paymob',
        customer_email: customerEmail || null,
        car_name: carName,
        car_id: carId || null,
        route_from: routeFrom,
        route_to: routeTo,
        distance_km: distance || 0,
        transfer_date: transferDate || null,
        transfer_time: transferTime || null,
        passengers: passengers || 1,
      })
    } catch (dbErr) {
      console.error('⚠️  Paymob: DB insert failed:', dbErr.message)
    }

    res.json({
      orderId: order.id,
      merchantOrderId,
      paymentKey,
      iframeUrl,
      amountEGP,
      amountCents,
    })
  } catch (err) {
    console.error('❌ Paymob create-payment error:', err)
    res.status(500).json({
      error: 'Failed to create Paymob payment',
      message: err.message,
    })
  }
})

/**
 * POST /api/paymob/callback
 * Paymob transaction processed callback (server-to-server).
 * Paymob sends the transaction result here.
 */
app.post('/api/paymob/callback', async (req, res) => {
  try {
    console.log('📩 Paymob callback received')

    // Verify HMAC
    if (!verifyPaymobHmac(req.body)) {
      console.error('❌ Paymob HMAC verification failed')
      return res.status(400).json({ error: 'Invalid HMAC' })
    }

    const txn = req.body.obj
    const success = txn.success === true || txn.success === 'true'
    const orderId = txn.order?.id || txn.order
    const status = success ? 'completed' : 'failed'

    console.log(`📩 Paymob transaction ${txn.id}: ${status} (order: ${orderId})`)

    // Update payment record in Supabase
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status,
          paymob_transaction_id: String(txn.id),
          payment_method: txn.source_data?.type || 'card',
          payment_sub_type: txn.source_data?.sub_type || '',
          updated_at: new Date().toISOString(),
        })
        .eq('paymob_order_id', String(orderId))

      if (error) {
        console.error('❌ Paymob callback Supabase update error:', error)
      } else {
        console.log('✅ Paymob payment record updated in database')
      }
    } catch (dbErr) {
      console.error('❌ Paymob callback DB update failed:', dbErr)
    }

    res.json({ received: true })
  } catch (err) {
    console.error('❌ Paymob callback error:', err)
    res.status(500).json({ error: 'Callback processing failed' })
  }
})

/**
 * GET /api/paymob/response
 * Paymob redirects the user here after payment (browser redirect).
 * Redirects the user to the frontend success/cancel page.
 */
app.get('/api/paymob/response', (req, res) => {
  const { success, order, id } = req.query
  const isSuccess = success === 'true'

  if (isSuccess) {
    res.redirect(`${CLIENT_URL}/payment/success?provider=paymob&order_id=${order || ''}&txn_id=${id || ''}`)
  } else {
    res.redirect(`${CLIENT_URL}/payment/cancel?provider=paymob&order_id=${order || ''}&txn_id=${id || ''}`)
  }
})

/**
 * GET /api/paymob/status/:orderId
 * Check Paymob payment status from database.
 */
app.get('/api/paymob/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('paymob_order_id', orderId)
      .single()

    if (error || !payment) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    res.json({
      status: payment.status,
      provider: 'paymob',
      orderId: payment.paymob_order_id,
      transactionId: payment.paymob_transaction_id,
      amountUSD: payment.amount_usd,
      amountEGP: payment.amount_egp,
      customerEmail: payment.customer_email,
      dbRecord: payment,
    })
  } catch (err) {
    console.error('❌ Paymob status error:', err)
    res.status(500).json({ error: 'Failed to check payment status' })
  }
})

// ═══════════════════════════════════════════════════════════════
// ─── BOOKINGS ENDPOINTS ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Middleware to verify Supabase auth token
 */
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.substring(7)
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token or user not found' })
    }
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

/**
 * GET /api/bookings
 * Get all bookings for the authenticated user
 */
app.get('/api/bookings', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      count: data.length,
      bookings: data,
    })
  } catch (err) {
    console.error('❌ Get bookings error:', err)
    res.status(500).json({ error: 'Failed to fetch bookings', message: err.message })
  }
})

/**
 * GET /api/bookings/:id
 * Get a specific booking by ID
 */
app.get('/api/bookings/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.json({
      success: true,
      booking: data,
    })
  } catch (err) {
    console.error('❌ Get booking error:', err)
    res.status(500).json({ error: 'Failed to fetch booking', message: err.message })
  }
})

/**
 * POST /api/bookings
 * Create a new booking
 * Body: {
 *   trip_id, trip_title, trip_slug, trip_image,
 *   start_date, end_date, number_of_travelers, total_price, currency,
 *   contact_name, contact_email, contact_phone,
 *   special_requests, hotel_preference
 * }
 */
app.post('/api/bookings', authenticateUser, async (req, res) => {
  try {
    const {
      trip_id,
      trip_title,
      trip_slug,
      trip_image,
      start_date,
      end_date,
      number_of_travelers,
      total_price,
      currency,
      contact_name,
      contact_email,
      contact_phone,
      special_requests,
      hotel_preference,
    } = req.body

    // Validate required fields
    if (!trip_title || !start_date || !number_of_travelers || !total_price || !contact_name || !contact_email || !contact_phone) {
      return res.status(400).json({
        error: 'Missing required fields: trip_title, start_date, number_of_travelers, total_price, contact_name, contact_email, contact_phone',
      })
    }

    // Create booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: req.user.id,
        trip_id: trip_id || null,
        trip_title,
        trip_slug: trip_slug || null,
        trip_image: trip_image || null,
        start_date,
        end_date: end_date || null,
        number_of_travelers,
        total_price,
        currency: currency || 'USD',
        contact_name,
        contact_email,
        contact_phone,
        special_requests: special_requests || null,
        hotel_preference: hotel_preference || null,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: data,
    })
  } catch (err) {
    console.error('❌ Create booking error:', err)
    res.status(500).json({ error: 'Failed to create booking', message: err.message })
  }
})

/**
 * PUT /api/bookings/:id
 * Update a booking (user can update their own, admin can update any)
 * Body: { status?, payment_status?, special_requests?, admin_notes? }
 */
app.put('/api/bookings/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Check if booking belongs to user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Users can only update their own bookings (except admin)
    const isAdmin = req.user.email?.includes('admin')
    if (existingBooking.user_id !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this booking' })
    }

    // Regular users can only update certain fields
    const allowedFields = ['special_requests', 'hotel_preference']
    const adminFields = ['status', 'payment_status', 'admin_notes']

    const updateData = {}
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) || (isAdmin && adminFields.includes(key))) {
        updateData[key] = updates[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking: data,
    })
  } catch (err) {
    console.error('❌ Update booking error:', err)
    res.status(500).json({ error: 'Failed to update booking', message: err.message })
  }
})

/**
 * DELETE /api/bookings/:id
 * Cancel a booking (soft delete by setting status to 'cancelled')
 */
app.delete('/api/bookings/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params

    // Check if booking belongs to user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (existingBooking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' })
    }

    // Soft delete: set status to cancelled
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: data,
    })
  } catch (err) {
    console.error('❌ Cancel booking error:', err)
    res.status(500).json({ error: 'Failed to cancel booking', message: err.message })
  }
})

// ─── Book Transfer (no Stripe — just save & notify) ─────────
app.post('/api/book-transfer', async (req, res) => {
  try {
    const {
      // Step 1: ride details
      pickupDate,
      pickupTime,
      route,        // e.g. "Cairo Airport ↔ 5th Settlement"
      routeFrom,
      routeTo,
      transferType, // "one-way" | "round-trip"
      distance,
      // Step 2: vehicle
      vehicleId,
      vehicleName,
      vehiclePrice,
      // Step 3: contact
      fullName,
      email,
      phone,
      whatsapp,
      flightNumber,
      specialRequests,
      passengers,
    } = req.body

    // Validate
    if (!pickupDate || !routeFrom || !routeTo || !vehicleName || !fullName || !email) {
      return res.status(400).json({
        error: 'Missing required fields: pickupDate, routeFrom, routeTo, vehicleName, fullName, email',
      })
    }

    // Store in Supabase transfers table (or payments table with type)
    let dbRecord = null
    try {
      const { data, error } = await supabase.from('transfer_bookings').insert({
        pickup_date: pickupDate,
        pickup_time: pickupTime || null,
        route_from: routeFrom,
        route_to: routeTo,
        route_label: route || `${routeFrom} → ${routeTo}`,
        transfer_type: transferType || 'one-way',
        distance_km: distance || 0,
        vehicle_id: vehicleId || null,
        vehicle_name: vehicleName,
        vehicle_price_usd: vehiclePrice || 0,
        full_name: fullName,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        flight_number: flightNumber || null,
        special_requests: specialRequests || null,
        passengers: passengers || 1,
        status: 'pending',
      }).select().single()

      if (error) {
        console.error('⚠️  Supabase insert error (transfer_bookings):', error.message)
        // If table doesn't exist, still return success — booking came through
      } else {
        dbRecord = data
        console.log('✅ Transfer booking saved:', data.id)
      }
    } catch (dbErr) {
      console.error('⚠️  DB insert failed:', dbErr.message)
    }

    res.json({
      success: true,
      message: 'Transfer booking received! We will confirm within 1 hour.',
      booking: {
        id: dbRecord?.id || `TRF-${Date.now()}`,
        pickupDate,
        pickupTime,
        route: route || `${routeFrom} → ${routeTo}`,
        transferType,
        vehicle: vehicleName,
        price: vehiclePrice,
        name: fullName,
        email,
      },
    })
  } catch (err) {
    console.error('❌ Book transfer error:', err)
    res.status(500).json({ error: 'Failed to process booking', message: err.message })
  }
})

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('')
  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║   Egypt Travel Pro — Payment Server                 ║')
  console.log('╠══════════════════════════════════════════════════════╣')
  console.log(`║   Server:          http://localhost:${PORT}              ║`)
  console.log(`║   Stripe Webhook:  http://localhost:${PORT}/api/webhook   ║`)
  console.log(`║   Paymob Callback: http://localhost:${PORT}/api/paymob/callback ║`)
  console.log(`║   Client:          ${CLIENT_URL.padEnd(33)}║`)
  console.log(`║   Stripe:          ${stripe ? '✅ Connected' : '❌ Not configured'}${''.padEnd(stripe ? 21 : 16)}║`)
  console.log(`║   Paymob:          ${PAYMOB_API_KEY ? '✅ Connected' : '❌ Not configured'}${''.padEnd(PAYMOB_API_KEY ? 21 : 16)}║`)
  console.log('╚══════════════════════════════════════════════════════╝')
  console.log('')
})