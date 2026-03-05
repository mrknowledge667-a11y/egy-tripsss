import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Egypt Knowledge Chatbot Component
 * AI-powered chatbot with extensive knowledge about ancient Egypt,
 * tourist destinations, and travel information
 */

// Comprehensive Egypt Knowledge Base
const egyptKnowledge = {
  // Ancient Egypt Information
  pyramids: {
    keywords: ['pyramid', 'pyramids', 'giza', 'khufu', 'cheops', 'khafre', 'menkaure'],
    response: `🏛️ **The Pyramids of Giza**

The Great Pyramid of Giza (Pyramid of Khufu/Cheops) is the oldest and largest of the three pyramids. Built around 2560 BCE, it stood as the tallest man-made structure for over 3,800 years!

**Key Facts:**
• Great Pyramid: 146.6 meters tall, 2.3 million stone blocks
• Pyramid of Khafre: Appears taller due to elevated base
• Pyramid of Menkaure: Smallest of the three, 65 meters tall
• The Sphinx guards the complex - 73 meters long, 20 meters high

**Best Time to Visit:** Early morning (8 AM) to avoid crowds and heat
**Entry Fee:** ~400 EGP for the Giza Plateau`
  },

  pharaohs: {
    keywords: ['pharaoh', 'pharaohs', 'king', 'queen', 'tutankhamun', 'ramses', 'cleopatra', 'nefertiti', 'hatshepsut'],
    response: `👑 **Famous Pharaohs of Egypt**

**Tutankhamun (1332-1323 BCE)**
• The "Boy King" who became pharaoh at age 9
• His tomb's discovery in 1922 revealed incredible treasures
• Golden death mask is world-famous

**Ramesses II (1279-1213 BCE)**
• Greatest pharaoh, ruled for 66 years
• Built Abu Simbel temples
• Had over 100 children

**Cleopatra VII (51-30 BCE)**
• Last active pharaoh of Egypt
• Known for intelligence and political skills
• Spoke 9 languages

**Hatshepsut (1479-1458 BCE)**
• One of Egypt's most successful female pharaohs
• Built the stunning Mortuary Temple at Deir el-Bahari`
  },

  temples: {
    keywords: ['temple', 'temples', 'karnak', 'luxor temple', 'abu simbel', 'philae', 'edfu', 'kom ombo'],
    response: `🏛️ **Ancient Egyptian Temples**

**Karnak Temple (Luxor)**
• Largest ancient religious site in the world
• Built over 2,000 years by 30 different pharaohs
• The Hypostyle Hall has 134 massive columns

**Abu Simbel**
• Built by Ramesses II
• Relocated in 1968 to save from flooding
• Sun festival twice yearly (Feb 22 & Oct 22)

**Philae Temple (Aswan)**
• Dedicated to goddess Isis
• Beautiful island setting
• Sound & Light show at night

**Edfu Temple**
• Best-preserved temple in Egypt
• Dedicated to Horus, the falcon god
• Built during Ptolemaic period`
  },

  mummies: {
    keywords: ['mummy', 'mummies', 'mummification', 'tomb', 'burial', 'afterlife'],
    response: `⚱️ **Mummification & The Afterlife**

Ancient Egyptians believed in life after death, so they preserved bodies through mummification.

**Mummification Process (70 days):**
1. Remove internal organs (stored in canopic jars)
2. Remove brain through the nose
3. Dry body with natron salt for 40 days
4. Wrap in linen bandages with amulets
5. Place in decorated coffin/sarcophagus

**Valley of the Kings**
• 63 tombs discovered (most famous: Tutankhamun's)
• Located on Luxor's West Bank
• Tombs decorated with spells from Book of the Dead

**Royal Mummy Room** at the Egyptian Museum displays pharaohs including Ramesses II!`
  },

  hieroglyphics: {
    keywords: ['hieroglyphic', 'hieroglyphics', 'writing', 'rosetta', 'stone', 'script'],
    response: `📜 **Egyptian Hieroglyphics**

Hieroglyphics were the formal writing system used in ancient Egypt for over 3,000 years.

**Key Facts:**
• Over 700 distinct symbols
• Could be read left-to-right, right-to-left, or top-to-bottom
• Used for religious texts, monuments, and tombs

**The Rosetta Stone (196 BCE)**
• Key to deciphering hieroglyphics
• Contains text in hieroglyphics, Demotic, and Greek
• Deciphered by Jean-François Champollion in 1822
• Now in the British Museum, London

**Symbols to Know:**
• Ankh ☥ = Life
• Eye of Horus 𓂀 = Protection
• Scarab = Rebirth`
  },

  // Destinations
  cairo: {
    keywords: ['cairo', 'capital', 'giza', 'museum', 'khan khalili', 'citadel'],
    response: `🌆 **Cairo - Egypt's Vibrant Capital**

Population: ~21 million (largest city in Africa!)

**Must-See Attractions:**
• Pyramids of Giza & Sphinx
• Egyptian Museum (Tahrir Square)
• Grand Egyptian Museum (opening soon!)
• Khan el-Khalili Bazaar
• Saladin Citadel & Mohamed Ali Mosque
• Old Cairo (Coptic churches)

**Best Areas to Stay:**
• Zamalek - upscale island district
• Downtown - central, budget-friendly
• Giza - near the pyramids

**Local Tips:**
• Traffic is chaotic - use Uber/Careem
• Bargain at markets (start at 50% of asking price)
• Try koshari - Egypt's national dish!

**Best Time:** October to April (avoid summer heat)`
  },

  luxor: {
    keywords: ['luxor', 'thebes', 'valley of the kings', 'karnak', 'west bank', 'east bank'],
    response: `🏛️ **Luxor - World's Greatest Open-Air Museum**

Ancient Thebes was Egypt's capital during the New Kingdom.

**East Bank (City of the Living):**
• Karnak Temple Complex
• Luxor Temple
• Luxor Museum
• Modern city & souks

**West Bank (City of the Dead):**
• Valley of the Kings (tombs of pharaohs)
• Valley of the Queens
• Temple of Hatshepsut
• Colossi of Memnon
• Medinet Habu

**Experiences:**
• Hot air balloon at sunrise over the temples
• Felucca sailing on the Nile
• Sound & Light shows
• Horse carriage rides (caleche)

**Getting There:** 1-hour flight from Cairo or overnight train
**Tip:** Get a Luxor Pass for unlimited temple access!`
  },

  aswan: {
    keywords: ['aswan', 'nubia', 'nubian', 'high dam', 'philae', 'elephantine', 'felucca'],
    response: `🌅 **Aswan - Gateway to Nubia**

The most relaxed city in Egypt with stunning Nile scenery.

**Top Attractions:**
• Philae Temple (Island of Isis)
• Aswan High Dam
• Unfinished Obelisk
• Nubian Villages (colorful houses)
• Elephantine Island
• Botanical Garden (Kitchener's Island)

**Day Trips:**
• Abu Simbel (3 hours south) - Ramesses II's masterpiece
• Kom Ombo Temple (crocodile & falcon gods)

**Experiences:**
• Felucca sailing at sunset
• Visit a Nubian home for tea
• Shop for spices, henna & Nubian crafts
• Swim in the Nile (safe here!)

**Best Time:** October to April
**Climate:** Hottest city in Egypt - stay hydrated!`
  },

  alexandria: {
    keywords: ['alexandria', 'mediterranean', 'library', 'bibliotheca', 'cleopatra', 'lighthouse'],
    response: `🌊 **Alexandria - Pearl of the Mediterranean**

Founded by Alexander the Great in 331 BCE.

**Historical Significance:**
• Home to the ancient Library of Alexandria
• Site of the Lighthouse (one of 7 wonders)
• Cleopatra's palace (now underwater)

**Must Visit:**
• Bibliotheca Alexandrina (modern library)
• Catacombs of Kom el-Shoqafa
• Citadel of Qaitbay (lighthouse ruins)
• Montazah Palace & Gardens
• Roman Amphitheatre
• Stanley Bridge & Corniche

**Food Scene:**
• Famous for fresh seafood
• Try: Fried calamari, grilled fish, sayadeya
• Best restaurants along the Corniche

**Getting There:** 2.5 hours from Cairo by train
**Best Time:** April to November (beach season)`
  },

  hurghada: {
    keywords: ['hurghada', 'red sea', 'diving', 'snorkeling', 'beach', 'resort', 'giftun'],
    response: `🏖️ **Hurghada - Red Sea Paradise**

Egypt's premier beach resort destination.

**Why Visit:**
• World-class coral reefs
• Year-round sunshine (300+ sunny days)
• Affordable luxury resorts
• Vibrant nightlife

**Water Activities:**
• Scuba diving (50+ dive sites)
• Snorkeling at Giftun Islands
• Glass-bottom boat trips
• Kitesurfing & windsurfing
• Swimming with dolphins

**Land Activities:**
• Desert quad biking
• Bedouin BBQ dinner
• Day trip to Luxor

**Best Dive Sites:**
• Giftun Island
• Abu Ramada
• Shaab El Erg (dolphins)
• Thistlegorm wreck

**Tip:** Book all-inclusive resorts for best value!`
  },

  sharm: {
    keywords: ['sharm', 'sheikh', 'sinai', 'naama', 'ras mohammed', 'diving', 'tiran'],
    response: `🐠 **Sharm El Sheikh - Sinai's Jewel**

Premier diving destination with world-famous reefs.

**Top Attractions:**
• Ras Mohammed National Park
• Naama Bay (main tourist area)
• Tiran Island coral reefs
• Old Market (Sharm el-Maya)
• Nabq Protected Area

**Best Dive Sites:**
• Ras Mohammed - pristine coral walls
• SS Thistlegorm - WWII shipwreck
• Jackson Reef
• Blue Hole (advanced divers)

**Excursions:**
• Mount Sinai sunrise trek
• St. Catherine's Monastery
• Colored Canyon
• Dahab day trip

**Nightlife:** Naama Bay has bars, clubs & casinos

**Getting There:** Direct flights worldwide
**Best Time:** Year-round (water temp: 21-28°C)`
  },

  // Practical Info
  travel: {
    keywords: ['travel', 'visit', 'trip', 'vacation', 'tour', 'holiday', 'plan'],
    response: `✈️ **Planning Your Egypt Trip**

**Best Time to Visit:**
• October to April (cooler weather)
• Avoid July-August (very hot, 40°C+)
• Ramadan dates vary (check calendar)

**Visa Information:**
• Most nationalities need a visa
• E-visa available online ($25 USD)
• Visa on arrival for many countries

**Essential Packing:**
• Comfortable walking shoes
• Modest clothing (cover shoulders/knees for temples)
• Sunscreen, hat, sunglasses
• Reusable water bottle

**Money:**
• Currency: Egyptian Pound (EGP)
• ATMs widely available
• Carry cash for markets/tips
• Credit cards accepted at hotels/restaurants

**Safety:** Egypt is very safe for tourists. Main sites have security.

**Getting Around:**
• Domestic flights (cheap & fast)
• Trains (comfortable sleeper to Luxor/Aswan)
• Uber/Careem in cities`
  },

  food: {
    keywords: ['food', 'eat', 'cuisine', 'restaurant', 'dish', 'koshari', 'falafel', 'ful'],
    response: `🍽️ **Egyptian Cuisine**

**Must-Try Dishes:**

• **Koshari** - National dish: rice, pasta, lentils, chickpeas, crispy onions & tomato sauce

• **Ful Medames** - Stewed fava beans with oil, lemon & spices (breakfast staple)

• **Ta'meya** - Egyptian falafel made with fava beans (green inside!)

• **Molokhia** - Jute leaf soup, served with rice & chicken

• **Mahshi** - Stuffed vegetables (grape leaves, peppers, zucchini)

• **Shawarma** - Grilled meat wrap (chicken or beef)

• **Om Ali** - Bread pudding with nuts & cream (dessert)

• **Fresh Juices** - Mango, sugarcane, pomegranate everywhere!

**Dining Tips:**
• Street food is delicious & safe
• Tip 10-15% at restaurants
• Vegetarian-friendly cuisine
• Try local cafes for authentic experience`
  },

  weather: {
    keywords: ['weather', 'temperature', 'hot', 'cold', 'when', 'season', 'climate'],
    response: `🌡️ **Egypt Weather Guide**

**Cairo & Giza:**
• Winter (Dec-Feb): 10-20°C
• Summer (Jun-Aug): 25-40°C
• Best: Oct-Nov, Mar-Apr

**Luxor & Aswan:**
• Winter: 15-25°C (perfect!)
• Summer: 35-45°C (very hot)
• Best: Oct-Apr

**Red Sea (Hurghada/Sharm):**
• Year-round warm: 20-35°C
• Water temp: 21-28°C
• Great anytime!

**Alexandria:**
• Mediterranean climate
• Mild year-round: 15-30°C
• Rainy in winter

**What to Wear:**
• Light, breathable fabrics
• Layers for AC & cool evenings
• Modest clothing for religious sites
• Swimwear only at beaches/pools`
  },

  safety: {
    keywords: ['safe', 'safety', 'danger', 'scam', 'tourist', 'police'],
    response: `🛡️ **Safety Tips for Egypt**

**General Safety:**
Egypt is very safe for tourists! Tourist areas have police and security.

**Common Scams to Avoid:**
• "Free" gifts that demand payment
• Unofficial "guides" at temples
• Inflated taxi prices (use Uber)
• Fake papyrus & perfume shops

**Smart Traveler Tips:**
• Agree on taxi/felucca prices beforehand
• Keep valuables secure
• Stay hydrated (drink bottled water)
• Use hotel safes for passports

**For Women:**
• Egypt is safe but modest dress helps
• Avoid walking alone late at night
• Wedding ring can reduce unwanted attention

**Emergency Numbers:**
• Tourist Police: 126
• Ambulance: 123
• General Emergency: 122

**Health:**
• Drink bottled water
• Sun protection essential
• Travel insurance recommended`
  },

  // Default responses
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'help'],
    response: `👋 **Welcome to Egypt Travel Assistant!**

I'm your guide to ancient Egypt and modern travel! 

**Ask me about:**
• 🏛️ Ancient history (pyramids, pharaohs, temples)
• 📍 Destinations (Cairo, Luxor, Aswan, Red Sea)
• ✈️ Travel tips (visa, weather, safety)
• 🍽️ Egyptian food & culture
• 🏊 Activities (diving, tours, cruises)

**Popular Questions:**
• "Tell me about the pyramids"
• "What should I see in Luxor?"
• "When is the best time to visit?"
• "Is Egypt safe to visit?"

How can I help you plan your Egyptian adventure? 🐪`
  }
}

