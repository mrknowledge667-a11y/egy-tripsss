import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

const tours = [
  {
    id: 'overnight-luxor-by-air',
    title: 'Overnight Luxor Escape from Cairo by Air',
    city: 'cairo',
    duration: '2 Days',
    price: 560,
    originalPrice: 650,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Karnak Temple', 'Valley of the Kings', 'Hatshepsut Temple', 'Medinet Habu'],
    description: 'Two-day luxury escape to Luxor with flights, a 5★ hotel and guided visits to Karnak and the Valley of the Kings.',
    itinerary: [
      { time: 'Day 1', activity: 'Pick-up from Cairo hotel → Flight to Luxor → Visit Karnak Temple → Lunch → Hotel check-in' },
      { time: 'Day 2', activity: 'Breakfast → Valley of the Kings → Temple of Queen Hatshepsut → Medinet Habu → Lunch → Flight back to Cairo → Drop-off' },
    ],
    included: ['Flights Cairo–Luxor–Cairo', '1 night 5★ hotel', 'Transfers', 'Guide', 'Entrance fees', '2 lunches', 'Breakfast at hotel', 'Bottled water', 'Service charges'],
    excluded: ['Visa', 'Personal expenses', 'Optional activities'],
    rating: 4.9,
    reviews: 210,
    bestSeller: true,
    link: '#',
    meals: '2 Lunches, Breakfast at hotel'
  },
  {
    id: 'giza-pyramids-egyptian-museum',
    title: 'Giza Pyramids & Egyptian Museum',
    city: 'cairo',
    duration: '8 Hours',
    price: 115,
    originalPrice: 140,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Giza Pyramids', 'Great Sphinx', 'Egyptian Museum'],
    description: 'See the Giza pyramids, Sphinx and the Egyptian Museum with an expert guide — perfect for first-time visitors.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Pyramids of Giza → Great Sphinx → Egyptian Museum → Return to hotel' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Tips', 'Personal expenses'],
    rating: 4.8,
    reviews: 540,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'st-catherine-monastery-2-day',
    title: '2-Day St. Catherine Monastery',
    city: 'cairo',
    duration: '2 Days',
    price: 330,
    originalPrice: 380,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['St. Catherine Monastery', 'Sinai landscapes'],
    description: 'Overnight pilgrimage to St. Catherine Monastery with private transfers and guided visits.',
    itinerary: [ { time: 'Day 1', activity: 'Pick-up → Transfer to Sinai → St. Catherine Monastery → Overnight stay' }, { time: 'Day 2', activity: 'Morning monastery visit → Return to Cairo' } ],
    included: ['Transfers', 'Guide', 'Hotel', 'Entrance fees', 'Lunch'],
    excluded: ['Visa', 'Dinner', 'Personal expenses', 'Tips'],
    rating: 4.7,
    reviews: 86,
    bestSeller: false,
    link: '#',
    meals: 'Lunch, Breakfast at hotel'
  },
  {
    id: 'full-day-luxor-by-air',
    title: 'Full-Day Luxor from Cairo by Air',
    city: 'cairo',
    duration: '16 Hours',
    price: 460,
    originalPrice: 520,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Karnak', 'Valley of the Kings', 'Hatshepsut Temple'],
    description: 'Long but rewarding day trip to Luxor by plane covering Karnak, the Valley of the Kings and Hatshepsut Temple.',
    itinerary: [ { time: '', activity: 'Early pick-up → Flight to Luxor → Karnak Temple → Valley of the Kings → Temple of Hatshepsut → Lunch → Return flight → Drop-off' } ],
    included: ['Flights', 'Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Tips', 'Personal expenses'],
    rating: 4.8,
    reviews: 320,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'memphis-saqqara-giza',
    title: 'Memphis, Saqqara and Pyramids of Giza Tour',
    city: 'cairo',
    duration: '8 Hours',
    price: 145,
    originalPrice: 170,
    image: 'https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Memphis', 'Saqqara Step Pyramid', 'Giza Plateau'],
    description: 'Discover Memphis, Saqqara and the Giza Pyramids with an expert guide and comfortable transfers.',
    itinerary: [ { time: '', activity: 'Pick-up → Memphis → Saqqara Step Pyramid → Giza Plateau → Pyramids & Sphinx → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.7,
    reviews: 210,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'cairo-city-tour-highlights',
    title: 'Cairo City Tour',
    city: 'cairo',
    duration: '8 Hours',
    price: 109,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Egyptian Museum', 'Citadel of Saladin', 'Old Cairo'],
    description: 'A carefully paced tour visiting the Egyptian Museum, the Citadel and the historic neighborhoods of Old Cairo.',
    itinerary: [ { time: '', activity: 'Egyptian Museum → Citadel of Saladin → Suspended Church → Synagogue of Ben Ezra → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Tips', 'Personal expenses', 'Meals'],
    rating: 4.6,
    reviews: 430,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'alexandria-day-trip',
    title: 'Day Trip to Alexandria from Cairo',
    city: 'alexandria',
    duration: '10 Hours',
    price: 125,
    originalPrice: 150,
    image: 'https://images.unsplash.com/photo-1509803874d4a487d912214a13ee8e74c5f91e94?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1509803874d4a487d912214a13ee8e74c5f91e94?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Qaitbay Citadel', 'Kom El Shoqafa', 'Bibliotheca Alexandrina'],
    description: 'Coastal day trip to Alexandria featuring the Citadel, Roman catacombs and the modern Bibliotheca.',
    itinerary: [ { time: '', activity: 'Pick-up → Qaitbay Citadel → Roman Catacombs → Pillar of Pompeii → Bibliotheca Alexandria → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 4.5,
    reviews: 290,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'pyramids-sound-and-light',
    title: 'Sound and Light Show at the Pyramids',
    city: 'cairo',
    duration: '5 Hours',
    price: 79,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Giza Plateau', 'Evening Show'],
    description: 'Evening Sound & Light show at Giza with transfers and reserved seating — a dramatic way to experience the pyramids.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Pyramids of Giza → Sound & Light Show → Drop-off' } ],
    included: ['Transfers', 'Show ticket', 'Guide for transfers'],
    excluded: ['Meals', 'Personal expenses', 'Tips', 'Entrance fees'],
    rating: 4.4,
    reviews: 150,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'el-moez-walking-tour',
    title: 'Walk on El Moez Street Tour',
    city: 'cairo',
    duration: '6 Hours',
    price: 30,
    originalPrice: 40,
    image: 'https://images.unsplash.com/photo-1516239482351-aab9c3a7d4d0?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1516239482351-aab9c3a7d4d0?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Al Moez Street', 'Mamluk architecture', 'Local markets'],
    description: 'Guided walking tour of historic Al Moez Street showcasing Cairo\'s finest medieval architecture and bazaars.',
    itinerary: [ { time: '', activity: 'Explore Old Cairo gates, mosques, houses, walls → Guided tour on Al Moez Street → Return' } ],
    included: ['Guide', 'Short transfers if requested'],
    excluded: ['Meals', 'Entrance fees', 'Personal expenses'],
    rating: 4.6,
    reviews: 85,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'cairo-dinner-cruise-nile',
    title: 'Cairo Dinner Cruise',
    city: 'cairo',
    duration: '4 Hours',
    price: 62,
    originalPrice: 80,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Nile cruise', 'Dinner buffet', 'Live entertainment'],
    description: 'Evening Nile cruise with buffet dinner and live performances including belly dance and music.',
    itinerary: [ { time: '', activity: 'Pick-up → Board Nile Cruise → Dinner buffet → Belly dance & music show → Return' } ],
    included: ['Dinner buffet', 'Transfers', 'Entertainment'],
    excluded: ['Drinks', 'Tips', 'Personal expenses'],
    rating: 4.5,
    reviews: 670,
    bestSeller: false,
    link: '#',
    meals: 'Dinner included'
  },
  {
    id: 'dahshur-saqqara-pyramids',
    title: 'Tour of the Pyramids of Dahshur and Saqqara',
    city: 'cairo',
    duration: '8 Hours',
    price: 140,
    originalPrice: 165,
    image: 'https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Step Pyramid', 'Red Pyramid', 'Bent Pyramid'],
    description: 'Visit Saqqara and Dahshur to see the Step Pyramid and the Bent & Red pyramids on a guided archaeology day.',
    itinerary: [ { time: '', activity: 'Pick-up → Step Pyramid → Red Pyramid → Bent Pyramid → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Tips', 'Personal expenses'],
    rating: 4.6,
    reviews: 120,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'memphis-saqqara-express',
    title: 'Memphis and Sakkara Day Tour',
    city: 'cairo',
    duration: '6 Hours',
    price: 110,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Memphis', 'Saqqara'],
    description: 'Compact tour covering Memphis and Saqqara — great for travellers short on time who want archaeology highlights.',
    itinerary: [ { time: '', activity: 'Memphis → Sakkara → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.5,
    reviews: 98,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'pyramids-camel-ride',
    title: 'Pyramids Camel Ride Experience',
    city: 'cairo',
    duration: '2–3 Hours',
    price: 43,
    originalPrice: 60,
    image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Camel ride', 'Giza Plateau photos'],
    description: 'Short authentic camel ride experience on the Giza Plateau with expert handlers and pyramid viewpoints.',
    itinerary: [ { time: '', activity: 'Pick-up → Camel ride at Giza Plateau → Photo stops → Return' } ],
    included: ['Camel ride', 'Transfers'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.4,
    reviews: 340,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'fayoum-day-trip',
    title: 'Fayoum City Tour from Cairo',
    city: 'fayoum',
    duration: 'Full day',
    price: 109,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1508264165352-c0f6b4a6f5a2?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1508264165352-c0f6b4a6f5a2?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Wadi El Rayan', 'Lake Qarun', 'Desert landscapes'],
    description: 'Scenic day trip to Fayoum: waterfalls, lakes and desert oases with comfortable transfers and local guide.',
    itinerary: [ { time: '', activity: 'Pick-up → Wadi El Rayan waterfalls → Lake Qarun → Desert landscapes → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.5,
    reviews: 76,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'half-day-pyramids',
    title: 'Half-Day Tour to Pyramids of Giza',
    city: 'cairo',
    duration: '4 Hours',
    price: 37,
    originalPrice: 50,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Giza Pyramids', 'Sphinx'],
    description: 'Quick and affordable visit to the Pyramids and Sphinx — ideal for tight schedules.',
    itinerary: [ { time: '', activity: 'Pick-up → Pyramids & Sphinx → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.3,
    reviews: 540,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'quad-bike-pyramids',
    title: 'Quad Bike Safari at the Pyramids',
    city: 'cairo',
    duration: '2 Hours',
    price: 49,
    originalPrice: 70,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['ATV ride', 'Desert dunes', 'Pyramid views'],
    description: 'Guided quad-bike safari across desert dunes with iconic views of the Giza Pyramids.',
    itinerary: [ { time: '', activity: 'Pick-up → Quad bike ride at Giza Desert → Return' } ],
    included: ['Bike ride', 'Transfers'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.6,
    reviews: 210,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'bahariya-white-desert-2day',
    title: '2 Day Bahariya Oasis & White Desert Tour',
    city: 'cairo',
    duration: '2 Days',
    price: 350,
    originalPrice: 420,
    image: 'https://images.unsplash.com/photo-1508264165352-c0f6b4a6f5a2?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1508264165352-c0f6b4a6f5a2?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['White Desert', 'Crystal Mountain', 'Desert camp'],
    description: 'Two-day desert adventure including overnight desert camp, White Desert formations and crystal mountain.',
    itinerary: [ { time: 'Day 1', activity: 'Cairo → Bahariya Oasis → Desert Safari → Overnight desert camp' }, { time: 'Day 2', activity: 'Explore White Desert → Crystal Mountain → Return to Cairo' } ],
    included: ['Transfers', 'Guide', 'Meals (lunch + dinner + breakfast)', 'Accommodation'],
    excluded: ['Personal expenses'],
    rating: 4.8,
    reviews: 98,
    bestSeller: true,
    link: '#',
    meals: 'All meals included'
  },
  {
    id: 'tanoura-show-wekalet',
    title: 'Tanoura Show at Wekalet El Ghouri',
    city: 'cairo',
    duration: '2–3 Hours',
    price: 20,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Sufi spinning dance', 'Traditional music'],
    description: 'Evening cultural performance showcasing the colourful Tanoura Sufi dance at a historic venue.',
    itinerary: [ { time: '', activity: 'Pick-up → Watch Sufi Tanoura Show → Return' } ],
    included: ['Transfers', 'Show ticket'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.2,
    reviews: 55,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'wadi-el-natrun-monasteries',
    title: 'Wadi El Natrun Monasteries Tour',
    city: 'cairo',
    duration: 'Full day',
    price: 50,
    originalPrice: 70,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Coptic monasteries', 'Monastic art'],
    description: 'Visit some of Egypt\'s oldest Coptic monasteries in Wadi El Natrun with a knowledgeable guide.',
    itinerary: [ { time: '', activity: 'Visit oldest Coptic monasteries → Guided tour → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.5,
    reviews: 44,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'el-minya-2-day',
    title: '2 Days Trip to El Minya from Cairo',
    city: 'cairo',
    duration: '2 Days',
    price: 330,
    originalPrice: 390,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Beni Hassan', 'Tell El Amarna'],
    description: 'Two-day cultural journey to El Minya visiting Beni Hassan tombs and Tell El-Amarna with overnight stay.',
    itinerary: [ { time: 'Day 1', activity: 'Cairo → Beni Hassan tombs → Overnight hotel' }, { time: 'Day 2', activity: 'Tell El Amarna → Return' } ],
    included: ['Transfers', 'Guide', 'Hotel', 'Lunch', 'Entrance fees', 'Breakfast at hotel'],
    excluded: ['Dinner', 'Personal expenses'],
    rating: 4.4,
    reviews: 22,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast at hotel + Lunch'
  },
  {
    id: 'cairo-layover-pyramids-museum',
    title: 'Cairo Layover Tour to Pyramids & Museum',
    city: 'cairo',
    duration: '6–8 Hours',
    price: 90,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Airport transfer', 'Giza Pyramids', 'Egyptian Museum'],
    description: 'Efficient layover tour picking you up from the airport to visit Giza and the Egyptian Museum, returning in time for your flight.',
    itinerary: [ { time: '', activity: 'Airport pick-up → Pyramids of Giza → Egyptian Museum → Return to airport' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.6,
    reviews: 140,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'felucca-ride-nile',
    title: 'Felucca Ride on the Nile',
    city: 'cairo',
    duration: '1–2 Hours',
    price: 35,
    originalPrice: 45,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Traditional felucca', 'Nile views'],
    description: 'Relax on a traditional felucca sailboat for a short scenic ride on the Nile — great at sunset.',
    itinerary: [ { time: '', activity: 'Pick-up → Traditional sailboat ride → Return' } ],
    included: ['Transfers', 'Boat ride'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.5,
    reviews: 400,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'el-minya-day-trip',
    title: 'Day Trip to El Minya from Cairo',
    city: 'cairo',
    duration: 'Full Day',
    price: 95,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Middle Egypt sites', 'Archaeology'],
    description: 'Full-day archaeological trip to Middle Egypt covering key sites and guided exploration.',
    itinerary: [ { time: '', activity: 'Cairo → Middle Egypt archaeological sites → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.3,
    reviews: 60,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  // SHARM EL-SHEIKH TOURS
  {
    id: 'sharm-city-tour',
    title: 'Sharm El-Sheikh City Tour',
    city: 'sharm',
    duration: '5 Hours',
    price: 70,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Naama Bay', 'Soho Square', 'Traditional Market', 'Mustafa Mosque'],
    description: 'Discover the vibrant soul of Sharm El-Sheikh with a guided city tour. Explore the bustling Naama Bay, charming Soho Square, visit the impressive Mustafa Mosque, and wander through traditional markets filled with local crafts and souvenirs.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Naama Bay → Soho Square → Traditional Market → Mustafa Mosque → Return to hotel' } ],
    included: ['Transfers', 'Guide', 'Entrance fees'],
    excluded: ['Meals', 'Personal expenses', 'Shopping'],
    rating: 4.6,
    reviews: 180,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'dahab-blue-hole-snorkeling',
    title: 'Dahab & Blue Hole Snorkeling Adventure',
    city: 'sharm',
    duration: '8 Hours',
    price: 80,
    originalPrice: 110,
    image: 'https://images.unsplash.com/photo-1583391733981-5a97e43c0993?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1583391733981-5a97e43c0993?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Blue Hole dive site', 'Ras Abu Galum', 'Pristine reefs', 'Beginner-friendly'],
    description: 'Experience world-class snorkeling at the famous Blue Hole in Dahab. Explore the protected Ras Abu Galum marine reserve with its vibrant coral gardens and exotic fish species. Perfect for both beginners and experienced snorkelers.',
    itinerary: [ { time: '', activity: 'Early pick-up → Drive to Dahab → Blue Hole snorkeling (2-3 dives) → Beach break → Ras Abu Galum exploration → Lunch → Return' } ],
    included: ['Transfers', 'Guide', 'Snorkeling equipment', 'Lunch', 'Bottled water'],
    excluded: ['Diving certification', 'Personal expenses'],
    rating: 4.8,
    reviews: 320,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'saint-catherine-colored-canyon',
    title: 'St. Catherine Monastery & Colored Canyon Tour',
    city: 'sharm',
    duration: '5 Hours',
    price: 150,
    originalPrice: 200,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['St. Catherine Monastery', 'Colored Canyon', 'Sinai Desert', 'Nuweiba dinner'],
    description: 'Journey into the Sinai desert to visit the world\'s oldest Christian monastery of St. Catherine, then explore the spectacular Colored Canyon with its multicolored rock formations. Conclude with dinner in Nuweiba with time for optional diving.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → St. Catherine Monastery tour → Colored Canyon exploration → Nuweiba dinner & leisure time → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Dinner'],
    excluded: ['Personal expenses', 'Diving activities'],
    rating: 4.7,
    reviews: 210,
    bestSeller: true,
    link: '#',
    meals: 'Dinner in Nuweiba'
  },
  {
    id: 'cairo-trip-by-air',
    title: 'Cairo Day Trip from Sharm by Air',
    city: 'sharm',
    duration: '12 Hours',
    price: 220,
    originalPrice: 280,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Giza Pyramids', 'Egyptian Museum', 'Khan El Khalili Bazaar', 'Direct flights'],
    description: 'Fly from Sharm El-Sheikh to Cairo and explore the capital\'s top attractions: marvel at the Giza Pyramids, discover ancient treasures in the Egyptian Museum, and shop in the legendary Khan El Khalili bazaar. All in one unforgettable day.',
    itinerary: [ { time: '', activity: 'Early pick-up → Flight to Cairo → Giza Pyramids tour → Egyptian Museum visit → Khan El Khalili bazaar shopping → Lunch → Return flight → Hotel drop-off' } ],
    included: ['Flights', 'Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses', 'Shopping'],
    rating: 4.9,
    reviews: 450,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'ras-mohamed-snorkeling',
    title: 'Ras Mohamed National Park Snorkeling',
    city: 'sharm',
    duration: '8 Hours',
    price: 110,
    originalPrice: 145,
    image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Ras Mohamed Reef', 'Shark Reef', 'Marine national park', 'Coral gardens'],
    description: 'Snorkel in one of the world\'s most beautiful marine parks. Explore vibrant coral reefs, encounter schools of tropical fish, and witness the incredible marine biodiversity of Ras Mohamed — a paradise for sea lovers.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Boat ride to Ras Mohamed → Snorkeling at Shark Reef (2-3 sites) → Lunch on boat → Return' } ],
    included: ['Transfers', 'Boat ride', 'Guide', 'Snorkeling equipment', 'Lunch', 'Bottled water'],
    excluded: ['Personal expenses'],
    rating: 4.8,
    reviews: 380,
    bestSeller: true,
    link: '#',
    meals: 'Lunch on boat'
  },
  {
    id: 'quad-bike-sinai-desert',
    title: 'Quad Bike Desert Safari in Sinai',
    city: 'sharm',
    duration: '5 Hours',
    price: 65,
    originalPrice: 90,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Desert dunes', 'ATV adventure', 'Bedouin experience', 'Sunset views'],
    description: 'Experience the thrill of quad biking across the pristine Sinai desert. Ride through golden dunes, encounter Bedouin culture, and enjoy breathtaking desert landscapes. Perfect for adventure seekers and adrenaline enthusiasts.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → ATV safety briefing → Desert ride through dunes → Bedouin tea stop → Return to hotel' } ],
    included: ['Transfers', 'ATV rental', 'Guide', 'Safety equipment', 'Bedouin tea'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.7,
    reviews: 240,
    bestSeller: false,
    link: '#',
    meals: 'Beverage included'
  },
  {
    id: 'tiran-island-snorkeling',
    title: 'Tiran Island Snorkeling Excursion',
    city: 'sharm',
    duration: '8 Hours',
    price: 75,
    originalPrice: 105,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Tiran Island beaches', 'Crystal clear waters', 'Coral reefs', 'Island paradise'],
    description: 'Discover the pristine beauty of Tiran Island with its pristine beaches, crystal-clear turquoise waters, and spectacular coral reefs. Snorkel in shallow coral gardens and relax on untouched sandy shores in this slice of paradise.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Boat to Tiran Island → Beach time → Snorkeling at reef sites → Lunch on island → Return' } ],
    included: ['Transfers', 'Boat ride', 'Snorkeling equipment', 'Lunch', 'Beverages'],
    excluded: ['Personal expenses'],
    rating: 4.6,
    reviews: 290,
    bestSeller: false,
    link: '#',
    meals: 'Lunch on island'
  },
  {
    id: 'semi-submarine-tour',
    title: 'Semi Submarine Glass Bottom Boat Tour',
    city: 'sharm',
    duration: '5 Hours',
    price: 85,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Glass bottom viewing', 'Marine life', 'No swimming required', 'Beginner-friendly'],
    description: 'Experience the underwater world without getting wet! Descend in a glass-bottom semi-submarine to observe colorful fish, coral reefs, and marine life. Perfect for non-swimmers, families with children, and those wanting a unique marine experience.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Boat ride to marine area → Semi-submarine descent (45-60 minutes) → Marine life viewing → Return' } ],
    included: ['Transfers', 'Boat ride', 'Semi-submarine tour'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.5,
    reviews: 180,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'mount-moses-monastery',
    title: 'Mount Moses & St. Catherine Monastery Tour',
    city: 'sharm',
    duration: '15 Hours',
    price: 90,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Mount Moses summit', 'Sunrise hike', 'St. Catherine Monastery', 'Spiritual experience'],
    description: 'Embark on a mystical journey to Mount Moses for an unforgettable sunrise hike, followed by a visit to the sacred St. Catherine Monastery — one of the world\'s oldest Christian sites. A deeply spiritual and awe-inspiring experience.',
    itinerary: [ { time: '', activity: 'Midnight pick-up → Drive to Mount Moses → Sunrise hike (3 hours) → Breakfast → St. Catherine Monastery tour → Return to hotel' } ],
    included: ['Transfers', 'Guide', 'Breakfast', 'Monastery entrance fee'],
    excluded: ['Personal expenses', 'Dinner'],
    rating: 4.8,
    reviews: 310,
    bestSeller: true,
    link: '#',
    meals: 'Breakfast included'
  },
  {
    id: 'alf-leila-wa-leila-show',
    title: 'Alf Leila Wa Leila Show & Dinner',
    city: 'sharm',
    duration: '5 Hours',
    price: 85,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Arabian Nights theme', 'Live performances', 'Dinner buffet', 'Belly dance show'],
    description: 'Step into a magical world inspired by the Thousand and One Nights! Enjoy an enchanting evening with international cuisine, traditional belly dance, acrobatics, and authentic Egyptian entertainment in a beautifully themed venue.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Arrival at theme park → Dinner buffet → Live performances & belly dance → Acrobatic show → Return to hotel' } ],
    included: ['Transfers', 'Dinner buffet', 'Show tickets', 'Entertainment'],
    excluded: ['Alcoholic drinks', 'Personal expenses'],
    rating: 4.5,
    reviews: 220,
    bestSeller: false,
    link: '#',
    meals: 'Dinner buffet included'
  },
  {
    id: 'colored-canyon-adventure',
    title: 'Colored Canyon Hiking & Desert Adventure',
    city: 'sharm',
    duration: '5 Hours',
    price: 60,
    originalPrice: 85,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Multicolored rock formations', 'Desert hiking', 'Photography opportunities', 'Nuweiba access'],
    description: 'Explore the natural wonder of Colored Canyon with its stunning multicolored rock layers and dramatic canyon formations. Hike through breathtaking landscapes, capture incredible photos, and experience the raw beauty of the Sinai desert.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Drive to Colored Canyon → Guided hiking tour (2-3 hours) → Photography stops → Return to hotel' } ],
    included: ['Transfers', 'Guide', 'Entrance fee'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.6,
    reviews: 170,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  // ASWAN TOURS
  {
    id: 'luxor-tour-from-aswan',
    title: 'Luxor Day Trip from Aswan',
    city: 'aswan',
    duration: '5 Hours',
    price: 145,
    originalPrice: 190,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Karnak Temple', 'Valley of the Kings', 'Luxor Temple', 'Open-air museum'],
    description: 'Experience the magnificent open-air museum of Luxor on a day trip from Aswan. Explore iconic temples and archaeological sites that showcase Ancient Egypt\'s grandeur and mystique from a different perspective.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Flight to Luxor or scenic drive → Karnak Temple → Valley of the Kings → Luxor Temple → Lunch → Return to Aswan' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses', 'Flight (if chosen)'],
    rating: 4.8,
    reviews: 280,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'philae-unfinished-obelisk-dam',
    title: 'Philae Temple, Unfinished Obelisk & High Dam Tour',
    city: 'aswan',
    duration: '8 Hours',
    price: 95,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Philae Temple', 'Unfinished Obelisk', 'Aswan High Dam', 'Island temple'],
    description: 'Discover Aswan\'s most iconic natural and cultural wonders. Visit the stunning Philae Temple dedicated to the goddess Isis, explore the fascinating Unfinished Obelisk, and marvel at the engineering feat of the Aswan High Dam with breathtaking Nile views.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → High Dam visit → Philae Temple (boat tour) → Unfinished Obelisk site → Lunch → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Boat ride', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.7,
    reviews: 310,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'abu-simbel-from-aswan-plane',
    title: 'Abu Simbel Temples by Plane from Aswan',
    city: 'aswan',
    duration: '8 Hours',
    price: 445,
    originalPrice: 550,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Abu Simbel Grand Temple', 'Rameses II temple', 'Nefertari temple', 'Flight included'],
    description: 'Experience one of Egypt\'s most magnificent monuments! Fly to Abu Simbel to visit the colossal temples of Rameses II. Marvel at the architectural masterpiece with its four towering statues and explore the smaller temple dedicated to Queen Nefertari.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Flight to Abu Simbel → Grand Temple tour → Temple of Nefertari → Lunch → Scenic driving → Return flight → Hotel drop-off' } ],
    included: ['Flights Aswan–Abu Simbel–Aswan', 'Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 4.9,
    reviews: 520,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'edfu-kom-ombo-temples',
    title: 'Edfu and Kom Ombo Temples Tour',
    city: 'aswan',
    duration: '5 Hours',
    price: 85,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Temple of Horus', 'Kom Ombo Temple', 'Best preserved temples', 'Dual temple design'],
    description: 'Visit two of Ancient Egypt\'s best-preserved temples on this enriching archaeological tour. Explore the magnificent Temple of Horus at Edfu—Egypt\'s most complete temple—and the unique Kom Ombo Temple with its rare dual design dedicated to two gods.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Drive to Edfu → Temple of Horus guided tour → Lunch → Kom Ombo Temple tour → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.7,
    reviews: 250,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'philae-sound-and-light',
    title: 'Philae Temple Sound and Light Show',
    city: 'aswan',
    duration: '2 Hours',
    price: 55,
    originalPrice: 80,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Evening performance', 'Temple illumination', 'Pharaonic history narration', 'Island setting'],
    description: 'Experience ancient history come alive! Watch the spectacular sound and light show at the beautiful Philae Temple. The dramatic narration and illumination reveal the daily life of the pharaohs, transporting you thousands of years into the past in this evocative riverside setting.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Boat to Philae Temple → Sound & Light show performance → Return to hotel' } ],
    included: ['Transfers', 'Boat ride', 'Show ticket'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.6,
    reviews: 180,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'felucca-nile-aswan',
    title: 'Traditional Felucca Sail on the Nile',
    city: 'aswan',
    duration: '5 Hours',
    price: 35,
    originalPrice: 50,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Traditional felucca boat', 'Nile sailing', 'Scenic views', 'Relaxation experience'],
    description: 'No visit to Aswan is complete without a traditional felucca ride! Glide gracefully on the Nile\'s ancient waters aboard a traditional Egyptian sailboat. Enjoy hours of peaceful relaxation, soak in the beautiful riverside nature, and experience the timeless charm of Egypt.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Embark on felucca sailboat → Scenic Nile cruise (3-4 hours) → Return to hotel' } ],
    included: ['Transfers', 'Felucca boat ride'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.5,
    reviews: 420,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'kalabsha-temple-nubian-museum',
    title: 'Kalabsha Temple & Nubian Museum Tour',
    city: 'aswan',
    duration: '5 Hours',
    price: 75,
    originalPrice: 105,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Kalabsha Temple', 'Nubian Museum', 'Nubian culture', 'Ancient craftsmanship'],
    description: 'Explore the rich heritage of Nubia on this culturally immersive tour. Visit Kalabsha Temple, the largest Nubian temple after Abu Simbel, then discover the treasures of the Nubian Museum featuring traditional arts, crafts, and exhibits reconstructing the daily life of local populations.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Kalabsha Temple guided tour → Nubian Museum exploration → Lunch → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.6,
    reviews: 200,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'nubian-village-motorboat',
    title: 'Nubian Village Exploration by Motor Boat',
    city: 'aswan',
    duration: '3 Hours',
    price: 65,
    originalPrice: 90,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Colorful Nubian village', 'Local culture', 'Unique traditions', 'Community interaction'],
    description: 'Immerse yourself in authentic Nubian culture! Travel by motorboat to a charming Nubian village with vibrant architecture, distinct language, and unique customs. Meet friendly locals, learn about their way of life, and experience the genuine hospitality of Nubian communities.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Motor boat to Nubian village → Village tour with local guide → Cultural interaction → Tea & refreshments → Return' } ],
    included: ['Transfers', 'Motorboat ride', 'Local guide', 'Tea & snacks'],
    excluded: ['Meals', 'Shopping', 'Personal expenses'],
    rating: 4.7,
    reviews: 310,
    bestSeller: false,
    link: '#',
    meals: 'Tea & refreshments'
  },
  // HURGHADA TOURS
  {
    id: 'luxor-from-hurghada-car',
    title: 'Luxor Day Trip from Hurghada by Car',
    city: 'hurghada',
    duration: '12 Hours',
    price: 200,
    originalPrice: 250,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Valley of the Kings', 'Karnak Temple', 'Luxor Temple', 'Thebes monuments'],
    description: 'Experience the magnificence of Ancient Egypt on this full-day excursion to Luxor from Hurghada. Visit the most important monuments of Pharaonic history and be fascinated by the majestic architectural complexes of the ancient capital Thebes. Explore temples, tombs, and archaeological wonders.',
    itinerary: [ { time: '', activity: 'Early pick-up → Drive to Luxor (4 hours) → Valley of the Kings → Temple of Queen Hatshepsut → Karnak Temple → Lunch → Luxor Temple → Return (4 hours)' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.8,
    reviews: 220,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'cairo-from-hurghada-air',
    title: 'Cairo Day Trip from Hurghada by Air',
    city: 'hurghada',
    duration: '12 Hours',
    price: 260,
    originalPrice: 320,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Giza Pyramids', 'Khan El Khalili Bazaar', 'Egyptian Museum', 'Direct flights'],
    description: 'Fly from Hurghada to Cairo and witness the majestic pyramids of Giza with your own eyes. Walk through the colorful alleys of the Khan El Khalili bazaar, explore the Egyptian Museum with its priceless treasures, and return by evening flight. An unforgettable day trip!',
    itinerary: [ { time: '', activity: 'Early pick-up → Flight to Cairo → Giza Pyramids tour → Khan El Khalili bazaar shopping → Egyptian Museum visit → Lunch → Return flight → Hotel drop-off' } ],
    included: ['Flights', 'Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses', 'Shopping'],
    rating: 4.9,
    reviews: 380,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'giftun-island-snorkeling',
    title: 'Giftun Island Snorkeling Adventure',
    city: 'hurghada',
    duration: '8 Hours',
    price: 95,
    originalPrice: 135,
    image: 'https://images.unsplash.com/photo-1583391733981-5a97e43c0993?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1583391733981-5a97e43c0993?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Colorful coral reefs', 'Tropical fish', 'Island paradise', 'Red Sea beauty'],
    description: 'Snorkel on the enchanting Giftun Island with its speechless beauty! Explore a colorful forest of corals in different shapes and sizes, swim among diverse fish species, and experience the natural magic of the Red Sea. A truly memorable experience awaits!',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Boat to Giftun Island → Snorkeling (2-3 sites) → Beach time → Lunch on boat → Return' } ],
    included: ['Transfers', 'Boat ride', 'Snorkeling equipment', 'Lunch', 'Beverages'],
    excluded: ['Personal expenses'],
    rating: 4.7,
    reviews: 290,
    bestSeller: false,
    link: '#',
    meals: 'Lunch on boat'
  },
  {
    id: 'mahmya-island-snorkeling',
    title: 'Mahmya Island Snorkeling Experience',
    city: 'hurghada',
    duration: '5 Hours',
    price: 80,
    originalPrice: 110,
    image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Turtle encounters', 'Vibrant corals', 'Fish species', 'Snorkeling paradise'],
    description: 'Experience the thrill of swimming among fish, turtles, and colorful corals during an unforgettable snorkeling trip to Mahmya Island. Dive into the crystal-clear waters of the Red Sea and discover the underwater wonders of one of Hurghada\'s best marine destinations.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Boat to Mahmya Island → Snorkeling adventure (2-3 hours) → Beach relaxation → Return' } ],
    included: ['Transfers', 'Boat ride', 'Snorkeling equipment', 'Beverages'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.6,
    reviews: 250,
    bestSeller: false,
    link: '#',
    meals: 'Beverages included'
  },
  {
    id: 'quad-bike-sunset-desert',
    title: 'Quad Bike Desert Safari at Sunset',
    city: 'hurghada',
    duration: '4 Hours',
    price: 60,
    originalPrice: 85,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Sunset ride', 'Desert dunes', 'Bedouin traditions', 'Barbecue dinner'],
    description: 'Treat yourself to an adrenaline-fuelled quad bike ride in the Hurghada desert at sunset! This unforgettable experience allows you to get to know Bedouin traditions and then enjoy a delicious barbecue dinner under the stars while watching an oriental show.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → ATV safety briefing → Desert ride through sand dunes → Sunset time → Bedouin camp → Barbecue dinner & oriental show → Return' } ],
    included: ['Transfers', 'ATV rental', 'Guide', 'Safety equipment', 'Barbecue dinner', 'Entertainment'],
    excluded: ['Personal expenses'],
    rating: 4.7,
    reviews: 310,
    bestSeller: false,
    link: '#',
    meals: 'Barbecue dinner included'
  },
  {
    id: 'alf-leila-show-hurghada',
    title: 'Alf Leila Wa Leila Show at Hurghada',
    city: 'hurghada',
    duration: '5 Hours',
    price: 70,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Thousand and One Nights theme', 'Pharaonic legends', 'Live performances', 'Dinner buffet'],
    description: 'Don\'t miss the fun and charm of "The Thousand and One Nights" during the Alf Leila Wa Leila Show! Experience legendary tales of the pharaohs through engaging performances that will catapult you into Ancient Egypt\'s mystical world.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Arrival at venue → Dinner buffet → Live performances with Pharaonic storytelling → Musical entertainment → Return' } ],
    included: ['Transfers', 'Dinner buffet', 'Show ticket', 'Entertainment'],
    excluded: ['Alcoholic drinks', 'Personal expenses'],
    rating: 4.5,
    reviews: 200,
    bestSeller: false,
    link: '#',
    meals: 'Dinner buffet included'
  },
  {
    id: 'jeep-safari-camel-bedouin',
    title: 'Jeep Safari with Camel & Bedouin Dinner',
    city: 'hurghada',
    duration: '8 Hours',
    price: 80,
    originalPrice: 115,
    image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Jeep safari', 'Camel ride', 'Bedouin culture', 'Desert camp dinner'],
    description: 'A safari in the Hurghada desert will undoubtedly be an unforgettable experience. Reach the heart of the desert by Jeep, then experience the adventure of crossing the desert on camel back. Finish with a barbecue dinner under the stars at a Bedouin camp.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Jeep drive into desert → Camel riding adventure → Bedouin camp arrival → Camel stables → Barbecue dinner under stars → Return' } ],
    included: ['Transfers', 'Jeep rental', 'Camel ride', 'Guide', 'Barbecue dinner', 'Beverages'],
    excluded: ['Personal expenses'],
    rating: 4.8,
    reviews: 340,
    bestSeller: true,
    link: '#',
    meals: 'Barbecue dinner included'
  },
  {
    id: 'semi-submarine-hurghada',
    title: 'Semi Submarine Tours & Snorkeling',
    city: 'hurghada',
    duration: '5 Hours',
    price: 70,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Submarine exploration', 'Underwater life', 'Coral photography', 'Glass bottom viewing'],
    description: 'Explore the depths of the Red Sea from the comfort of a semi-submarine! Film and photograph through the portholes the beautiful underwater world made of corals of all shapes and colors and different types of sea creatures. A unique way to experience marine life!',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Boat to submarine area → Semi-submarine descent (45-60 minutes) → Snorkeling time (optional) → Surface break → Return' } ],
    included: ['Transfers', 'Boat ride', 'Semi-submarine tour', 'Snorkeling equipment'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.6,
    reviews: 270,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: '5-day-nile-cruise-hurghada',
    title: '5-Day Nile Cruise from Hurghada',
    city: 'hurghada',
    duration: '5 Days',
    price: 450,
    originalPrice: 580,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['5-star cruise ship', 'Luxor explore', 'Aswan visit', 'Nile navigation'],
    description: 'Experience the legendary Nile River on an unforgettable 5-day cruise! Fly comfortably from Hurghada to Luxor and enjoy several days navigating the river that allowed the development of one of the greatest civilizations ever to exist. Explore temples, tombs, and historic sites in luxury.',
    itinerary: [ 
      { time: 'Day 1', activity: 'Fly from Hurghada to Luxor → Board 5★ cruise ship → Dinner & briefing' },
      { time: 'Day 2-4', activity: 'Daily guided tours of temples and archaeological sites along Nile → Meals onboard → Nile cruising between stops' },
      { time: 'Day 5', activity: 'Final breakfast → Transfer to airport → Return flight to Hurghada' }
    ],
    included: ['Flights', 'Transfers', '4 nights luxury cruise', 'Guide', 'All meals onboard', 'Entertainment'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 4.9,
    reviews: 410,
    bestSeller: true,
    link: '#',
    meals: 'All meals & drinks onboard'
  },
  {
    id: '2-day-cairo-luxor-hurghada',
    title: '2-Day Cairo & Luxor from Hurghada by Flight',
    city: 'hurghada',
    duration: '2 Days',
    price: 660,
    originalPrice: 800,
    image: 'https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Giza Pyramids', 'Egyptian Museum', 'Valley of the Kings', 'Luxor Temple'],
    description: 'Embark on a captivating two-day adventure flying from Hurghada to Cairo and Luxor! Day 1: Discover the Giza Plateau with the massive pyramids, visit the Egyptian Museum with its priceless treasures. Day 2: Explore Luxor, the former capital, with the Valley of the Kings and magnificent temples.',
    itinerary: [ 
      { time: 'Day 1', activity: 'Early pick-up → Flight to Cairo → Giza Pyramids & Sphinx tour → Egyptian Museum → Khan El Khalili bazaar → Hotel check-in in Cairo' },
      { time: 'Day 2', activity: 'Morning flight to Luxor → Valley of the Kings → Temple of Hatshepsut → Karnak Temple → Return flight to Hurghada → Hotel drop-off' }
    ],
    included: ['Flights Hurghada–Cairo–Luxor–Hurghada', 'Transfers', 'Guides', 'Entrance fees', 'Lunch both days', '1 night hotel in Cairo'],
    excluded: ['Personal expenses', 'Dinner'],
    rating: 4.9,
    reviews: 350,
    bestSeller: true,
    link: '#',
    meals: 'Breakfast at hotel + Lunch both days'
  },
  // LUXOR TOURS
  {
    id: 'aswan-abu-simbel-from-luxor',
    title: '2-Day Aswan & Abu Simbel Excursion',
    city: 'luxor',
    duration: '2 Days',
    price: 380,
    originalPrice: 480,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Aswan High Dam', 'Temple of Isis', 'Abu Simbel temples', 'Nile journey'],
    description: 'Discover the wonders of ancient Egypt on this two-day tour. Visit Aswan\'s High Dam, Unfinished Obelisk, and the enchanting Temple of Isis. Day 2 takes you to Abu Simbel to marvel at the rock-cut temples of Ramses II. An unforgettable Nubian adventure awaits!',
    itinerary: [ 
      { time: 'Day 1', activity: 'Hotel pick-up → Drive to Aswan (3-4 hours) → High Dam visit → Unfinished Obelisk → Philae Temple → Hotel check-in → Dinner' },
      { time: 'Day 2', activity: 'Early breakfast → Drive to Abu Simbel (3 hours) → Grand Temple & Temple of Nefertari tour → Lunch → Return to Luxor' }
    ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Hotel', 'Lunch on Day 2'],
    excluded: ['Personal expenses', 'Dinner Day 2'],
    rating: 4.9,
    reviews: 420,
    bestSeller: true,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: 'karnak-luxor-temples-day',
    title: 'Karnak & Luxor Temples Day Tour',
    city: 'luxor',
    duration: '4 Hours',
    price: 65,
    originalPrice: 90,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Karnak Temple', 'Luxor Temple', 'Thebes history', 'Architectural marvels'],
    description: 'Let yourself be enchanted by the wonderful temples of Karnak and Luxor in the ancient city of Thebes. This tour allows you to delve into the history of construction of these impressive structures and witness the grandeur of Pharaonic Egypt.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Karnak Temple guided tour → Luxor Temple exploration → Return to hotel' } ],
    included: ['Transfers', 'Guide', 'Entrance fees'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.7,
    reviews: 340,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'valley-kings-queens-hatshepsut',
    title: 'Valley of Kings, Queens & Hatshepsut',
    city: 'luxor',
    duration: '4 Hours',
    price: 75,
    originalPrice: 105,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Valley of the Kings', 'Royal tombs', 'Hatshepsut Temple', 'Female Pharaoh'],
    description: 'Treat yourself to an exciting excursion to the Valley of the Kings and Queens. Explore royal tombs and the Funeral Temple of Hatshepsut, Egypt\'s most powerful female Pharaoh. Marvel at ancient hieroglyphics and the stunning architectural achievements of the New Kingdom.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Valley of the Kings (3 tombs) → Temple of Queen Hatshepsut → Valley of the Queens → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.8,
    reviews: 380,
    bestSeller: true,
    link: '#',
    meals: 'None'
  },
  {
    id: 'dendera-abydos-temples',
    title: 'Temples of Dendera & Abydos Tour',
    city: 'luxor',
    duration: '10 Hours',
    price: 65,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Temple of Dendera', 'Temple of Abydos', 'Ancient necropolis', 'Pharaonic sanctuaries'],
    description: 'Don\'t miss the excursion to the temples of Dendera and Abydos, one of the most important necropolises in the history of Ancient Egypt. Explore these remarkable temples and vast necropolis with intricate hieroglyphics and sacred chambers.',
    itinerary: [ { time: '', activity: 'Early pick-up → Drive to Dendera (1 hour) → Temple of Dendera tour → Lunch → Drive to Abydos (1.5 hours) → Temple of Abydos tour → Return to Luxor' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.7,
    reviews: 260,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'east-west-bank-luxor',
    title: 'East Bank & West Bank of Luxor Tour',
    city: 'luxor',
    duration: '8 Hours',
    price: 130,
    originalPrice: 170,
    image: 'https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Karnak Temple', 'Luxor Temple', 'Valley of Kings', 'Hatshepsut Temple'],
    description: 'This comprehensive tour takes you from one bank of the Nile to the other, allowing you to explore all the priceless archaeological sites of the ancient city of Thebes. Discover temples and tombs on both sides of this historical wonder.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → East Bank: Karnak & Luxor Temples → Lunch → West Bank: Valley of Kings & Hatshepsut Temple → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.8,
    reviews: 310,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'sound-light-karnak',
    title: 'Sound & Light Show at Karnak',
    city: 'luxor',
    duration: '5 Hours',
    price: 75,
    originalPrice: 105,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Evening performance', 'Temple illumination', 'Ancient Egypt narration', 'Live actors'],
    description: 'Attend the captivating "Sounds and Lights" show at the Temple of Karnak. Retrace the history and secrets of Ancient Egypt through dramatic performances and stunning illumination. An enchanting evening experience under Egyptian stars.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Dinner (optional) → Karnak Temple Sound & Light show → Return to hotel' } ],
    included: ['Transfers', 'Show ticket'],
    excluded: ['Dinner', 'Meals', 'Personal expenses'],
    rating: 4.6,
    reviews: 220,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'edfu-kom-ombo-from-luxor',
    title: 'Edfu & Kom Ombo Temples Tour',
    city: 'luxor',
    duration: '5 Hours',
    price: 110,
    originalPrice: 150,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Temple of Horus', 'Kom Ombo Temple', 'Dual temple design', 'Nile route between cities'],
    description: 'Discover the temples of Edfu and Kom Ombo! These two wonderful structures are located south on the route between Luxor and Aswan. Explore the best-preserved Temple of Horus and the unique dual-temple complex of Kom Ombo.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Drive south → Edfu Temple of Horus guided tour → Lunch → Kom Ombo Temple exploration → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses'],
    rating: 4.7,
    reviews: 280,
    bestSeller: false,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'hot-air-balloon-luxor',
    title: 'Hot Air Balloon Adventure in Luxor',
    city: 'luxor',
    duration: '2 Hours',
    price: 120,
    originalPrice: 160,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Aerial views', 'Sunrise flight', 'Valley views', 'Unforgettable experience'],
    description: 'Don\'t miss the chance to watch Luxor from above during a breathtaking hot air balloon flight! Experience an exciting adventure in the Egyptian sky with panoramic views of temples, valleys, and the Nile River at dawn.',
    itinerary: [ { time: '', activity: 'Hotel pick-up before dawn → Balloon inflation preparation → Hot air balloon flight (1 hour) → Champagne breakfast → Return to hotel' } ],
    included: ['Transfers', 'Balloon flight', 'Champagne breakfast'],
    excluded: ['Personal expenses'],
    rating: 4.9,
    reviews: 480,
    bestSeller: true,
    link: '#',
    meals: 'Champagne breakfast'
  },
  {
    id: 'cairo-from-luxor-plane',
    title: 'Cairo Day Tour from Luxor by Plane',
    city: 'luxor',
    duration: '18 Hours',
    price: 350,
    originalPrice: 450,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Giza Pyramids', 'Khan El Khalili Bazaar', 'Coptic Cairo', 'Egyptian Museum'],
    description: 'The trip to Cairo departing by plane from Luxor will take you to discover the major points of interest of the capital: the majestic pyramids, the colorful Khan El Khalili souk, and the beautiful churches of Coptic Cairo. Return by evening flight.',
    itinerary: [ { time: '', activity: 'Early pick-up → Flight to Cairo → Giza Pyramids tour → Khan El Khalili bazaar → Coptic Cairo churches → Lunch → Return flight → Hotel drop-off' } ],
    included: ['Flights', 'Transfers', 'Guide', 'Entrance fees', 'Lunch'],
    excluded: ['Personal expenses', 'Shopping'],
    rating: 4.9,
    reviews: 400,
    bestSeller: true,
    link: '#',
    meals: 'Lunch included'
  },
  {
    id: 'valley-queens-mummification',
    title: 'Valley of Queens & Mummification Museum',
    city: 'luxor',
    duration: '5 Hours',
    price: 95,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Valley of Queens', 'Royal tombs', 'Mummification Museum', 'Ancient burial practices'],
    description: 'Treat yourself to an interesting excursion to discover the Valley of the Queens and the Mummification Museum. Learn about ancient Egyptian burial practices, see royal tombs, and understand the sacred process of mummification.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Valley of the Queens guided tour (2-3 tombs) → Mummification Museum visit & explanation → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.6,
    reviews: 190,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  {
    id: 'habu-temple-tombs-nobles',
    title: 'Habu Temple & Tombs of Nobles Day Trip',
    city: 'luxor',
    duration: '5 Hours',
    price: 85,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Temple of Habu', 'Nobles tombs', 'Ramses III temple', 'West Bank sites'],
    description: 'Treat yourself to the unmissable opportunity to discover the Temple of Habu and the Tombs of Nobles on one unforgettable excursion. Explore the impressive mortuary temple of Ramses III and the burial chambers of high officials.',
    itinerary: [ { time: '', activity: 'Hotel pick-up → Temple of Habu guided tour → Tombs of Nobles exploration → Optional West Bank sites → Return' } ],
    included: ['Transfers', 'Guide', 'Entrance fees'],
    excluded: ['Meals', 'Personal expenses'],
    rating: 4.5,
    reviews: 170,
    bestSeller: false,
    link: '#',
    meals: 'None'
  },
  // CLASSIC EGYPT TOURS - REAL PARTNER TOURS FROM egypttimetravel.com
  {
    id: '3-days-cairo-tour-package',
    title: '3 Days Cairo Tour Package – Cairo Private Tours',
    city: 'classic',
    duration: '3 Days',
    price: 435,
    originalPrice: 435,
    image: 'https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Egyptian Museum', 'Old Cairo'],
    description: 'Book a 3-day tour of Cairo and visit the Pyramids of Giza, the Egyptian Museum, Old Cairo, the Citadel, and Mohamed Ali Mosque.',
    itinerary: [ { time: '', activity: 'Daily guided tours in Cairo as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '3-days-in-cairo-alexandria',
    title: '3 Days to Cairo & Alexandria – Holidays to Egypt',
    city: 'classic',
    duration: '3 Days',
    price: 440,
    originalPrice: 440,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Qaitbay Citadel', 'Library of Alexandria'],
    description: 'Book a private 3 days tour in Cairo and Alexandria to discover highlights like the Pyramids of Giza, Egyptian Museum, Qaitbay Citadel, and Library of Alexandria.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Alexandria as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '4-days-cairo-tour-package',
    title: '4 Days Cairo Tour Package – Cairo Holiday Package',
    city: 'classic',
    duration: '4 Days',
    price: 520,
    originalPrice: 520,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Egyptian Museum', 'Saqqara'],
    description: 'Book 4 days in Cairo and visit the Pyramids of Giza, the Sphinx, the Egyptian Museum, Saqqara, and Old Cairo.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '4-days-cairo-alexandria-tour-package',
    title: '4 Days Cairo & Alexandria Tour – Short Egypt Tours',
    city: 'classic',
    duration: '4 Days',
    price: 525,
    originalPrice: 525,
    image: 'https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1526481280698-4c0c3a6d1166?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Alexandria Library', 'Qaitbay Citadel'],
    description: 'Enjoy 4 days of Cairo and Alexandria, visiting pyramids, museums, the Library of Alexandria, Qaitbay Citadel, and more.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Alexandria as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '5-days-cairo-tour-package',
    title: '5 Days in Cairo – Private Guided Tour',
    city: 'classic',
    duration: '5 Days',
    price: 675,
    originalPrice: 675,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Old Cairo', 'Felucca ride'],
    description: 'Enjoy 5 days in Cairo with the pyramids, Old Cairo, Salah El Din Citadel, and Nile views including a felucca ride.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '6-days-cairo-alexandria-tour',
    title: '6 Days Cairo & Alexandria Tour',
    city: 'classic',
    duration: '6 Days',
    price: 800,
    originalPrice: 800,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Old Cairo', 'Alexandria landmarks'],
    description: 'A 6-day tour in Cairo and Alexandria visiting the Pyramids of Giza, Old Cairo, and Alexandria’s landmarks.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Alexandria as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '6-days-cairo-hurghada-tour',
    title: '6 Days Egypt Tour Holiday to Cairo & Hurghada',
    city: 'classic',
    duration: '6 Days',
    price: 865,
    originalPrice: 865,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Egyptian Museum', 'Hurghada beaches'],
    description: 'A 6-day package to Cairo and Hurghada covering the pyramids, Old Cairo, the Egyptian Museum, and Red Sea time.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and beach time in Hurghada as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '5-days-cairo-sharm-el-sheikh-tour',
    title: '5 Days Cairo & Sharm El Sheikh Tour',
    city: 'classic',
    duration: '5 Days',
    price: 895,
    originalPrice: 895,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Cairo attractions', 'Sharm El Sheikh'],
    description: 'A 5-day Cairo and Sharm El Sheikh break with ancient sites in Cairo and resort time on the Red Sea.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and resort time in Sharm El Sheikh as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '4-days-cairo-luxor-tour-package',
    title: '4 Days Cairo & Luxor Tour Package',
    city: 'classic',
    duration: '4 Days',
    price: 1015,
    originalPrice: 1015,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Karnak Temple', 'Valley of the Kings'],
    description: 'A short break covering Cairo’s pyramids and museum plus Luxor highlights like Karnak, Luxor Temple, and Valley of the Kings.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Luxor as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '5-days-cairo-luxor-tour-by-air',
    title: '5 Days Cairo & Luxor Tour – Best Egypt Tours',
    city: 'classic',
    duration: '5 Days',
    price: 1100,
    originalPrice: 1100,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Egyptian Museum', 'Luxor temples'],
    description: 'Spend 5 days between Cairo and Luxor visiting the Pyramids, Egyptian Museum, Valley of the Kings, Karnak, and Luxor Temple.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Luxor as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '8-days-cairo-alexandria-fayoum',
    title: '8 Days Cairo, Alexandria & Fayoum – Vacation to Egypt',
    city: 'classic',
    duration: '8 Days',
    price: 1180,
    originalPrice: 1180,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo highlights', 'Alexandria sites', 'Fayoum oasis'],
    description: 'An 8-day trip across Cairo, Alexandria, and Fayoum exploring Egypt’s history and civilization across eras.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, and Fayoum as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '6-days-cairo-alexandria-luxor-tour',
    title: '6 Days Cairo, Alexandria & Luxor Tour – Egypt Holiday Package',
    city: 'classic',
    duration: '6 Days',
    price: 1345,
    originalPrice: 1345,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo sites', 'Alexandria landmarks', 'Luxor temples'],
    description: 'A 6-day trip to Cairo, Alexandria, and Luxor with ancient monuments and Islamic and Coptic architecture.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, and Luxor as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '6-days-cairo-luxor-aswan-tour',
    title: '6 Days Cairo, Luxor & Aswan Tour',
    city: 'classic',
    duration: '6 Days',
    price: 1395,
    originalPrice: 1395,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Valley of the Kings', 'Abu Simbel'],
    description: 'A classic 6-day tour from the Pyramids of Giza to Abu Simbel, via Luxor’s Valley of the Kings.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Luxor, and Aswan as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '8-days-alexandria-cairo-luxor',
    title: '8 Days Alexandria, Cairo & Luxor',
    city: 'classic',
    duration: '8 Days',
    price: 1555,
    originalPrice: 1555,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Alexandria highlights', 'Luxor temples'],
    description: 'An 8-day tour covering Cairo’s pyramids, Alexandria’s landmarks, and Luxor’s temples.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, and Luxor as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '7-days-cairo-alexandria-luxor-aswan',
    title: '7 Days Cairo, Alexandria, Luxor & Aswan',
    city: 'classic',
    duration: '7 Days',
    price: 1570,
    originalPrice: 1570,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Alexandria sites', 'Abu Simbel'],
    description: 'A 7-day tour from Cairo’s pyramids to Alexandria, Luxor, and Aswan including Abu Simbel.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, Luxor, and Aswan as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '6-days-cairo-nile-cruise-tour-package',
    title: '6 Days Cairo & Nile Cruise Tour Package',
    city: 'classic',
    duration: '6 Days',
    price: 1580,
    originalPrice: 1580,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo sites', 'Nile cruise', 'Luxor & Aswan'],
    description: 'A 6-day itinerary combining Cairo’s sites with a Nile cruise between Luxor and Aswan.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '8-days-cairo-nile-cruise-by-sleeper-train',
    title: '8 Days Cairo & Nile Cruise Tour Package by Train',
    city: 'classic',
    duration: '8 Days',
    price: 1610,
    originalPrice: 1610,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo attractions', 'Sleeper train', 'Nile cruise'],
    description: 'Tour Cairo’s attractions and cruise between Aswan and Luxor on an 8-day itinerary with sleeper train travel.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '7-days-cairo-nile-cruise-by-flight',
    title: '7 Days Cairo & Nile Cruise – Egypt Tour Package',
    city: 'classic',
    duration: '7 Days',
    price: 1665,
    originalPrice: 1665,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Old Cairo', 'Nile cruise'],
    description: 'A 7-day Cairo and Nile cruise package with pyramids, Old Cairo, and sailing between Luxor and Aswan.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '9-days-cairo-nile-cruise-by-sleeper-train',
    title: '9 Days Cairo & Nile Cruise by Sleeper Train',
    city: 'classic',
    duration: '9 Days',
    price: 1810,
    originalPrice: 1810,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo highlights', 'Sleeper train', 'Nile cruise'],
    description: 'A 9-day Cairo trip with a Nile cruise between Luxor and Aswan using sleeper train travel.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '8-days-cairo-alexandria-nile-cruise-by-flight',
    title: '8 Days Cairo, Alexandria & Nile – Egypt Tours Packages',
    city: 'classic',
    duration: '8 Days',
    price: 1860,
    originalPrice: 1860,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Alexandria sites', 'Nile cruise'],
    description: 'A tour of Cairo and Alexandria plus a Nile cruise featuring the pyramids, temples, and Alexandria highlights.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '8-days-cairo-nile-cruise-by-flight',
    title: '8 Days Cairo & Nile Cruise Tour Package by Flight',
    city: 'classic',
    duration: '8 Days',
    price: 1880,
    originalPrice: 1880,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Luxor & Aswan', 'Nile cruise'],
    description: 'An 8-day Cairo and Nile cruise trip visiting the Pyramids, Sphinx, Karnak, Luxor, Aswan, and Philae.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '11-days-cairo-cruise-hurghada-by-train',
    title: '11 Days Cairo, Cruise & Hurghada by Train',
    city: 'classic',
    duration: '11 Days',
    price: 1910,
    originalPrice: 1910,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo sites', 'Nile cruise', 'Hurghada beaches'],
    description: 'An 11-day vacation covering Cairo, Luxor, Aswan, and Hurghada with a Nile cruise.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise, plus Hurghada stay as per program.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '9-days-cairo-alexandria-nile-cruise-by-flight',
    title: '9 Days Egypt Tours to Cairo, Alexandria & Nile Cruise',
    city: 'classic',
    duration: '9 Days',
    price: 1990,
    originalPrice: 1990,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Alexandria sites', 'Nile cruise'],
    description: 'A 9-day tour covering Cairo’s pyramids and museum, a Nile cruise, and Alexandria sightseeing.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '12-days-egypt-pyramids-nile-hurghada',
    title: '12 Days Pyramids, Nile & Hurghada – Tours to Egypt',
    city: 'classic',
    duration: '12 Days',
    price: 2155,
    originalPrice: 2155,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Nile cruise', 'Hurghada beaches'],
    description: 'A 12-day package combining Cairo’s pyramids, a Nile cruise, and relaxation in Hurghada on the Red Sea.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise, plus Hurghada stay as per program.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '10-days-archaeology-tour-to-cairo-upper-egypt',
    title: '10 Days Archaeology Tour to Cairo & Upper Egypt',
    city: 'classic',
    duration: '10 Days',
    price: 2175,
    originalPrice: 2175,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo sites', 'Luxor & Aswan', 'Abu Simbel'],
    description: 'A 10-day archaeology-focused tour covering Cairo, Luxor, Aswan, and Abu Simbel.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Luxor, and Aswan as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '10-days-cairo-alexandria-cruise-by-flight',
    title: '10 Days Cairo, Alexandria & Cruise by Flight',
    city: 'classic',
    duration: '10 Days',
    price: 2250,
    originalPrice: 2250,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo highlights', 'Alexandria sites', 'Nile cruise'],
    description: 'A 10-day journey blending Cairo and Alexandria with a Nile cruise, temples, and historic sites.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '12-days-cairo-alexandria-nile-cruise-by-flight',
    title: '12 Days Cairo, Alexandria & Nile Cruise Holiday',
    city: 'classic',
    duration: '12 Days',
    price: 2410,
    originalPrice: 2410,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo sites', 'Alexandria landmarks', 'Nile cruise'],
    description: 'A 12-day itinerary across Cairo, Alexandria, Luxor, and Aswan with a Nile cruise.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, and Nile cruise program as scheduled.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },
  {
    id: '11-days-cairo-nile-cruise-sharm-by-flight',
    title: '11 Days Cairo, Nile Cruise & Sharm by Flight',
    city: 'classic',
    duration: '11 Days',
    price: 2500,
    originalPrice: 2500,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo sites', 'Nile cruise', 'Sharm El Sheikh'],
    description: 'An 11-day vacation combining Cairo, a Nile cruise, and Sharm El Sheikh.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise, plus Sharm stay as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '12-days-pyramids-nile-sharm',
    title: '12 Days Pyramids, Nile & Sharm – Trip to Egypt',
    city: 'classic',
    duration: '12 Days',
    price: 2580,
    originalPrice: 2580,
    image: 'https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1519821172141-bd4df6b6f0f3?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Pyramids of Giza', 'Nile cruise', 'Sharm El Sheikh'],
    description: 'A 12-day tour of Cairo, Luxor, Aswan, and Sharm El Sheikh with pyramids, temples, and a Nile cruise.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo and Nile cruise, plus Sharm stay as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '10-days-cairo-alex-luxor-aswan-sharm',
    title: '10 Days Cairo, Alex, Luxor, Aswan & Sharm',
    city: 'classic',
    duration: '10 Days',
    price: 2595,
    originalPrice: 2595,
    image: 'https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1505765050461-3c5b7db63f0a?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo sites', 'Luxor & Aswan', 'Sharm El Sheikh'],
    description: 'A 10-day tour covering Cairo, Alexandria, Luxor, Aswan, and Sharm El Sheikh.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, Luxor, Aswan, and Sharm as per program.' } ],
    included: ['Breakfast', 'Lunch'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch'
  },
  {
    id: '12-days-cairo-alexandria-nile-oasis',
    title: '12 Days Cairo, Alexandria, Nile & Oasis',
    city: 'classic',
    duration: '12 Days',
    price: 2640,
    originalPrice: 2640,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'],
    highlights: ['Cairo sites', 'Nile cruise', 'White Desert oasis'],
    description: 'A 12-day tour with Cairo, Alexandria, a Nile cruise, and a White Desert oasis experience.',
    itinerary: [ { time: '', activity: 'Guided tours in Cairo, Alexandria, and Nile cruise, plus oasis stay as per program.' } ],
    included: ['Breakfast', 'Lunch', 'Dinner'],
    excluded: ['Personal expenses', 'Tips'],
    rating: 0,
    reviews: 0,
    bestSeller: false,
    link: '#',
    meals: 'Breakfast + Lunch + Dinner'
  },

  // HONEYMOON PACKAGES - REAL PARTNER TOURS FROM egypttimetravel.com
  // All honeymoon tours removed - only real partner tours to be added here

  // SMALL GROUP TOURS - REAL PARTNER TOURS FROM egypttimetravel.com
  // All small group tours removed - only real partner tours to be added here
]

