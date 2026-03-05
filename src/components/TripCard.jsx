import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * TripCard Component
 * Displays trip information in a card format with image, details, and hover effects
 * Used in trip listings and featured sections
 */
const TripCard = ({ trip, index = 0 }) => {
  const {
    id,
    slug,
    title,
    shortDescription,
    duration,
    price,
    currency = 'USD',
    image,
    travelStyle,
    rating,
    reviews,
    destinations = [],
  } = trip

  // Fallback image if none provided
  const displayImage = image || 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800'
  const displayStyle = travelStyle || 'Culture'

  // Format price with currency
  const formatPrice = (amount, curr) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Get travel style color
  const getStyleColor = (style) => {
    const colors = {
      // Main Categories
      Culture: 'bg-purple-100 text-purple-700',
      Adventure: 'bg-orange-100 text-orange-700',
      Beach: 'bg-cyan-100 text-cyan-700',
      Romantic: 'bg-pink-100 text-pink-700',
      Luxury: 'bg-amber-100 text-amber-700',
      Budget: 'bg-green-100 text-green-700',
      Family: 'bg-blue-100 text-blue-700',
      Cruise: 'bg-indigo-100 text-indigo-700',
      // Package Styles
      Honeymoon: 'bg-rose-100 text-rose-700',
      Classic: 'bg-slate-100 text-slate-700',
      Premium: 'bg-yellow-100 text-yellow-700',
      'Group Tour': 'bg-teal-100 text-teal-700',
      'Private Tour': 'bg-violet-100 text-violet-700',
      // Tour Types
      'Day Tour': 'bg-lime-100 text-lime-700',
      'Nile Cruise': 'bg-sky-100 text-sky-700',
      'Shore Excursion': 'bg-emerald-100 text-emerald-700',
      Transfer: 'bg-neutral-100 text-neutral-700',
      // Special Categories
      Spiritual: 'bg-fuchsia-100 text-fuchsia-700',
      Safari: 'bg-amber-100 text-amber-800',
      Diving: 'bg-blue-100 text-blue-800',
      Historical: 'bg-stone-100 text-stone-700',
      Desert: 'bg-orange-100 text-orange-800',
      'City Break': 'bg-zinc-100 text-zinc-700',
      Relax: 'bg-teal-100 text-teal-700',
    }
    return colors[style] || 'bg-gray-100 text-gray-700'
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="card group"
    >
      <Link to={`/trips/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={displayImage}
            alt={title}
            className="card-image transform group-hover:scale-110 transition-transform duration-500"
          />
          {/* Travel Style Badge */}
          <div className="absolute top-4 left-4">
            <span className={`badge ${getStyleColor(displayStyle)}`}>
              {displayStyle}
            </span>
          </div>
          {/* Duration Badge */}
          <div className="absolute top-4 right-4">
            <span className="badge bg-white/90 text-gray-700 backdrop-blur-sm">
              {duration} {duration === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="card-content">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {shortDescription}
          </p>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {rating}
                </span>
              </div>
              {reviews && (
                <span className="text-sm text-gray-500">
                  ({reviews} reviews)
                </span>
              )}
            </div>
          )}

          {/* Footer with price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-sm text-gray-500">From</span>
              <p className="text-xl font-bold text-primary-600">
                {formatPrice(price, currency)}
              </p>
            </div>
            <span className="text-primary-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details
              <svg
                className="w-4 h-4"
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
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default TripCard