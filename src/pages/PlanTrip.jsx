import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroSection, PlanTripForm, TripCard } from '../components'
import tripsData from '../data/trips.json'

/**
 * PlanTrip Page
 * Trip planning page with form to filter trips based on dates, travelers, and style
 * Displays matching trips with animations
 */
const PlanTrip = () => {
  const [filteredTrips, setFilteredTrips] = useState(null)
  const [searchParams, setSearchParams] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  /**
   * Filter trips based on form data
   * Matches by duration (within range) and travel style
   */
  const handleFormSubmit = (formData) => {
    setSearchParams(formData)
    setHasSearched(true)

    const { days, travelStyle } = formData

    // Filter trips based on criteria
    let results = [...tripsData]

    // Filter by duration - show trips that fit within the available days
    if (days) {
      results = results.filter(trip => trip.duration <= days)
    }

    // Filter by travel style if specified
    if (travelStyle) {
      results = results.filter(trip => trip.travelStyle === travelStyle)
    }

    // Sort by best match (closest duration to selected days)
    if (days) {
      results.sort((a, b) => {
        const diffA = Math.abs(a.duration - days)
        const diffB = Math.abs(b.duration - days)
        return diffA - diffB
      })
    }

    setFilteredTrips(results)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        title="Plan Your Trip"
        subtitle="Tell us about your travel preferences and we'll find the perfect trip for you"
        backgroundImage="https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1920"
        height="h-[50vh]"
        showCta={false}
      />

      {/* Form Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                When are you traveling?
              </h2>
              <p className="text-gray-600">
                Enter your travel dates and preferences to find matching trips
              </p>
            </motion.div>

            <PlanTripForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="section bg-white"
          >
            <div className="container-custom">
              {/* Results Header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                  {filteredTrips?.length > 0 
                    ? `${filteredTrips.length} Trips Found` 
                    : 'No Matching Trips'
                  }
                </h2>
                {searchParams && (
                  <p className="text-gray-600">
                    {searchParams.days && (
                      <span>For {searchParams.days} days</span>
                    )}
                    {searchParams.travelStyle && (
                      <span> • {searchParams.travelStyle} style</span>
                    )}
                    {searchParams.travelers && (
                      <span> • {searchParams.travelers} travelers</span>
                    )}
                  </p>
                )}
              </div>

              {/* Results Grid or Empty State */}
              {filteredTrips?.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredTrips.map((trip, index) => (
                    <TripCard key={trip.id} trip={trip} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-gray-50 rounded-2xl"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No trips match your criteria
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting your dates or travel style to find more options. 
                    We have trips ranging from 3 to 14 days.
                  </p>
                  <button
                    onClick={() => {
                      setFilteredTrips(null)
                      setHasSearched(false)
                      setSearchParams(null)
                    }}
                    className="btn btn-secondary"
                  >
                    Reset Search
                  </button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Tips Section - shown before search */}
      {!hasSearched && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="section bg-white"
        >
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                Planning Tips
              </h2>
              <p className="text-gray-600">
                Make the most of your trip with these helpful suggestions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '📅',
                  title: 'Best Time to Visit',
                  description: 'October to April offers the most pleasant weather for exploring ancient sites and enjoying outdoor activities.',
                },
                {
                  icon: '⏱️',
                  title: 'Trip Duration',
                  description: 'We recommend at least 7 days to experience the highlights, or 14 days for a comprehensive journey.',
                },
                {
                  icon: '👥',
                  title: 'Group Size',
                  description: 'Small groups of 2-6 travelers offer the best balance of social experience and personalized attention.',
                },
              ].map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
                    <span className="text-3xl">{tip.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {tip.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </main>
  )
}

export default PlanTrip