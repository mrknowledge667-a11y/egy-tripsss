import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * AI Blog Generator Component
 * Generates new blog posts based on travel-related keywords
 * Can be integrated into an admin dashboard or blog page
 */

// Predefined content templates for AI-like generation
const contentTemplates = {
  'best time to visit egypt': {
    title: 'Best Time to Visit Egypt – Complete 2026 Guide',
    excerpt: 'Planning your Egyptian adventure? Discover the ideal seasons, weather patterns, and insider tips for the perfect trip timing.',
    content: `Planning a trip to Egypt requires careful consideration of weather, crowds, and seasonal events. Here's your complete guide to choosing the perfect time for your Egyptian adventure.

## Overview of Egypt's Seasons

Egypt experiences a desert climate with hot summers and mild winters. The best time to visit depends on your planned activities and destinations.

### Winter (November – February)
This is peak tourist season with perfect weather for sightseeing. Temperatures range from 15-25°C in Cairo and are ideal for exploring the pyramids, temples, and desert sites.

**Pros:**
- Comfortable temperatures for outdoor activities
- Perfect for Luxor, Aswan, and desert excursions
- Clear skies for photography

**Cons:**
- Higher prices and more tourists
- Need to book accommodations in advance

### Spring (March – May)
A shoulder season with warming temperatures and occasional sandstorms (khamsin winds).

### Summer (June – September)
Hot season with temperatures exceeding 40°C in Upper Egypt. Best for Red Sea beach resorts.

### Fall (September – November)
Excellent shoulder season with cooling temperatures and fewer crowds.

## Our Recommendation

For the best overall experience, visit between **October and April**. November offers the sweet spot of great weather, manageable crowds, and reasonable prices.`,
    tags: ['Best time to visit Egypt', 'Egypt weather', 'Travel planning', 'Egypt seasons'],
    category: 'Travel Tips',
    city: null,
    activities: ['Planning', 'General']
  },
  'adventure activities in sinai': {
    title: 'Top Adventure Activities in Sinai Peninsula',
    excerpt: 'From climbing Mount Sinai to diving in the Blue Hole, discover the most thrilling adventures awaiting you in Egypt\'s Sinai Peninsula.',
    content: `The Sinai Peninsula is Egypt's adventure playground, offering everything from world-class diving to desert expeditions and spiritual mountain treks.

## Mount Sinai Sunrise Trek

One of the most rewarding experiences in Egypt is hiking Mount Sinai (Jebel Musa) to watch the sunrise from its 2,285-meter summit.

**What to expect:**
- Start at 2 AM from St. Catherine's Monastery
- 3-4 hour climb via the Camel Path or Steps of Repentance
- Spectacular sunrise over the desert mountains
- Visit St. Catherine's Monastery afterward

**Tips:**
- Bring warm layers (it's cold at the summit)
- Hire a local Bedouin guide
- Carry water and snacks

## Diving & Snorkeling

### Blue Hole (Dahab)
One of the world's most famous dive sites, this 100-meter deep sinkhole attracts experienced divers from around the globe.

### Ras Mohammed National Park
Pristine coral walls and incredible marine biodiversity make this a must-visit for divers and snorkelers.

### Thistlegorm Wreck
Explore this WWII shipwreck filled with motorcycles, trucks, and supplies frozen in time.

## Desert Adventures

### Colored Canyon
Hike through narrow sandstone passages painted in stunning reds, yellows, and purples.

### Bedouin Safari
Experience traditional Bedouin hospitality with a desert camp, camel ride, and stargazing dinner.

### Quad Biking
Race across the desert dunes near Sharm El Sheikh or Dahab.

## Rock Climbing in Wadi Rum

The granite mountains of South Sinai offer world-class rock climbing routes for all skill levels.`,
    tags: ['Sinai adventure', 'Mount Sinai', 'Diving Egypt', 'Desert safari', 'Adventure activities'],
    category: 'Adventure',
    city: 'Sharm El-Sheikh',
    activities: ['Adventure', 'Diving', 'Hiking', 'Nature']
  },
  'top parks in cairo': {
    title: 'Best Parks and Gardens in Cairo for a Peaceful Escape',
    excerpt: 'Escape the bustling streets of Cairo and discover the city\'s most beautiful green spaces, from historic gardens to modern parks.',
    content: `Cairo's 20+ million inhabitants need green spaces to breathe, and the city delivers with several beautiful parks and gardens perfect for relaxation.

## Al-Azhar Park

Built on a 500-year-old rubbish dump, Al-Azhar Park is now one of the world's most beautiful urban parks and a testament to successful restoration.

**Highlights:**
- Stunning views of historic Cairo and the Citadel
- Beautiful Islamic-style gardens and fountains
- Lakeside Restaurant with panoramic views
- Evening light shows
- Well-maintained walking paths

**Visiting info:**
- Open daily 9 AM – 10 PM
- Entry fee: ~40 EGP
- Best visited at sunset

## Cairo Zoo (Giza Zoo)

One of Africa's oldest zoos, established in 1891, featuring Egyptian and African wildlife.

**Note:** The zoo is undergoing renovations to improve animal welfare.

## Orman Botanical Garden

Adjacent to Cairo Zoo, this 28-acre botanical garden houses over 100 species of plants including rare palms and tropical trees.

**Best for:**
- Peaceful morning walks
- Photography
- Escaping the city heat

## Fish Garden (Aquarium Grotto Garden)

A unique Victorian-era garden in Zamalek featuring underground grottoes and aquariums.

## Japanese Garden (Helwan)

A peaceful retreat south of Cairo with Japanese-style landscaping and pagodas.

## The Grand Egyptian Museum Gardens

Opening with the new museum, these landscaped gardens will offer stunning pyramid views.`,
    tags: ['Cairo parks', 'Al-Azhar Park', 'Green spaces Cairo', 'Cairo attractions'],
    category: 'City Guide',
    city: 'Cairo',
    activities: ['Nature', 'Relaxation', 'Sightseeing']
  },
  'egyptian food guide': {
    title: 'Ultimate Egyptian Food Guide – Must-Try Dishes & Where to Eat',
    excerpt: 'From koshari to ful medames, discover the delicious world of Egyptian cuisine and the best places to experience authentic local flavors.',
    content: `Egyptian cuisine is a delicious blend of Mediterranean, Middle Eastern, and African influences. Here's your complete guide to the must-try dishes.

## Breakfast Staples

### Ful Medames
Egypt's national breakfast dish – slow-cooked fava beans seasoned with olive oil, lemon, cumin, and garlic. Served with fresh pita bread.

**Where to try:** Felfela (Cairo), any local foul cart

### Ta'meya (Egyptian Falafel)
Unlike Middle Eastern falafel made with chickpeas, Egyptian ta'meya uses fava beans, resulting in a green interior and lighter texture.

## Main Dishes

### Koshari
Egypt's beloved street food: a hearty mix of rice, macaroni, lentils, chickpeas, fried onions, and spicy tomato sauce.

**Where to try:** Abou Tarek (Cairo) – the most famous koshari restaurant

### Molokhia
A green soup made from jute leaves, served with rice and chicken or rabbit. An acquired taste but beloved by Egyptians.

### Mahshi
Vegetables (grape leaves, zucchini, peppers) stuffed with seasoned rice and herbs.

## Grilled Meats

### Kebab & Kofta
Grilled lamb kebabs and spiced minced meat kofta, served with tahini and fresh salads.

### Shawarma
Thinly sliced marinated meat wrapped in flatbread with pickles and garlic sauce.

## Desserts

### Om Ali
Egyptian bread pudding with nuts, raisins, and cream – served warm and utterly delicious.

### Basbousa
Semolina cake soaked in sweet syrup, often topped with almonds.

### Konafa
Shredded phyllo pastry with sweet cheese filling, doused in sugar syrup.

## Drinks

### Fresh Juices
Mango, sugarcane, pomegranate, and guava juices available on every corner.

### Sahlab
Warm winter drink made from orchid root, topped with nuts and cinnamon.

### Karkade
Hibiscus tea served hot or cold – refreshing and healthy.`,
    tags: ['Egyptian food', 'Koshari', 'Egyptian cuisine', 'Food guide Egypt'],
    category: 'Food & Culture',
    city: null,
    activities: ['Food', 'Culture']
  },
  'nile cruise tips': {
    title: 'Nile Cruise Guide – Everything You Need to Know',
    excerpt: 'Planning a Nile cruise? Our comprehensive guide covers routes, ships, best times, and what to expect on Egypt\'s most iconic journey.',
    content: `A Nile cruise is the quintessential Egyptian experience, floating past ancient temples while enjoying luxury accommodations. Here's everything you need to know.

## Popular Routes

### Luxor to Aswan (Most Popular)
- Duration: 3-4 nights
- Direction: Upstream (south)
- Key stops: Esna, Edfu, Kom Ombo

### Aswan to Luxor
- Duration: 3-4 nights
- Direction: Downstream (north)
- Same stops in reverse

### Cairo to Luxor (Extended)
- Duration: 10-14 nights
- Less common, more adventurous

## What's Included

Most Nile cruises offer:
- Full board meals (breakfast, lunch, dinner)
- Guided temple visits with Egyptologist
- Entertainment (folklore shows, galabeya party)
- Sun deck with pool
- Air-conditioned cabins

## Choosing Your Ship

### Luxury (5-star)
- Oberoi, Sanctuary, Sonesta
- Spacious suites, gourmet dining
- $400-800/night

### Mid-range (4-star)
- Movenpick, Steigenberger
- Comfortable cabins, good service
- $200-400/night

### Budget (3-star)
- Various local operators
- Basic but clean accommodations
- $100-200/night

## Best Time to Cruise

- **Peak Season:** October – April
- **Ideal:** November – February (comfortable weather)
- **Avoid:** June – August (extreme heat)

## Temple Highlights

### Karnak & Luxor Temples
Start or end your cruise with these magnificent East Bank temples.

### Edfu Temple
Best-preserved temple in Egypt, dedicated to Horus.

### Kom Ombo
Unique double temple dedicated to Sobek and Horus.

### Philae Temple
Beautiful island temple reached by boat from Aswan.

## Tips for Your Cruise

- Book cabins on upper decks for views
- Bring sun protection for deck time
- Tip your crew at the end (~$50-100)
- Bring comfortable walking shoes
- Stay hydrated during temple visits`,
    tags: ['Nile cruise', 'Egypt cruise', 'Luxor Aswan', 'Temple tour'],
    category: 'Travel Tips',
    city: null,
    activities: ['Cruise', 'Sightseeing', 'Relaxation']
  }
}

