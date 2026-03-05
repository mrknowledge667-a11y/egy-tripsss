import { motion } from 'framer-motion'

/**
 * AdCard Component
 * Displays a single advertisement in a card format that matches
 * the existing TripCard styling (card, card-image, card-content classes).
 * Used in the Ads page and can be embedded in any section.
 */
const AdCard = ({ ad, index = 0 }) => {
  const {
    title,
    shortDescription,
    price,
    currency,
    duration,
    image,
    category,
    link,
  } = ad

  // Format price with currency
  const formatPrice = (amount, curr) => {
    if (!amount || !curr) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Category badge color map
  const getCategoryColor = (cat) => {
    const colors = {
      'Egypt Packages': 'bg-amber-100 text-amber-700',
      'Day Tours': 'bg-blue-100 text-blue-700',
      'Nile Cruises': 'bg-cyan-100 text-cyan-700',
      'Shore Excursions': 'bg-emerald-100 text-emerald-700',
      'Transfers': 'bg-violet-100 text-violet-700',
      'Destinations': 'bg-rose-100 text-rose-700',
      'Travel Tips': 'bg-orange-100 text-orange-700',
      'Special Offers': 'bg-red-100 text-red-700',
    }
    return colors[cat] || 'bg-gray-100 text-gray-700'
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="card group"
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="card-image transform group-hover:scale-110 transition-transform duration-500"
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`badge ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>
          {/* Duration Badge */}
          {duration && (
            <div className="absolute top-4 right-4">
              <span className="badge bg-white/90 text-gray-700 backdrop-blur-sm">
                {duration}
              </span>
            </div>
          )}
          {/* Sponsored label */}
          <div className="absolute bottom-2 right-2">
            <span className="text-[10px] font-medium text-white/70 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
              Sponsored
            </span>
          </div>
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="card-content">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {shortDescription}
          </p>

          {/* Footer with price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {price ? (
              <div>
                <span className="text-sm text-gray-500">From</span>
                <p className="text-xl font-bold text-primary-600">
                  {formatPrice(price, currency)}
                </p>
              </div>
            ) : (
              <span className="text-sm text-gray-500 italic">Free guide</span>
            )}
            <span className="text-primary-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn More
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
      </a>
    </motion.article>
  )
}

export default AdCard