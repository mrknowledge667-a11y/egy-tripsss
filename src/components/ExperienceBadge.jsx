import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * ExperienceBadge Component
 * Displays experience type as a badge or card with icon and name
 * Used in featured sections and trip details
 */
const ExperienceBadge = ({ 
  experience, 
  index = 0, 
  variant = 'badge', // 'badge' | 'card' | 'pill'
  showDescription = false,
  clickable = true,
}) => {
  const {
    id,
    slug,
    name,
    icon,
    shortDescription,
    color,
    category,
  } = experience

  // Badge variant - small inline badge
  if (variant === 'badge') {
    const content = (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
      >
        <span>{icon}</span>
        <span>{name}</span>
      </motion.span>
    )

    if (clickable) {
      return (
        <Link to={`/trips?experience=${slug}`}>
          {content}
        </Link>
      )
    }
    return content
  }

  // Pill variant - colored pill with icon
  if (variant === 'pill') {
    const content = (
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={{ 
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        <span className="text-lg">{icon}</span>
        <span>{name}</span>
      </motion.span>
    )

    if (clickable) {
      return (
        <Link to={`/trips?experience=${slug}`}>
          {content}
        </Link>
      )
    }
    return content
  }

  // Card variant - full card with description
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group p-6 rounded-2xl bg-white shadow-card hover:shadow-hover transition-all duration-300 border border-gray-100"
    >
      {/* Icon */}
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${color}15` }}
      >
        <span className="text-3xl">{icon}</span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {name}
      </h3>

      {/* Category */}
      <span 
        className="inline-block text-xs font-medium px-2 py-1 rounded-md mb-3"
        style={{ 
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        {category}
      </span>

      {/* Description */}
      {showDescription && (
        <p className="text-gray-600 text-sm line-clamp-2">
          {shortDescription}
        </p>
      )}

      {/* Arrow indicator */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
        <svg
          className="w-5 h-5"
          style={{ color: color }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </motion.div>
  )

  if (clickable) {
    return (
      <Link to={`/trips?experience=${slug}`}>
        {cardContent}
      </Link>
    )
  }
  return cardContent
}

export default ExperienceBadge