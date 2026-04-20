import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://raoahenfotwbcmrrhdsa.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhb2FoZW5mb3R3YmNtcnJoZHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDE3MTIsImV4cCI6MjA4NjE3NzcxMn0.4ZpR1VXOZXtC5o9wZ2U-voZbvklINGZnp04kIVAapyE'

const normalizeEnv = (value) => {
  if (!value || typeof value !== 'string') return ''
  // Guards against accidental quotes/newlines when copying keys into Vercel env vars.
  return value.trim().replace(/^['"]|['"]$/g, '')
}

const parseJwtPayload = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const decoded = atob(padded)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

const getProjectRefFromUrl = (url) => {
  try {
    const hostname = new URL(url).hostname
    return hostname.split('.')[0] || ''
  } catch {
    return ''
  }
}

const envSupabaseUrl = normalizeEnv(import.meta.env.VITE_SUPABASE_URL)
const envSupabaseAnonKey = normalizeEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)

let supabaseUrl = envSupabaseUrl || DEFAULT_SUPABASE_URL
let supabaseAnonKey = envSupabaseAnonKey || DEFAULT_SUPABASE_ANON_KEY

if (envSupabaseUrl && envSupabaseAnonKey) {
  const payload = parseJwtPayload(envSupabaseAnonKey)
  const keyRef = payload?.ref || ''
  const urlRef = getProjectRefFromUrl(envSupabaseUrl)

  // If key cannot be parsed as a Supabase JWT, treat env value as malformed.
  if (!keyRef) {
    console.warn('Supabase anon key in env appears malformed. Falling back to default project config.')
    supabaseUrl = DEFAULT_SUPABASE_URL
    supabaseAnonKey = DEFAULT_SUPABASE_ANON_KEY
  }

  // If URL/key point to different projects, use known-good defaults.
  if (keyRef && urlRef && keyRef !== urlRef) {
    console.warn('Supabase env mismatch detected (URL project != anon key project). Falling back to default project config.')
    supabaseUrl = DEFAULT_SUPABASE_URL
    supabaseAnonKey = DEFAULT_SUPABASE_ANON_KEY
  }
}


if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.')
}

/**
 * Supabase client instance
 * Used throughout the app for database queries, auth, and storage
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

/**
 * Helper: Get public URL for a file in Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @returns {string} Public URL
 */
export const getStorageUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || ''
}

/**
 * Helper: Upload a file to Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Destination path
 * @param {File} file - File object to upload
 * @returns {Promise<{data, error}>}
 */
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })
  return { data, error }
}

/**
 * Helper: Delete a file from Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string[]} paths - Array of file paths to delete
 * @returns {Promise<{data, error}>}
 */
export const deleteFiles = async (bucket, paths) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove(paths)
  return { data, error }
}

export default supabase