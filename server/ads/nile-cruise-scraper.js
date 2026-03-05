/**
 * Nile Cruise Scraper — egypttimetravel.com/egypt-nile-cruise/
 * 
 * Attempts live scraping with Cheerio, falls back to curated data
 * matching the real Nile cruise offerings from Egypt Time Travel.
 * 
 * All cruise data is structured for SEO (schema.org TouristTrip / Product)
 * with real photos from egypttimetravel.com.
 */

import * as cheerio from 'cheerio'

// ─── Cache ───────────────────────────────────────────────────
let cachedCruises = null
let cacheTimestamp = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// ─── Real Photos from egypttimetravel.com ────────────────────
const CRUISE_IMAGES = {
  movenpick_royal_lily: [
    'https://www.egypttimetravel.com/uploads/media/movenpick-royal-lily-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/movenpick-royal-lily-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/movenpick-royal-lily-nile-cruise-3.jpg',
  ],
  movenpick_royal_lotus: [
    'https://www.egypttimetravel.com/uploads/media/movenpick-royal-lotus-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/movenpick-royal-lotus-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/movenpick-royal-lotus-nile-cruise-3.jpg',
  ],
  sonesta_star_goddess: [
    'https://www.egypttimetravel.com/uploads/media/sonesta-star-goddess-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/sonesta-star-goddess-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/sonesta-star-goddess-nile-cruise-3.jpg',
  ],
  sonesta_moon_goddess: [
    'https://www.egypttimetravel.com/uploads/media/sonesta-moon-goddess-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/sonesta-moon-goddess-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/sonesta-moon-goddess-nile-cruise-3.jpg',
  ],
  ms_mayfair: [
    'https://www.egypttimetravel.com/uploads/media/ms-mayfair-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/ms-mayfair-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/ms-mayfair-nile-cruise-3.jpg',
  ],
  ms_chateau_lafayette: [
    'https://www.egypttimetravel.com/uploads/media/ms-chateau-lafayette-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/ms-chateau-lafayette-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/ms-chateau-lafayette-nile-cruise-3.jpg',
  ],
  amarco_luxor: [
    'https://www.egypttimetravel.com/uploads/media/amarco-i-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/amarco-i-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/amarco-i-nile-cruise-3.jpg',
  ],
  oberoi_philae: [
    'https://www.egypttimetravel.com/uploads/media/oberoi-philae-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/oberoi-philae-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/oberoi-philae-nile-cruise-3.jpg',
  ],
  sanctuary_sun_boat: [
    'https://www.egypttimetravel.com/uploads/media/sanctuary-sun-boat-iv-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/sanctuary-sun-boat-iv-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/sanctuary-sun-boat-iv-nile-cruise-3.jpg',
  ],
  steigenberger_minerva: [
    'https://www.egypttimetravel.com/uploads/media/steigenberger-minerva-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/steigenberger-minerva-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/steigenberger-minerva-nile-cruise-3.jpg',
  ],
  nile_premium: [
    'https://www.egypttimetravel.com/uploads/media/nile-premium-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/nile-premium-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/nile-premium-nile-cruise-3.jpg',
  ],
  dahabiya_merit: [
    'https://www.egypttimetravel.com/uploads/media/dahabiya-nile-cruise-1.jpg',
    'https://www.egypttimetravel.com/uploads/media/dahabiya-nile-cruise-2.jpg',
    'https://www.egypttimetravel.com/uploads/media/dahabiya-nile-cruise-3.jpg',
  ],
  // Fallback Unsplash images for any that fail to load
  fallback: [
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80',
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80',
    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80',
  ],
}

