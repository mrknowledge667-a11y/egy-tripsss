import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * FloatingButtons Component
 * Fixed position buttons for WhatsApp and Chatbot
 * Features: Animated entrance, hover effects, tooltip on hover
 */
const FloatingButtons = () => {
  const [showChatbot, setShowChatbot] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null)

  const whatsappNumber = '201212011881' // Egyptian number format for WhatsApp
  const whatsappMessage = encodeURIComponent('Hello! I would like to know more about your Egypt tours.')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 2,
        staggerChildren: 0.15,
        delayChildren: 2.2
      }
    }
  }

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  }

  const tooltipVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  }

  const chatbotVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 }
    }
  }

  return (
    <>
      {/* Floating Buttons Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-4"
      >
        {/* Chatbot Button */}
        <motion.div className="relative">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowChatbot(!showChatbot)}
            onMouseEnter={() => setHoveredButton('chatbot')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow duration-300"
            aria-label="Open chatbot"
          >
            {showChatbot ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <img
                src="/img-649f3d6b-ccf6-4265-80e4-e3226f0d780a.jpg"
                alt="Chat with Pharaoh"
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </motion.button>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredButton === 'chatbot' && !showChatbot && (
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg"
              >
                Chat with us
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* WhatsApp Button */}
        <motion.div className="relative">
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onMouseEnter={() => setHoveredButton('whatsapp')}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow duration-300"
            aria-label="Contact us on WhatsApp"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </motion.a>

          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredButton === 'whatsapp' && (
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg"
              >
                WhatsApp Us
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Chatbot Window */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            variants={chatbotVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/img-649f3d6b-ccf6-4265-80e4-e3226f0d780a.jpg"
                    alt="Egypt Travel Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Egypt Travel Assistant</h3>
                  <p className="text-white/80 text-sm">We typically reply within minutes</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="h-80 p-4 bg-gray-50 overflow-y-auto">
              {/* Welcome Message */}
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="/img-649f3d6b-ccf6-4265-80e4-e3226f0d780a.jpg"
                    alt="Pharaoh Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[80%]">
                  <p className="text-gray-700 text-sm">
                    👋 Welcome to Egypt Travel Pro! How can I help you plan your Egyptian adventure today?
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 mb-4">
                <p className="text-gray-500 text-xs text-center">Quick options:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Popular Tours', 'Nile Cruises', 'Custom Trip', 'Pricing'].map((option) => (
                    <button
                      key={option}
                      className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Options */}
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-gray-500 text-xs mb-2">Or contact us directly:</p>
                <div className="flex gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href="tel:+201212011881"
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Us
                  </a>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm"
                />
                <button className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingButtons