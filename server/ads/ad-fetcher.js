/**
 * Ad Fetcher Module
 * --------------------------------------------------
 * Simulates fetching 50 advertisements from an external source
 * (e.g. https://egypttimetravel.com/) and returns structured
 * placeholder data.  No copyrighted content is used — every field
 * is demo / placeholder data you can swap for real scraped data later.
 *
 * Usage:
 *   import { fetchAds, getAdsByCategory, AD_CATEGORIES } from './ads/ad-fetcher.js'
 *   const ads = await fetchAds()          // all 50 ads
 *   const tours = getAdsByCategory('Day Tours')
 */

// ─── Category constants ──────────────────────────────────────
export const AD_CATEGORIES = [
  'Egypt Packages',
  'Day Tours',
  'Nile Cruises',
  'Shore Excursions',
  'Transfers',
  'Destinations',
  'Travel Tips',
  'Special Offers',
]

// Map categories → frontend route paths
export const CATEGORY_ROUTES = {
  'Egypt Packages': '/egypt-packages',
  'Day Tours': '/day-tours',
  'Nile Cruises': '/nile-cruises',
  'Shore Excursions': '/shore-excursions',
  'Transfers': '/transfers',
  'Destinations': '/destinations',
  'Travel Tips': '/blog',
  'Special Offers': '/trips',
}

// ─── Placeholder image helper (uses picsum for demo) ─────────
const img = (seed) => `https://picsum.photos/seed/egypt${seed}/600/400`

