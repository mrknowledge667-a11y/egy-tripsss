/**
 * Visit Egypt Scraper
 * --------------------------------------------------
 * Attempts to scrape 20 trips from https://visitegypt.com/
 * using cheerio.  If the live site is unreachable or the HTML
 * structure has changed, it falls back to 20 curated placeholder
 * trips with content-matched Unsplash images.
 *
 * Usage:
 *   import { scrapeVisitEgyptTrips } from './ads/visitegypt-scraper.js'
 *   const trips = await scrapeVisitEgyptTrips()
 */

import * as cheerio from 'cheerio'

const SOURCE_URL = 'https://visitegypt.com'
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// ─── Content-matched Unsplash images ─────────────────────────
// Each image is chosen to match the trip content / destination
const CONTENT_IMAGES = {
  pyramids:       'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600&h=400&fit=crop',
  sphinx:         'https://images.unsplash.com/photo-1568322445389-f64b0f36b57a?w=600&h=400&fit=crop',
  cairo:          'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&h=400&fit=crop',
  luxor:          'https://images.unsplash.com/photo-1590059390047-f5e617e4db46?w=600&h=400&fit=crop',
  karnak:         'https://images.unsplash.com/photo-1600859377498-cfda68e8b4de?w=600&h=400&fit=crop',
  aswan:          'https://images.unsplash.com/photo-1618953425556-3dc5cec5bb4f?w=600&h=400&fit=crop',
  nile:           'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600&h=400&fit=crop',
  redsea:         'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
  desert:         'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&h=400&fit=crop',
  siwa:           'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&h=400&fit=crop',
  alexandria:     'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=600&h=400&fit=crop',
  museum:         'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=400&fit=crop',
  felucca:        'https://images.unsplash.com/photo-1608159219660-571e73284efc?w=600&h=400&fit=crop',
  diving:         'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
  temple:         'https://images.unsplash.com/photo-1568322445389-f64b0f36b57a?w=600&h=400&fit=crop',
  bazaar:         'https://images.unsplash.com/photo-1568480541765-7a985966da1a?w=600&h=400&fit=crop',
  camel:          'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600&h=400&fit=crop',
  sharm:          'https://images.unsplash.com/photo-1580541631950-7282082b02f6?w=600&h=400&fit=crop',
  hurghada:       'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop',
  balloon:        'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&h=400&fit=crop',
}

