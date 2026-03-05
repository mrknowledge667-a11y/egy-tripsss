import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExperienceBadge } from '../components'
import BookingModal from '../components/BookingModal'
import { supabase } from '../lib/supabase'
// Fallback data
import tripsDataFallback from '../data/trips.json'
import destinationsDataFallback from '../data/destinations.json'
import experiencesDataFallback from '../data/experiences.json'

/**
 * TripDetails Page
 * Displays comprehensive trip information including itinerary, destinations, and experiences
 * Fetches data from Supabase with JSON fallback
 */
const TripDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [tripDestinations, setTripDestinations] = useState([])
  const [tripExperiences, setTripExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Fetch trip data from Supabase
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        // Fetch trip by slug
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('slug', slug)
          .single()

        if (tripError) {
          if (tripError.code === 'PGRST116') {
            // Not found in Supabase, try fallback
            console.log('⚠️ Trip not found in Supabase, checking fallback')
            const fallbackTrip = tripsDataFallback.find(t => t.slug === slug)
            if (fallbackTrip) {
              setTrip(fallbackTrip)
              setTripDestinations(destinationsDataFallback.filter(d => fallbackTrip.destinations?.includes(d.id)))
              setTripExperiences(experiencesDataFallback.filter(e => fallbackTrip.experiences?.includes(e.id)))
            } else {
              setNotFound(true)
            }
            setLoading(false)
            return
          }
          throw tripError
        }

        console.log('✅ Loaded trip from Supabase:', tripData.title)
        // Transform snake_case to camelCase and add defaults for frontend components
        const transformedTrip = {
          ...tripData,
          shortDescription: tripData.short_description || tripData.description?.substring(0, 150) + '...',
          travelStyle: tripData.travel_style || 'Culture',
          heroImage: tripData.hero_image || tripData.image || 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1920',
          isFeatured: tripData.is_featured,
          isPublished: tripData.is_published,
          // Ensure arrays exist with defaults
          highlights: tripData.highlights?.length ? tripData.highlights : ['Explore amazing destinations', 'Professional guide', 'Comfortable transport'],
          included: tripData.included?.length ? tripData.included : ['Professional guide', 'Transport', 'Entrance fees'],
          itinerary: tripData.itinerary || [],
          gallery: tripData.gallery || [],
        }
        setTrip(transformedTrip)
      } catch (error) {
        console.error('Error fetching trip:', error)
        // Try fallback data
        const fallbackTrip = tripsDataFallback.find(t => t.slug === slug)
        if (fallbackTrip) {
          setTrip(fallbackTrip)
          setTripDestinations(destinationsDataFallback.filter(d => fallbackTrip.destinations?.includes(d.id)))
          setTripExperiences(experiencesDataFallback.filter(e => fallbackTrip.experiences?.includes(e.id)))
        } else {
          setNotFound(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [slug])

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </main>
    )
  }

  // Handle trip not found
  if (notFound || !trip) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist.</p>
          <Link to="/trips" className="btn btn-primary">
            Browse All Trips
          </Link>
        </div>
      </main>
    )
  }

  // Format price
  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount || 0)
  }

  // Get travel style color
  const getStyleColor = (style) => {
    const colors = {
      // Main Categories
      Culture: 'bg-purple-100 text-purple-700',
      Adventure: 'bg-orange-100 text-orange-700',
      Beach: 'bg-cyan-100 text-cyan-700',
      Romantic: 'bg-pink-100 text-pink-700',
      Luxury: 'bg-amber-100 text-amber-700',
      Budget: 'bg-green-100 text-green-700',
      Family: 'bg-blue-100 text-blue-700',
      Cruise: 'bg-indigo-100 text-indigo-700',
      // Package Styles
      Honeymoon: 'bg-rose-100 text-rose-700',
      Classic: 'bg-slate-100 text-slate-700',
      Premium: 'bg-yellow-100 text-yellow-700',
      'Group Tour': 'bg-teal-100 text-teal-700',
      'Private Tour': 'bg-violet-100 text-violet-700',
      // Tour Types
      'Day Tour': 'bg-lime-100 text-lime-700',
      'Nile Cruise': 'bg-sky-100 text-sky-700',
      'Shore Excursion': 'bg-emerald-100 text-emerald-700',
      Transfer: 'bg-neutral-100 text-neutral-700',
      // Special Categories
      Spiritual: 'bg-fuchsia-100 text-fuchsia-700',
      Safari: 'bg-amber-100 text-amber-800',
      Diving: 'bg-blue-100 text-blue-800',
      Historical: 'bg-stone-100 text-stone-700',
      Desert: 'bg-orange-100 text-orange-800',
      'City Break': 'bg-zinc-100 text-zinc-700',
      Relax: 'bg-teal-100 text-teal-700',
    }
    return colors[style] || 'bg-gray-100 text-gray-700'
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={trip.heroImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Hero Content */}
        <div className="relative z-10 container-custom pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`badge ${getStyleColor(trip.travelStyle)}`}>
                {trip.travelStyle}
              </span>
              <span className="badge bg-white/20 text-white backdrop-blur-sm">
                {trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              {trip.title}
            </h1>

            {/* Rating */}
            {trip.rating && (
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-yellow-400">★</span>
                <span className="font-medium">{trip.rating}</span>
                {trip.reviews && (
                  <span className="text-white/70">({trip.reviews} reviews)</span>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  Overview
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {trip.description}
                </p>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  Highlights
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(trip.highlights || []).map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary-500 mt-1">✓</span>
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Itinerary - Only show if has items */}
              {trip.itinerary && trip.itinerary.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-6">
                  {trip.itinerary.map((day, index) => (
                    <motion.div
                      key={day.day || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="relative pl-8 pb-6 border-l-2 border-primary-200 last:border-l-0"
                    >
                      {/* Day Number Circle */}
                      <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                        {day.day || index + 1}
                      </div>
                      
                      {/* Day Content */}
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {day.title || `Day ${index + 1}`}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {day.description || ''}
                        </p>
                        {/* Activities */}
                        {day.activities && day.activities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {day.activities.map((activity, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              )}

              {/* Included Destinations */}
              {tripDestinations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                    Destinations Included
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {tripDestinations.map(dest => (
                      <Link
                        key={dest.id}
                        to={`/destinations/${dest.slug}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <span className="text-lg">📍</span>
                        <span className="font-medium text-gray-700">{dest.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Experiences */}
              {tripExperiences.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                    Experiences
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {tripExperiences.map((exp, index) => (
                      <ExperienceBadge
                        key={exp.id}
                        experience={exp}
                        index={index}
                        variant="pill"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-28 bg-white rounded-2xl shadow-card border border-gray-100 p-6"
              >
                {/* Price */}
                <div className="mb-6">
                  <span className="text-sm text-gray-500">Starting from</span>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatPrice(trip.price, trip.currency)}
                  </p>
                  <span className="text-sm text-gray-500">per person</span>
                </div>

                {/* Trip Details */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">
                      {trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Travel Style</span>
                    <span className="font-medium text-gray-900">{trip.travelStyle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Destinations</span>
                    <span className="font-medium text-gray-900">{tripDestinations.length}</span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                  <ul className="space-y-2">
                    {(trip.included || []).slice(0, 5).map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                    {(trip.included || []).length > 5 && (
                      <li className="text-sm text-primary-600">
                        +{trip.included.length - 5} more included
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowBookingModal(true)}
                    className="w-full btn btn-primary py-3"
                  >
                    Book This Trip
                  </button>
                  <button className="w-full btn btn-secondary py-3 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Save Trip
                  </button>
                  <button className="w-full text-center text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Trip
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        trip={trip}
      />
    </main>
  )
}

export default TripDetails