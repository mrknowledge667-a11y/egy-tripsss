import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdCard from '../components/AdCard'

/**
 * Ads Page
 * Fetches 50 advertisements from the backend API and displays
 * them organised by category.  Each category section uses the
 * same card grid layout as the rest of the site.
 *
 * API base URL defaults to the Express server on port 3001.
 * Override via VITE_API_URL in .env if needed.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const Ads = () => {
  const [grouped, setGrouped] = useState({})
  const [categories, setCategories] = useState([])
  const [routes, setRoutes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/ads/grouped`)
        if (!res.ok) throw new Error(`Server responded with ${res.status}`)
        const data = await res.json()
        setGrouped(data.grouped || {})
        setCategories(data.categories || [])
        setRoutes(data.routes || {})
      } catch (err) {
        console.error('Failed to load ads:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadAds()
  }, [])

  // Filter which categories to show
  const visibleCategories =
    activeCategory === 'all'
      ? categories
      : categories.filter((c) => c === activeCategory)

  // Total count
  const totalAds = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 pt-20 bg-gray-50"
    >
      {/* ─── Hero / Header ─────────────────────────────── */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700 text-white py-16 md:py-20">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white mb-4"
          >
            Travel Deals & Offers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Browse {totalAds} curated advertisements from Egypt Time Travel — packages,
            tours, cruises, transfers and more.
          </motion.p>
          <div className="section-divider mt-6" />
        </div>
      </section>

      {/* ─── Category Filter Tabs ──────────────────────── */}
      <section className="sticky top-16 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveCategory('all')}
              className={`btn btn-sm rounded-full whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({totalAds})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat} ({(grouped[cat] || []).length})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Loading State ─────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="loading-spinner" />
          <span className="ml-4 text-gray-500">Loading advertisements…</span>
        </div>
      )}

      {/* ─── Error State ───────────────────────────────── */}
      {error && !loading && (
        <div className="container-custom py-20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load ads</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-500 text-sm">
            Make sure the backend server is running:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm run dev:server</code>
          </p>
        </div>
      )}

      {/* ─── Ads by Category ───────────────────────────── */}
      {!loading && !error && (
        <div className="container-custom py-12 space-y-16">
          {visibleCategories.map((cat) => {
            const ads = grouped[cat] || []
            if (ads.length === 0) return null
            return (
              <section key={cat} id={cat.toLowerCase().replace(/\s+/g, '-')}>
                {/* Section Header */}
                <div className="section-header text-left mb-8">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                        {cat}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        {ads.length} advertisement{ads.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {routes[cat] && (
                      <a
                        href={routes[cat]}
                        className="btn btn-sm btn-outline-primary rounded-full"
                      >
                        View all {cat}
                      </a>
                    )}
                  </div>
                  <div className="w-16 h-1 bg-primary-500 mt-3" />
                </div>

                {/* Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ads.map((ad, idx) => (
                    <AdCard key={ad.id} ad={ad} index={idx} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </motion.main>
  )
}

export default Ads