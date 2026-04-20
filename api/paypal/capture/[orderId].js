import { supabase, handleCors } from '../../_lib/config.js'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'
const PAYPAL_BASE_URL = PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

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

async function paypalCaptureOrder(accessToken, orderId) {
  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to capture PayPal order')
  }
  return data
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
    const { orderId } = req.query
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' })
    }

    const accessToken = await paypalGetAccessToken()
    const captureData = await paypalCaptureOrder(accessToken, orderId)

    const isCompleted = captureData.status === 'COMPLETED'
    const status = isCompleted ? 'paid' : 'failed'
    const captureId = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null

    try {
      await supabase
        .from('payments')
        .update({
          status,
          payment_method: 'paypal',
          paypal_capture_id: captureId,
          updated_at: new Date().toISOString(),
        })
        .eq('paypal_order_id', orderId)
    } catch (dbErr) {
      console.error('⚠️ PayPal capture DB update failed:', dbErr.message)
    }

    return res.json({ success: true, status, captureId, data: captureData })
  } catch (err) {
    console.error('❌ PayPal capture error:', err)
    return res.status(500).json({ error: 'Failed to capture PayPal order', message: err.message })
  }
}
