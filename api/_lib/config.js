import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

/**
 * Null when URL or anon key is missing so callers can return 503 instead of failing at runtime.
 */
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/** @returns {boolean} true if response already sent (503) */
export function ensureSupabase(res) {
  if (supabase) return false
  res.status(503).json({
    error: 'Database service unavailable',
    message:
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).',
  })
  return true
}

/**
 * USD → SAR: SAR per 1 USD (e.g. 3.75).
 * Accepts USD_TO_SAR_RATE or EXCHANGE_RATE_USD_TO_SAR.
 */
export function getUsdToSarRate() {
  const raw = process.env.USD_TO_SAR_RATE ?? process.env.EXCHANGE_RATE_USD_TO_SAR
  const n = raw != null && raw !== '' ? Number.parseFloat(raw) : Number.NaN
  if (Number.isFinite(n) && n > 0) return n
  return 3.75
}

export function usdToSar(usd) {
  return Math.round(usd * getUsdToSarRate() * 100) / 100
}

// ─── Client URL ──────────────────────────────────────────────
export const CLIENT_URL =
  process.env.CLIENT_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

// ─── CORS Helper ─────────────────────────────────────────────
export function handleCors(req, res) {
  const origin = process.env.CLIENT_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '*')
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }
  return false
}
