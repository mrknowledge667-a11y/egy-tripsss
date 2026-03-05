import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * DestinationCard Component
 * Displays destination information with image, name, and hover effects
 * Used in destination listings and featured sections
 */
const DestinationCard = ({ destination, index = 0, size = 'medium' }) => {
  const {
    id,
    slug,
    name,
    country,
    shortDescription,
    image,
    region,
    tripIds = [],
  } = destination

  // Size variants for different layouts
  const sizeClasses = {
    small: 'h-48',
    medium: 'h-64 md:h-72',
    large: 'h-80 md:h-96',
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative group overflow-hidden rounded-2xl shadow-card"
    >
      <Link to={`/destinations/${slug}`} className="block">
        {/* Background Image */}
        <div className={`relative ${sizeClasses[size]} overflow-hidden`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          {/* Region Tag */}
          <div className="mb-2">
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
              {region}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1">
            {name}
          </h3>

          {/* Country */}
          <p className="text-white/80 text-sm mb-3">
            {country}
          </p>

          {/* Description - shown on hover */}
          <p className="text-white/70 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {shortDescription}
          </p>

          {/* Trip count */}
          <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
            <span className="text-white/90 text-sm">
              {tripIds.length} {tripIds.length === 1 ? 'trip' : 'trips'} available
            </span>
            <svg
              className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </Link>
    </motion.article>
  )
}

export default DestinationCard