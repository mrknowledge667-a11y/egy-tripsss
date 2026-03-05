import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroSection, TripCard, DestinationCard, WorldWindGlobe, EgyptRightNow, InteractiveEgyptMap, VisitEgyptTrips } from '../components'
import { supabase } from '../lib/supabase'
// Fallback data
import tripsDataFallback from '../data/trips.json'
import destinationsDataFallback from '../data/destinations.json'

// Car fleet data for transfer booking
const carFleet = [
  { id: 'sedan', name: 'Sedan Car', passengers: '1-3', luggage: '2 bags', image: '🚗', pricePerKm: 0.5 },
  { id: 'suv', name: 'SUV / Crossover', passengers: '1-5', luggage: '4 bags', image: '🚙', pricePerKm: 0.7 },
  { id: 'van', name: 'Minivan', passengers: '1-7', luggage: '6 bags', image: '🚐', pricePerKm: 0.9 },
  { id: 'bus', name: 'Minibus', passengers: '8-15', luggage: '10 bags', image: '🚌', pricePerKm: 1.2 },
  { id: 'luxury', name: 'Luxury Car', passengers: '1-3', luggage: '2 bags', image: '✨', pricePerKm: 1.5 },
  { id: 'limousine', name: 'Limousine', passengers: '1-4', luggage: '3 bags', image: '🏎️', pricePerKm: 2.0 },
]

// Popular transfer routes
const transferRoutes = [
  { id: 'cairo-luxor', from: 'Cairo', to: 'Luxor', distance: 660, popular: true },
  { id: 'cairo-hurghada', from: 'Cairo', to: 'Hurghada', distance: 460, popular: true },
  { id: 'cairo-alex', from: 'Cairo', to: 'Alexandria', distance: 225, popular: true },
  { id: 'cairo-sharm', from: 'Cairo', to: 'Sharm El Sheikh', distance: 500, popular: true },
  { id: 'cairo-ain', from: 'Cairo', to: 'Ain Sokhna', distance: 130, popular: false },
  { id: 'cairo-aswan', from: 'Cairo', to: 'Aswan', distance: 880, popular: false },
  { id: 'luxor-aswan', from: 'Luxor', to: 'Aswan', distance: 220, popular: true },
  { id: 'luxor-hurghada', from: 'Luxor', to: 'Hurghada', distance: 300, popular: false },
  { id: 'hurghada-cairo', from: 'Hurghada', to: 'Cairo Airport', distance: 470, popular: false },
  { id: 'airport-cairo', from: 'Cairo Airport', to: 'Downtown Cairo', distance: 25, popular: true },
  { id: 'airport-giza', from: 'Cairo Airport', to: 'Giza / Pyramids', distance: 45, popular: true },
  { id: 'custom', from: 'Custom', to: 'Custom', distance: 0, popular: false },
]

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

/**
 * Home Page
 * Landing page for Egypt Travel Pro — private transfers & curated tours across Egypt
 * Sections: Hero, Book Transfer, About, Tours, Destinations, Why Choose Us, Testimonials, Stats, CTA
 * Fetches data from Supabase with JSON fallback
 */