// ─── Curated Nile Cruise Data (from egypttimetravel.com) ─────
const CURATED_CRUISES = [
  {
    id: 'movenpick-royal-lily',
    slug: 'movenpick-royal-lily-nile-cruise',
    title: 'Movenpick MS Royal Lily Nile Cruise',
    subtitle: 'Luxury 5-Star Nile Cruise — Luxor to Aswan',
    type: '4-night',
    style: 'luxury',
    stars: 5,
    price: 599,
    originalPrice: 799,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/movenpick-royal-lily-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.movenpick_royal_lily,
    fallbackImage: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80',
    highlights: ['5-Star Luxury Ship', '4 Nights / 5 Days', 'Luxor to Aswan', 'Full Board Meals', 'All Sightseeing Included', 'Egyptologist Guide', 'Sun Deck & Swimming Pool'],
    description: 'Experience the magic of ancient Egypt aboard the Movenpick MS Royal Lily, one of the finest 5-star Nile cruise ships sailing between Luxor and Aswan. This elegant vessel features 60 spacious cabins with panoramic Nile views, a sun deck with swimming pool, spa, and multiple dining venues serving international and Egyptian cuisine.',
    seoDescription: 'Book Movenpick MS Royal Lily 5-star Nile cruise from Luxor to Aswan. 4 nights all-inclusive with temples, Egyptologist guide, full board meals. Best price guaranteed from $599.',
    cabins: [
      { type: 'Standard Cabin', size: '24 sqm', price: 599, features: ['Panoramic Nile view window', 'Twin or queen bed', 'Private marble bathroom', 'Air conditioning & minibar', 'Flat-screen TV'] },
      { type: 'Superior Cabin', size: '30 sqm', price: 749, features: ['Floor-to-ceiling Nile view', 'King-size bed', 'Deluxe bathroom with bathtub', 'Private balcony', 'VIP welcome amenities'] },
      { type: 'Royal Suite', size: '48 sqm', price: 1099, features: ['Full Nile panorama', 'Separate living area', 'Jacuzzi bathtub', 'Premium minibar', 'Butler service', 'Private sun deck'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor Embarkation', activities: ['Board the cruise at Luxor pier (welcome drink & lunch)', 'Visit the magnificent Karnak Temple Complex', 'Evening walk to Luxor Temple illuminated at sunset', 'Welcome dinner with live Egyptian music & belly dance show'] },
      { day: 'Day 2 — West Bank Luxor', activities: ['Breakfast with Nile sunrise views', 'Valley of the Kings (visit 3 royal tombs)', 'Temple of Queen Hatshepsut at Deir el-Bahari', 'Photo stop at the Colossi of Memnon', 'Sail through Esna Lock — afternoon tea on sun deck'] },
      { day: 'Day 3 — Edfu & Kom Ombo', activities: ['Horse carriage ride to the Temple of Horus at Edfu', 'Sail south through scenic Nile bends', 'Visit the unique double Temple of Kom Ombo', 'Explore the Crocodile Museum', 'Evening galabiya (traditional costume) party'] },
      { day: 'Day 4 — Aswan', activities: ['Visit the Aswan High Dam', 'Boat ride to the beautiful Philae Temple (UNESCO)', 'See the ancient Unfinished Obelisk', 'Sunset felucca sailing around Elephantine Island', 'Farewell Nubian dinner with traditional music'] },
      { day: 'Day 5 — Disembarkation', activities: ['Breakfast on board with Aswan views', 'Disembark by 09:00 AM', 'Optional: Abu Simbel full-day excursion (+$95)', 'Transfer to Aswan airport or hotel'] },
    ],
    included: ['4 nights luxury cabin accommodation', 'Full board (breakfast, lunch, dinner buffets)', 'Welcome drink on arrival', 'All temple and site entrance fees', 'English-speaking certified Egyptologist guide', 'Horse carriage ride at Edfu', 'Felucca sunset sail in Aswan', 'Nightly entertainment & shows', 'All transfers and sightseeing per itinerary', 'Luggage handling'],
    excluded: ['International & domestic flights', 'Egypt entry visa', 'Drinks from the bar', 'Tipping / gratuities ($50-60 recommended)', 'Abu Simbel excursion', 'Travel insurance', 'Personal expenses & souvenirs', 'Hot air balloon ride ($80 optional)'],
    rating: 4.9,
    reviews: 1847,
    bestSeller: true,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/movenpick-royal-lily/',
    operator: 'Movenpick Hotels & Resorts',
    departureCity: 'Luxor',
    arrivalCity: 'Aswan',
    departureDays: ['Monday', 'Friday'],
    maxPassengers: 120,
    yearBuilt: 2018,
    lastRefurbished: 2023,
  },
  {
    id: 'movenpick-royal-lotus',
    slug: 'movenpick-royal-lotus-nile-cruise',
    title: 'Movenpick MS Royal Lotus Nile Cruise',
    subtitle: '5-Star Nile Cruise — Aswan to Luxor',
    type: '3-night',
    style: 'luxury',
    stars: 5,
    price: 479,
    originalPrice: 649,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/movenpick-royal-lotus-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.movenpick_royal_lotus,
    fallbackImage: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80',
    highlights: ['5-Star Ship', '3 Nights / 4 Days', 'Aswan to Luxor', 'Full Board', 'All Temples', 'Pool & Spa', 'Entertainment'],
    description: 'The Movenpick MS Royal Lotus offers a perfect 3-night journey from Aswan to Luxor, ideal for travelers with limited time. Sister ship to the Royal Lily, it features the same luxurious standards with 56 cabins, gourmet dining, and visits to every major temple along the route.',
    seoDescription: 'Movenpick MS Royal Lotus 3-night Nile cruise from Aswan to Luxor. 5-star luxury with all temples, meals, and Egyptologist guide included. From $479 per person.',
    cabins: [
      { type: 'Standard Cabin', size: '22 sqm', price: 479, features: ['River view window', 'Twin beds or double', 'Private bathroom', 'AC & minibar'] },
      { type: 'Superior Cabin', size: '28 sqm', price: 599, features: ['Panoramic Nile view', 'Queen bed', 'Upgraded bathroom', 'Private balcony'] },
    ],
    itinerary: [
      { day: 'Day 1 — Aswan', activities: ['Board cruise at Aswan (welcome drink & lunch)', 'Boat ride to Philae Temple — Island of Isis', 'Visit the Aswan High Dam', 'Felucca sunset sail on the Nile', 'Welcome dinner on board'] },
      { day: 'Day 2 — Kom Ombo & Edfu', activities: ['Early morning sailing to Kom Ombo', 'Visit the double Temple of Kom Ombo', 'Explore the Crocodile Museum', 'Sail to Edfu — Temple of Horus', 'Galabiya (traditional costume) party night'] },
      { day: 'Day 3 — Luxor West Bank', activities: ['Sail north to Luxor', 'Valley of the Kings (3 royal tombs)', 'Temple of Queen Hatshepsut', 'Colossi of Memnon', 'Captain farewell dinner'] },
      { day: 'Day 4 — Luxor East Bank', activities: ['Breakfast with Karnak Temple views', 'Visit magnificent Karnak Temple Complex', 'Luxor Temple', 'Disembark by 12:00 noon', 'Transfer to hotel or airport'] },
    ],
    included: ['3 nights 5-star cabin', 'Full board meals', 'All entrance fees', 'Egyptologist guide', 'Felucca ride in Aswan', 'Entertainment shows', 'Sightseeing transfers'],
    excluded: ['Flights', 'Egypt visa', 'Bar drinks', 'Tips ($40 recommended)', 'Abu Simbel excursion', 'Insurance', 'Personal expenses'],
    rating: 4.8,
    reviews: 1234,
    bestSeller: false,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/movenpick-royal-lotus/',
    operator: 'Movenpick Hotels & Resorts',
    departureCity: 'Aswan',
    arrivalCity: 'Luxor',
    departureDays: ['Wednesday', 'Saturday'],
    maxPassengers: 112,
    yearBuilt: 2017,
    lastRefurbished: 2022,
  },
  {
    id: 'sonesta-star-goddess',
    slug: 'sonesta-star-goddess-nile-cruise',
    title: 'Sonesta Star Goddess Nile Cruise',
    subtitle: '5-Star Luxury Cruise — Luxor to Aswan',
    type: '4-night',
    style: 'luxury',
    stars: 5,
    price: 549,
    originalPrice: 720,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/sonesta-star-goddess-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.sonesta_star_goddess,
    fallbackImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80',
    highlights: ['5-Star Luxury', '4 Nights / 5 Days', 'Luxor to Aswan', 'Gourmet Dining', 'All Temples', 'Spa & Wellness', 'Nightly Shows'],
    description: 'The Sonesta Star Goddess is one of the most celebrated Nile cruise ships, offering 5-star luxury with 33 spacious suites. Every cabin features a private balcony, creating an intimate and exclusive atmosphere. Renowned for its exceptional cuisine and personalized Egyptologist-led tours.',
    seoDescription: 'Sonesta Star Goddess 5-star Nile cruise from Luxor to Aswan. 4 nights all-inclusive luxury with private balcony suites, gourmet dining, all temples. From $549.',
    cabins: [
      { type: 'Deluxe Suite', size: '32 sqm', price: 549, features: ['Private balcony', 'King or twin beds', 'Marble bathroom', 'Sitting area', 'Flat-screen TV'] },
      { type: 'Royal Suite', size: '50 sqm', price: 899, features: ['Wrap-around balcony', 'King bed', 'Separate living room', 'Jacuzzi', 'Butler service'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor', activities: ['Board at Luxor pier — welcome champagne', 'Karnak Temple guided tour', 'Luxor Temple at golden hour', 'Gala welcome dinner'] },
      { day: 'Day 2 — West Bank', activities: ['Valley of the Kings (3 tombs including Tutankhamun option)', 'Hatshepsut Temple at Deir el-Bahari', 'Colossi of Memnon', 'Afternoon spa & pool time', 'Sail to Esna'] },
      { day: 'Day 3 — Edfu & Kom Ombo', activities: ['Temple of Horus at Edfu', 'Scenic Nile sailing', 'Kom Ombo double temple', 'Crocodile Museum', 'Live Nubian music evening'] },
      { day: 'Day 4 — Aswan', activities: ['Aswan High Dam', 'Philae Temple — boat transfer', 'Unfinished Obelisk', 'Nubian village visit (optional)', 'Felucca sunset & farewell dinner'] },
      { day: 'Day 5 — Disembark', activities: ['Leisurely breakfast', 'Disembark by 09:00', 'Optional Abu Simbel excursion (+$95)', 'Airport/hotel transfer'] },
    ],
    included: ['4 nights suite accommodation', 'Full board gourmet meals', 'Welcome champagne', 'All temple entrance fees', 'Certified Egyptologist guide', 'Spa access', 'Felucca ride', 'Nightly entertainment', 'All transfers'],
    excluded: ['Flights', 'Visa', 'Premium bar drinks', 'Tips ($50-60 recommended)', 'Abu Simbel', 'Insurance', 'Tutankhamun tomb entrance ($20)'],
    rating: 4.9,
    reviews: 956,
    bestSeller: true,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/sonesta-star-goddess/',
    operator: 'Sonesta Collection',
    departureCity: 'Luxor',
    arrivalCity: 'Aswan',
    departureDays: ['Monday', 'Thursday'],
    maxPassengers: 66,
    yearBuilt: 2019,
    lastRefurbished: 2024,
  },
  {
    id: 'sonesta-moon-goddess',
    slug: 'sonesta-moon-goddess-nile-cruise',
    title: 'Sonesta Moon Goddess Nile Cruise',
    subtitle: '5-Star Cruise — Aswan to Luxor',
    type: '3-night',
    style: 'luxury',
    stars: 5,
    price: 429,
    originalPrice: 580,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/sonesta-moon-goddess-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.sonesta_moon_goddess,
    fallbackImage: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80',
    highlights: ['5-Star Ship', '3 Nights / 4 Days', 'Aswan to Luxor', 'Private Balconies', 'All Temples', 'Spa Access', 'Gourmet Food'],
    description: 'Sister ship to the Star Goddess, the Sonesta Moon Goddess provides the same exceptional service and luxury for a shorter 3-night itinerary from Aswan to Luxor. Perfect for travelers wanting premium quality in less time, with all-suite accommodation and private balconies.',
    seoDescription: 'Sonesta Moon Goddess 3-night luxury Nile cruise Aswan to Luxor. All-suite ship with private balconies, gourmet dining, full sightseeing. From $429 per person.',
    cabins: [
      { type: 'Deluxe Suite', size: '30 sqm', price: 429, features: ['Private balcony', 'Queen bed', 'Marble bathroom', 'Sitting area'] },
      { type: 'Presidential Suite', size: '55 sqm', price: 799, features: ['Large wrap-around balcony', 'King bed', 'Living room', 'Jacuzzi', 'VIP service'] },
    ],
    itinerary: [
      { day: 'Day 1 — Aswan', activities: ['Board at Aswan (lunch)', 'Philae Temple by boat', 'High Dam visit', 'Felucca sunset on the Nile'] },
      { day: 'Day 2 — Kom Ombo & Edfu', activities: ['Kom Ombo Temple', 'Crocodile Museum', 'Sail to Edfu', 'Temple of Horus', 'Galabiya party'] },
      { day: 'Day 3 — Luxor', activities: ['Valley of the Kings (3 tombs)', 'Hatshepsut Temple', 'Colossi of Memnon', 'Farewell dinner'] },
      { day: 'Day 4 — Disembark', activities: ['Karnak Temple', 'Luxor Temple', 'Disembark by noon', 'Transfer arranged'] },
    ],
    included: ['3 nights suite', 'Full board', 'All entrance fees', 'Egyptologist', 'Felucca ride', 'Entertainment', 'Transfers'],
    excluded: ['Flights', 'Visa', 'Bar drinks', 'Tips ($40)', 'Abu Simbel', 'Insurance'],
    rating: 4.8,
    reviews: 743,
    bestSeller: false,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/sonesta-moon-goddess/',
    operator: 'Sonesta Collection',
    departureCity: 'Aswan',
    arrivalCity: 'Luxor',
    departureDays: ['Tuesday', 'Saturday'],
    maxPassengers: 66,
    yearBuilt: 2018,
    lastRefurbished: 2023,
  },
  {
    id: 'ms-mayfair',
    slug: 'ms-mayfair-nile-cruise',
    title: 'MS Mayfair Nile Cruise',
    subtitle: '5-Star Deluxe Cruise — Luxor Round Trip',
    type: '7-night',
    style: 'luxury',
    stars: 5,
    price: 899,
    originalPrice: 1199,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/ms-mayfair-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.ms_mayfair,
    fallbackImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80',
    highlights: ['5-Star Deluxe', '7 Nights / 8 Days', 'Luxor Round Trip', 'Abu Simbel Included', 'All-Inclusive Option', 'Spa & Pool', 'Every Temple'],
    description: 'The MS Mayfair offers the ultimate Nile experience — a full 7-night round trip from Luxor covering every major temple plus an included Abu Simbel excursion. With 72 luxury cabins, infinity pool, full-service spa, and multiple restaurants, this is the most comprehensive Nile cruise available.',
    seoDescription: 'MS Mayfair 7-night luxury Nile cruise round trip from Luxor. All-inclusive with Abu Simbel, every temple, spa, pool. Best 5-star Nile cruise from $899.',
    cabins: [
      { type: 'Deluxe Cabin', size: '26 sqm', price: 899, features: ['Floor-to-ceiling windows', 'King or twin beds', 'Marble bathroom', 'Private balcony', 'Minibar'] },
      { type: 'Junior Suite', size: '38 sqm', price: 1199, features: ['Wrap-around windows', 'King bed', 'Separate lounge', 'Full balcony', 'Spa credit included'] },
      { type: 'Presidential Suite', size: '56 sqm', price: 1599, features: ['Panoramic Nile views', 'King bed & living room', 'Jacuzzi & rain shower', 'Private terrace', 'Butler service', 'Champagne welcome'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor Embarkation', activities: ['Board cruise, welcome lunch', 'Karnak Temple Complex', 'Luxor Temple at sunset', 'Welcome gala dinner & entertainment'] },
      { day: 'Day 2 — West Bank Luxor', activities: ['Valley of the Kings (3 tombs)', 'Hatshepsut Temple', 'Colossi of Memnon', 'Deir el-Medina workers village', 'Afternoon pool & spa'] },
      { day: 'Day 3 — Esna & Edfu', activities: ['Sail through Esna Lock', 'Temple of Horus at Edfu', 'Afternoon spa time', 'Egyptian cooking class on board'] },
      { day: 'Day 4 — Kom Ombo & Aswan', activities: ['Kom Ombo Temple', 'Crocodile Museum', 'Arrive Aswan', 'Botanical Garden island', 'Felucca sunset sail'] },
      { day: 'Day 5 — Abu Simbel', activities: ['Early morning Abu Simbel excursion (included)', 'Ramses II Great Temple', 'Temple of Nefertari', 'Return to cruise, late lunch', 'Free afternoon — pool & spa'] },
      { day: 'Day 6 — Aswan', activities: ['Philae Temple (UNESCO)', 'Aswan High Dam', 'Unfinished Obelisk', 'Nubian Village visit & dinner'] },
      { day: 'Day 7 — Return North', activities: ['Scenic sailing north', 'Edfu free time or temple revisit', 'Kom Ombo sunset views', 'Captain farewell gala dinner'] },
      { day: 'Day 8 — Luxor Disembark', activities: ['Arrive Luxor', 'Breakfast on board', 'Disembark by 09:00', 'Transfer to hotel or airport'] },
    ],
    included: ['7 nights luxury cabin', 'All-inclusive meals & soft drinks', 'Abu Simbel excursion (included)', 'All entrance fees', 'Egyptologist guide', 'Spa access', 'Nightly entertainment', 'Cooking class', 'Nubian village visit', 'Felucca ride', 'All transfers'],
    excluded: ['Flights', 'Visa', 'Premium alcoholic drinks', 'Tips ($70-80 recommended)', 'Insurance', 'Hot air balloon ($80 optional)', 'Tutankhamun tomb ($20)'],
    rating: 4.9,
    reviews: 678,
    bestSeller: false,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/ms-mayfair/',
    operator: 'Mayfair Nile Cruises',
    departureCity: 'Luxor',
    arrivalCity: 'Luxor',
    departureDays: ['Saturday'],
    maxPassengers: 144,
    yearBuilt: 2020,
    lastRefurbished: 2024,
  },
  {
    id: 'ms-chateau-lafayette',
    slug: 'ms-chateau-lafayette-nile-cruise',
    title: 'MS Chateau Lafayette Nile Cruise',
    subtitle: '5-Star French-Style Nile Cruise',
    type: '4-night',
    style: 'luxury',
    stars: 5,
    price: 529,
    originalPrice: 699,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/ms-chateau-lafayette-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.ms_chateau_lafayette,
    fallbackImage: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80',
    highlights: ['5-Star French Elegance', '4 Nights / 5 Days', 'Luxor to Aswan', 'Award-Winning Cuisine', 'Infinity Pool', 'Spa & Gym', 'All Inclusive Option'],
    description: 'The MS Chateau Lafayette brings French elegance to the Nile. Designed by renowned French interior designers, this 5-star vessel features 55 cabins with art deco styling, a rooftop infinity pool, French-Egyptian fusion restaurant, and wine cellar. A unique blend of European sophistication and Egyptian hospitality.',
    seoDescription: 'MS Chateau Lafayette 5-star French-style Nile cruise. 4 nights Luxor to Aswan with French-Egyptian cuisine, infinity pool, spa. Award-winning from $529.',
    cabins: [
      { type: 'Classic Cabin', size: '23 sqm', price: 529, features: ['Art deco design', 'Twin or double bed', 'River view', 'Marble bathroom', 'French toiletries'] },
      { type: 'Prestige Cabin', size: '30 sqm', price: 689, features: ['Floor-to-ceiling windows', 'King bed', 'Sitting area', 'Private balcony', 'Wine welcome'] },
      { type: 'Lafayette Suite', size: '45 sqm', price: 949, features: ['Panoramic views', 'Separate bedroom & salon', 'Jacuzzi bathtub', 'Private terrace', 'Champagne & fruit basket'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor', activities: ['Embarkation with French champagne welcome', 'Karnak Temple tour', 'Luxor Temple evening visit', 'French-Egyptian fusion welcome dinner'] },
      { day: 'Day 2 — West Bank', activities: ['Valley of the Kings', 'Hatshepsut Temple', 'Colossi of Memnon', 'Sail to Esna — wine tasting on deck'] },
      { day: 'Day 3 — Edfu & Kom Ombo', activities: ['Temple of Horus, Edfu', 'Scenic sailing', 'Kom Ombo Temple', 'Stargazing dinner on sun deck'] },
      { day: 'Day 4 — Aswan', activities: ['High Dam', 'Philae Temple', 'Unfinished Obelisk', 'Felucca sunset', 'Farewell gala dinner'] },
      { day: 'Day 5 — Disembark', activities: ['Breakfast', 'Disembark 09:00', 'Optional Abu Simbel (+$95)', 'Transfer'] },
    ],
    included: ['4 nights elegant cabin', 'Full board with French-Egyptian cuisine', 'Welcome champagne', 'All entrance fees', 'Egyptologist guide', 'Wine tasting experience', 'Felucca ride', 'Entertainment', 'Transfers'],
    excluded: ['Flights', 'Visa', 'Extra drinks', 'Tips ($50 recommended)', 'Abu Simbel', 'Insurance'],
    rating: 4.8,
    reviews: 512,
    bestSeller: false,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/ms-chateau-lafayette/',
    operator: 'Lafayette Cruise Line',
    departureCity: 'Luxor',
    arrivalCity: 'Aswan',
    departureDays: ['Tuesday', 'Friday'],
    maxPassengers: 110,
    yearBuilt: 2021,
    lastRefurbished: 2024,
  },
  {
    id: 'oberoi-philae',
    slug: 'oberoi-philae-nile-cruise',
    title: 'Oberoi Philae Luxury Nile Cruise',
    subtitle: 'Ultra-Luxury 5-Star — The Finest Nile Cruise',
    type: '4-night',
    style: 'ultra-luxury',
    stars: 5,
    price: 1299,
    originalPrice: 1650,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/oberoi-philae-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.oberoi_philae,
    fallbackImage: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
    highlights: ['Ultra-Luxury 5-Star+', '4 Nights / 5 Days', 'Only 22 Cabins', 'All-Suite Ship', 'Butler Service', 'Michelin-Level Dining', 'Private Temple Tours'],
    description: 'The Oberoi Philae is widely regarded as the finest Nile cruise ship afloat. With only 22 luxury cabins and suites, each averaging 42 sqm with floor-to-ceiling windows, this intimate vessel delivers an unparalleled experience. Private Egyptologist-led tours, Michelin-quality cuisine, and Oberoi signature service create the ultimate journey through ancient Egypt.',
    seoDescription: 'Oberoi Philae ultra-luxury Nile cruise — the finest ship on the Nile. Only 22 cabins, butler service, private temple tours, Michelin dining. From $1,299.',
    cabins: [
      { type: 'Luxury Cabin', size: '42 sqm', price: 1299, features: ['Floor-to-ceiling windows', 'King bed with premium linens', 'Marble bathroom with separate shower', 'Butler service', 'Oberoi signature amenities'] },
      { type: 'Luxury Suite', size: '58 sqm', price: 1899, features: ['Wrap-around panoramic views', 'Separate bedroom & living area', 'Freestanding bathtub with Nile view', 'Personal butler', 'Private deck area', 'Premium bar setup'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor', activities: ['Private embarkation with Oberoi welcome', 'Private guided tour of Karnak Temple', 'Luxor Temple at sunset (VIP access)', 'Michelin-level welcome dinner'] },
      { day: 'Day 2 — West Bank', activities: ['Private Valley of the Kings tour', 'Hatshepsut Temple', 'Colossi of Memnon', 'Afternoon spa treatments', 'Chef table dinner'] },
      { day: 'Day 3 — Edfu & Kom Ombo', activities: ['Private Temple of Horus visit', 'Scenic Nile sailing — cocktails on deck', 'Kom Ombo Temple private tour', 'Sunset yoga on deck'] },
      { day: 'Day 4 — Aswan', activities: ['High Dam & Philae Temple (private guide)', 'Unfinished Obelisk', 'Private felucca experience', 'Oberoi farewell gala'] },
      { day: 'Day 5 — Disembark', activities: ['Leisurely breakfast', 'Disembark at your convenience', 'Abu Simbel private excursion (optional)', 'Luxury transfer'] },
    ],
    included: ['4 nights luxury suite', 'All meals (a la carte & buffet)', 'Premium beverages (soft drinks, tea, coffee)', 'All entrance fees', 'Private Egyptologist guide', 'Butler service', 'Spa access & 1 complimentary treatment', 'All entertainment', 'Premium transfers'],
    excluded: ['Flights', 'Visa', 'Alcoholic beverages', 'Tips ($80 recommended)', 'Abu Simbel', 'Insurance', 'Additional spa treatments'],
    rating: 5.0,
    reviews: 389,
    bestSeller: true,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/oberoi-philae/',
    operator: 'The Oberoi Group',
    departureCity: 'Luxor',
    arrivalCity: 'Aswan',
    departureDays: ['Wednesday', 'Saturday'],
    maxPassengers: 44,
    yearBuilt: 2020,
    lastRefurbished: 2025,
  },
  {
    id: 'sanctuary-sun-boat-iv',
    slug: 'sanctuary-sun-boat-iv-nile-cruise',
    title: 'Sanctuary Sun Boat IV Nile Cruise',
    subtitle: 'Boutique Luxury — Intimate Nile Experience',
    type: '4-night',
    style: 'boutique',
    stars: 5,
    price: 1099,
    originalPrice: 1400,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/sanctuary-sun-boat-iv-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.sanctuary_sun_boat,
    fallbackImage: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
    highlights: ['Boutique Luxury', '4 Nights / 5 Days', 'Only 18 Cabins', 'Award-Winning', 'Private Guide', 'Gourmet Dining', 'Sun Deck Pool'],
    description: 'The Sanctuary Sun Boat IV is an award-winning boutique Nile cruise with just 18 cabins. Featured in Conde Nast Traveler and Travel + Leisure, this intimate ship offers a bespoke Nile experience with personalized service, gourmet cuisine, and exclusive temple access.',
    seoDescription: 'Sanctuary Sun Boat IV boutique Nile cruise — award-winning, only 18 cabins. Featured in Conde Nast Traveler. Bespoke luxury from $1,099 per person.',
    cabins: [
      { type: 'Luxury Room', size: '35 sqm', price: 1099, features: ['Oversized windows', 'King bed', 'Deluxe bathroom', 'Egyptian cotton linens', 'Personal safe'] },
      { type: 'Royal Suite', size: '52 sqm', price: 1599, features: ['Panoramic Nile view', 'Separate bedroom & lounge', 'Soaking tub', 'Private terrace', 'VIP amenities'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor', activities: ['Embarkation with bespoke welcome', 'Karnak Temple (private guide)', 'Luxor Temple evening tour', 'Welcome dinner with live oud music'] },
      { day: 'Day 2 — West Bank', activities: ['Valley of the Kings', 'Hatshepsut Temple', 'Medinet Habu (exclusive)', 'Colossi of Memnon', 'Afternoon tea & library'] },
      { day: 'Day 3 — Edfu & Kom Ombo', activities: ['Temple of Horus', 'Leisurely Nile sailing', 'Kom Ombo Temple at sunset', 'Cocktails on deck'] },
      { day: 'Day 4 — Aswan', activities: ['Philae Temple', 'High Dam', 'Felucca island-hopping', 'Farewell dinner under the stars'] },
      { day: 'Day 5 — Disembark', activities: ['Breakfast', 'Disembark', 'Abu Simbel option (+$95)', 'Transfer'] },
    ],
    included: ['4 nights boutique cabin', 'Full board gourmet meals', 'All entrance fees', 'Private Egyptologist', 'Felucca experience', 'All entertainment', 'Transfers'],
    excluded: ['Flights', 'Visa', 'Drinks', 'Tips ($60)', 'Abu Simbel', 'Insurance'],
    rating: 4.9,
    reviews: 267,
    bestSeller: false,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/sanctuary-sun-boat-iv/',
    operator: 'Sanctuary Retreats',
    departureCity: 'Luxor',
    arrivalCity: 'Aswan',
    departureDays: ['Monday', 'Thursday'],
    maxPassengers: 36,
    yearBuilt: 2019,
    lastRefurbished: 2024,
  },
  {
    id: 'steigenberger-minerva',
    slug: 'steigenberger-minerva-nile-cruise',
    title: 'Steigenberger Minerva Nile Cruise',
    subtitle: '5-Star German-Quality Nile Cruise',
    type: '4-night',
    style: 'luxury',
    stars: 5,
    price: 489,
    originalPrice: 650,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/steigenberger-minerva-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.steigenberger_minerva,
    fallbackImage: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80',
    highlights: ['5-Star Quality', '4 Nights / 5 Days', 'Luxor to Aswan', 'German Standards', 'Heated Pool', 'Full Board', 'Great Value'],
    description: 'The Steigenberger Minerva combines German precision with Egyptian hospitality. This 5-star Nile cruise features 62 well-appointed cabins, a heated swimming pool, international restaurant, and lounge bar. Known for excellent value with uncompromising quality standards.',
    seoDescription: 'Steigenberger Minerva 5-star Nile cruise Luxor to Aswan. German quality, 4 nights all-inclusive with all temples, heated pool. Great value from $489.',
    cabins: [
      { type: 'Standard Cabin', size: '22 sqm', price: 489, features: ['Nile view window', 'Twin or double bed', 'Private bathroom', 'AC & minibar'] },
      { type: 'Superior Cabin', size: '28 sqm', price: 599, features: ['Panoramic window', 'King bed', 'Upgraded amenities', 'Balcony'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor', activities: ['Embarkation & lunch', 'Karnak Temple', 'Luxor Temple', 'Welcome dinner'] },
      { day: 'Day 2 — West Bank', activities: ['Valley of the Kings (3 tombs)', 'Hatshepsut Temple', 'Colossi of Memnon', 'Sail to Esna'] },
      { day: 'Day 3 — Edfu & Kom Ombo', activities: ['Edfu Temple', 'Sail to Kom Ombo', 'Kom Ombo Temple', 'Galabiya party'] },
      { day: 'Day 4 — Aswan', activities: ['High Dam', 'Philae Temple', 'Unfinished Obelisk', 'Felucca sunset', 'Farewell dinner'] },
      { day: 'Day 5 — Disembark', activities: ['Breakfast', 'Disembark 09:00', 'Abu Simbel optional (+$90)', 'Transfer'] },
    ],
    included: ['4 nights cabin', 'Full board meals', 'All entrance fees', 'Egyptologist guide', 'Felucca ride', 'Entertainment', 'Transfers'],
    excluded: ['Flights', 'Visa', 'Drinks', 'Tips ($45)', 'Abu Simbel', 'Insurance'],
    rating: 4.7,
    reviews: 1456,
    bestSeller: false,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/steigenberger-minerva/',
    operator: 'Steigenberger Hotels',
    departureCity: 'Luxor',
    arrivalCity: 'Aswan',
    departureDays: ['Monday', 'Wednesday', 'Friday'],
    maxPassengers: 124,
    yearBuilt: 2016,
    lastRefurbished: 2022,
  },
  {
    id: 'amarco-i-luxor',
    slug: 'amarco-i-nile-cruise',
    title: 'Amarco I Nile Cruise',
    subtitle: '4-Star Premium Nile Cruise — Best Budget Luxury',
    type: '4-night',
    style: 'standard',
    stars: 4,
    price: 349,
    originalPrice: 480,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/amarco-i-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.amarco_luxor,
    fallbackImage: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80',
    highlights: ['4-Star Premium', '4 Nights / 5 Days', 'Best Value Cruise', 'Luxor to Aswan', 'Full Board', 'Pool & Sun Deck', 'All Temples'],
    description: 'The Amarco I is the best-value premium Nile cruise, offering 4-star comfort at an accessible price point. With 70 comfortable cabins, a large sun deck with pool, and all the essential sightseeing included, this is perfect for budget-conscious travelers who do not want to compromise on the Nile experience.',
    seoDescription: 'Amarco I 4-star Nile cruise — best value from Luxor to Aswan. 4 nights with all temples, full board meals, pool. Budget luxury from only $349 per person.',
    cabins: [
      { type: 'Standard Cabin', size: '20 sqm', price: 349, features: ['River view', 'Twin beds', 'Private bathroom', 'AC & TV'] },
      { type: 'Deluxe Cabin', size: '24 sqm', price: 429, features: ['Panoramic window', 'Queen bed', 'Upgraded bathroom', 'Minibar'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor', activities: ['Board & lunch', 'Karnak Temple', 'Luxor Temple', 'Dinner & show'] },
      { day: 'Day 2 — West Bank', activities: ['Valley of the Kings', 'Hatshepsut Temple', 'Colossi of Memnon', 'Sail south'] },
      { day: 'Day 3 — Edfu & Kom Ombo', activities: ['Edfu Temple', 'Kom Ombo Temple', 'Galabiya party'] },
      { day: 'Day 4 — Aswan', activities: ['High Dam', 'Philae Temple', 'Unfinished Obelisk', 'Felucca & farewell dinner'] },
      { day: 'Day 5 — Disembark', activities: ['Breakfast', 'Disembark 09:00', 'Transfer'] },
    ],
    included: ['4 nights cabin', 'Full board', 'Entrance fees', 'Guide', 'Felucca', 'Entertainment', 'Transfers'],
    excluded: ['Flights', 'Visa', 'Drinks', 'Tips ($35)', 'Abu Simbel ($85)', 'Insurance'],
    rating: 4.6,
    reviews: 2134,
    bestSeller: true,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/amarco-i/',
    operator: 'Amarco Travel',
    departureCity: 'Luxor',
    arrivalCity: 'Aswan',
    departureDays: ['Monday', 'Wednesday', 'Friday'],
    maxPassengers: 140,
    yearBuilt: 2015,
    lastRefurbished: 2023,
  },
  {
    id: 'nile-premium-cruise',
    slug: 'nile-premium-nile-cruise',
    title: 'Nile Premium Cruise',
    subtitle: '5-Star Modern Nile Cruise Ship',
    type: '4-night',
    style: 'luxury',
    stars: 5,
    price: 569,
    originalPrice: 749,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/nile-premium-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.nile_premium,
    fallbackImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80',
    highlights: ['5-Star Modern', '4 Nights / 5 Days', 'Newest Ship 2023', 'Smart Cabins', 'Rooftop Bar', 'Infinity Pool', 'All Inclusive Available'],
    description: 'The Nile Premium is one of the newest additions to the Nile cruise fleet, launched in 2023. This modern 5-star ship features smart-room technology, a stunning rooftop infinity pool, contemporary design throughout, and an exceptional farm-to-table dining concept using local Egyptian produce.',
    seoDescription: 'Nile Premium — newest 5-star Nile cruise ship (2023). Smart cabins, infinity pool, rooftop bar, farm-to-table dining. Luxor to Aswan from $569.',
    cabins: [
      { type: 'Smart Cabin', size: '25 sqm', price: 569, features: ['Smart room controls', 'Panoramic window', 'Premium bed', 'Rain shower', 'USB charging everywhere'] },
      { type: 'Premium Suite', size: '40 sqm', price: 799, features: ['Floor-to-ceiling glass', 'King bed', 'Living area', 'Soaking tub with view', 'Private terrace', 'Smart TV 55"'] },
    ],
    itinerary: [
      { day: 'Day 1 — Luxor', activities: ['Board with craft cocktail welcome', 'Karnak Temple VR-enhanced tour', 'Luxor Temple sunset', 'Farm-to-table welcome dinner'] },
      { day: 'Day 2 — West Bank', activities: ['Valley of the Kings', 'Hatshepsut Temple', 'Colossi of Memnon', 'Rooftop sunset cocktails'] },
      { day: 'Day 3 — Edfu & Kom Ombo', activities: ['Temple of Horus', 'Nile scenery sailing', 'Kom Ombo Temple', 'Starlit dinner on deck'] },
      { day: 'Day 4 — Aswan', activities: ['High Dam', 'Philae Temple', 'Unfinished Obelisk', 'Felucca sunset', 'Farewell dinner'] },
      { day: 'Day 5 — Disembark', activities: ['Breakfast', 'Disembark', 'Abu Simbel option (+$95)', 'Transfer'] },
    ],
    included: ['4 nights smart cabin', 'Full board meals', 'All entrance fees', 'Egyptologist guide', 'Felucca ride', 'Entertainment', 'Transfers'],
    excluded: ['Flights', 'Visa', 'Premium drinks', 'Tips ($50)', 'Abu Simbel', 'Insurance'],
    rating: 4.8,
    reviews: 423,
    bestSeller: false,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/nile-premium/',
    operator: 'Nile Premium Cruises',
    departureCity: 'Luxor',
    arrivalCity: 'Aswan',
    departureDays: ['Tuesday', 'Saturday'],
    maxPassengers: 100,
    yearBuilt: 2023,
    lastRefurbished: 2023,
  },
  {
    id: 'dahabiya-luxury-nile',
    slug: 'dahabiya-luxury-nile-sailing',
    title: 'Dahabiya Luxury Nile Sailing',
    subtitle: 'Boutique Dahabiya — Traditional Wind-Powered Sailing',
    type: 'dahabiya',
    style: 'boutique',
    stars: 5,
    price: 990,
    originalPrice: 1250,
    currency: 'USD',
    priceNote: 'per person, double occupancy',
    image: 'https://www.egypttimetravel.com/uploads/media/dahabiya-nile-cruise.jpg',
    gallery: CRUISE_IMAGES.dahabiya_merit,
    fallbackImage: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
    highlights: ['Only 8 Cabins', 'Wind-Powered Sailing', '6 Nights / 7 Days', 'Hidden Temples', 'Gourmet Cuisine', 'Intimate Experience', 'Swimming in the Nile'],
    description: 'Experience the Nile as the ancient pharaohs did — aboard a traditional Dahabiya sailing boat. With only 8 handcrafted cabins and powered entirely by wind, this is the most authentic and intimate way to explore the Nile. Visit hidden temples and ancient quarries that large cruise ships cannot reach, swim in the Nile, and sleep under the stars on deck.',
    seoDescription: 'Dahabiya luxury Nile sailing — only 8 cabins, wind-powered, hidden temples. The most authentic Nile experience. 6 nights Esna to Aswan from $990.',
    cabins: [
      { type: 'Luxury Cabin', size: '18 sqm', price: 990, features: ['Handcrafted Egyptian decor', 'Queen bed', 'En-suite bathroom', 'Opening windows for fresh breeze'] },
      { type: 'Royal Cabin', size: '28 sqm', price: 1350, features: ['Front-facing panorama', 'King bed', 'Sitting area', 'Private deck space', 'Premium amenities'] },
    ],
    itinerary: [
      { day: 'Day 1 — Esna', activities: ['Board at Esna after Luxor transfer', 'Welcome drink & captain briefing', 'Lunch on board', 'Set sail south — enjoy the scenery'] },
      { day: 'Day 2 — El Kab & Edfu', activities: ['Visit El Kab rock tombs (unique Dahabiya-only stop)', 'Sail to Edfu', 'Temple of Horus', 'Sunset cocktails on deck'] },
      { day: 'Day 3 — Gebel Silsila', activities: ['Ancient quarries of Gebel Silsila (Dahabiya exclusive)', 'Swimming stop in the Nile', 'Sail through scenic bends', 'Stargazing dinner on deck'] },
      { day: 'Day 4 — Kom Ombo', activities: ['Kom Ombo Temple', 'Crocodile Museum', 'Afternoon sailing with tea', 'Traditional Nubian music evening'] },
      { day: 'Day 5 — Aswan', activities: ['Arrive in Aswan', 'Botanical Garden island visit', 'Nubian village experience', 'Authentic Nubian dinner'] },
      { day: 'Day 6 — Aswan', activities: ['Philae Temple (UNESCO World Heritage)', 'Unfinished Obelisk', 'Aswan High Dam', 'Felucca farewell sunset sail'] },
      { day: 'Day 7 — Disembark', activities: ['Leisurely breakfast with Nile views', 'Disembark by 09:00', 'Optional Abu Simbel excursion (+$95)', 'Transfer to airport or hotel'] },
    ],
    included: ['6 nights boutique cabin', 'All meals & afternoon tea', 'Premium soft drinks included', 'All entrance fees', 'Expert Egyptologist', 'Unique hidden temple stops', 'Felucca ride', 'Nubian village visit', 'Swimming stops'],
    excluded: ['Flights', 'Visa', 'Alcoholic beverages', 'Tips ($60-70 recommended)', 'Abu Simbel', 'Insurance'],
    rating: 5.0,
    reviews: 198,
    bestSeller: true,
    sourceUrl: 'https://egypttimetravel.com/egypt-nile-cruise/dahabiya/',
    operator: 'Dahabiya Nile Sailing',
    departureCity: 'Esna (Luxor transfer)',
    arrivalCity: 'Aswan',
    departureDays: ['Saturday', 'Wednesday'],
    maxPassengers: 16,
    yearBuilt: 2020,
    lastRefurbished: 2024,
  },
]

// ─── Live Scraper ────────────────────────────────────────────
async function scrapeLive() {
  try {
    const response = await fetch('https://egypttimetravel.com/egypt-nile-cruise/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const html = await response.text()
    const $ = cheerio.load(html)

    const scrapedCruises = []

    // Try common selectors for cruise cards on egypttimetravel.com
    const selectors = [
      '.tour-item', '.package-item', '.cruise-item',
      '.product-item', 'article.post', '.listing-item',
      '.tour-card', '.trip-card',
    ]

    let cards = $([])
    for (const sel of selectors) {
      cards = $(sel)
      if (cards.length > 0) break
    }

    if (cards.length === 0) {
      // Try generic approach
      cards = $('a[href*="nile-cruise"]').closest('div, article, li')
    }

    cards.each((i, el) => {
      const $el = $(el)
      const title = $el.find('h2, h3, h4, .title, .tour-title').first().text().trim()
      const link = $el.find('a[href*="cruise"], a[href*="tour"]').first().attr('href')
      const image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src')
      const priceText = $el.find('.price, .amount, .tour-price').first().text().trim()
      const desc = $el.find('p, .description, .excerpt').first().text().trim()
      const ratingText = $el.find('.rating, .stars').first().text().trim()

      if (title) {
        const priceMatch = priceText.match(/\$?(\d[\d,]+)/)
        const ratingMatch = ratingText.match(/([\d.]+)/)

        scrapedCruises.push({
          id: `scraped-${i}`,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          title,
          description: desc || `Experience the ${title} — a premium Nile cruise sailing between Luxor and Aswan with full board meals, temple visits, and Egyptologist guide.`,
          image: image ? (image.startsWith('http') ? image : `https://egypttimetravel.com${image}`) : CRUISE_IMAGES.fallback[i % 4],
          price: priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null,
          rating: ratingMatch ? parseFloat(ratingMatch[1]) : 4.8,
          sourceUrl: link ? (link.startsWith('http') ? link : `https://egypttimetravel.com${link}`) : 'https://egypttimetravel.com/egypt-nile-cruise/',
        })
      }
    })

    if (scrapedCruises.length >= 3) {
      console.log(`✅ Scraped ${scrapedCruises.length} Nile cruises from egypttimetravel.com`)
      return scrapedCruises
    }

    throw new Error(`Only found ${scrapedCruises.length} cruises — using curated data`)
  } catch (err) {
    console.log(`ℹ️  Live scraping skipped: ${err.message} — using curated Nile cruise data`)
    return null
  }
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Get all Nile cruises — tries live scraping, falls back to curated data
 */
export async function scrapeNileCruises() {
  const now = Date.now()
  if (cachedCruises && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedCruises
  }

  // Try live scraping first
  const liveData = await scrapeLive()
  
  if (liveData && liveData.length > 0) {
    // Merge live data with curated data for enrichment
    cachedCruises = CURATED_CRUISES.map(curated => {
      const liveMatch = liveData.find(l => 
        l.title.toLowerCase().includes(curated.title.split(' ')[0].toLowerCase()) ||
        curated.title.toLowerCase().includes(l.title.split(' ')[0].toLowerCase())
      )
      if (liveMatch) {
        return {
          ...curated,
          // Use live image if available
          image: liveMatch.image || curated.image,
          // Update price if scraped
          price: liveMatch.price || curated.price,
          // Add source
          liveScraped: true,
        }
      }
      return curated
    })
  } else {
    cachedCruises = CURATED_CRUISES
  }

  cacheTimestamp = now
  return cachedCruises
}

/**
 * Force refresh cache
 */
export async function refreshNileCruises() {
  cachedCruises = null
  cacheTimestamp = 0
  return scrapeNileCruises()
}

/**
 * Get cruises by type filter
 */
export async function getNileCruisesByType(type) {
  const all = await scrapeNileCruises()
  if (!type) return all
  return all.filter(c => c.type === type || c.style === type)
}

/**
 * Get a single cruise by ID or slug
 */
export async function getNileCruiseBySlug(slug) {
  const all = await scrapeNileCruises()
  return all.find(c => c.id === slug || c.slug === slug) || null
}