const faqs = [
  { q: 'What time does the day tour start?', a: 'Most tours start between 7:00-8:30 AM depending on the destination. Luxor tours start earlier (5:00-6:00 AM) to avoid the midday heat. Evening tours like the Dinner Cruise start around 7:00 PM. Exact pickup time will be confirmed the evening before.' },
  { q: 'Are the tours private or shared?', a: 'All our day tours are 100% private — just you, your group, your guide, and your driver. No waiting for other tourists or following a large group. You set the pace.' },
  { q: 'Can I customize the itinerary?', a: 'Absolutely! All itineraries are flexible. Want to spend more time at the Pyramids? Skip the museum? Add a camel ride? Just tell your guide — they\'ll adapt the schedule to your preferences.' },
  { q: 'What if I\'m staying in a different city?', a: 'We offer pickup from any hotel in Cairo, Giza, Luxor, Aswan, Hurghada, and Alexandria. For tours from other cities or airports, contact us for a custom quote.' },
  { q: 'Is lunch included?', a: 'Yes, all our full-day tours include a sit-down lunch at a quality local restaurant. Vegetarian, vegan, and allergy-friendly options are available — just let us know in advance. Shorter tours (2-4 hours) do not include lunch.' },
  { q: 'What about children\'s prices?', a: 'Children under 6 are free. Ages 6-12 receive a 30-50% discount depending on the tour. Car seats are available on request at no extra charge.' },
  { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards (Visa, MasterCard, Maestro) via secure online checkout, PayPal, bank transfer, and cash payment to your guide on the day. A small deposit may be required for peak-season bookings.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 24 hours before the tour. Cancellations within 24 hours may incur a 50% charge. No-shows are non-refundable. For flight-inclusive tours, cancellation terms may differ.' },
]

const reviews = [
  { name: 'Marco & Lucia', country: 'Italy 🇮🇹', rating: 5, tour: 'Pyramids of Giza', text: 'Our guide Mahmoud was exceptional — so knowledgeable and passionate about the pyramids. The private car was comfortable and we had the best day. A must-do tour!', date: 'January 2026' },
  { name: 'David Miller', country: 'Canada 🇨🇦', rating: 5, tour: 'Luxor from Hurghada', text: 'Long day but absolutely worth every minute. Valley of the Kings blew my mind. Having a private Egyptologist explain everything made it 10x better than wandering alone.', date: 'December 2025' },
  { name: 'Aisha Rahman', country: 'UAE 🇦🇪', rating: 5, tour: 'Cairo City Tour', text: 'The Egyptian Museum and Old Cairo were fascinating! Our guide knew every story behind every artifact. The Coptic area was a wonderful surprise.', date: 'November 2025' },
  { name: 'Sophie Laurent', country: 'France 🇫🇷', rating: 5, tour: 'Hot Air Balloon Luxor', text: 'Watching the sunrise over the Valley of the Kings from a hot air balloon was pure magic. One of the most incredible experiences of my life! Book this immediately.', date: 'February 2026' },
]

const DayTours = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const cityFilter = searchParams.get('city') || ''
  const [expandedTour, setExpandedTour] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', selectedTour: '', tourDate: '', travelers: 2, pickupLocation: '', specialRequests: '' })
  const [formSuccess, setFormSuccess] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  
  // Database packages state
  const [dbTours, setDbTours] = useState([])
  const [dbLoading, setDbLoading] = useState(true)

  // Fetch Day Tour packages from Supabase
  useEffect(() => {
    const fetchDayTours = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_published', true)
          .eq('style', 'Day Tour')
          .order('created_at', { ascending: false })
        
        if (!error && data && data.length > 0) {
          // Transform Supabase format to match tour format
          const transformed = data.map(pkg => ({
            id: pkg.slug || pkg.id,
            title: pkg.title,
            city: 'cairo', // default
            duration: pkg.duration || `${pkg.duration_days} Days`,
            price: pkg.price,
            originalPrice: pkg.original_price || pkg.price,
            image: pkg.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
            gallery: pkg.gallery || [],
            highlights: pkg.highlights || [],
            description: pkg.description,
            itinerary: (pkg.itinerary || []).map((item, idx) => ({
              time: item.title || `Day ${idx + 1}`,
              activity: item.details || '',
            })),
            included: pkg.included || [],
            excluded: pkg.excluded || [],
            rating: pkg.rating || 4.5,
            reviews: pkg.reviews || 0,
            bestSeller: pkg.best_seller || false,
            link: '#',
            meals: 'As per itinerary',
            fromDb: true, // mark as database item
          }))
          setDbTours(transformed)
          console.log('✅ Loaded', data.length, 'Day Tour packages from Supabase')
        }
      } catch (err) {
        console.log('⚠️ Using static Day Tours data:', err.message)
      }
      setDbLoading(false)
    }
    fetchDayTours()
  }, [])

  // Combine database tours with static tours (database first)
  const allTours = [...dbTours, ...tours.filter(t => !dbTours.find(dt => dt.id === t.id))]

  // Special categories that have their own dedicated sections below
  const specialCategories = ['classic', 'honeymoon', 'smallgroup', 'luxury', 'christmas', 'easter']
  // When no filter is set, show only regular city tours (special sections render separately below)
  // When a filter IS set, show that category's tours
  const filteredTours = allTours.filter(t => {
    if (cityFilter) return t.city === cityFilter
    return !specialCategories.includes(t.city)
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const message = `Hello! I'd like to book a Day Tour:\n\n🏛️ Tour: ${formData.selectedTour}\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n📅 Date: ${formData.tourDate}\n👥 Travelers: ${formData.travelers}\n📍 Pickup: ${formData.pickupLocation}\n📝 Notes: ${formData.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(message)}`, '_blank')
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 5000)
  }

  const handleStripeCheckout = async (tour) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carName: tour.title, carId: tour.id, routeFrom: 'Day Tour', routeTo: tour.city, distance: 0, transferDate: formData.tourDate || '', transferTime: '', passengers: formData.travelers || 2, amount: tour.price * (formData.travelers || 2), customerEmail: formData.email || undefined }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { alert('Payment setup failed. Please try via WhatsApp.') }
    finally { setCheckoutLoading(false) }
  }

  const handleViewDetails = (tour) => {
    navigate(`/day-tours/${tour.id}`)
  }

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-secondary-500 overflow-hidden">
        <div className="absolute inset-0 opacity-75"><img src="https://i0.wp.com/egypttimetravel.com/wp-content/uploads/2020/05/Egypt-Time-Travel_0049_Layer-102.jpg?resize=700%2C500&ssl=1" alt="Pyramids of Giza with camel" className="w-full h-full object-cover object-center" /></div>
        <div className="relative container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6"><Link to="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Day Tours</span></nav>
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Private Guided Tours</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Best Egypt Day Tours in 2025</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl">Private guided day tours across Egypt — Pyramids, Luxor, Aswan, Hurghada & more. Expert Egyptologist guides, air-conditioned transport, entrance fees included.</p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Private Tour</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Expert Guide</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Lunch Included</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Hotel Pickup</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Free Cancellation</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-[60px] z-30">
        <div className="container-custom">
          <div className="overflow-x-auto">
            <div className="flex gap-2 py-4 justify-center pb-4 flex-nowrap">
              {[{v:'cairo',l:'Cairo & Giza'},{v:'luxor',l:'Luxor'},{v:'aswan',l:'Aswan'},{v:'hurghada',l:'Hurghada'},{v:'sharm',l:'Sharm El-Sheikh'},{v:'smallgroup',l:'👥 Groups'},{v:'luxury',l:'👑 Luxury'},{v:'christmas',l:'🎄 Christmas'},{v:'easter',l:'🐣 Easter'}].map(c => (
                <Link key={c.v} to={`/day-tours?city=${c.v}`} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${cityFilter === c.v ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}>{c.l} ({tours.filter(t => t.city === c.v).length})</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tours List */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, index) => (
              <motion.div key={tour.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow">
                <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: tour.gallery, index: 0 })}>
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {tour.gallery.length}</div>
                  {tour.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-2">
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{tour.duration}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">{tour.city}</span>
                      <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(tour.rating))}</span>
                      <span className="text-xs text-gray-500">({tour.reviews})</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.title}</h3>
                  </div>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tour.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tour.highlights.slice(0, 3).map(h => (
                      <span key={h} className="inline-flex items-center gap-0.5 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">✓ {h}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-3 py-2 border-t">
                    <div>
                      {tour.originalPrice > tour.price && <span className="text-xs text-gray-400 line-through">${tour.originalPrice}</span>}
                      <div className="text-lg font-bold text-primary-600">${tour.price}</div>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <button onClick={() => handleViewDetails(tour)} className="btn btn-primary text-xs py-2 w-full">
                      View Details
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => { setFormData(p => ({ ...p, selectedTour: tour.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-primary text-xs py-2 flex-1">Book</button>
                      <button onClick={() => handleStripeCheckout(tour)} disabled={checkoutLoading} className="btn bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 flex-1">Pay</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classic Egypt Tours Section */}
      {!cityFilter && (
        <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-50 border-t-4 border-amber-400">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="inline-block text-amber-600 text-sm font-semibold uppercase tracking-wider mb-3">✨ Premium Multi-Day Packages</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Classic Egypt Tours</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Experience ancient Egypt with our premium 3 to 12-day packages. Explore multiple destinations including Cairo, Luxor, Aswan, Alexandria, and pristine beach resorts with luxury accommodations and expert guides.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.filter(t => t.city === 'classic').map((tour, index) => (
                <motion.div key={tour.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow border-t-2 border-amber-500">
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: tour.gallery, index: 0 })}>
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {tour.gallery.length}</div>
                    {tour.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-2 flex-wrap">
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">🌟 {tour.duration}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">Classic</span>
                        <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(tour.rating))}</span>
                        <span className="text-xs text-gray-500">({tour.reviews})</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.title}</h3>
                    </div>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tour.highlights.slice(0, 3).map(h => (
                        <span key={h} className="inline-flex items-center gap-0.5 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">✓ {h}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3 py-2 border-t">
                      <div>
                        {tour.originalPrice > tour.price && <span className="text-xs text-gray-400 line-through">${tour.originalPrice}</span>}
                        <div className="text-lg font-bold text-amber-600">${tour.price}</div>
                        <span className="text-xs text-gray-500">per person</span>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <button onClick={() => handleViewDetails(tour)} className="btn btn-primary text-xs py-2 w-full">
                        View Details
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => { setFormData(p => ({ ...p, selectedTour: tour.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-primary text-xs py-2 flex-1">Book</button>
                        <button onClick={() => handleStripeCheckout(tour)} disabled={checkoutLoading} className="btn bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 flex-1">Pay</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Honeymoon Packages Section */}
      {!cityFilter && (
        <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-50 border-t-4 border-rose-400">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="inline-block text-rose-600 text-sm font-semibold uppercase tracking-wider mb-3">💕 Romantic Getaways</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Egypt Honeymoon Packages</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Create unforgettable memories with your loved one. Our romantic honeymoon packages offer luxury accommodations, exclusive Nile cruises, and intimate experiences in Egypt's most enchanting destinations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.filter(t => t.city === 'honeymoon').map((tour, index) => (
                <motion.div key={tour.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow border-t-2 border-rose-500">
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: tour.gallery, index: 0 })}>
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {tour.gallery.length}</div>
                    {tour.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-2 flex-wrap">
                        <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">❤️ {tour.duration}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">{tour.city}</span>
                        <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(tour.rating))}</span>
                        <span className="text-xs text-gray-500">({tour.reviews})</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.title}</h3>
                    </div>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tour.highlights.slice(0, 3).map(h => (
                        <span key={h} className="inline-flex items-center gap-0.5 text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">✓ {h}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3 py-2 border-t">
                      <div>
                        {tour.originalPrice > tour.price && <span className="text-xs text-gray-400 line-through">${tour.originalPrice}</span>}
                        <div className="text-lg font-bold text-rose-600">${tour.price}</div>
                        <span className="text-xs text-gray-500">per person</span>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <button onClick={() => handleViewDetails(tour)} className="btn btn-primary text-xs py-2 w-full">View Details</button>
                      <div className="flex gap-2">
                        <button onClick={() => { setFormData(p => ({ ...p, selectedTour: tour.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-primary text-xs py-2 flex-1">Book</button>
                        <button onClick={() => handleStripeCheckout(tour)} disabled={checkoutLoading} className="btn bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 flex-1">Pay</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Small Group Tours Section */}
      {!cityFilter && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50 border-t-4 border-blue-400">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="inline-block text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">👥 Group Adventures</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Egypt Small Group Tours</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Travel with like-minded adventurers and enjoy special group rates. Our small group tours offer the perfect balance of social experience and personalized attention with expert local guides.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.filter(t => t.city === 'smallgroup').map((tour, index) => (
                <motion.div key={tour.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow border-t-2 border-blue-500">
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: tour.gallery, index: 0 })}>
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {tour.gallery.length}</div>
                    {tour.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-2 flex-wrap">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">👥 {tour.duration}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">{tour.city}</span>
                        <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(tour.rating))}</span>
                        <span className="text-xs text-gray-500">({tour.reviews})</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.title}</h3>
                    </div>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tour.highlights.slice(0, 3).map(h => (
                        <span key={h} className="inline-flex items-center gap-0.5 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">✓ {h}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3 py-2 border-t">
                      <div>
                        {tour.originalPrice > tour.price && <span className="text-xs text-gray-400 line-through">${tour.originalPrice}</span>}
                        <div className="text-lg font-bold text-blue-600">${tour.price}</div>
                        <span className="text-xs text-gray-500">per person</span>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <button onClick={() => handleViewDetails(tour)} className="btn btn-primary text-xs py-2 w-full">View Details</button>
                      <div className="flex gap-2">
                        <button onClick={() => { setFormData(p => ({ ...p, selectedTour: tour.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-primary text-xs py-2 flex-1">Book</button>
                        <button onClick={() => handleStripeCheckout(tour)} disabled={checkoutLoading} className="btn bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 flex-1">Pay</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Luxury Tours Section */}
      {!cityFilter && (
        <section className="py-16 bg-gradient-to-br from-yellow-50 to-amber-50 border-t-4 border-yellow-500">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="inline-block text-yellow-700 text-sm font-semibold uppercase tracking-wider mb-3">👑 Premium Experiences</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Egypt Luxury Tours</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Indulge in the finest Egypt has to offer. Our luxury tours feature 5-star hotels, premium Nile cruises, exclusive access to archaeological sites, and personalized concierge service for an unforgettable experience.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.filter(t => t.city === 'luxury').map((tour, index) => (
                <motion.div key={tour.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow border-t-2 border-yellow-500">
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: tour.gallery, index: 0 })}>
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {tour.gallery.length}</div>
                    {tour.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-2 flex-wrap">
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">👑 {tour.duration}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">{tour.city}</span>
                        <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(tour.rating))}</span>
                        <span className="text-xs text-gray-500">({tour.reviews})</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.title}</h3>
                    </div>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tour.highlights.slice(0, 3).map(h => (
                        <span key={h} className="inline-flex items-center gap-0.5 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">✓ {h}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3 py-2 border-t">
                      <div>
                        {tour.originalPrice > tour.price && <span className="text-xs text-gray-400 line-through">${tour.originalPrice}</span>}
                        <div className="text-lg font-bold text-yellow-700">${tour.price}</div>
                        <span className="text-xs text-gray-500">per person</span>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <button onClick={() => handleViewDetails(tour)} className="btn btn-primary text-xs py-2 w-full">View Details</button>
                      <div className="flex gap-2">
                        <button onClick={() => { setFormData(p => ({ ...p, selectedTour: tour.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-primary text-xs py-2 flex-1">Book</button>
                        <button onClick={() => handleStripeCheckout(tour)} disabled={checkoutLoading} className="btn bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 flex-1">Pay</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Christmas & New Year Section */}
      {!cityFilter && (
        <section className="py-16 bg-gradient-to-br from-green-50 to-red-50 border-t-4 border-green-500">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="inline-block text-green-600 text-sm font-semibold uppercase tracking-wider mb-3">🎄 Holiday Specials</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Christmas & New Year Packages</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Celebrate the holidays in Egypt! Join thousands of travelers for festive packages that combine cultural exploration with beach relaxation and New Year's celebrations in magical Egyptian settings.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.filter(t => t.city === 'christmas').map((tour, index) => (
                <motion.div key={tour.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow border-t-2 border-green-500">
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: tour.gallery, index: 0 })}>
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {tour.gallery.length}</div>
                    {tour.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-2 flex-wrap">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">🎄 {tour.duration}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">{tour.city}</span>
                        <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(tour.rating))}</span>
                        <span className="text-xs text-gray-500">({tour.reviews})</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.title}</h3>
                    </div>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tour.highlights.slice(0, 3).map(h => (
                        <span key={h} className="inline-flex items-center gap-0.5 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">✓ {h}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3 py-2 border-t">
                      <div>
                        {tour.originalPrice > tour.price && <span className="text-xs text-gray-400 line-through">${tour.originalPrice}</span>}
                        <div className="text-lg font-bold text-green-600">${tour.price}</div>
                        <span className="text-xs text-gray-500">per person</span>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <button onClick={() => handleViewDetails(tour)} className="btn btn-primary text-xs py-2 w-full">View Details</button>
                      <div className="flex gap-2">
                        <button onClick={() => { setFormData(p => ({ ...p, selectedTour: tour.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-primary text-xs py-2 flex-1">Book</button>
                        <button onClick={() => handleStripeCheckout(tour)} disabled={checkoutLoading} className="btn bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 flex-1">Pay</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Easter Tours Section */}
      {!cityFilter && (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 border-t-4 border-purple-500">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="inline-block text-purple-600 text-sm font-semibold uppercase tracking-wider mb-3">🐣 Spring Holidays</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Egypt Easter Tours</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">Experience Easter in Egypt with special holiday packages. Explore ancient wonders during this magical season and enjoy festive celebrations in Cairo, the Nile, and beach resorts.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.filter(t => t.city === 'easter').map((tour, index) => (
                <motion.div key={tour.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow border-t-2 border-purple-500">
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: tour.gallery, index: 0 })}>
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {tour.gallery.length}</div>
                    {tour.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-2 flex-wrap">
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">🐣 {tour.duration}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">{tour.city}</span>
                        <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(tour.rating))}</span>
                        <span className="text-xs text-gray-500">({tour.reviews})</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.title}</h3>
                    </div>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tour.highlights.slice(0, 3).map(h => (
                        <span key={h} className="inline-flex items-center gap-0.5 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">✓ {h}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-3 py-2 border-t">
                      <div>
                        {tour.originalPrice > tour.price && <span className="text-xs text-gray-400 line-through">${tour.originalPrice}</span>}
                        <div className="text-lg font-bold text-purple-600">${tour.price}</div>
                        <span className="text-xs text-gray-500">per person</span>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <button onClick={() => handleViewDetails(tour)} className="btn btn-primary text-xs py-2 w-full">View Details</button>
                      <div className="flex gap-2">
                        <button onClick={() => { setFormData(p => ({ ...p, selectedTour: tour.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn btn-primary text-xs py-2 flex-1">Book</button>
                        <button onClick={() => handleStripeCheckout(tour)} disabled={checkoutLoading} className="btn bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 flex-1">Pay</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section className="py-16 bg-white" id="booking-form">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Book Your Tour</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Request a Day Tour</h2>
            <p className="text-gray-600">Fill in your details — we'll confirm your tour within a few hours</p>
          </div>
          {formSuccess && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center text-green-700 font-medium">✅ Booking request sent! We'll contact you shortly.</div>}
          <form onSubmit={handleFormSubmit} className="bg-gray-50 rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="John Smith" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="john@example.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp</label><input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="+1 234 567 8900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Select Tour *</label>
                <select required value={formData.selectedTour} onChange={e => setFormData(p => ({ ...p, selectedTour: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option value="">Choose a tour</option>{tours.map(t => <option key={t.id} value={t.title}>{t.title} — ${t.price}/person</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Tour Date *</label><input type="date" required value={formData.tourDate} onChange={e => setFormData(p => ({ ...p, tourDate: e.target.value }))} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Travelers *</label>
                <select required value={formData.travelers} onChange={e => setFormData(p => ({ ...p, travelers: Number(e.target.value) }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Hotel / Pickup Location</label><input type="text" value={formData.pickupLocation} onChange={e => setFormData(p => ({ ...p, pickupLocation: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="e.g. Marriott Mena House, Giza" /></div>
            </div>
            <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label><textarea rows={3} value={formData.specialRequests} onChange={e => setFormData(p => ({ ...p, specialRequests: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="Dietary needs, accessibility, extra stops..." /></div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="btn btn-primary flex-1 justify-center text-base py-3.5">📩 Submit Booking Request</button>
              <a href="https://wa.me/201212011881?text=Hi!%20I%27d%20like%20to%20book%20a%20Day%20Tour%20in%20Egypt" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary flex-1 justify-center text-base py-3.5">💬 Book via WhatsApp</a>
            </div>
          </form>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Traveler Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-yellow-400 mb-3">{'★'.repeat(r.rating)}</div>
                <p className="text-gray-600 text-sm italic mb-4">"{r.text}"</p>
                <div className="border-t pt-3"><p className="font-semibold text-gray-900 text-sm">{r.name}</p><p className="text-xs text-gray-500">{r.country} • {r.tour}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">FAQs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <svg className={`w-5 h-5 text-primary-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <AnimatePresence>{openFaq === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t pt-4">{faq.a}</div></motion.div>)}</AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Need a Custom Tour?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">We can design a private day tour to any site in Egypt. Tell us what you want to see!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/201212011881?text=Hi!%20I%20want%20a%20custom%20day%20tour%20in%20Egypt" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">💬 Chat on WhatsApp</a>
            <Link to="/contact" className="btn btn-outline btn-lg">✉️ Contact Us</Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox({ ...lightbox, open: false })}>
            <button className="absolute top-4 right-4 text-white text-3xl hover:text-primary-400 z-50" onClick={() => setLightbox({ ...lightbox, open: false })}>✕</button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-primary-400" onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: (l.index - 1 + l.images.length) % l.images.length })) }}>‹</button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-primary-400" onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: (l.index + 1) % l.images.length })) }}>›</button>
            <img src={lightbox.images[lightbox.index]} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default DayTours