const Home = () => {
  const [featuredTrips, setFeaturedTrips] = useState(tripsDataFallback.slice(0, 20))
  const [featuredDestinations, setFeaturedDestinations] = useState(destinationsDataFallback.slice(0, 6))

  // Fetch data from Supabase (merge with fallback — always show 20 trips minimum)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured trips (must be published AND featured)
        const { data: trips, error: tripsError } = await supabase
          .from('trips')
          .select('*')
          .eq('is_featured', true)
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(20)

        if (!tripsError && trips && trips.length >= 20) {
          // Supabase has enough trips — use them
          setFeaturedTrips(trips)
        } else if (!tripsError && trips && trips.length > 0) {
          // Supabase returned fewer than 20 — merge with JSON fallback to always show 20
          const supabaseIds = new Set(trips.map(t => t.id))
          const remaining = tripsDataFallback.filter(t => !supabaseIds.has(t.id))
          setFeaturedTrips([...trips, ...remaining].slice(0, 20))
        }
        // If Supabase returns nothing or errors, keep the initial 20 from JSON fallback

        // Fetch featured destinations
        const { data: destinations, error: destError } = await supabase
          .from('destinations')
          .select('*')
          .order('name')
          .limit(6)

        if (!destError && destinations && destinations.length > 0) {
          setFeaturedDestinations(destinations)
        }
      } catch (error) {
        console.error('Error fetching home data:', error)
        // Keep fallback data on error
      }
    }

    fetchData()
  }, [])
  
  const aboutRef = useRef(null)
  const toursRef = useRef(null)
  const destinationsRef = useRef(null)
  const whyUsRef = useRef(null)
  const statsRef = useRef(null)

  // GSAP Scroll Animations
  useEffect(() => {
    // About section animation
    if (aboutRef.current) {
      gsap.fromTo(
        aboutRef.current.querySelectorAll('.gsap-fade-up'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    // Tours section animation
    if (toursRef.current) {
      gsap.fromTo(
        toursRef.current.querySelectorAll('.tour-card-animate'),
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: toursRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    // Stats counter animation
    if (statsRef.current) {
      const statNumbers = statsRef.current.querySelectorAll('.stat-number')
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target'))
        gsap.fromTo(
          stat,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  // Transfer booking state
  const [selectedCar, setSelectedCar] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState('')
  const [transferDate, setTransferDate] = useState('')
  const [transferTime, setTransferTime] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || ''

  // Handle Stripe Checkout
  const handleStripeCheckout = useCallback(async () => {
    const car = carFleet.find(c => c.id === selectedCar)
    const route = transferRoutes.find(r => r.id === selectedRoute)
    if (!car || !route || route.distance <= 0) return

    const amount = Math.round(car.pricePerKm * route.distance)
    if (amount <= 0) return

    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carName: car.name,
          carId: car.id,
          routeFrom: route.from,
          routeTo: route.to,
          distance: route.distance,
          transferDate,
          transferTime,
          passengers,
          amount,
          customerEmail: customerEmail || undefined,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create checkout session')
      }

      const data = await res.json()
      // Redirect to Stripe hosted checkout page
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Stripe checkout error:', err)
      alert('Payment setup failed. Please try again or book via WhatsApp.')
    } finally {
      setCheckoutLoading(false)
    }
  }, [selectedCar, selectedRoute, transferDate, transferTime, passengers, customerEmail, API_URL])

  // Why Choose Us features
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Licensed & Insured',
      description: 'Fully licensed by the Egyptian Ministry of Tourism with comprehensive insurance on every ride',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Professional Drivers',
      description: 'English-speaking, vetted drivers who know every route and shortcut across Egypt',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Transparent Pricing',
      description: 'Fixed rates with no hidden fees, surge pricing, or surprises — what you see is what you pay',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: '24/7 Availability',
      description: 'Book transfers any time of day or night — airport pickups, hotel drops, and intercity rides',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Modern Fleet',
      description: 'Air-conditioned, well-maintained vehicles ranging from sedans to luxury limousines',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Door-to-Door Service',
      description: 'Picked up from your exact location and dropped off right at your destination — hassle-free',
    },
  ]

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      rating: 5,
      text: 'Booked a private transfer from Cairo Airport to our hotel. The driver was waiting with a sign, the car was spotless, and we arrived safely. Highly recommend!',
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Sydney, Australia',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 5,
      text: 'Used Egypt Travel Pro for our entire 10-day itinerary — transfers, tours, Nile cruise. Everything was seamless and professionally handled.',
    },
    {
      id: 3,
      name: 'Emma Williams',
      location: 'London, UK',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 5,
      text: 'The Cairo-to-Hurghada transfer was comfortable and on time. Our driver was friendly and the SUV was perfect for our family of five!',
    },
  ]

  // Stats data
  const stats = [
    { number: 20000, suffix: '+', label: 'Transfers Completed' },
    { number: 50, suffix: '+', label: 'Tour Packages' },
    { number: 15, suffix: '+', label: 'Years on the Road' },
    { number: 99, suffix: '%', label: 'On-Time Rate' },
  ]

  return (
    <main className="overflow-hidden">
      {/* Hero Section - Video Background Only */}
      <HeroSection showSearch={false} />

      {/* Section: Book Your Transfer — with NASA WorldWind Globe */}
      <section className="overflow-hidden bg-[#030812]" id="book-transfer">
        {/* NASA WebWorldWind 3D Earth Globe - Large interactive size */}
        <div className="relative w-full flex items-center justify-center py-8 md:py-12">
          <div className="relative w-full max-w-[90vw] md:max-w-[700px] lg:max-w-[800px] aspect-square mx-auto">
            <WorldWindGlobe />
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030812]/80 pointer-events-none" />
        </div>

        {/* Egypt Right Now — Real-time info widget */}
        <EgyptRightNow />
      </section>

      {/* Egypt Trip Advertisements — 20 Curated Tours (below Earth globe) */}
      <section ref={aboutRef} className="section bg-white" id="egypt-tours" aria-label="Egypt Tour Packages">
        <div className="container-custom">
          {/* SEO-optimized header */}
          <div className="text-center mb-12">
            <span className="gsap-fade-up inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              Welcome to Egypt Travel Pro
            </span>
            <h2 className="gsap-fade-up text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Trusted Travel Partner in Egypt
            </h2>
            <p className="gsap-fade-up text-gray-600 text-lg max-w-3xl mx-auto mb-2">
              Discover 20 handpicked Egypt tours — from Pyramids of Giza day trips and Nile cruises to Red Sea diving adventures, desert safaris, and cultural walking tours. Book your dream Egypt vacation today.
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-4 gsap-fade-up" />
          </div>

          {/* 20-Trip Grid with SEO schema markup */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <meta itemProp="name" content="Best Egypt Tours & Travel Packages 2026" />
            <meta itemProp="description" content="Browse 20 top-rated Egypt tours including Pyramids, Nile cruises, Red Sea, and desert adventures." />
            {featuredTrips.map((trip, index) => (
              <article
                key={trip.id}
                className="gsap-fade-up group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                itemScope
                itemType="https://schema.org/TouristTrip"
                itemProp="itemListElement"
              >
                <meta itemProp="position" content={String(index + 1)} />
                {/* Image */}
                <Link to={`/trips/${trip.slug || trip.id}`} className="block relative overflow-hidden aspect-[4/3]">
                  <img
                    src={trip.image}
                    alt={`${trip.title} — Egypt tour package starting from $${trip.price}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading={index < 8 ? 'eager' : 'lazy'}
                    width="400"
                    height="300"
                    itemProp="image"
                  />
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                      <meta itemProp="priceCurrency" content={trip.currency || 'USD'} />
                      <span itemProp="price" content={String(trip.price)}>From ${trip.price}</span>
                    </span>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}
                  </div>
                  {/* Rating badge */}
                  {trip.rating && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                        <span itemProp="ratingValue">{trip.rating}</span>
                        <meta itemProp="reviewCount" content={String(trip.reviews || 0)} />
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/trips/${trip.slug || trip.id}`}>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-primary-500 transition-colors line-clamp-2" itemProp="name">
                      {trip.title}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3" itemProp="description">
                    {trip.shortDescription || trip.description?.substring(0, 100)}
                  </p>

                  {/* Travel Style Tag */}
                  <div className="mb-3">
                    <span className="inline-flex items-center text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full" itemProp="touristType">
                      {trip.travelStyle}
                    </span>
                  </div>

                  {/* Package-style Action Buttons (matching EgyptPackages page) */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    {/* View Itinerary — outline primary */}
                    <Link
                      to={`/trips/${trip.slug || trip.id}`}
                      className="btn btn-outline-primary text-xs px-3 py-1.5 flex-1 justify-center"
                    >
                      View Itinerary
                    </Link>

                    {/* Book Package — solid primary */}
                    <Link
                      to={`/trips/${trip.slug || trip.id}`}
                      className="btn btn-primary text-xs px-3 py-1.5 flex-1 justify-center"
                    >
                      Book Now
                    </Link>

                    {/* Pay Online — purple with credit card icon */}
                    <a
                      href={`https://wa.me/201212011881?text=${encodeURIComponent(`Hi! I'd like to book the "${trip.title}" package ($${trip.price}). Please send me payment details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-secondary-500 hover:bg-secondary-600 text-white text-xs px-3 py-1.5 flex items-center gap-1.5 flex-1 justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      Pay Online
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12 gsap-fade-up">
            <Link to="/trips" className="btn btn-primary btn-lg">
              View All Egypt Tours
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Visit Egypt — 20 Scraped Trips from visitegypt.com */}
      <VisitEgyptTrips />

      {/* Explore Our Egypt Nile Cruises Section */}
      <section className="section bg-white" id="nile-cruises" aria-label="Egypt Nile Cruises">
        <div className="container-custom">
          {/* SEO-optimized header */}
          <div className="text-center mb-12">
            <span className="gsap-fade-up inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              Nile River Adventures
            </span>
            <h2 className="gsap-fade-up text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Explore Our Egypt Nile Cruises →
            </h2>
            <p className="gsap-fade-up text-gray-600 text-lg max-w-3xl mx-auto mb-2">
              Discover the timeless beauty of Egypt's Nile River with our premium cruise packages. Sail between Luxor and Aswan, exploring ancient temples, tombs, and monuments that have stood for millennia.
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-4 gsap-fade-up" />
          </div>

          {/* Nile Cruises Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Luxor Aswan Nile Cruise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                  🚢
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Luxor Aswan Nile Cruise</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Enjoy an unforgettable vacation in Egypt on a Nile cruise when booking a Nile Cruise between Luxor and Aswan. Choose your dream cruise through a variety of Nile cruises in the land of the Pharaohs, sailing through southern Egypt. Experience the most incredible and majestic temples that spread between the cities of Luxor and Aswan. The famous Temples of Karnak, Luxor, Kom Ombo, Abu Simbel, Hatshepsut, check out the mysterious Valley of the Kings, where the sumptuous tomb of the young pharaoh Tutankhamon is located. Discover the Aswan Dam, the Unfinished Obelisk, the Temple of Philae, Horus, and much more. Embark on a journey along the River Nile in the very near future, don't stop dreaming! Enjoy your free time in the comfort of your own home, and plan now your vacation and travel after.
              </p>
              <Link to="/nile-cruises" className="btn btn-primary">
                View Trips
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Luxury Nile Cruise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl">
                  🏛️
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Luxury Nile Cruise</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                See much of this beautiful world has to offer. Watch as the years of one of the greatest and oldest civilizations that ever existed pass by taking one of our luxury cruises on the Nile. Enjoy a trip to the heart of Egypt and take the Nile Cruise between Luxor and Aswan or a Lake Nasser Cruise. It is the best way to see the incredible ruins of ancient Egypt and modern life along the banks of the Nile that have brought Egypt to life for thousands of years. Explore Egypt by water on Luxury Egypt Nile Cruise 2020, Egypt Time Travel offers several 5 Star Nile Cruises between Luxor, Aswan, Edfu, and Kom Ombo and also from Cairo to Upper Egypt. Decide for yourself with which Nile cruise ship you want to travel and don't miss the chance to visit the breathtaking sights of Egypt such as Luxor Temple, Karnak Temple, Edfu Temple, Kom Ombo Temple, and Aswan Dam. There are Nile cruise ships with a French balcony or only with a window. After the Nile cruise, you can book a bathing stay extra. With an optional bathing stay, you can relax on the beach or enjoy the colorful underwater world of the sea. Book your Luxury Nile cruise now with Egypt Time Travel. The experts are always there for you.
              </p>
              <Link to="/nile-cruises" className="btn btn-primary">
                View Trips
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Dahabiya Boats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl">
                  ⛵
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Dahabiya Boats</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Do you like quiet? Do you like the Nile of Egypt? A Nile Cruise in Dahabiya is a great way for a memorable trip on the Nile between Luxor, Aswan, and Esna. Away from the crowds and pre-packaged entertainment on the big ships, enjoy exclusive comfort and privacy. A Dahabiya is a 2-masted ship sailing with the wind, sometimes towed by a tugboat if the wind is calm. It is a small boat ideal for small groups, friends, individuals, and newlyweds. Families also use it as a private cruise or boat/family home with high-end privacy, private tours, special food, and special memories of the Nile and the people. Through Dahabiya, you will explore the attractions of the most amazing sites on the banks of the Nile such as Karnak Temples, Luxor Temple, Valley of the Kings, High Dam, Temple of Philae, and Temple of Kom Ombo. Thus, a Dahabiya can dock at the most inaccessible sites, not to be seen in advance! So, this is an opportunity to discover several must-see sites, but also to see the rural life on the banks of the Nile. The Dahabiyas is built on the traditional sailing model of ancient Egypt and include new means of comfort and convenience.
              </p>
              <Link to="/nile-cruises" className="btn btn-primary">
                View Trips
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Lake Nasser Cruise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl">
                  🏜️
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Lake Nasser Cruise</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Do you dream of dining in front of the famous temples of Abu Simbel? Would you like to experience the pharaonic spirit that fills every temple on Lake Nasser? Explore with us temples saved from the water, exotic Nubian landscapes, and enjoy an exceptional journey. Take a look at our itineraries for an unforgettable 4 or 5-day cruise on Lake Nasser. Enjoy a timeless journey through the legends of Nubia on a luxury cruise through the tranquil waters of Lake Nasser. Here you will discover the lesser-known temples as well as Abu Simbel, Egypt's largest monument after the pyramids. Lake Nasser, otherwise known as the Nubian Sea in southern Egypt, is one of the largest man-made lakes in the world. It was created following the construction of the Aswan High Dam across the waters of the Nile and is named after Nasser, Egypt's second president. With an opportunity to explore the bustling streets of Aswan and visit the spectacular World Heritage site of Abu Simbel, this remarkable journey encompasses some of Egypt's most sublimely beautiful and culturally diverse landscapes.
              </p>
              <Link to="/nile-cruises" className="btn btn-primary">
                View Trips
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Tailor-Made Holiday to Egypt */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-200"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tailor-Made Holiday to Egypt</h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
                Looking for a customized trip to Egypt? Contact us and we will arrange a special trip for you based on your preferences and requirements. Our expert team will create a personalized itinerary that matches your interests, budget, and schedule.
              </p>
              <Link to="/contact" className="btn btn-primary btn-lg">
                Inquire Now 
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Section with Video Background */}
      <section ref={destinationsRef} className="relative overflow-hidden py-20 bg-secondary-500">
        {/* Content */}
        <div className="container-custom relative z-10">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="section-header"
          >
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Top Destinations
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Iconic Places to Visit
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              From Cairo to Aswan, explore Egypt's most breathtaking destinations
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-4" />
          </motion.div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {featuredDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
                size={index === 0 || index === 3 ? 'large' : 'medium'}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/destinations" className="btn btn-primary btn-lg">
              Explore All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Where is Egypt? — Location & Travel Times Section */}
      <section className="section bg-gradient-to-b from-white via-gray-50 to-white py-24" id="where-is-egypt" aria-label="Where is Egypt">
        <div className="container-custom">
          {/* Section Header — Big, Bold & Decorative */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-primary-500 text-sm font-bold uppercase tracking-[0.25em] mb-6 bg-primary-50 px-6 py-2 rounded-full"
            >
              🌍 Discover the Land of Pharaohs
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 100 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              Where is Egypt?
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-500 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Location
            </motion.h3>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-32 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 mx-auto rounded-full"
            />
          </motion.div>

          {/* Two-column layout: Text + Real Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Description & Travel Times */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
                Egypt is a transcontinental country spanning the northeast corner of Africa and southwest corner of Asia, connected by the Sinai Peninsula. Home to one of the world's oldest civilizations, Egypt stretches along the life-giving Nile River from the Mediterranean Sea in the north to Sudan in the south.
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-10">
                The country features the fertile Nile Valley, vast Western and Eastern Deserts, the Red Sea coast, and the historic Sinai Peninsula.
              </p>

              {/* Travel Times from Cairo — Animated Cards */}
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block"
                >
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.span>
                Travel Times from Cairo
              </motion.h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { destination: 'Giza Pyramids', time: '30–45 minutes', mode: 'by car', icon: '🏛️', color: 'from-amber-50 to-orange-50', border: 'border-amber-200' },
                  { destination: 'Alexandria', time: '2.5–3 hours', mode: 'by car or train', icon: '🏖️', color: 'from-blue-50 to-cyan-50', border: 'border-blue-200' },
                  { destination: 'Luxor', time: '1 hour by flight', mode: '10 hours by train', icon: '🏺', color: 'from-rose-50 to-pink-50', border: 'border-rose-200' },
                  { destination: 'Hurghada (Red Sea)', time: '5–6 hours by car', mode: '1 hour by flight', icon: '🤿', color: 'from-teal-50 to-emerald-50', border: 'border-teal-200' },
                  { destination: 'Aswan', time: '1.5 hours by flight', mode: '13 hours by train', icon: '⛵', color: 'from-violet-50 to-purple-50', border: 'border-violet-200' },
                  { destination: 'Sharm El Sheikh', time: '1 hour by flight', mode: '6 hours by car', icon: '🏝️', color: 'from-sky-50 to-indigo-50', border: 'border-sky-200' },
                ].map((route, index) => (
                  <motion.div
                    key={route.destination}
                    initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: 15 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1 * index,
                      type: 'spring',
                      stiffness: 120,
                      damping: 14,
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      transition: { duration: 0.25 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-gradient-to-br ${route.color} rounded-2xl p-5 border ${route.border} cursor-pointer relative overflow-hidden group`}
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                      initial={{ x: '-200%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.8 }}
                    />
                    <div className="flex items-start gap-4 relative z-10">
                      <motion.span
                        className="text-3xl md:text-4xl drop-shadow-sm"
                        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        {route.icon}
                      </motion.span>
                      <div>
                        <p className="font-bold text-gray-900 text-base md:text-lg">{route.destination}</p>
                        <p className="text-primary-600 text-sm md:text-base font-semibold mt-0.5">{route.time}</p>
                        <p className="text-gray-500 text-xs md:text-sm mt-0.5">{route.mode}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Real Egypt Map (OpenStreetMap embed) */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:sticky lg:top-24"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 bg-white relative group">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary-500 rounded-tl-3xl z-10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary-500 rounded-br-3xl z-10 pointer-events-none" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7200000!2d30.8025!3d26.8206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14368976c35c36e9%3A0x2c45a00925c4c444!2sEgypt!5e0!3m2!1sen!2sus!4v1700000000000"
                  width="100%"
                  height="580"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map of Egypt — English labels"
                  className="w-full"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-center text-gray-400 text-xs mt-4 flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Egypt — Northeast Africa & Sinai Peninsula
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section ref={whyUsRef} className="section bg-secondary-500 text-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="section-header"
          >
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Why Travel With Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Egypt Travel Pro Difference
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              Reliable transfers, expert guides, and a team that puts your comfort first
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-4" />
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="section-header"
          >
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              What Our Travelers Say
            </h2>
            <p className="section-subtitle">
              Read genuine reviews from travelers who explored Egypt with us
            </p>
            <div className="section-divider" />
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="testimonial-card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span 
                    className="stat-number text-4xl md:text-5xl font-bold text-primary-500"
                    data-target={stat.number}
                  >
                    {stat.number}
                  </span>
                  <span className="text-4xl md:text-5xl font-bold text-primary-500">{stat.suffix}</span>
                </div>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners Section — Infinite Marquee */}
      <section className="py-16 bg-gray-50 overflow-hidden" id="partners" aria-label="Our Partners">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              Trusted By
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Partners
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Proudly partnered with leading travel brands to deliver world-class experiences across Egypt
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-4" />
          </motion.div>
        </div>

        {/* Infinite Marquee Track */}
        <div className="relative w-full">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

          <div
            className="flex items-center gap-16 w-max"
            style={{
              animation: 'partnerMarquee 18s linear infinite',
            }}
          >
            {/* Duplicate set for seamless loop */}
            {['/par1.png.jpg', '/par2.png.jpg', '/par3.png.jpg', '/par1.png.jpg', '/par2.png.jpg', '/par3.png.jpg', '/par1.png.jpg', '/par2.png.jpg', '/par3.png.jpg', '/par1.png.jpg', '/par2.png.jpg', '/par3.png.jpg'].map((imgSrc, i) => (
              <div
                key={i}
                className="flex-shrink-0 group relative"
              >
                <div className="w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 p-4 flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-primary-300">
                  {/* Shimmer / simulation overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
                      animation: 'partnerShimmer 2s ease-in-out infinite',
                    }}
                  />
                  <img
                    src={imgSrc}
                    alt={`EgyptTravelPro.com Partner ${i + 1}`}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                  />
                </div>
                <p className="text-center text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  EgyptTravelPro.com
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Inline keyframes for marquee & shimmer */}
        <style>{`
          @keyframes partnerMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          @keyframes partnerShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/number8.jpg"
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-800/90 to-secondary-900/85" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Start Your Journey
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Travel Egypt in Comfort?
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Whether it's a quick airport transfer or a full guided tour, our team is ready.
              Book now and travel Egypt the right way!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#book-transfer" className="btn btn-primary btn-lg">
                Book a Transfer
              </a>
              <a
                href="https://wa.me/201212011881"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default Home