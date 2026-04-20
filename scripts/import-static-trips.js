/**
 * Import Static Trip Data to Unified Trips Table
 * Imports dayTours, nileCruises, and shoreExcursions into the unified trips table
 * 
 * Usage: node scripts/import-static-trips.js
 */

import { createClient } from '@supabase/supabase-js'
import { dayTours } from '../data/dayTours.js'
import { nileCruises } from '../data/nileCruises.js'
import { shoreExcursions } from '../data/shoreExcursions.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Helper function to create slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Helper function to clean price (remove non-numeric chars except decimal)
const cleanPrice = (priceText) => {
  if (!priceText) return 0
  const price = parseFloat(priceText.toString().replace(/[^\d.]/g, ''))
  return isNaN(price) ? 0 : price
}

// Helper function to extract duration in days
const extractDuration = (durationText) => {
  if (!durationText) return 1
  const match = durationText.toString().match(/(\d+)\s*(day|hour)/i)
  if (match) {
    const num = parseInt(match[1])
    const unit = match[2].toLowerCase()
    return unit === 'hour' ? Math.max(1, Math.ceil(num / 8)) : num // Convert hours to days
  }
  return 1
}

// Import function for each trip type
async function importTrips(trips, type, typeName) {
  console.log(`\n📦 Importing ${trips.length} ${typeName}...`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const trip of trips) {
    try {
      // Clean and prepare data
      const slug = trip.id || createSlug(trip.title)
      const price = cleanPrice(trip.price || trip.originalPrice)
      const duration = extractDuration(trip.duration)
      
      // Use Supabase RPC function for safe import
      const { data, error } = await supabase.rpc('import_trip_data', {
        p_type: type,
        p_title: trip.title,
        p_slug: slug,
        p_description: trip.description || '',
        p_duration: duration,
        p_price: price,
        p_currency: 'USD',
        p_image: trip.image || null,
        p_rating: parseFloat(trip.rating) || 4.5,
        p_reviews: parseInt(trip.reviews) || 0,
        p_highlights: trip.highlights || [],
        p_included: trip.included || [],
        p_excluded: trip.excluded || [],
        p_best_seller: trip.bestSeller || trip.best_seller || false
      })
      
      if (error) {
        console.error(`❌ Error importing ${trip.title}:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Imported: ${trip.title}`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Exception importing ${trip.title}:`, err.message)
      errorCount++
    }
  }
  
  console.log(`📊 ${typeName} Results: ${successCount} success, ${errorCount} errors`)
  return { success: successCount, errors: errorCount }
}

// Main import function
async function main() {
  console.log('🚀 Starting static trip data import...')
  
  try {
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('trips')
      .select('count', { count: 'exact', head: true })
    
    if (testError) {
      throw new Error(`Connection failed: ${testError.message}`)
    }
    
    console.log(`📊 Current trips in database: ${testData || 0}`)
    
    // Import each type
    const results = {
      dayTours: await importTrips(dayTours, 'day_tour', 'Day Tours'),
      nileCruises: await importTrips(nileCruises, 'nile_cruise', 'Nile Cruises'),
      shoreExcursions: await importTrips(shoreExcursions, 'short_excursion', 'Shore Excursions')
    }
    
    // Summary
    const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0)
    const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0)
    
    console.log('\n🎉 IMPORT COMPLETE!')
    console.log(`📈 Total imported: ${totalSuccess}`)
    console.log(`⚠️  Total errors: ${totalErrors}`)
    
    // Final count
    const { count: finalCount } = await supabase
      .from('trips')
      .select('count', { count: 'exact', head: true })
    
    console.log(`📊 Final trips in database: ${finalCount}`)
    
  } catch (error) {
    console.error('💥 Import failed:', error.message)
    process.exit(1)
  }
}

// Run the import
main()