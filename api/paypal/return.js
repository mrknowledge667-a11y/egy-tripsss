import { CLIENT_URL, handleCors } from '../_lib/config.js'

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

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return res.redirect(`${CLIENT_URL}/payment/cancel?provider=paypal&reason=not_configured`)
  }

  try {
    const orderId = req.query.token
    if (!orderId) {
      return res.redirect(`${CLIENT_URL}/payment/cancel?provider=paypal&reason=missing_token`)
    }

    const accessToken = await paypalGetAccessToken()
    const captureData = await paypalCaptureOrder(accessToken, orderId)

    const isCompleted = captureData.status === 'COMPLETED'
    const captureId = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || ''

    if (isCompleted) {
      return res.redirect(`${CLIENT_URL}/payment/success?provider=paypal&order_id=${orderId}&capture_id=${captureId}`)
    }

    return res.redirect(`${CLIENT_URL}/payment/cancel?provider=paypal&order_id=${orderId}`)
  } catch (err) {
    console.error('❌ PayPal return/capture error:', err)
    return res.redirect(`${CLIENT_URL}/payment/cancel?provider=paypal&reason=capture_failed`)
  }
}
