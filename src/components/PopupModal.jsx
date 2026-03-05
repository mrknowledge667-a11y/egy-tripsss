import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * PopupModal Component
 * Displays a promotional popup image when user first visits the site
 * Features: High-quality entrance/exit animations, backdrop blur, close button
 */
const PopupModal = ({ 
  imageSrc = '/popup.jpg',
  delay = 1500, // Delay before showing popup (ms)
  storageKey = 'popupShown' // LocalStorage key to track if shown
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasShown = sessionStorage.getItem(storageKey)
    
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        sessionStorage.setItem(storageKey, 'true')
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [delay, storageKey])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: -30,
      transition: { duration: 0.25, ease: 'easeIn' }
    }
  }

  const shimmerVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: '100%',
      transition: {
        repeat: Infinity,
        repeatDelay: 3,
        duration: 1.5,
        ease: 'easeInOut',
        delay: 1
      }
    }
  }

  const closeButtonVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        delay: 0.5, 
        type: 'spring',
        stiffness: 400,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1, 
      rotate: 90,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.9 }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          style={{ perspective: '1000px' }}
        >
          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative max-w-2xl w-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Glow Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.5, 0.8, 0.5], 
                scale: [1, 1.02, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="absolute -inset-4 bg-gradient-to-r from-primary-500/30 via-amber-500/30 to-primary-500/30 rounded-3xl blur-xl"
            />

            {/* Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Shimmer Effect */}
              <motion.div
                variants={shimmerVariants}
                initial="hidden"
                animate="visible"
                className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />

              {/* Main Image */}
              <motion.img
                src={imageSrc}
                alt="Special Offer"
                className="w-full h-auto object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              {/* Close Button */}
              <motion.button
                variants={closeButtonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                onClick={handleClose}
                className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg z-20"
                aria-label="Close popup"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </motion.button>

              {/* Decorative Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary-500/50 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary-500/50 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary-500/50 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary-500/50 rounded-br-2xl" />
            </div>

            {/* Click to close hint */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center text-white/70 text-sm mt-4"
            >
              Click outside or press the X to close
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PopupModal