// ─── 20 curated fallback trips (placeholder — no copyrighted content) ──
const FALLBACK_TRIPS = [
  {
    id: 've-1',
    title: 'Pyramids of Giza & Sphinx Discovery',
    shortDescription: 'Stand before the last surviving wonder of the ancient world. Explore the Great Pyramid, the Sphinx, and the Valley Temple with a licensed Egyptologist.',
    image: CONTENT_IMAGES.pyramids,
    price: 45,
    currency: 'USD',
    duration: '6 hours',
    category: 'Day Tours',
    rating: 4.9,
    link: `${SOURCE_URL}/en/experiences/pyramids-giza`,
  },
  {
    id: 've-2',
    title: 'Egyptian Museum & Old Cairo Walking Tour',
    shortDescription: 'Journey through 5,000 years of history at the Egyptian Museum, then stroll through Coptic Cairo and Khan El Khalili bazaar.',
    image: CONTENT_IMAGES.museum,
    price: 35,
    currency: 'USD',
    duration: '7 hours',
    category: 'Day Tours',
    rating: 4.8,
    link: `${SOURCE_URL}/en/experiences/egyptian-museum`,
  },
  {
    id: 've-3',
    title: 'Luxor East & West Bank Full Day',
    shortDescription: 'Visit the Valley of the Kings, Hatshepsut Temple, Colossi of Memnon on the West Bank, then Karnak and Luxor Temple on the East Bank.',
    image: CONTENT_IMAGES.luxor,
    price: 75,
    currency: 'USD',
    duration: '10 hours',
    category: 'Day Tours',
    rating: 4.9,
    link: `${SOURCE_URL}/en/experiences/luxor-full-day`,
  },
  {
    id: 've-4',
    title: 'Nile Cruise: Luxor to Aswan 4 Nights',
    shortDescription: 'Sail the Nile aboard a 5-star cruise ship. Stop at Edfu, Kom Ombo, and Philae Temple. All meals and guided excursions included.',
    image: CONTENT_IMAGES.nile,
    price: 599,
    currency: 'USD',
    duration: '5 days',
    category: 'Nile Cruises',
    rating: 4.8,
    link: `${SOURCE_URL}/en/experiences/nile-cruise-luxor-aswan`,
  },
  {
    id: 've-5',
    title: 'Red Sea Snorkeling Adventure — Hurghada',
    shortDescription: 'Discover vibrant coral reefs and tropical fish on a full-day boat trip from Hurghada. Includes lunch, snorkeling gear, and two reef stops.',
    image: CONTENT_IMAGES.redsea,
    price: 40,
    currency: 'USD',
    duration: '8 hours',
    category: 'Day Tours',
    rating: 4.7,
    link: `${SOURCE_URL}/en/experiences/red-sea-snorkeling`,
  },
  {
    id: 've-6',
    title: 'Aswan: Philae Temple, High Dam & Nubian Village',
    shortDescription: 'Explore the island temple of Philae, marvel at the High Dam, and visit a colorful Nubian village by felucca.',
    image: CONTENT_IMAGES.aswan,
    price: 55,
    currency: 'USD',
    duration: '8 hours',
    category: 'Day Tours',
    rating: 4.8,
    link: `${SOURCE_URL}/en/experiences/aswan-highlights`,
  },
  {
    id: 've-7',
    title: 'Abu Simbel Sunrise Excursion',
    shortDescription: 'Depart Aswan before dawn and arrive at Ramses II great temple as the first rays of sun illuminate the colossal statues.',
    image: CONTENT_IMAGES.temple,
    price: 95,
    currency: 'USD',
    duration: '12 hours',
    category: 'Day Tours',
    rating: 4.9,
    link: `${SOURCE_URL}/en/experiences/abu-simbel`,
  },
  {
    id: 've-8',
    title: 'White Desert & Bahariya Oasis Overnight Safari',
    shortDescription: 'Camp under the stars amid surreal chalk formations in the White Desert. Includes 4x4 jeep tour, Bedouin dinner, and oasis hot springs.',
    image: CONTENT_IMAGES.desert,
    price: 120,
    currency: 'USD',
    duration: '2 days',
    category: 'Adventure',
    rating: 4.9,
    link: `${SOURCE_URL}/en/experiences/white-desert-safari`,
  },
  {
    id: 've-9',
    title: 'Alexandria Day Trip from Cairo',
    shortDescription: 'Visit the Bibliotheca Alexandrina, Citadel of Qaitbay, Pompey Pillar, and enjoy a fresh Mediterranean seafood lunch.',
    image: CONTENT_IMAGES.alexandria,
    price: 65,
    currency: 'USD',
    duration: '12 hours',
    category: 'Day Tours',
    rating: 4.6,
    link: `${SOURCE_URL}/en/experiences/alexandria-day-trip`,
  },
  {
    id: 've-10',
    title: 'Luxor Hot Air Balloon at Sunrise',
    shortDescription: 'Float over the Valley of the Kings and ancient temples as the sun rises over the Theban mountains. A once-in-a-lifetime experience.',
    image: CONTENT_IMAGES.balloon,
    price: 85,
    currency: 'USD',
    duration: '3 hours',
    category: 'Adventure',
    rating: 4.9,
    link: `${SOURCE_URL}/en/experiences/luxor-balloon`,
  },
  {
    id: 've-11',
    title: 'Karnak Temple Sound & Light Show',
    shortDescription: 'Experience the grandeur of Karnak Temple illuminated at night with a dramatic sound and light show narrating ancient Thebes.',
    image: CONTENT_IMAGES.karnak,
    price: 30,
    currency: 'USD',
    duration: '2 hours',
    category: 'Culture',
    rating: 4.5,
    link: `${SOURCE_URL}/en/experiences/karnak-sound-light`,
  },
  {
    id: 've-12',
    title: 'Siwa Oasis 3-Day Expedition',
    shortDescription: 'Explore the remote Siwa Oasis: swim in Cleopatra Spring, visit the Oracle Temple, and sandboard on the Great Sand Sea.',
    image: CONTENT_IMAGES.siwa,
    price: 280,
    currency: 'USD',
    duration: '3 days',
    category: 'Adventure',
    rating: 4.8,
    link: `${SOURCE_URL}/en/experiences/siwa-oasis`,
  },
  {
    id: 've-13',
    title: 'Cairo Street Food & Markets Tour',
    shortDescription: 'Taste koshari, ful, taameya and fresh juices as you walk through Downtown Cairo and the bustling Khan El Khalili market.',
    image: CONTENT_IMAGES.bazaar,
    price: 25,
    currency: 'USD',
    duration: '4 hours',
    category: 'Culture',
    rating: 4.7,
    link: `${SOURCE_URL}/en/experiences/cairo-food-tour`,
  },
  {
    id: 've-14',
    title: 'Felucca Sunset Sail in Aswan',
    shortDescription: 'Glide past Elephantine Island and the Aga Khan Mausoleum on a traditional wooden sailboat as the sun sets over the Nile.',
    image: CONTENT_IMAGES.felucca,
    price: 15,
    currency: 'USD',
    duration: '2 hours',
    category: 'Culture',
    rating: 4.8,
    link: `${SOURCE_URL}/en/experiences/felucca-aswan`,
  },
  {
    id: 've-15',
    title: 'Sharm El Sheikh Scuba Diving',
    shortDescription: 'Dive Ras Mohamed National Park or the SS Thistlegorm wreck with a PADI-certified dive center. Suitable for beginners and pros.',
    image: CONTENT_IMAGES.sharm,
    price: 70,
    currency: 'USD',
    duration: '6 hours',
    category: 'Adventure',
    rating: 4.8,
    link: `${SOURCE_URL}/en/experiences/sharm-diving`,
  },
  {
    id: 've-16',
    title: 'Pyramids Camel Ride at Sunset',
    shortDescription: 'Ride a camel through the Giza Plateau as the sun dips behind the Pyramids. Includes Bedouin tea and photo stops.',
    image: CONTENT_IMAGES.camel,
    price: 35,
    currency: 'USD',
    duration: '2 hours',
    category: 'Adventure',
    rating: 4.7,
    link: `${SOURCE_URL}/en/experiences/pyramids-camel-ride`,
  },
  {
    id: 've-17',
    title: 'Saqqara & Memphis Ancient Capital Tour',
    shortDescription: 'Discover the Step Pyramid of Djoser, the oldest stone structure on Earth, and the open-air museum of Memphis.',
    image: CONTENT_IMAGES.sphinx,
    price: 45,
    currency: 'USD',
    duration: '5 hours',
    category: 'Day Tours',
    rating: 4.7,
    link: `${SOURCE_URL}/en/experiences/saqqara-memphis`,
  },
  {
    id: 've-18',
    title: 'Grand Egyptian Museum VIP Access',
    shortDescription: 'Skip the line at the brand-new Grand Egyptian Museum near Giza. See Tutankhamun treasures and 100,000+ artifacts with a private guide.',
    image: CONTENT_IMAGES.cairo,
    price: 55,
    currency: 'USD',
    duration: '4 hours',
    category: 'Culture',
    rating: 4.9,
    link: `${SOURCE_URL}/en/experiences/grand-museum`,
  },
  {
    id: 've-19',
    title: 'Hurghada Glass-Bottom Boat & Island Hopping',
    shortDescription: 'See coral reefs without getting wet on a glass-bottom boat, then stop at Giftun Island for swimming and beach time.',
    image: CONTENT_IMAGES.hurghada,
    price: 30,
    currency: 'USD',
    duration: '7 hours',
    category: 'Day Tours',
    rating: 4.6,
    link: `${SOURCE_URL}/en/experiences/hurghada-boat`,
  },
  {
    id: 've-20',
    title: 'Dahab Blue Hole Freediving Experience',
    shortDescription: 'Freedive or snorkel at the legendary Blue Hole in Dahab, one of the world most famous diving sites on the Red Sea coast.',
    image: CONTENT_IMAGES.diving,
    price: 50,
    currency: 'USD',
    duration: '5 hours',
    category: 'Adventure',
    rating: 4.8,
    link: `${SOURCE_URL}/en/experiences/dahab-blue-hole`,
  },
]

