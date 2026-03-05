import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroSection, TripCard } from '../components'
import { supabase } from '../lib/supabase'
// Fallback data
import tripsDataFallback from '../data/trips.json'
import destinationsDataFallback from '../data/destinations.json'

/**
 * Trips Page
 * Displays all trips with filtering capabilities
 * Supports URL query params for pre-filtering
 * Fetches data from Supabase with JSON fallback
 */
const Trips = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tripsData, setTripsData] = useState(tripsDataFallback)
  const [destinationsData, setDestinationsData] = useState(destinationsDataFallback)
  const [loading, setLoading] = useState(true)
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    duration: searchParams.get('duration') || '',
    destination: searchParams.get('destination') || '',
    travelStyle: searchParams.get('style') || '',
  })

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch published trips
        const { data: trips, error: tripsError } = await supabase
          .from('trips')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })

        if (tripsError) {
          console.error('Trips fetch error:', tripsError)
          throw tripsError
        }

        if (trips && trips.length > 0) {
          console.log('✅ Loaded', trips.length, 'trips from Supabase')
          // Transform snake_case to camelCase for frontend components
          const transformedTrips = trips.map(trip => ({
            ...trip,
            shortDescription: trip.short_description || trip.description?.substring(0, 150) + '...',
            travelStyle: trip.travel_style || 'Culture',
            heroImage: trip.hero_image,
            isFeatured: trip.is_featured,
            isPublished: trip.is_published,
          }))
          setTripsData(transformedTrips)
        } else {
          console.log('⚠️ No trips in Supabase, using fallback data')
        }

        // Try to fetch destinations (optional)
        const { data: destinations } = await supabase
          .from('destinations')
          .select('*')
          .order('name')

        if (destinations && destinations.length > 0) {
          setDestinationsData(destinations)
        }
      } catch (error) {
        console.error('Error fetching trips:', error)
        console.log('⚠️ Using fallback data due to error')
        // Keep fallback data on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter options
  const durationOptions = [
    { value: '', label: 'Any Duration' },
    { value: '1-4', label: '1-4 Days' },
    { value: '5-7', label: '5-7 Days' },
    { value: '8-14', label: '8-14 Days' },
    { value: '15+', label: '15+ Days' },
  ]

  const styleOptions = [
    { value: '', label: 'Any Style' },
    // Main Categories
    { value: 'Culture', label: 'Culture' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Beach', label: 'Beach' },
    { value: 'Romantic', label: 'Romantic' },
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Budget', label: 'Budget' },
    { value: 'Family', label: 'Family' },
    { value: 'Cruise', label: 'Cruise' },
    // Package Styles
    { value: 'Honeymoon', label: 'Honeymoon' },
    { value: 'Classic', label: 'Classic' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Group Tour', label: 'Group Tour' },
    { value: 'Private Tour', label: 'Private Tour' },
    // Tour Types
    { value: 'Day Tour', label: 'Day Tour' },
    { value: 'Nile Cruise', label: 'Nile Cruise' },
    { value: 'Shore Excursion', label: 'Shore Excursion' },
    // Special Categories
    { value: 'Spiritual', label: 'Spiritual' },
    { value: 'Safari', label: 'Safari' },
    { value: 'Diving', label: 'Diving' },
    { value: 'Historical', label: 'Historical' },
    { value: 'Desert', label: 'Desert' },
    { value: 'City Break', label: 'City Break' },
  ]

  // Filter trips based on selected filters
  const filteredTrips = useMemo(() => {
    let results = [...tripsData]

    // Filter by duration
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number)
      if (filters.duration === '15+') {
        results = results.filter(trip => trip.duration >= 15)
      } else {
        results = results.filter(trip => trip.duration >= min && trip.duration <= max)
      }
    }

    // Filter by destination
    if (filters.destination) {
      const destId = parseInt(filters.destination)
      results = results.filter(trip => trip.destinations?.includes(destId))
    }

    // Filter by travel style
    if (filters.travelStyle) {
      results = results.filter(trip => trip.travelStyle === filters.travelStyle)
    }

    return results
  }, [filters, tripsData])

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL params
    const params = new URLSearchParams()
    if (newFilters.duration) params.set('duration', newFilters.duration)
    if (newFilters.destination) params.set('destination', newFilters.destination)
    if (newFilters.travelStyle) params.set('style', newFilters.travelStyle)
    setSearchParams(params)
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({ duration: '', destination: '', travelStyle: '' })
    setSearchParams({})
  }

  // Check if any filters are active
  const hasActiveFilters = filters.duration || filters.destination || filters.travelStyle

  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        title="Explore Our Trips"
        subtitle="Discover carefully curated journeys designed to create unforgettable experiences"
        backgroundImage="https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1920"
        height="h-[50vh]"
        showCta={false}
      />

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              {/* Duration Filter */}
              <div className="relative">
                <select
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="form-select py-2 px-4 pr-10 text-sm min-w-[140px]"
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Filter */}
              <div className="relative">
                <select
                  value={filters.destination}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="form-select py-2 px-4 pr-10 text-sm min-w-[160px]"
                >
                  <option value="">Any Destination</option>
                  {destinationsData.map(dest => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Style Filter */}
              <div className="relative">
                <select
                  value={filters.travelStyle}
                  onChange={(e) => handleFilterChange('travelStyle', e.target.value)}
                  className="form-select py-2 px-4 pr-10 text-sm min-w-[140px]"
                >
                  {styleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={resetFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </motion.button>
              )}
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredTrips.length}</span> {filteredTrips.length === 1 ? 'trip' : 'trips'}
            </p>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            {filteredTrips.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTrips.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No trips found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any trips matching your filters. Try adjusting your criteria or explore all our trips.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn btn-primary"
                >
                  View All Trips
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}

export default Trips