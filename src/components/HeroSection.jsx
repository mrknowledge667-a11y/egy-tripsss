import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

/**
 * HeroSection Component
 * Two modes:
 *  1. Video mode (Home): full-screen video background with animated "Egypt Travel Pro" text
 *     Triggered when no title/backgroundImage props are provided.
 *  2. Image mode (sub-pages): background image with title, subtitle, optional CTA
 *     Triggered when title and/or backgroundImage props are provided.
 *
 * Props:
 *  - title (string)           – heading text (image mode)
 *  - subtitle (string)        – sub-heading text (image mode)
 *  - backgroundImage (string) – URL for background image (image mode)
 *  - height (string)          – Tailwind height class, default 'h-screen' for video, 'h-[50vh]' typical for sub-pages
 *  - showCta (bool)           – whether to show CTA buttons (image mode), default false
 */
const HeroSection = ({
  title,
  subtitle,
  backgroundImage,
  height,
  showCta = false,
}) => {
  const isVideoMode = !title && !backgroundImage
  const heroRef = useRef(null)
  const textRef = useRef(null)

  // Resolve height: video mode defaults to h-screen, image mode defaults to h-[50vh]
  const resolvedHeight = height || (isVideoMode ? 'h-screen' : 'h-[50vh]')

  // GSAP letter animation for video mode
  useEffect(() => {
    if (!isVideoMode || !textRef.current) return

    const letters = textRef.current.querySelectorAll('.letter')

    gsap.fromTo(
      letters,
      {
        y: 100,
        opacity: 0,
        rotateX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        delay: 0.5,
      }
    )

    // Floating animation after entrance
    gsap.to(letters, {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true,
      },
      delay: 2,
    })
  }, [isVideoMode])

  // ---------- VIDEO MODE (Home page) ----------
  if (isVideoMode) {
    const text = 'Egypt Travel Pro'
    const letters = text.split('')

    return (
      <section ref={heroRef} className={`relative ${resolvedHeight} min-h-[600px] overflow-hidden bg-black`}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            <source src="/videoground.mp4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030812] via-transparent to-black/30 z-[1]" />
        </div>

        {/* Animated Text at Bottom */}
        <div className="relative z-10 h-full flex items-end justify-center pb-32">
          <div className="text-center" ref={textRef} style={{ perspective: '1000px' }}>
            {/* Main Title with Letter Animation */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight inline-flex flex-wrap justify-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="letter inline-block"
                  style={{
                    display: letter === ' ' ? 'inline' : 'inline-block',
                    width: letter === ' ' ? '0.3em' : 'auto',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </h1>

            {/* Animated Underline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 2, duration: 1, ease: 'easeOut' }}
              className="mx-auto mt-8 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
              style={{ width: '60%', maxWidth: '500px' }}
            />

            {/* Subtle Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="mt-8 text-xl md:text-2xl text-white/70 tracking-widest uppercase"
            >
              Private Transfers · Guided Tours · Nile Cruises
            </motion.p>
          </div>
        </div>

        {/* Animated Particles/Sparkles */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-400/60 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: '100%',
                opacity: 0,
              }}
              animate={{
                y: '-10%',
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
              style={{
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-primary-500"
        >
          <span className="text-sm mb-2 tracking-wider">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>
    )
  }

  // ---------- IMAGE MODE (Sub-pages) ----------
  return (
    <section
      ref={heroRef}
      className={`relative ${resolvedHeight} min-h-[300px] flex items-center justify-center overflow-hidden`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-75">
        <img
          src={backgroundImage}
          alt={title || 'Hero background'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-6 h-1 w-24 bg-primary-500 rounded-full"
        />

        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <a href="/trips" className="btn btn-primary btn-lg">
              Explore Tours
            </a>
            <a href="/plan-trip" className="btn btn-outline btn-lg">
              Plan Your Trip
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default HeroSection