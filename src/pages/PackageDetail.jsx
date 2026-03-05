import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { packages as staticPackages } from '../data/egyptPackages'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * PackageDetail Component
 * Full detail page for individual Egypt travel packages
 * Fetches from Supabase with static file fallback
 */
const PackageDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  // Package state - fetches from Supabase then falls back to static
  const [pkg, setPkg] = useState(null)
  const [allPackages, setAllPackages] = useState(staticPackages)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Fetch package from Supabase on mount
  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true)
      setNotFound(false)

      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('slug', slug)
          .single()

        if (!error && data) {
          console.log('✅ Loaded package from Supabase:', data.title)
          // Transform Supabase format to match component expectations
          const transformed = {
            id: data.id,
            slug: data.slug,
            title: data.title,
            description: data.description,
            longDescription: data.long_description,
            duration: data.duration,
            durationDays: data.duration_days,
            durationFilter: data.duration_filter,
            style: data.style,
            tourType: data.tour_type,
            price: data.price,
            originalPrice: data.original_price,
            currency: data.currency,
            image: data.image,
            gallery: data.gallery || [],
            highlights: data.highlights || [],
            included: data.included || [],
            excluded: data.excluded || [],
            itinerary: data.itinerary || [],
            rating: data.rating,
            reviews: data.reviews,
            bestSeller: data.best_seller,
            locations: data.locations || [],
            groupSize: data.group_size,
            languages: data.languages || [],
            startPoint: data.start_point,
            endPoint: data.end_point,
          }
          setPkg(transformed)
          setLoading(false)
          return
        } else {
          console.log('⚠️ Supabase lookup failed:', error?.message || 'not found')
        }
      } catch (err) {
        console.log('⚠️ Supabase fetch failed, using static data:', err.message)
      }

      // Fallback to static data
      const staticPkg = staticPackages.find(p => p.slug === slug || p.id === slug)
      if (staticPkg) {
        console.log('📦 Using static data for:', staticPkg.title)
        setPkg(staticPkg)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }

    fetchPackage()
  }, [slug])

  // Related packages (same style or different, excluding current)
  const relatedPackages = allPackages.filter(p => p.id !== pkg?.id).slice(0, 3)

  // Gallery lightbox
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })
  const [activeDay, setActiveDay] = useState(null)

  // Booking form
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', nationality: '',
    travelDate: '', travelers: 2, rooms: 1, hotelGrade: '4-star', specialRequests: '',
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Sticky sidebar tracking
  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  // Loading state
  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50 pt-20 min-h-screen">
        <div className="text-center px-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package...</p>
        </div>
      </main>
    )
  }

  if (notFound || !pkg) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50 pt-20 min-h-screen">
        <div className="text-center px-4">
          <div className="text-8xl mb-6">🏜️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <p className="text-gray-600 text-lg mb-8">The package you're looking for doesn't exist or has been removed.</p>
          <Link to="/egypt-packages" className="btn btn-primary">← Back to All Packages</Link>
        </div>
      </main>
    )
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)
    const message = `Hello! I'd like to book:\n\n📦 Package: ${pkg.title} (${pkg.duration})\n💰 Price: $${pkg.price}/person\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n🌍 Nationality: ${formData.nationality}\n📅 Travel Date: ${formData.travelDate}\n👥 Travelers: ${formData.travelers}\n🏨 Rooms: ${formData.rooms} (${formData.hotelGrade})\n📝 Notes: ${formData.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(message)}`, '_blank')
    setFormSubmitting(false)
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 5000)
  }

  const handleStripeCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carName: pkg.title,
          carId: pkg.id,
          routeFrom: 'Egypt Package',
          routeTo: pkg.duration,
          distance: 0,
          transferDate: formData.travelDate || '',
          transferTime: '',
          passengers: formData.travelers || 2,
          amount: pkg.price * (formData.travelers || 2),
          customerEmail: formData.email || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Payment setup failed. Please try via WhatsApp.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const discount = pkg.originalPrice > pkg.price
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0

  // Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.description,
    touristType: 'Cultural Tourism',
    itinerary: {
      '@type': 'ItemList',
      itemListElement: pkg.itinerary.map((day, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `Day ${day.day}: ${day.title}`,
        description: day.details,
      })),
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: pkg.currency,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: pkg.rating,
      reviewCount: pkg.reviews,
      bestRating: 5,
    },
  }

  return (
    <main className="overflow-hidden bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[65vh]">
          <img
            src={pkg.gallery[0] || pkg.image}
            alt={`${pkg.title} — Egypt Travel Package`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Gallery button */}
          <button
            onClick={() => setLightbox({ open: true, index: 0 })}
            className="absolute bottom-6 right-6 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View All {pkg.gallery.length} Photos
          </button>

          {/* Badges */}
          {pkg.bestSeller && (
            <div className="absolute top-28 left-6 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              🔥 Best Seller
            </div>
          )}
          {pkg.style === 'luxury' && (
            <div className="absolute top-28 right-6 bg-yellow-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              ✨ Luxury Package
            </div>
          )}

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
            <div className="container-custom">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/egypt-packages" className="hover:text-white transition-colors">Egypt Packages</Link>
                  <span>/</span>
                  <span className="text-white">{pkg.title}</span>
                </nav>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {pkg.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {pkg.locations?.join(' → ')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-yellow-400">{'★'.repeat(Math.floor(pkg.rating))}</span>
                    <span>{pkg.rating}/5</span>
                    <span className="text-white/60">({pkg.reviews} reviews)</span>
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery Thumbnails Strip ────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {pkg.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox({ open: true, index: i })}
                className="flex-shrink-0 w-20 h-14 md:w-28 md:h-20 rounded-lg overflow-hidden hover:opacity-80 transition-opacity ring-2 ring-transparent hover:ring-primary-400"
              >
                <img src={img} alt={`${pkg.title} photo ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content + Sidebar ──────────────────────────────── */}
      <section className="py-10 md:py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* ── Left Column: Main Content ─────────────────────── */}
            <div className="lg:col-span-2 space-y-10">

              {/* Quick Info Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-xl bg-blue-50">
                    <div className="text-2xl mb-1">🕐</div>
                    <div className="text-xs text-gray-500 mb-0.5">Duration</div>
                    <div className="font-bold text-gray-900 text-sm">{pkg.duration}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-green-50">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-xs text-gray-500 mb-0.5">Group Size</div>
                    <div className="font-bold text-gray-900 text-sm">{pkg.groupSize || 'Private'}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-purple-50">
                    <div className="text-2xl mb-1">🗣️</div>
                    <div className="text-xs text-gray-500 mb-0.5">Languages</div>
                    <div className="font-bold text-gray-900 text-sm">{pkg.languages?.slice(0, 3).join(', ')}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-orange-50">
                    <div className="text-2xl mb-1">🏷️</div>
                    <div className="text-xs text-gray-500 mb-0.5">Tour Type</div>
                    <div className="font-bold text-gray-900 text-sm">{pkg.tourType || 'Cultural'}</div>
                  </div>
                </div>
              </motion.div>

              {/* Overview / Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="text-primary-500">📖</span> Tour Overview
                </h2>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                  {pkg.longDescription || pkg.description}
                </p>

                {/* Highlights */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tour Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
                      <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        ✓
                      </div>
                      <span className="text-gray-800 font-medium text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Locations Map */}
              {pkg.locations && pkg.locations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span className="text-primary-500">📍</span> Places You'll Visit
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {pkg.locations.map((loc, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="bg-secondary-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
                        <span className="font-medium text-gray-800">{loc}</span>
                        {i < pkg.locations.length - 1 && (
                          <svg className="w-4 h-4 text-gray-300 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Day-by-Day Itinerary ────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="text-primary-500">📅</span> Day-by-Day Itinerary
                </h2>

                <div className="space-y-4">
                  {pkg.itinerary.map((day, i) => (
                    <div key={day.day} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <button
                        onClick={() => setActiveDay(activeDay === i ? null : i)}
                        className="w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex flex-col items-center justify-center shadow-md">
                          <span className="text-[10px] uppercase font-medium leading-none">Day</span>
                          <span className="text-xl font-bold leading-none">{day.day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-base md:text-lg">{day.title}</h4>
                          {activeDay !== i && (
                            <p className="text-sm text-gray-500 mt-0.5 truncate">{day.details}</p>
                          )}
                        </div>
                        <svg
                          className={`w-5 h-5 text-primary-500 flex-shrink-0 transition-transform duration-300 ${activeDay === i ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {activeDay === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 md:px-5 pb-5 border-t border-gray-100 pt-4">
                              <p className="text-gray-700 leading-relaxed mb-4">{day.details}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                {day.meals && (
                                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                                    <span>🍽️</span>
                                    <span className="font-medium">{day.meals}</span>
                                  </div>
                                )}
                                {day.accommodation && day.accommodation !== '-' && (
                                  <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
                                    <span>🏨</span>
                                    <span className="font-medium">{day.accommodation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── Included / Excluded ──────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-6"
              >
                {/* Included */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-green-100">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">✅</span>
                    What's Included
                  </h2>
                  <ul className="space-y-3">
                    {pkg.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excluded */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-red-100">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg">✕</span>
                    Not Included
                  </h2>
                  <ul className="space-y-3">
                    {pkg.excluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-500 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* ── Booking Form ─────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                id="booking-form"
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="text-primary-500">📩</span> Book This Package
                </h2>
                <p className="text-gray-500 mb-6">Fill in your details and we'll confirm within 24 hours. No payment required now.</p>

                {formSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center text-green-700 font-medium">
                    ✅ Your booking request has been sent! We'll contact you within 24 hours.
                  </div>
                )}

                <form onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="John Smith" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone / WhatsApp *</label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="+1 234 567 8900" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality</label>
                      <input type="text" value={formData.nationality} onChange={e => setFormData(p => ({ ...p, nationality: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="e.g. American, British" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Travel Date *</label>
                      <input type="date" required value={formData.travelDate} onChange={e => setFormData(p => ({ ...p, travelDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Travelers *</label>
                      <select required value={formData.travelers} onChange={e => setFormData(p => ({ ...p, travelers: Number(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Rooms</label>
                      <select value={formData.rooms} onChange={e => setFormData(p => ({ ...p, rooms: Number(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Hotel Grade</label>
                      <select value={formData.hotelGrade} onChange={e => setFormData(p => ({ ...p, hotelGrade: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                        <option value="3-star">3-Star (Budget)</option>
                        <option value="4-star">4-Star (Standard)</option>
                        <option value="5-star">5-Star (Luxury)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests</label>
                    <textarea rows={3} value={formData.specialRequests} onChange={e => setFormData(p => ({ ...p, specialRequests: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="Dietary requirements, accessibility needs, extra activities..." />
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button type="submit" disabled={formSubmitting} className="btn btn-primary flex-1 justify-center text-base py-3.5">
                      {formSubmitting ? 'Sending...' : '📩 Submit Booking Request'}
                    </button>
                    <a href={`https://wa.me/201212011881?text=${encodeURIComponent(`Hi! I'm interested in the ${pkg.title} package (${pkg.duration}, $${pkg.price}/person). Can you help me book?`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline-primary flex-1 justify-center text-base py-3.5">
                      💬 Book via WhatsApp
                    </a>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* ── Right Column: Pricing Sidebar ─────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Price Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="text-center mb-5">
                    {discount > 0 && (
                      <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                        🔥 {discount}% OFF — Limited Time
                      </span>
                    )}
                    <div className="flex items-center justify-center gap-3">
                      {pkg.originalPrice > pkg.price && (
                        <span className="text-xl text-gray-400 line-through">${pkg.originalPrice}</span>
                      )}
                      <span className="text-4xl font-bold text-primary-600">${pkg.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">per person</p>
                  </div>

                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary-500">🕐</span>
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-gray-900 ml-auto">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary-500">🏷️</span>
                      <span className="text-gray-600">Tour Type:</span>
                      <span className="font-semibold text-gray-900 ml-auto">{pkg.tourType}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary-500">👥</span>
                      <span className="text-gray-600">Group Size:</span>
                      <span className="font-semibold text-gray-900 ml-auto">{pkg.groupSize || 'Private'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary-500">🗣️</span>
                      <span className="text-gray-600">Languages:</span>
                      <span className="font-semibold text-gray-900 ml-auto">{pkg.languages?.length || 0}+</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary-500">⭐</span>
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold text-gray-900 ml-auto">{pkg.rating}/5 ({pkg.reviews})</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary-500">📍</span>
                      <span className="text-gray-600">Start:</span>
                      <span className="font-semibold text-gray-900 ml-auto text-right text-xs">{pkg.startPoint}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary-500">🏁</span>
                      <span className="text-gray-600">End:</span>
                      <span className="font-semibold text-gray-900 ml-auto text-right text-xs">{pkg.endPoint}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full btn btn-primary justify-center py-3.5 text-base"
                    >
                      📩 Book This Package
                    </button>
                    <button
                      onClick={handleStripeCheckout}
                      disabled={checkoutLoading}
                      className="w-full btn bg-purple-600 hover:bg-purple-700 text-white justify-center py-3.5 text-base flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      {checkoutLoading ? 'Processing...' : 'Pay Online'}
                    </button>
                    <a
                      href={`https://wa.me/201212011881?text=${encodeURIComponent(`Hi! I'm interested in the ${pkg.title} package (${pkg.duration}, $${pkg.price}/person).`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full btn btn-outline-primary justify-center py-3.5 text-base"
                    >
                      💬 WhatsApp Us
                    </a>
                  </div>
                </motion.div>

                {/* Trust Badges */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 text-sm mb-4 text-center">Why Book With Us</h4>
                  <div className="space-y-3">
                    {[
                      { icon: '🛡️', text: 'Licensed by Egyptian Ministry of Tourism' },
                      { icon: '💰', text: 'Best Price Guarantee' },
                      { icon: '🔄', text: 'Free Cancellation (48hrs)' },
                      { icon: '🎓', text: 'Certified Egyptologist Guides' },
                      { icon: '🚗', text: 'Private Transport — No Shared Buses' },
                      { icon: '📱', text: '24/7 WhatsApp Support' },
                    ].map((badge, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-gray-700">{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Need Help Card */}
                <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl mb-2">🤔</div>
                  <h4 className="font-bold text-lg mb-2">Need Help Choosing?</h4>
                  <p className="text-white/80 text-sm mb-4">Our travel experts are available 24/7 to help you plan the perfect Egypt trip.</p>
                  <a
                    href="https://wa.me/201212011881?text=Hi!%20I%20need%20help%20choosing%20the%20right%20Egypt%20package.%20Can%20you%20help?"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-white text-secondary-600 font-bold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    💬 Chat Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Packages ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">More Adventures</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              You Might Also Like
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPackages.map((rp) => (
              <Link
                key={rp.id}
                to={`/egypt-packages/${rp.slug}`}
                className="group bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {rp.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">🔥 Best Seller</div>}
                  <div className="absolute bottom-3 right-3 bg-primary-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm">${rp.price}</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full">{rp.duration}</span>
                    <span className="text-xs text-gray-500">
                      {'★'.repeat(Math.floor(rp.rating))} {rp.rating}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {rp.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rp.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/egypt-packages" className="btn btn-outline-primary text-base">
              ← View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────── */}
      <section className="py-16 bg-secondary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Explore Egypt?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Book the {pkg.title} package today and create memories that last a lifetime. Our team is ready to make your Egyptian dream come true.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary btn-lg"
            >
              📩 Book Now — ${pkg.price}/person
            </button>
            <a href={`https://wa.me/201212011881?text=${encodeURIComponent(`Hi! I want to book the ${pkg.title} package.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Sticky Bottom Bar (Mobile) ──────────────────────────── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 lg:hidden"
          >
            <div className="flex items-center gap-3 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">{pkg.title}</p>
                <div className="flex items-center gap-2">
                  {pkg.originalPrice > pkg.price && (
                    <span className="text-sm text-gray-400 line-through">${pkg.originalPrice}</span>
                  )}
                  <span className="text-xl font-bold text-primary-600">${pkg.price}</span>
                  <span className="text-xs text-gray-500">/person</span>
                </div>
              </div>
              <button
                onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary text-sm py-2.5 px-5 flex-shrink-0"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Gallery Lightbox ────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox({ ...lightbox, open: false })}
          >
            <button className="absolute top-4 right-4 text-white text-3xl hover:text-primary-400 z-50" onClick={() => setLightbox({ ...lightbox, open: false })}>✕</button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-primary-400"
              onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: (l.index - 1 + pkg.gallery.length) % pkg.gallery.length })) }}
            >‹</button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-primary-400"
              onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: (l.index + 1) % pkg.gallery.length })) }}
            >›</button>
            <img
              src={pkg.gallery[lightbox.index]}
              alt={`${pkg.title} — Photo ${lightbox.index + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-4 text-white text-sm">
              {lightbox.index + 1} / {pkg.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default PackageDetail