// Quick suggestion buttons
const quickSuggestions = [
  { icon: '🏛️', text: 'Pyramids of Giza', query: 'pyramids' },
  { icon: '👑', text: 'Famous Pharaohs', query: 'pharaohs' },
  { icon: '🌆', text: 'Cairo Guide', query: 'cairo' },
  { icon: '🏛️', text: 'Luxor Temples', query: 'luxor' },
  { icon: '🏖️', text: 'Red Sea Beaches', query: 'hurghada' },
  { icon: '✈️', text: 'Travel Tips', query: 'travel' },
  { icon: '🍽️', text: 'Egyptian Food', query: 'food' },
  { icon: '🛡️', text: 'Safety Info', query: 'safety' },
]

const EgyptChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: egyptKnowledge.greeting.response,
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Find matching response
  const findResponse = (query) => {
    const lowerQuery = query.toLowerCase()
    
    for (const [key, data] of Object.entries(egyptKnowledge)) {
      if (data.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return data.response
      }
    }

    // Default response if no match
    return `I'm not sure about that specific topic, but I'd love to help you learn about Egypt! 

**Try asking about:**
• Pyramids, temples, or pharaohs
• Cities like Cairo, Luxor, or Aswan
• Red Sea destinations (Hurghada, Sharm El Sheikh)
• Travel tips, food, or safety

What would you like to know? 🏛️`
  }

  // Handle send message
  const handleSend = (query = inputValue) => {
    if (!query.trim()) return

    // Add user message
    const userMessage = {
      type: 'user',
      content: query,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(query)
      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 800 + Math.random() * 500)
  }

  // Handle quick suggestion click
  const handleSuggestion = (query) => {
    handleSend(query)
  }

  // Format message content with markdown-like styling
  const formatMessage = (content) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Bullet points
        if (line.startsWith('• ')) {
          return <li key={i} className="ml-4" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
        }
        // Headers
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h4 key={i} className="font-bold text-gray-800 mt-2" dangerouslySetInnerHTML={{ __html: line }} />
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: line }} />
      })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-lg flex items-center justify-center text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <img
            src="/img-649f3d6b-ccf6-4265-80e4-e3226f0d780a.jpg"
            alt="Egypt Guide"
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-44 right-6 z-50 w-[360px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/img-649f3d6b-ccf6-4265-80e4-e3226f0d780a.jpg"
                    alt="Egypt Travel Guide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Egypt Travel Guide</h3>
                  <p className="text-xs text-white/80">Your ancient Egypt expert</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white rounded-br-sm'
                        : 'bg-white shadow-sm border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <div className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-700'}`}>
                      {message.type === 'bot' ? formatMessage(message.content) : message.content}
                    </div>
                    <span className={`text-[10px] mt-1 block ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {quickSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(suggestion.query)}
                    className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full text-xs text-gray-600 transition-colors"
                  >
                    <span>{suggestion.icon}</span>
                    <span>{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about Egypt..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EgyptChatbot