// ─── Live scraper ────────────────────────────────────────────
async function scrapeLive() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    // Try fetching the experiences / things-to-do page
    const urls = [
      `${SOURCE_URL}/en/experiences`,
      `${SOURCE_URL}/en/things-to-do`,
      `${SOURCE_URL}/en`,
    ]

    let html = null
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
          signal: controller.signal,
        })
        if (res.ok) {
          html = await res.text()
          break
        }
      } catch {
        continue
      }
    }

    clearTimeout(timeout)
    if (!html) return null

    const $ = cheerio.load(html)
    const trips = []

    // Generic selectors — try common card patterns
    const cardSelectors = [
      'article',
      '.card',
      '.experience-card',
      '.tour-card',
      '.trip-card',
      '[class*="card"]',
      '.grid > div',
      '.listing-item',
    ]

    let cards = $([])
    for (const sel of cardSelectors) {
      cards = $(sel)
      if (cards.length >= 5) break
    }

    cards.each((i, el) => {
      if (trips.length >= 20) return false

      const $el = $(el)

      // Title
      const title =
        $el.find('h2, h3, h4, [class*="title"]').first().text().trim() ||
        $el.find('a').first().attr('title') ||
        ''

      if (!title || title.length < 3) return

      // Image
      const imgEl = $el.find('img').first()
      let image =
        imgEl.attr('src') ||
        imgEl.attr('data-src') ||
        imgEl.attr('data-lazy-src') ||
        ''

      // Make relative URLs absolute
      if (image && !image.startsWith('http')) {
        image = new URL(image, SOURCE_URL).href
      }

      // Description
      const shortDescription =
        $el.find('p, [class*="desc"], [class*="excerpt"]').first().text().trim() ||
        title

      // Link
      let link = $el.find('a').first().attr('href') || ''
      if (link && !link.startsWith('http')) {
        link = new URL(link, SOURCE_URL).href
      }

      // Price (try to extract number)
      const priceText = $el.find('[class*="price"]').first().text()
      const priceMatch = priceText.match(/[\d,]+/)
      const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, ''), 10) : null

      // Duration
      const duration = $el.find('[class*="duration"], [class*="days"]').first().text().trim() || null

      trips.push({
        id: `ve-live-${i + 1}`,
        title,
        shortDescription: shortDescription.substring(0, 200),
        image: image || CONTENT_IMAGES.pyramids,
        price,
        currency: 'USD',
        duration,
        category: 'Visit Egypt',
        rating: null,
        link: link || SOURCE_URL,
        source: 'visitegypt.com',
      })
    })

    return trips.length >= 5 ? trips.slice(0, 20) : null
  } catch (err) {
    clearTimeout(timeout)
    console.warn('Visit Egypt scrape failed:', err.message)
    return null
  }
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Scrape 20 trips from visitegypt.com.
 * Falls back to curated placeholder data if the live site is unreachable.
 * Results are cached in memory for 1 hour.
 *
 * @returns {Promise<Array>}
 */
let _cache = null
let _cacheTime = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export async function scrapeVisitEgyptTrips() {
  // Return cache if fresh
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) {
    return _cache
  }

  // Try live scrape
  const liveTrips = await scrapeLive()

  if (liveTrips && liveTrips.length > 0) {
    console.log(`✅ Scraped ${liveTrips.length} trips from visitegypt.com`)
    _cache = liveTrips
    _cacheTime = Date.now()
    return liveTrips
  }

  // Fallback to curated placeholder data
  console.log('ℹ️  Using 20 curated placeholder trips (visitegypt.com unreachable or changed)')
  _cache = FALLBACK_TRIPS
  _cacheTime = Date.now()
  return FALLBACK_TRIPS
}

/**
 * Force refresh the cache (bypass TTL).
 */
export async function refreshVisitEgyptTrips() {
  _cache = null
  _cacheTime = 0
  return scrapeVisitEgyptTrips()
}

export default { scrapeVisitEgyptTrips, refreshVisitEgyptTrips, FALLBACK_TRIPS }