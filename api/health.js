import { getUsdToSarRate, handleCors, supabase } from './_lib/config.js'

export default function handler(req, res) {
  if (handleCors(req, res)) return

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseConfigured = !!(
    supabaseUrl && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)
  )

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabaseEnvPresent: supabaseConfigured,
    supabaseClientReady: !!supabase,
    usdToSarRate: getUsdToSarRate(),
  })
}