// Suggested keywords for quick generation
const suggestedKeywords = [
  'Best time to visit Egypt',
  'Adventure activities in Sinai',
  'Top parks in Cairo',
  'Egyptian food guide',
  'Nile cruise tips',
  'Scuba diving Red Sea',
  'Ancient Egyptian temples',
  'Cairo nightlife guide',
  'Budget travel Egypt',
  'Family trips to Egypt',
  'Solo female travel Egypt',
  'Photography spots Egypt'
]

const BlogGenerator = ({ onGenerate, isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState(null)
  const [error, setError] = useState('')

  // Simulate AI content generation
  const generateContent = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword or topic')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedPost(null)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Check if we have a template for this keyword
    const lowerKeyword = keyword.toLowerCase()
    let template = null

    for (const [key, value] of Object.entries(contentTemplates)) {
      if (lowerKeyword.includes(key) || key.includes(lowerKeyword)) {
        template = value
        break
      }
    }

    if (template) {
      const post = {
        id: Date.now(),
        slug: template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        ...template,
        image: `https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200`,
        thumbnail: `https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600`,
        author: {
          name: 'AI Travel Writer',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
          role: 'Content Generator'
        },
        publishedAt: new Date().toISOString().split('T')[0],
        readTime: Math.ceil(template.content.split(' ').length / 200),
        season: 'Year-round',
        featured: false,
        views: 0,
        likes: 0,
        generated: true
      }
      setGeneratedPost(post)
    } else {
      // Generate generic response for unknown keywords
      setGeneratedPost({
        id: Date.now(),
        slug: keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: `Exploring ${keyword} – A Traveler's Guide`,
        excerpt: `Discover everything you need to know about ${keyword} for your Egyptian adventure.`,
        content: `This article about "${keyword}" is being prepared by our travel experts. 

## Coming Soon

Our team is currently researching and writing comprehensive content about this topic. Check back soon for:

- Detailed guides and tips
- Insider recommendations
- Practical travel advice
- Photo galleries

In the meantime, explore our other articles or contact us for personalized travel advice!`,
        tags: [keyword, 'Egypt travel', 'Travel guide'],
        category: 'Travel Tips',
        city: null,
        activities: ['General'],
        image: `https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200`,
        thumbnail: `https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600`,
        author: {
          name: 'AI Travel Writer',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
          role: 'Content Generator'
        },
        publishedAt: new Date().toISOString().split('T')[0],
        readTime: 2,
        season: 'Year-round',
        featured: false,
        views: 0,
        likes: 0,
        generated: true,
        draft: true
      })
    }

    setIsGenerating(false)
  }

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion)
  }

  const handleSavePost = () => {
    if (generatedPost && onGenerate) {
      onGenerate(generatedPost)
      setGeneratedPost(null)
      setKeyword('')
      setIsOpen(false)
    }
  }

  if (!isAdmin) {
    return null // Only show for admin users
  }

  return (
    <>
      {/* Generator Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="font-medium">AI Generator</span>
      </motion.button>

      {/* Generator Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">AI Blog Generator</h2>
                      <p className="text-white/80 text-sm">Generate travel content with AI</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {!generatedPost ? (
                  <>
                    {/* Keyword Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter a topic or keyword
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder="e.g., Best time to visit Egypt"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && generateContent()}
                        />
                        <button
                          onClick={generateContent}
                          disabled={isGenerating}
                          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Generate
                            </>
                          )}
                        </button>
                      </div>
                      {error && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                      )}
                    </div>

                    {/* Suggested Keywords */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Suggested topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedKeywords.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-purple-600 text-sm rounded-full transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Generated Post Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Generated Article</h3>
                        {generatedPost.draft && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                            Draft - Needs Review
                          </span>
                        )}
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <img
                          src={generatedPost.image}
                          alt={generatedPost.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex gap-2 mb-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                              {generatedPost.category}
                            </span>
                            {generatedPost.city && (
                              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                                {generatedPost.city}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{generatedPost.title}</h4>
                          <p className="text-gray-600 text-sm mb-4">{generatedPost.excerpt}</p>
                          
                          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {generatedPost.content.substring(0, 500)}...
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-4">
                            {generatedPost.tags?.map((tag, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setGeneratedPost(null)}
                          className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Generate Another
                        </button>
                        <button
                          onClick={handleSavePost}
                          className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save to Blog
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default BlogGenerator