import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

/**
 * CinematicGallery Component
 * Immersive gallery with small thumbnails that pop up on hover
 */

// Image sections configuration (excluding number1, number3, number9)
const gallerySections = [
  {
    id: 'nature',
    title: 'Nature & Deserts',
    subtitle: 'The Golden Sands of Egypt',
    images: ['/number2.jpg', '/number4.jpg', '/number5.jpg', '/number6.jpg', '/number7.jpg'],
  },
  {
    id: 'rivers',
    title: 'Rivers & Nile',
    subtitle: 'The Lifeblood of Civilization',
    images: ['/number8.jpg', '/number10.jpg', '/number11.jpg', '/number12.jpg', '/number13.jpg', '/number14.jpg'],
  },
  {
    id: 'mountains',
    title: 'Mountains & Sunsets',
    subtitle: 'Dramatic Landscapes of Wonder',
    images: ['/number15.jpg', '/number16.jpg', '/number17.jpg', '/number18.jpg', '/number19.jpg', '/number20.jpg', '/number21.jpg'],
  },
]

/**
 * ImagePopup Component
 * Displays the expanded image overlay
 */
const ImagePopup = ({ src, alt, isVisible, position }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-50 pointer-events-none inset-0 flex items-center"
          style={{
            justifyContent: position.x > window.innerWidth / 2 ? 'flex-start' : 'flex-end',
            paddingLeft: position.x > window.innerWidth / 2 ? '2rem' : '0',
            paddingRight: position.x > window.innerWidth / 2 ? '0' : '2rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative w-1/2 h-[80vh] rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/40 border border-amber-500/30"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-yellow-500/30 blur-2xl" />
            
            {/* Image container */}
            <div className="relative w-full h-full bg-slate-900">
              <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'
                }`}
              />
              
              {/* Loading state */}
              {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Cinematic overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
              
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-amber-400/60 rounded-tl-lg" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-amber-400/60 rounded-br-lg" />
              <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-amber-400/60 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-amber-400/60 rounded-bl-lg" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * ThumbnailImage Component
 * Small thumbnail that triggers popup on hover
 */
const ThumbnailImage = ({ src, alt, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const thumbRef = useRef(null)

  const handleMouseEnter = (e) => {
    setIsHovered(true)
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <motion.div
        ref={thumbRef}
        className="gallery-thumb relative cursor-pointer"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1, zIndex: 10 }}
      >
        {/* Thumbnail glow on hover */}
        <motion.div
          className="absolute -inset-1 rounded-lg bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-yellow-500/40 blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Thumbnail container */}
        <div className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
          isHovered ? 'shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50' : 'shadow-md shadow-black/30'
        }`}>
          <div className="aspect-square w-full">
            <img
              src={src}
              alt={alt}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Popup overlay */}
      <ImagePopup
        src={src}
        alt={alt}
        isVisible={isHovered}
        position={mousePosition}
      />
    </>
  )
}

/**
 * GallerySection Component
 * Section with small thumbnails grid
 */
const GallerySection = ({ section, sectionIndex }) => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current.querySelectorAll('.gallery-thumb'),
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 40%',
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
      className="relative py-16 md:py-24"
    >
      {/* Section background with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
      </motion.div>

      {/* Section header */}
      <motion.div
        className="container-custom mb-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.span
          className="inline-block px-3 py-1.5 mb-3 text-xs font-medium text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Section {sectionIndex + 1}
        </motion.span>
        
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {section.title}
        </motion.h2>
        
        <motion.p
          className="text-base text-gray-400 font-light"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {section.subtitle}
        </motion.p>
      </motion.div>

      {/* Thumbnails grid - 5-6 columns for small thumbnails */}
      <div className="container-custom">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {section.images.map((src, index) => (
            <ThumbnailImage
              key={src}
              src={src}
              alt={`${section.title} - Image ${index + 1}`}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Decorative lines */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-1/3 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-1/3 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
    </section>
  )
}

/**
 * Main CinematicGallery Component
 */
const CinematicGallery = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
    >
      {/* Hero section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-900 to-slate-950" />
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
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

        {/* Hero content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Egypt's
              </span>
              <br />
              <span className="text-white">Natural Beauty</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-8 font-light"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Hover over thumbnails to explore Egypt's breathtaking landscapes
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div
                className="w-5 h-8 border-2 border-amber-400/50 rounded-full mx-auto flex justify-center"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="w-1 h-2 bg-amber-400 rounded-full mt-1.5"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              <p className="text-xs text-gray-500 mt-3">Scroll to explore</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery sections */}
      {gallerySections.map((section, index) => (
        <GallerySection
          key={section.id}
          section={section}
          sectionIndex={index}
        />
      ))}

      {/* Footer section */}
      <section className="relative py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container-custom"
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">
            Experience Egypt's Wonder
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm">
            From the golden deserts to the flowing Nile, discover the natural
            masterpieces that make Egypt truly magical.
          </p>
          <motion.a
            href="/plan-trip"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Plan Your Journey
          </motion.a>
        </motion.div>
      </section>
    </div>
  )
}

export default CinematicGallery