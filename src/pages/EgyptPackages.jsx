import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { packages as staticPackages, faqs, packageReviews as reviews } from '../data/egyptPackages'
import { supabase } from '../lib/supabase'
import EgyptPackagesGrid from '../components/EgyptPackages'
import ToursGrid from '../components/ToursGrid'
import SharmElSheikhDayTours from '../components/SharmElSheikhDayTours';

const API_URL = import.meta.env.VITE_API_URL || ''

// ─── Component ───────────────────────────────────────────────
const EgyptPackages = () => {
  // Packages state - fetches from Supabase with static fallback
  const [packages, setPackages] = useState(staticPackages)
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [dataSource, setDataSource] = useState('static') // 'static' or 'supabase'

  // Fetch packages from Supabase on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
        
        if (!error && data && data.length > 0) {
          // Transform Supabase format to match static data format
          const transformed = data.map(pkg => ({
            id: pkg.id,
            slug: pkg.slug,
            title: pkg.title,
            description: pkg.description,
            longDescription: pkg.long_description,
            duration: pkg.duration,
            durationDays: pkg.duration_days,
            durationFilter: pkg.duration_filter,
            style: pkg.style,
            tourType: pkg.tour_type,
            price: pkg.price,
            originalPrice: pkg.original_price,
            currency: pkg.currency,
            image: pkg.image,
            gallery: pkg.gallery || [],
            highlights: pkg.highlights || [],
            included: pkg.included || [],
            excluded: pkg.excluded || [],
            itinerary: pkg.itinerary || [],
            rating: pkg.rating,
            reviews: pkg.reviews,
            bestSeller: pkg.best_seller,
            locations: pkg.locations || [],
            groupSize: pkg.group_size,
            languages: pkg.languages || [],
            startPoint: pkg.start_point,
            endPoint: pkg.end_point,
          }))
          setPackages(transformed)
          setDataSource('supabase')
          console.log('✅ Loaded', data.length, 'packages from Supabase')
        } else {
          console.log('⚠️ Using static data - Supabase returned:', error?.message || 'no data')
          setDataSource('static')
        }
      } catch (err) {
        console.log('⚠️ Using static packages data (Supabase unavailable):', err.message)
        setDataSource('static')
      }
      setPackagesLoading(false)
    }
    fetchPackages()
  }, [])

  // Unique locations from all packages for destination filter
  const allLocations = useMemo(() => Array.from(
    new Set(
      packages.flatMap(pkg => (Array.isArray(pkg.locations) ? pkg.locations : [])).filter(Boolean)
    )
  ).sort(), [packages])
  const [searchParams] = useSearchParams()
  const durationFilter = searchParams.get('duration') || ''
  const styleFilter = searchParams.get('style') || ''

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState(null)

  // Gallery lightbox
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })

  // Booking form state
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', nationality: '', selectedPackage: '', travelDate: '', travelers: 2, rooms: 1, hotelGrade: '4-star', specialRequests: '',
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Filter state seeded from URL params (for sharable links)
  const [filters, setFilters] = useState({
    duration: durationFilter || '',
    style: styleFilter || '',
    price: '',
    location: '',
  })

  // Filter option definitions
  const durationOptions = [
    { value: '', label: 'Any Duration' },
    { value: '3-5', label: '3–5 Days' },
    { value: '6-8', label: '6–8 Days' },
    { value: '9+', label: '9+ Days' },
  ]

  const styleOptions = [
    { value: '', label: 'Any Style' },
    { value: 'budget', label: 'Best Value (Budget & Deals)' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'Honeymoon', label: 'Honeymoon' },
    { value: 'Small Group', label: 'Small Group' },
  ]

  const priceOptions = [
    { value: '', label: 'Any Budget' },
    { value: '0-800', label: 'Up to $800' },
    { value: '800-1500', label: '$800 – $1,500' },
    { value: '1500-2500', label: '$1,500 – $2,500' },
    { value: '2500+', label: '$2,500+' },
  ]

  // Filtered packages list
  const filteredPackages = useMemo(() => {
    let result = [...packages]

    // Duration bucket (uses durationFilter field where available)
    if (filters.duration) {
      result = result.filter(pkg => pkg.durationFilter === filters.duration)
    }

    // Style / tour type
    if (filters.style) {
      result = result.filter(pkg => {
        // If style is stored directly on the package (budget, luxury, etc.)
        if (pkg.style && (pkg.style === filters.style)) return true
        // Some categories are encoded in tourType (e.g. Honeymoon, Small Group)
        if (pkg.tourType && pkg.tourType === filters.style) return true
        return false
      })
    }

    // Price ranges use base per-person price
    if (filters.price) {
      if (filters.price === '2500+') {
        result = result.filter(pkg => pkg.price >= 2500)
      } else {
        const [min, max] = filters.price.split('-').map(Number)
        result = result.filter(pkg => pkg.price >= min && pkg.price <= max)
      }
    }

    // Destination/location
    if (filters.location) {
      result = result.filter(pkg =>
        Array.isArray(pkg.locations) && pkg.locations.includes(filters.location)
      )
    }

    return result
  }, [filters])

  const hasActiveFilters =
    filters.duration || filters.style || filters.price || filters.location

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))

    // Keep URL params in sync for duration/style only (for sharable links)
    const params = new URLSearchParams()
    const nextDuration = key === 'duration' ? value : filters.duration
    const nextStyle = key === 'style' ? value : filters.style
    if (nextDuration) params.set('duration', nextDuration)
    if (nextStyle) params.set('style', nextStyle)
    // Do not encode price/location into URL to keep it short
    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({ duration: '', style: '', price: '', location: '' })
    window.history.replaceState(null, '', window.location.pathname)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)
    const message = `Hello! I'd like to book an Egypt Package:\n\n📦 Package: ${formData.selectedPackage || 'Not selected'}\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n🌍 Nationality: ${formData.nationality}\n📅 Travel Date: ${formData.travelDate}\n👥 Travelers: ${formData.travelers}\n🏨 Rooms: ${formData.rooms} (${formData.hotelGrade})\n📝 Notes: ${formData.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(message)}`, '_blank')
    setFormSubmitting(false)
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 5000)
  }

  // Stripe checkout for a package
  const handleStripeCheckout = async (pkg) => {
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
      if (!res.ok) throw new Error('Failed to create checkout session')
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Payment setup failed. Please try via WhatsApp.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  }
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: 1.0 + i * 0.1, duration: 0.5, type: 'spring', stiffness: 200 },
    }),
  }
  const trustBadges = [
    { icon: '🏨', text: 'Hotels Included' },
    { icon: '🚐', text: 'Private Transport' },
    { icon: '🎓', text: 'Egyptologist Guides' },
    { icon: '💸', text: 'No Hidden Fees' },
    { icon: '🔄', text: 'Free Cancellation' },
    { icon: '✈️', text: 'Flights Arranged' },
  ]

  return (
  <main className="overflow-hidden">
    {/* ── Hero Banner ─────────────────────────────────────────── */}
    <section className="relative pt-32 pb-20 bg-secondary-500 overflow-hidden">
      <div className="absolute inset-0 opacity-75">
        <img src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&h=900&fit=crop&q=80" alt="Egypt Pyramids panoramic landscape" className="w-full h-full object-cover object-center" />
      </div>
      <div className="relative container-custom text-white">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Egypt Packages</span>
          </nav>
          <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Curated Travel Packages</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Egypt Vacation Packages</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl">Handpicked itineraries from 3 to 12 days covering Cairo, Luxor, Aswan, and the Red Sea. All-inclusive with private guides and transport.</p>
          <div className="flex flex-wrap gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Hotels Included</div>
            <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Private Transport</div>
            <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Egyptologist Guides</div>
            <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> No Hidden Fees</div>
            <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Free Cancellation</div>
          </div>
        </motion.div>
      </div>
    </section>

      {/* ── Classic Tours, Honeymoon & Small Group Link Bar ────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30">
        <div className="container-custom py-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link 
              to="/day-tours?city=classic" 
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">✨</span>
              <span>Classic Tours</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              to="/day-tours?city=honeymoon" 
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">🍽️</span>
              <span>Honeymoon</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a 
              href="#luxury-tours" 
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">✨</span>
              <span>Luxury Tours</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a 
              href="#small-groups" 
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">👥</span>
              <span>Small Group Tours</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── All Packages ───────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 6) * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Package Image */}
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: pkg.gallery, index: 0 })}>
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {pkg.gallery.length}
                  </div>
                  {pkg.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">🔥 Best Seller</div>}
                  {pkg.style === 'luxury' && <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">✨ Luxury</div>}
                  {pkg.originalPrice > pkg.price && <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">-{Math.round((1 - pkg.price/pkg.originalPrice) * 100)}% OFF</div>}
                </div>

                {/* Package Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2.5 py-1 rounded-full">{pkg.duration}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-xs text-gray-500">{pkg.rating} ({pkg.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{pkg.title}</h3>

                  {/* Highlights chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.highlights.slice(0, 3).map(h => (
                      <span key={h} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      {pkg.originalPrice > pkg.price && (
                        <span className="text-sm text-gray-400 line-through mr-1">${pkg.originalPrice}</span>
                      )}
                      <span className="text-xl font-bold text-primary-600">${pkg.price}</span>
                      <span className="text-xs text-gray-500">/person</span>
                    </div>
                    <Link to={`/egypt-packages/${pkg.slug}`} className="btn btn-sm btn-primary">
                      View →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Luxury Tours Section ───────────────────────────────── */}
      <section id="luxury-tours" className="py-16 bg-gradient-to-b from-amber-50 to-white scroll-mt-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-amber-600 text-sm font-semibold uppercase tracking-wider mb-3">Premium Experience</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Luxury Egypt Tours</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience Egypt in ultimate comfort with 5-star hotels, private Egyptologist guides, and exclusive access to ancient wonders.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'luxury-cairo-cruise-8d', title: '8 Days Cairo & Cruise by Flight – Luxury Egypt Tours', duration: '8 Days', price: 2400, image: 'https://images.unsplash.com/photo-1568322503050-1fa74e2506f4?w=600', rating: 4.9, reviews: 156, highlights: ['Pyramids of Giza', 'Sphinx', 'Karnak Temple', 'Nile Cruise', '5-Star Hotels'] },
              { id: 'luxury-pyramids-nile-hurghada-12d', title: '12 Days Egypt Tours Luxury – Pyramids, Nile & Hurghada', duration: '12 Days', price: 1410, image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600', rating: 4.8, reviews: 203, highlights: ['Cairo', 'Nile Cruise', 'Hurghada Beach', 'Red Sea'] },
              { id: 'luxury-cairo-cruise-7d', title: '7 Days Luxury Egypt Tours – Cairo & Cruise by Flight', duration: '7 Days', price: 2199, image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600', rating: 4.9, reviews: 134, highlights: ['Pyramids', 'Saqqara', 'Memphis', 'Old Cairo', 'Nile Cruise'] },
              { id: 'luxury-cairo-alex-cruise-12d', title: '12 Days Cairo, Alex & Cruise by Flight – Luxury', duration: '12 Days', price: 3430, image: 'https://images.unsplash.com/photo-1551106652-a5bcf0b4210f?w=600', rating: 4.9, reviews: 89, highlights: ['Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Nile Cruise'] },
              { id: 'luxury-cairo-luxor-hurghada-8d', title: '8 Days Luxury Tours – Cairo, Luxor & Hurghada', duration: '8 Days', price: 2260, image: 'https://images.unsplash.com/photo-1608313161259-27e73a85bccc?w=600', rating: 4.8, reviews: 178, highlights: ['Pyramids', 'Luxor Temples', 'Red Sea Beach', 'Valley of Kings'] },
              { id: 'luxury-cairo-cruise-sharm-11d', title: '11 Days Cairo, Cruise & Sharm by Flight – Luxury', duration: '11 Days', price: 2997, image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600', rating: 4.9, reviews: 112, highlights: ['Cairo', 'Nile Cruise', 'Sharm El Sheikh', 'Red Sea Diving'] },
              { id: 'luxury-pyramids-nile-sharm-12d', title: 'Pyramids, Nile & Sharm – Egypt Luxury Tours', duration: '12 Days', price: 1600, image: 'https://images.unsplash.com/photo-1573322357635-5b5c8c8c3ab6?w=600', rating: 4.8, reviews: 145, highlights: ['Pyramids', 'Salah El Din Castle', 'Sharm Beaches', 'Nile Cruise'] },
              { id: 'luxury-cairo-alex-nile-8d', title: '8 Days Luxury Tours – Cairo, Alex & Nile by Flight', duration: '8 Days', price: 2520, image: 'https://images.unsplash.com/photo-1560611588-163f295eb145?w=600', rating: 4.9, reviews: 98, highlights: ['Cairo', 'Luxor', 'Valley of Kings', 'Karnak', 'Philae Temple'] },
              { id: 'luxury-cairo-alex-cruise-10d', title: 'Egypt Tours Luxury – Cairo, Alexandria & Cruise', duration: '10 Days', price: 2885, image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600', rating: 4.9, reviews: 167, highlights: ['Cairo', 'Alexandria', 'Nile Cruise', 'Luxor', 'Aswan'] },
              { id: 'luxury-alex-cairo-luxor-8d', title: '8 Days Alexandria, Cairo & Luxor – Luxury Trips', duration: '8 Days', price: 2620, image: 'https://images.unsplash.com/photo-1568322503050-1fa74e2506f4?w=600', rating: 4.8, reviews: 124, highlights: ['Qaitbay Citadel', 'Catacombs', 'Library of Alexandria', 'Luxor'] },
              { id: 'luxury-aswan-abu-simbel-2d', title: 'Aswan & Abu Simbel Tour from Luxor – Short Break', duration: '2 Days', price: 774, image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600', rating: 4.9, reviews: 234, highlights: ['Abu Simbel', 'Aswan', 'Pharaonic History', 'Quick Escape'] },
              { id: 'luxury-cairo-luxor-hurghada-8d-deal', title: '8 Days Luxury Tours – Cairo, Luxor & Hurghada', duration: '8 Days', price: 1000, originalPrice: 2260, image: 'https://images.unsplash.com/photo-1608313161259-27e73a85bccc?w=600', rating: 4.8, reviews: 189, highlights: ['SPECIAL DEAL', 'Pyramids', 'Luxor', 'Red Sea'] },
            ].map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">✨ Luxury</div>
                  {trip.originalPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">🔥 -{Math.round((1 - trip.price/trip.originalPrice) * 100)}% OFF</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">{trip.duration}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-xs text-gray-500">{trip.rating} ({trip.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{trip.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {trip.highlights.slice(0, 3).map(h => (
                      <span key={h} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {trip.originalPrice && (
                        <span className="text-sm text-gray-400 line-through mr-2">${trip.originalPrice}</span>
                      )}
                      <span className="text-xl font-bold text-amber-600">${trip.price}</span>
                      <span className="text-xs text-gray-500">/person</span>
                    </div>
                    <Link to={`/egypt-packages/${trip.id}`} className="btn btn-sm bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white">
                      View →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Luxury Nile Cruises Section ───────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-purple-600 text-sm font-semibold uppercase tracking-wider mb-3">Premium Nile Experience</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Best Luxury Tours - Nile Cruise Only</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Sail in ultimate luxury aboard Egypt's finest 5-star Nile cruises between Luxor and Aswan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'sonesta-st-george', title: 'Sonesta St. George Luxury Nile Cruise', duration: '5 Days / 4 Days', image: 'https://images.unsplash.com/photo-1568322503050-1fa74e2506f4?w=600', rating: 4.9, reviews: 312, highlights: ['French Style', '47 Deluxe Cabins', '9 Presidential Suites', 'Royal Suite'], style: '5-Star Luxury' },
              { id: 'sonesta-moon-goddess', title: 'Sonesta Moon Goddess Luxury Nile Cruise', duration: '5 Days / 4 Days', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600', rating: 4.9, reviews: 287, highlights: ['Most Charming Cruise', 'Excellent Service', 'Premium Comfort', 'Gourmet Dining'], style: '5-Star Luxury' },
              { id: 'oberoi-zahra', title: 'Oberoi Zahra Nile Cruise', duration: '5 Days / 4 Days', image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600', rating: 5.0, reviews: 198, highlights: ['Largest Suites on Nile', 'VIP Level Luxury', 'Private Butler', 'Spa & Wellness'], style: 'Ultra Luxury' },
              { id: 'oberoi-philae', title: 'Oberoi Philae Nile Cruise', duration: '5 Days / 4 Days', image: 'https://images.unsplash.com/photo-1551106652-a5bcf0b4210f?w=600', rating: 5.0, reviews: 176, highlights: ['First-Class Service', 'Elegant Design', 'World-Class Cuisine', 'Infinity Pool'], style: 'Ultra Luxury' },
            ].map((cruise, index) => (
              <motion.div
                key={cruise.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="bg-gradient-to-b from-purple-50 to-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={cruise.image} alt={cruise.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">🛳️ {cruise.style}</div>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">{cruise.duration}</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(cruise.rating))}</span>
                    <span className="text-xs text-gray-500">{cruise.rating} ({cruise.reviews})</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{cruise.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cruise.highlights.slice(0, 2).map(h => (
                      <span key={h} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                  <Link to={`/nile-cruises/${cruise.id}`} className="btn btn-sm w-full justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                    View Cruise Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Small Groups Section ───────────────────────────────── */}
      <section id="small-groups" className="py-16 bg-gray-50 scroll-mt-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-3">Join Fellow Travelers</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Small Group Tours</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Join like-minded travelers on our expertly guided small group adventures. Maximum 12 travelers per group for an intimate experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'seniors-cairo-hurghada-6d', title: '6 Days Egypt Group Tours for Seniors - Cairo & Hurghada', duration: '6 Days', price: 670, originalPrice: 820, image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600', rating: 4.8, reviews: 89, highlights: ['Pyramids of Giza', 'Sakkara', 'Old Cairo', 'Red Sea Coast'] },
              { id: 'seniors-cairo-nile-8d', title: '8 Days Egypt Group Tours for Seniors - Cairo & Nile Cruise', duration: '8 Days', price: 1295, originalPrice: 1550, image: 'https://images.unsplash.com/photo-1568322503050-1fa74e2506f4?w=600', rating: 4.9, reviews: 156, highlights: ['Pyramids', 'Luxor Temple', 'Valley of Kings', 'Nile Cruise'] },
              { id: 'budget-cairo-nile-8d', title: '8 Days Egypt Budget Tour - Cairo, Aswan & Luxor', duration: '8 Days', price: 795, originalPrice: 950, image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600', rating: 4.7, reviews: 203, highlights: ['Budget-Friendly', 'Cairo', 'Nile Cruise', 'Luxor'] },
              { id: 'women-cairo-nile-8d', title: '8 Days Women Only Tour - Cairo & Nile Cruise', duration: '8 Days', price: 1395, originalPrice: 1650, image: 'https://images.unsplash.com/photo-1551106652-a5bcf0b4210f?w=600', rating: 4.9, reviews: 78, highlights: ['Women Only', 'Safe Travel', 'Expert Female Guide', 'Nile Cruise'] },
              { id: 'christmas-cairo-nile-8d', title: '8 Days Christmas & New Year Tour - Cairo & Nile', duration: '8 Days', price: 1695, originalPrice: 1950, image: 'https://images.unsplash.com/photo-1608313161259-27e73a85bccc?w=600', rating: 4.9, reviews: 134, highlights: ['Christmas Celebration', 'New Year Party', 'Pyramids', 'Nile Cruise'] },
              { id: 'easter-cairo-nile-8d', title: '8 Days Easter Tour - Cairo & Nile Cruise', duration: '8 Days', price: 1495, originalPrice: 1750, image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600', rating: 4.8, reviews: 92, highlights: ['Easter Special', 'Pyramids', 'Luxor', 'Nile Cruise'] },
            ].map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">👥 Small Group</div>
                  {trip.originalPrice > trip.price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">-{Math.round((1 - trip.price/trip.originalPrice) * 100)}% OFF</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{trip.duration}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-xs text-gray-500">{trip.rating} ({trip.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{trip.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {trip.highlights.slice(0, 3).map(h => (
                      <span key={h} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {trip.originalPrice > trip.price && (
                        <span className="text-sm text-gray-400 line-through mr-2">${trip.originalPrice}</span>
                      )}
                      <span className="text-xl font-bold text-emerald-600">${trip.price}</span>
                      <span className="text-xs text-gray-500">/person</span>
                    </div>
                    <Link to={`/group-tours`} className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white">
                      View →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/group-tours" className="btn btn-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              View All Small Group Tours →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Why Book With Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>The Egypt Travel Pro Guarantee</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: '🛡️', title: 'Licensed & Insured', desc: 'Egyptian Ministry of Tourism licensed' },
              { icon: '💰', title: 'Best Price', desc: 'Price match guarantee on all packages' },
              { icon: '🔄', title: 'Free Cancellation', desc: 'Cancel up to 48hrs before for full refund' },
              { icon: '🎓', title: 'Expert Guides', desc: 'Certified Egyptologist guides' },
              { icon: '🚗', title: 'Private Transport', desc: 'Modern AC vehicles, no shared buses' },
              { icon: '📱', title: '24/7 Support', desc: 'WhatsApp support throughout your trip' },
            ].map(item => (
              <div key={item.title} className="text-center p-4">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Form ───────────────────────────────────────── */}
      <section className="py-16 bg-gray-50" id="booking-form">
        <div className="container-custom max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-10">
              <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Book Your Package</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Request a Booking
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">Fill in your details and we'll confirm your package within 24 hours. No payment required to submit — pay only when confirmed.</p>
            </div>

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center text-green-700 font-medium">
                ✅ Your booking request has been sent! We'll contact you within 24 hours.
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp *</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="+1 234 567 8900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <input type="text" value={formData.nationality} onChange={e => setFormData(p => ({ ...p, nationality: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="e.g. American, British, German" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Package *</label>
                  <select required value={formData.selectedPackage} onChange={e => setFormData(p => ({ ...p, selectedPackage: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                    <option value="">Choose a package</option>
                    {packages.map(pkg => <option key={pkg.id} value={pkg.title}>{pkg.title} — ${pkg.price}/person ({pkg.duration})</option>)}
                    <option value="Custom Package">Custom Package — Tell us what you want</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date *</label>
                  <input type="date" required value={formData.travelDate} onChange={e => setFormData(p => ({ ...p, travelDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers *</label>
                  <select required value={formData.travelers} onChange={e => setFormData(p => ({ ...p, travelers: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Grade</label>
                  <select value={formData.hotelGrade} onChange={e => setFormData(p => ({ ...p, hotelGrade: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                    <option value="3-star">3-Star (Budget)</option>
                    <option value="4-star">4-Star (Standard)</option>
                    <option value="5-star">5-Star (Luxury)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests / Notes</label>
                <textarea rows={3} value={formData.specialRequests} onChange={e => setFormData(p => ({ ...p, specialRequests: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="Any dietary requirements, accessibility needs, extra activities, room preferences..." />
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button type="submit" disabled={formSubmitting} className="btn btn-primary flex-1 justify-center text-base py-3.5">
                  {formSubmitting ? 'Sending...' : '📩 Submit Booking Request'}
                </button>
                <a href="https://wa.me/201212011881?text=Hi!%20I%27m%20interested%20in%20an%20Egypt%20travel%20package.%20Can%20you%20help%20me%20plan%20my%20trip?" target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline-primary flex-1 justify-center text-base py-3.5">
                  💬 Book via WhatsApp
                </a>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">No payment required now. We'll confirm availability and send you a detailed quote.</p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Reviews Section ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Traveler Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Guests Say</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="text-gray-700 font-semibold">4.9/5</span>
              <span className="text-gray-500 text-sm">based on 1,200+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-3 text-yellow-400">{'★'.repeat(review.rating)}</div>
                <p className="text-gray-600 text-sm italic mb-4">"{review.text}"</p>
                <div className="border-t pt-3">
                  <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.country} • {review.package}</p>
                  <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Have Questions?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <svg className={`w-5 h-5 text-primary-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────── */}
      <section className="py-16 bg-secondary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Can't Find What You're Looking For?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            We specialize in custom Egypt itineraries. Tell us your dates, interests, and budget — we'll design your perfect trip.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/201212011881?text=Hi!%20I%20want%20a%20custom%20Egypt%20package.%20Can%20you%20help?" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              💬 Chat on WhatsApp
            </a>
            <Link to="/contact" className="btn btn-outline btn-lg">
              ✉️ Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Lightbox Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox({ ...lightbox, open: false })}
          >
            <button className="absolute top-4 right-4 text-white text-3xl hover:text-primary-400 z-50" onClick={() => setLightbox({ ...lightbox, open: false })}>✕</button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-primary-400" onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: (l.index - 1 + l.images.length) % l.images.length })) }}>‹</button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-primary-400" onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: (l.index + 1) % l.images.length })) }}>›</button>
            <img src={lightbox.images[lightbox.index]} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
            <div className="absolute bottom-4 text-white text-sm">{lightbox.index + 1} / {lightbox.images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Egypt Packages Grid Section */}
      <section style={{marginTop: '2rem', padding: '2rem'}}>
        <EgyptPackagesGrid />
      </section>

      {/* Tours Grid Section */}
      <ToursGrid />

      {/* Sharm El-Sheikh Day Tours Section */}
      <SharmElSheikhDayTours />
    </main>
  )
}

export default EgyptPackages