import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroSection, DestinationCard } from '../components'
import { supabase } from '../lib/supabase'
// Fallback data
import destinationsDataFallback from '../data/destinations.json'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Popular destinations data with new images
const popularDestinations = [
  { id: 1, image: '/number21.jpg', name: 'Pyramids of Giza', location: 'Cairo' },
  { id: 2, image: '/number22.jpg', name: 'Luxor Temple', location: 'Luxor' },
  { id: 3, image: '/number23.jpg', name: 'Abu Simbel', location: 'Aswan' },
  { id: 4, image: '/number24.jpg', name: 'Siwa Oasis', location: 'Western Desert' },
  { id: 5, image: '/number25.jpg', name: 'Red Sea Coast', location: 'Hurghada' },
  { id: 6, image: '/number26.jpg', name: 'White Desert', location: 'Farafra' },
  { id: 7, image: '/number27.jpg', name: 'Alexandria', location: 'Mediterranean' },
  { id: 8, image: '/number28.jpg', name: 'Mount Sinai', location: 'Sinai Peninsula' },
]

/**
 * PopularDestinationCard Component
 * Individual card with 3D hover effects
 */
const PopularDestinationCard = ({ destination, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      })
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className="destination-card relative group cursor-pointer"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
    >
      <div
        className={`absolute -inset-3 rounded-3xl bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-yellow-500/25 blur-xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
          isHovered ? 'shadow-2xl shadow-amber-500/20' : 'shadow-lg shadow-black/30'
        }`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
          />

          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div
            className={`absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-white/10 transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <p className="text-amber-400 text-sm font-medium mb-1">
                {destination.location}
              </p>
              <h3 className="text-xl font-display font-bold text-white mb-2">
                {destination.name}
              </h3>
              
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: isHovered ? 'auto' : 0, 
                  opacity: isHovered ? 1 : 0 
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-flex items-center gap-2 text-sm text-white/80 mt-2">
                  Explore →
                </span>
              </motion.div>
            </motion.div>
          </div>

          <div
            className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * PopularDestinationsSection Component
 * Cinematic gallery with high-quality animations
 */
const PopularDestinationsSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.destination-card')
    
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotateX: 20,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 70%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 100}%`,
            }}
            animate={{
              y: [-15, 15],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2.5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-block px-4 py-2 mb-4 text-sm font-medium text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Most Visited
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
              Popular
            </span>{' '}
            Destinations
          </motion.h2>

          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the most breathtaking locations that travelers love
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest, index) => (
            <PopularDestinationCard
              key={dest.id}
              destination={dest}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-1/3 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-1/3 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
    </section>
  )
}

/**
 * Destinations Page
 * Displays all available destinations in a responsive grid layout
 * Fetches data from Supabase with JSON fallback
 */
const Destinations = () => {
  const [destinationsData, setDestinationsData] = useState(destinationsDataFallback)
  const [loading, setLoading] = useState(true)

  // Fetch destinations from Supabase
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .order('name')

        if (error) throw error
        if (data && data.length > 0) {
          setDestinationsData(data)
        }
      } catch (error) {
        console.error('Error fetching destinations:', error)
        // Keep fallback data on error
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const groupedDestinations = destinationsData.reduce((acc, dest) => {
    const region = dest.region
    if (!acc[region]) {
      acc[region] = []
    }
    acc[region].push(dest)
    return acc
  }, {})

  const regionOrder = [
    'Lower Egypt',
    'Upper Egypt',
    'Red Sea Coast',
    'Sinai Peninsula',
    'Western Desert',
    'Mediterranean Coast',
    'Nubia',
  ]

  const sortedRegions = Object.keys(groupedDestinations).sort((a, b) => {
    const indexA = regionOrder.indexOf(a)
    const indexB = regionOrder.indexOf(b)
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  })

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
      <HeroSection
        title="Explore Destinations"
        subtitle="From ancient wonders to pristine beaches, discover the diverse landscapes waiting for you"
        backgroundImage="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1920"
        height="h-[50vh]"
        showCta={false}
      />

      <PopularDestinationsSection />

      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              All Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore {destinationsData.length} incredible destinations across multiple regions
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {destinationsData.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
                size="medium"
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              Browse by Region
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each region offers unique experiences and attractions
            </p>
          </motion.div>

          <div className="space-y-16">
            {sortedRegions.map((region, regionIndex) => (
              <motion.div
                key={region}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: regionIndex * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900">
                    {region}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">
                    {groupedDestinations[region].length} destinations
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedDestinations[region].map((destination, index) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                      index={index}
                      size="medium"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              Travel Tips
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Make the most of your journey with these helpful insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🌡️',
                title: 'Best Time',
                description: 'October to April offers pleasant weather, while summer is ideal for beach destinations.',
              },
              {
                icon: '👔',
                title: 'Dress Code',
                description: 'Light, breathable clothing is recommended. Modest dress for religious sites.',
              },
              {
                icon: '💰',
                title: 'Currency',
                description: 'Egyptian Pound (EGP). Major credit cards accepted in tourist areas.',
              },
              {
                icon: '🗣️',
                title: 'Language',
                description: 'Arabic is official. English is widely spoken in tourist destinations.',
              },
            ].map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
                  <span className="text-2xl">{tip.icon}</span>
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
      </section>
    </main>
  )
}

export default Destinations