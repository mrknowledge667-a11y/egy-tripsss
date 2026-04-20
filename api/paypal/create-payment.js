import { supabase, handleCors, CLIENT_URL } from '../_lib/config.js'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'
const PAYPAL_BASE_URL = PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

const SERVER_BASE_URL =
  process.env.SERVER_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

async function paypalGetAccessToken() {
  const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  const body = new URLSearchParams({ grant_type: 'client_credentials' })

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  const data = await res.json()
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to authenticate PayPal')
  }

  return data.access_token
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return res.status(503).json({ error: 'PayPal is not configured' })
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
      amount,
      customerEmail,
    } = req.body || {}

    if (!carName || !routeFrom || !routeTo || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        error: 'Missing required fields: carName, routeFrom, routeTo, amount',
      })
    }

    const description = [
      `${routeFrom} -> ${routeTo}`,
      Number(distance) > 0 ? `${distance} km` : null,
      transferDate ? `Date: ${transferDate}` : null,
      transferTime ? `Time: ${transferTime}` : null,
      `${passengers || 1} passenger${(passengers || 1) > 1 ? 's' : ''}`,
    ].filter(Boolean).join(' • ')

    const accessToken = await paypalGetAccessToken()

    const createRes = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: Number(amount).toFixed(2),
            },
            description,
            custom_id: carId ? String(carId).slice(0, 127) : undefined,
          },
        ],
        payer: customerEmail ? { email_address: customerEmail } : undefined,
        application_context: {
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
          return_url: `${SERVER_BASE_URL}/api/paypal/return`,
          cancel_url: `${SERVER_BASE_URL}/api/paypal/cancel`,
        },
      }),
    })

    const order = await createRes.json()
    if (!createRes.ok || !order.id) {
      const detail = Array.isArray(order.details)
        ? order.details.map(d => d.description).join('; ')
        : ''
      throw new Error(detail || order.message || 'Failed to create PayPal order')
    }

    const approveUrl = (order.links || []).find(link => link.rel === 'approve')?.href
    if (!approveUrl) {
      throw new Error('PayPal approve URL was not returned by PayPal')
    }

    if (supabase) {
      try {
        await supabase.from('payments').insert({
          paypal_order_id: order.id,
          amount_usd: Number(amount),
          currency: 'usd',
          status: 'pending',
          customer_email: customerEmail || null,
          car_name: carName,
          car_id: carId || null,
          route_from: routeFrom,
          route_to: routeTo,
          distance_km: Number(distance) || 0,
          transfer_date: transferDate || null,
          transfer_time: transferTime || null,
          passengers: passengers || 1,
          payment_provider: 'paypal',
        })
      } catch (dbErr) {
        console.error('⚠️ PayPal DB insert failed:', dbErr.message)
      }
    } else {
      console.warn('⚠️ Supabase env vars missing on Vercel function; skipping payment record insert')
    }

    return res.json({
      success: true,
      orderId: order.id,
      approveUrl,
      returnUrl: `${CLIENT_URL}/payment/success?provider=paypal&order_id=${order.id}`,
    })
  } catch (err) {
    console.error('❌ PayPal create-payment error:', err)
    return res.status(500).json({
      error: err?.message || 'Failed to create PayPal payment',
      message: err?.message || 'Unknown PayPal error',
      paypalMode: PAYPAL_MODE,
    })
  }
}
