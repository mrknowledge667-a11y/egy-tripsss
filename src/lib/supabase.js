import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://raoahenfotwbcmrrhdsa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhb2FoZW5mb3R3YmNtcnJoZHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDE3MTIsImV4cCI6MjA4NjE3NzcxMn0.4ZpR1VXOZXtC5o9wZ2U-voZbvklINGZnp04kIVAapyE'

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