// ─── 50 placeholder ads ──────────────────────────────────────
const ADS_DATA = [
  // ── Egypt Packages (8) ──────────────────────────────────────
  { id: 1,  category: 'Egypt Packages',    title: 'Classic Egypt 7-Night Package',          shortDescription: 'Cairo, Luxor & Aswan with 5-star hotels and guided tours.',        price: 1299, currency: 'USD', duration: '7 Days',  image: img(1),  link: 'https://egypttimetravel.com/packages/classic-7' },
  { id: 2,  category: 'Egypt Packages',    title: 'Luxury Pyramids & Nile Getaway',         shortDescription: 'Private chauffeur, luxury Nile cruise and VIP Pyramids access.',   price: 2499, currency: 'USD', duration: '10 Days', image: img(2),  link: 'https://egypttimetravel.com/packages/luxury-pyramids' },
  { id: 3,  category: 'Egypt Packages',    title: 'Budget Cairo Explorer',                  shortDescription: 'Affordable 4-night Cairo trip covering all must-see sights.',      price: 499,  currency: 'USD', duration: '4 Days',  image: img(3),  link: 'https://egypttimetravel.com/packages/budget-cairo' },
  { id: 4,  category: 'Egypt Packages',    title: 'Family Fun Egypt Adventure',             shortDescription: 'Kid-friendly itinerary with camel rides and felucca sailing.',     price: 1599, currency: 'USD', duration: '8 Days',  image: img(4),  link: 'https://egypttimetravel.com/packages/family-fun' },
  { id: 5,  category: 'Egypt Packages',    title: 'Honeymoon on the Nile',                  shortDescription: 'Romantic cruise with candlelit dinners under the stars.',           price: 1899, currency: 'USD', duration: '6 Days',  image: img(5),  link: 'https://egypttimetravel.com/packages/honeymoon-nile' },
  { id: 6,  category: 'Egypt Packages',    title: 'Egypt & Jordan Combined',                shortDescription: 'Pyramids, Petra & Wadi Rum in one unforgettable trip.',             price: 2199, currency: 'USD', duration: '12 Days', image: img(6),  link: 'https://egypttimetravel.com/packages/egypt-jordan' },
  { id: 7,  category: 'Egypt Packages',    title: 'Red Sea & Desert Safari',                shortDescription: 'Snorkeling in Hurghada plus overnight desert camping.',             price: 899,  currency: 'USD', duration: '5 Days',  image: img(7),  link: 'https://egypttimetravel.com/packages/red-sea-desert' },
  { id: 8,  category: 'Egypt Packages',    title: 'Ancient Wonders Deep Dive',              shortDescription: 'Archaeological-focused tour with expert Egyptologist guides.',      price: 1799, currency: 'USD', duration: '9 Days',  image: img(8),  link: 'https://egypttimetravel.com/packages/ancient-wonders' },

  // ── Day Tours (7) ──────────────────────────────────────────
  { id: 9,  category: 'Day Tours',         title: 'Giza Pyramids & Sphinx Half-Day',        shortDescription: 'Morning tour of the Great Pyramids and the Sphinx with lunch.',     price: 59,   currency: 'USD', duration: '5 hrs',   image: img(9),  link: 'https://egypttimetravel.com/tours/giza-half-day' },
  { id: 10, category: 'Day Tours',         title: 'Old Cairo Walking Tour',                 shortDescription: 'Coptic Cairo, Khan El Khalili bazaar & Al-Azhar Mosque.',           price: 45,   currency: 'USD', duration: '6 hrs',   image: img(10), link: 'https://egypttimetravel.com/tours/old-cairo' },
  { id: 11, category: 'Day Tours',         title: 'Luxor East & West Bank Full Day',        shortDescription: 'Valley of Kings, Hatshepsut Temple, Karnak & Luxor Temple.',        price: 79,   currency: 'USD', duration: '10 hrs',  image: img(11), link: 'https://egypttimetravel.com/tours/luxor-full-day' },
  { id: 12, category: 'Day Tours',         title: 'Alexandria Day Trip from Cairo',          shortDescription: 'Bibliotheca Alexandrina, Catacombs & Mediterranean seafood lunch.', price: 69,   currency: 'USD', duration: '12 hrs',  image: img(12), link: 'https://egypttimetravel.com/tours/alexandria-day' },
  { id: 13, category: 'Day Tours',         title: 'Aswan Highlights Tour',                  shortDescription: 'Philae Temple, High Dam & Nubian Village felucca ride.',            price: 55,   currency: 'USD', duration: '8 hrs',   image: img(13), link: 'https://egypttimetravel.com/tours/aswan-highlights' },
  { id: 14, category: 'Day Tours',         title: 'Abu Simbel Sunrise Tour',                shortDescription: 'Early morning trip to Ramses II colossal temple.',                  price: 95,   currency: 'USD', duration: '14 hrs',  image: img(14), link: 'https://egypttimetravel.com/tours/abu-simbel' },
  { id: 15, category: 'Day Tours',         title: 'Saqqara & Memphis Tour',                 shortDescription: 'Step Pyramid, ancient capital ruins & open-air museum.',             price: 49,   currency: 'USD', duration: '6 hrs',   image: img(15), link: 'https://egypttimetravel.com/tours/saqqara-memphis' },

  // ── Nile Cruises (6) ──────────────────────────────────────
  { id: 16, category: 'Nile Cruises',      title: '4-Night Luxor to Aswan Cruise',          shortDescription: 'Full-board Nile cruise stopping at Edfu, Kom Ombo & more.',         price: 599,  currency: 'USD', duration: '5 Days',  image: img(16), link: 'https://egypttimetravel.com/cruises/luxor-aswan-4' },
  { id: 17, category: 'Nile Cruises',      title: '7-Night Grand Nile Voyage',              shortDescription: 'Luxury dahabiya sailing with private sundeck and gourmet chef.',     price: 1399, currency: 'USD', duration: '8 Days',  image: img(17), link: 'https://egypttimetravel.com/cruises/grand-nile-7' },
  { id: 18, category: 'Nile Cruises',      title: '3-Night Aswan to Luxor Express',         shortDescription: 'Shorter cruise perfect for tight schedules with all temples.',       price: 449,  currency: 'USD', duration: '4 Days',  image: img(18), link: 'https://egypttimetravel.com/cruises/aswan-luxor-3' },
  { id: 19, category: 'Nile Cruises',      title: 'Lake Nasser Cruise',                     shortDescription: 'Explore Abu Simbel from the water on a peaceful 3-night sail.',      price: 799,  currency: 'USD', duration: '4 Days',  image: img(19), link: 'https://egypttimetravel.com/cruises/lake-nasser' },
  { id: 20, category: 'Nile Cruises',      title: 'Felucca Overnight Adventure',            shortDescription: 'Traditional sailing boat, campfire dinners & stargazing.',           price: 129,  currency: 'USD', duration: '2 Days',  image: img(20), link: 'https://egypttimetravel.com/cruises/felucca-overnight' },
  { id: 21, category: 'Nile Cruises',      title: 'Luxury Steamer Nile Cruise',             shortDescription: 'Restored 1920s steamer with colonial-era elegance.',                 price: 1899, currency: 'USD', duration: '7 Days',  image: img(21), link: 'https://egypttimetravel.com/cruises/luxury-steamer' },

  // ── Shore Excursions (6) ──────────────────────────────────
  { id: 22, category: 'Shore Excursions',  title: 'Safaga Port → Luxor Temples',            shortDescription: 'Full day from Safaga to Valley of Kings & Karnak Temple.',           price: 89,   currency: 'USD', duration: '12 hrs',  image: img(22), link: 'https://egypttimetravel.com/shore/safaga-luxor' },
  { id: 23, category: 'Shore Excursions',  title: 'Ain Sokhna → Cairo & Pyramids',          shortDescription: 'Cruise port transfer to Giza & Egyptian Museum return.',             price: 99,   currency: 'USD', duration: '14 hrs',  image: img(23), link: 'https://egypttimetravel.com/shore/sokhna-cairo' },
  { id: 24, category: 'Shore Excursions',  title: 'Alexandria Port City Tour',              shortDescription: 'Pompey Pillar, Citadel, Library & local food tasting.',             price: 65,   currency: 'USD', duration: '8 hrs',   image: img(24), link: 'https://egypttimetravel.com/shore/alexandria-port' },
  { id: 25, category: 'Shore Excursions',  title: 'Port Said → Cairo Express',              shortDescription: 'Quick transfer from Port Said to see the Pyramids and back.',        price: 109,  currency: 'USD', duration: '13 hrs',  image: img(25), link: 'https://egypttimetravel.com/shore/port-said-cairo' },
  { id: 26, category: 'Shore Excursions',  title: 'Aqaba Port → Petra Day Trip',            shortDescription: 'Cross to Jordan for a guided Petra visit, returns same day.',        price: 159,  currency: 'USD', duration: '15 hrs',  image: img(26), link: 'https://egypttimetravel.com/shore/aqaba-petra' },
  { id: 27, category: 'Shore Excursions',  title: 'Sharm Port Snorkeling Trip',             shortDescription: 'Ras Mohamed marine park snorkeling from your cruise ship.',          price: 49,   currency: 'USD', duration: '6 hrs',   image: img(27), link: 'https://egypttimetravel.com/shore/sharm-snorkeling' },

  // ── Transfers (6) ─────────────────────────────────────────
  { id: 28, category: 'Transfers',         title: 'Cairo Airport Private Transfer',          shortDescription: 'Meet & greet, air-conditioned sedan to any Cairo hotel.',             price: 25,   currency: 'USD', duration: '1 hr',    image: img(28), link: 'https://egypttimetravel.com/transfers/cairo-airport' },
  { id: 29, category: 'Transfers',         title: 'Luxor Airport ↔ Hotel Shuttle',          shortDescription: 'Comfortable minivan with luggage assistance.',                       price: 19,   currency: 'USD', duration: '30 min',  image: img(29), link: 'https://egypttimetravel.com/transfers/luxor-airport' },
  { id: 30, category: 'Transfers',         title: 'Cairo → Hurghada Private Car',           shortDescription: 'Door-to-door 5-hour ride in a modern SUV.',                          price: 89,   currency: 'USD', duration: '5 hrs',   image: img(30), link: 'https://egypttimetravel.com/transfers/cairo-hurghada' },
  { id: 31, category: 'Transfers',         title: 'Aswan → Abu Simbel Minibus',             shortDescription: 'Shared minibus departing at 4 AM with police convoy.',               price: 35,   currency: 'USD', duration: '3 hrs',   image: img(31), link: 'https://egypttimetravel.com/transfers/aswan-abu-simbel' },
  { id: 32, category: 'Transfers',         title: 'Sharm El Sheikh Airport Transfer',       shortDescription: 'Private AC car straight to your resort in Naama Bay.',               price: 29,   currency: 'USD', duration: '20 min',  image: img(32), link: 'https://egypttimetravel.com/transfers/sharm-airport' },
  { id: 33, category: 'Transfers',         title: 'Cairo → Alexandria Limousine',           shortDescription: 'Luxury Mercedes transfer along the desert highway.',                  price: 79,   currency: 'USD', duration: '2.5 hrs', image: img(33), link: 'https://egypttimetravel.com/transfers/cairo-alex-limo' },

  // ── Destinations (6) ──────────────────────────────────────
  { id: 34, category: 'Destinations',      title: 'Discover Cairo',                         shortDescription: 'The bustling capital: pyramids, museums, mosques and nightlife.',     price: null,  currency: null, duration: null,       image: img(34), link: 'https://egypttimetravel.com/destinations/cairo' },
  { id: 35, category: 'Destinations',      title: 'Explore Luxor',                          shortDescription: 'The world\'s greatest open-air museum on the East & West Banks.',    price: null,  currency: null, duration: null,       image: img(35), link: 'https://egypttimetravel.com/destinations/luxor' },
  { id: 36, category: 'Destinations',      title: 'Aswan & Nubia',                          shortDescription: 'Colorful Nubian villages, Philae Temple & Nile felucca rides.',      price: null,  currency: null, duration: null,       image: img(36), link: 'https://egypttimetravel.com/destinations/aswan' },
  { id: 37, category: 'Destinations',      title: 'Hurghada & Red Sea',                     shortDescription: 'Crystal-clear waters, coral reefs and year-round sunshine.',          price: null,  currency: null, duration: null,       image: img(37), link: 'https://egypttimetravel.com/destinations/hurghada' },
  { id: 38, category: 'Destinations',      title: 'Sharm El Sheikh',                        shortDescription: 'Premium Red Sea resort with world-class diving and snorkeling.',      price: null,  currency: null, duration: null,       image: img(38), link: 'https://egypttimetravel.com/destinations/sharm' },
  { id: 39, category: 'Destinations',      title: 'Alexandria',                             shortDescription: 'Mediterranean charm, Roman ruins and seafood paradise.',              price: null,  currency: null, duration: null,       image: img(39), link: 'https://egypttimetravel.com/destinations/alexandria' },

  // ── Travel Tips (6) ───────────────────────────────────────
  { id: 40, category: 'Travel Tips',       title: 'Best Time to Visit Egypt',               shortDescription: 'Season guide: temperatures, crowds and festival calendar.',           price: null,  currency: null, duration: null,       image: img(40), link: 'https://egypttimetravel.com/blog/best-time-visit' },
  { id: 41, category: 'Travel Tips',       title: 'Egypt Visa Guide 2026',                  shortDescription: 'E-visa, on-arrival and exemption rules explained simply.',            price: null,  currency: null, duration: null,       image: img(41), link: 'https://egypttimetravel.com/blog/visa-guide' },
  { id: 42, category: 'Travel Tips',       title: 'What to Pack for Egypt',                 shortDescription: 'Clothing tips, sun protection and must-have gadgets.',                price: null,  currency: null, duration: null,       image: img(42), link: 'https://egypttimetravel.com/blog/packing-list' },
  { id: 43, category: 'Travel Tips',       title: 'Egyptian Food You Must Try',             shortDescription: 'Koshari, ful medames, molokhia and more local favourites.',           price: null,  currency: null, duration: null,       image: img(43), link: 'https://egypttimetravel.com/blog/egyptian-food' },
  { id: 44, category: 'Travel Tips',       title: 'Staying Safe in Egypt',                  shortDescription: 'Practical safety advice for solo, family and female travellers.',     price: null,  currency: null, duration: null,       image: img(44), link: 'https://egypttimetravel.com/blog/safety-tips' },
  { id: 45, category: 'Travel Tips',       title: 'Haggling & Tipping Etiquette',           shortDescription: 'How to negotiate in markets and proper baksheesh amounts.',           price: null,  currency: null, duration: null,       image: img(45), link: 'https://egypttimetravel.com/blog/haggling-tipping' },

  // ── Special Offers (5) ────────────────────────────────────
  { id: 46, category: 'Special Offers',    title: '🔥 Flash Sale: 30% Off Nile Cruises',    shortDescription: 'Book this week and save 30% on selected 4-night cruises.',            price: 419,  currency: 'USD', duration: '5 Days',  image: img(46), link: 'https://egypttimetravel.com/offers/nile-flash-sale' },
  { id: 47, category: 'Special Offers',    title: 'Early Bird Summer 2026',                 shortDescription: 'Reserve before March and get a free hot-air balloon ride in Luxor.',   price: 999,  currency: 'USD', duration: '7 Days',  image: img(47), link: 'https://egypttimetravel.com/offers/early-bird-summer' },
  { id: 48, category: 'Special Offers',    title: 'Group Discount: 5+ Travelers',           shortDescription: 'Travel with friends — groups of 5+ get 15% off any package.',         price: 1104, currency: 'USD', duration: '7 Days',  image: img(48), link: 'https://egypttimetravel.com/offers/group-discount' },
  { id: 49, category: 'Special Offers',    title: 'Free Airport Transfer Promo',            shortDescription: 'Book any 7+ night package and get free Cairo airport pickup.',         price: 1299, currency: 'USD', duration: '7 Days',  image: img(49), link: 'https://egypttimetravel.com/offers/free-transfer' },
  { id: 50, category: 'Special Offers',    title: 'Last Minute Deals',                      shortDescription: 'Departures within 14 days at heavily discounted prices.',              price: 349,  currency: 'USD', duration: '4 Days',  image: img(50), link: 'https://egypttimetravel.com/offers/last-minute' },
]

