import { handleCors } from './_lib/config.js'

export default function handler(req, res) {
  if (handleCors(req, res)) return

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: !!process.env.VITE_SUPABASE_URL,
  })
}