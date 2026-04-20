import { CLIENT_URL, handleCors } from '../_lib/config.js'

export default function handler(req, res) {
  if (handleCors(req, res)) return

  const orderId = req.query.token || ''
  return res.redirect(`${CLIENT_URL}/payment/cancel?provider=paypal&order_id=${orderId}`)
}