// ─── Public API ──────────────────────────────────────────────

/**
 * Simulates an async network fetch.  In production you would
 * replace the body with a real HTTP call + HTML parser (cheerio, puppeteer, etc.)
 * targeting https://egypttimetravel.com/
 *
 * @param {{ category?: string, limit?: number }} options
 * @returns {Promise<Array>}
 */
export async function fetchAds({ category, limit } = {}) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 80))

  let results = [...ADS_DATA]

  if (category) {
    results = results.filter(
      (ad) => ad.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (limit && limit > 0) {
    results = results.slice(0, limit)
  }

  return results
}

/**
 * Convenience — get ads grouped by category.
 * @returns {Promise<Record<string, Array>>}
 */
export async function fetchAdsGrouped() {
  const ads = await fetchAds()
  const grouped = {}
  for (const cat of AD_CATEGORIES) {
    grouped[cat] = ads.filter((a) => a.category === cat)
  }
  return grouped
}

/**
 * Get ads for a single category (sync filter on cached data).
 * @param {string} category
 * @returns {Array}
 */
export function getAdsByCategory(category) {
  return ADS_DATA.filter(
    (ad) => ad.category.toLowerCase() === category.toLowerCase()
  )
}

export default { fetchAds, fetchAdsGrouped, getAdsByCategory, AD_CATEGORIES, CATEGORY_ROUTES }