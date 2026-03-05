import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * AnimatedBanner — Reusable promotional banner with fade-in + slide-up + hover scale
 * @param {Object} banner - Banner data { id, title, subtitle, cta, ctaLink, image, gradient }
 * @param {number} index - Index for stagger delay
 */
const AnimatedBanner = ({ banner, index = 0 }) => {
  const isExternal = banner.ctaLink?.startsWith('http')

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
    >
      {/* Background Image with Lazy Loading */}
      <img
        src={banner.image}
        alt={banner.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end min-h-[200px] md:min-h-[220px]">
        <h3 className="text-white text-lg md:text-xl font-bold mb-2 leading-tight">
          {banner.title}
        </h3>
        <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
          {banner.subtitle}
        </p>
        {isExternal ? (
          <a
            href={banner.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-300 w-fit"
          >
            {banner.cta}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        ) : (
          <Link
            to={banner.ctaLink}
            className="inline-flex items-center gap-2 text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-300 w-fit"
          >
            {banner.cta}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default AnimatedBanner