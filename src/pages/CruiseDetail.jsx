import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || ''

// Import the cruises data from NileCruises component
const cruises = [
  {
    id: 'ms-mayfair',
    title: 'MS Mayfair Nile Cruise',
    type: '4-5-night',
    style: 'luxury',
    price: 750,
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800'],
    seoTitle: 'MS Mayfair Nile Cruise - Luxury 4-5 Day Luxor to Aswan',
    seoDescription: 'Experience true luxury exclusively onboard MS Mayfair Nile Cruise, where exceptional services are available on its elegant five floors, coupled with attentive and friendly staff, guarantees you an unparalleled experience in order to enjoy your vacation.',
    highlights: ['Luxor ↔ Aswan Route','4–5 Days / 4–5 Nights','Luxury Accommodations','Valley of Kings Tour','Karnak & Luxor Temples','Philae Temple Visit'],
    description: 'Embark on an unforgettable journey of luxury aboard the MS Mayfair Nile Cruise, a premier vessel offering exceptional service across its five elegant decks. With attentive and friendly staff, indulge in unparalleled comfort and create lasting memories on your Egyptian vacation. Explore more Luxor and Aswan Nile cruise options.',
    cabins: [
      { type: 'Standard Cabin', size: '22 sqm', price: 750, features: ['Nile view window','Twin or double bed','Private bathroom','AC & minibar'] },
      { type: 'Superior Cabin', size: '28 sqm', price: 850, features: ['Panoramic Nile view','King bed','Upgraded bathroom','Private balcony'] },
      { type: 'Deluxe Suite', size: '35 sqm', price: 1050, features: ['Full Nile panorama','Separate living area','Marble bathroom','VIP amenities'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor East Bank', activities: ['Arrival at Luxor City','Meet & assist at the airport or train station for transfer to the cruise','11:00 AM Embarkation','Lunch on board on Nile Cruise','Visit Karnak Temple & Luxor Temple','Dinner onboard on Nile Cruise','Overnight at Luxor'] },
      { day: 'Day 2 – Luxor West Bank – Sail to Edfu', activities: ['Breakfast on board on Nile Cruise','Visit West Bank – Valley of the Kings, Temple of Hatshepsut, and Colossi of Memnon','Lunch on board on Nile Cruise','Sail to Edfu','Dinner onboard on Nile Cruise','Overnight at Edfu'] },
      { day: 'Day 3 – Edfu – Kom Ombo – Sail to Aswan', activities: ['Breakfast on board on Nile Cruise','Visit Temple of Horus in Edfu','Sail to Kom Ombo','Lunch on board on Nile Cruise','Visit Kom Ombo Temple shared by the two gods Sobek and Harris','Dinner onboard on Nile Cruise','Overnight at Aswan'] },
      { day: 'Day 4 – Aswan City Tour', activities: ['Breakfast on board on Nile Cruise','Visit the High Dam – Unfinished Obelisk and the Temple of Philae','Lunch on board on Nile Cruise','Sail on the Nile with Felucca around Kitchener\'s Island','Dinner onboard on Nile Cruise','Overnight at Aswan'] },
      { day: 'Day 5 – Disembarkation', activities: ['08:00 AM Disembarkation after breakfast, then transfer you to the airport or train station'] },
    ],
    included: ['Meet and Assist in the airport or Train Station','Our assistance during your stay and excursions','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights onboard the Nile cruises based on FB basis','Private Egyptologist tour guide','Entry fees to all sites as per itinerary','Complimentary 1 bottle of water per day per person','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.9, reviews: 856, bestSeller: true,
  },
  {
    id: 'al-hambra-nile',
    title: 'Al Hambra Nile Cruise',
    type: '4-5-night',
    style: 'luxury',
    price: 650,
    originalPrice: 800,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Al Hambra Nile Cruise - Comfort & Elegance Luxor-Aswan',
    seoDescription: 'Discover unparalleled luxury on the Al Hambra Nile Cruise, featuring the largest standard suites on the Nile. Designed for VIPs and discerning travelers, this vessel offers a fresh perspective on opulence during your journey between Luxor and Aswan.',
    highlights: ['Luxor to Aswan','4–5 Days / Nights','High-Standard Service','All Major Temples','Spacious Cabins','Full Board Meals'],
    description: 'Discover unparalleled luxury on the Al Hambra Nile Cruise, featuring the largest standard suites on the Nile. Designed for VIPs and discerning travelers, this vessel offers a fresh perspective on opulence during your journey between Luxor and Aswan.',
    cabins: [
      { type: 'Standard Cabin', size: '20 sqm', price: 650, features: ['River view window','Twin beds','Private bathroom','AC'] },
      { type: 'Superior Cabin', size: '26 sqm', price: 750, features: ['Panoramic window','King or twin bed','Upgraded amenities','Private balcony'] },
      { type: 'Suite', size: '40 sqm', price: 950, features: ['Full Nile view','Separate lounge','Marble bath','VIP service'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Embarkation', activities: ['Embark at Luxor (lunch included)','Visit Karnak Temple','Visit Luxor Temple','Dinner with entertainment onboard'] },
      { day: 'Day 2 – West Bank Exploration', activities: ['Valley of the Kings tour (3 tombs)','Temple of Hatshepsut visit','Colossi of Memnon photo stop','Sail to Edfu','Dinner onboard'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Visit Edfu Temple (Horus Temple)','Sail to Kom Ombo','Visit Kom Ombo Temple','Tea & snacks on sun deck'] },
      { day: 'Day 4 – Aswan Highlights', activities: ['Aswan High Dam tour','Philae Temple (boat ride)','Unfinished Obelisk visit','Optional felucca sail','Traditional dinner'] },
      { day: 'Day 5 – Disembarkation', activities: ['Breakfast','Check-out and transfer'] },
    ],
    included: ['Meet and Assist in the airport','Our assistance during your stay','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights onboard the Nile cruises based on FB basis','Private guided tours','Entry fees to all sites as per itinerary','Bottled water during trips','Local SIM card with WIFI','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.8, reviews: 654, bestSeller: false,
  },
  {
    id: 'alyssa-nile',
    title: 'Alyssa Nile Cruise',
    type: '4-5-night',
    style: 'standard',
    price: 500,
    originalPrice: 650,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9c38f4?w=600',
    gallery: ['https://images.unsplash.com/photo-1504280390367-361c6d9c38f4?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Alyssa Nile Cruise - Stylish 4-5 Day Cruise Luxor-Aswan',
    seoDescription: 'Experience the uniqueness of the Alyssa Nile Cruise, where every design, plan, and piece of furniture is exclusively crafted for this vessel. Enjoy the most wonderful Egypt tours with a Nile cruise along the Nile River between Luxor and Aswan, setting it apart from typical Nile cruise ships.',
    highlights: ['Luxor–Aswan Sailing','4–5 Days / Nights','Stylish Design','Desert & Temple Tours','Cultural Immersion','All-Inclusive Package'],
    description: 'Experience the uniqueness of the Alyssa Nile Cruise, where every design, plan, and piece of furniture is exclusively crafted for this vessel. Enjoy the most wonderful Egypt tours with a Nile cruise along the Nile River between Luxor and Aswan, setting it apart from typical Nile cruise ships.',
    cabins: [
      { type: 'Standard Cabin', size: '18 sqm', price: 500, features: ['River view','Twin beds','Ensuite bathroom','AC'] },
      { type: 'Deluxe Cabin', size: '23 sqm', price: 600, features: ['Panoramic window','Queen bed','Modern amenities','Balcony access'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Boarding', activities: ['Embark at Luxor','Lunch onboard','Karnak Temple tour','Luxor Temple sunset visit','Dinner & belly dance show'] },
      { day: 'Day 2 – West Bank Adventure', activities: ['Valley of the Kings exploration','Temple of Hatshepsut','Colossi of Memnon site','Sail to Edfu','Dinner onboard'] },
      { day: 'Day 3 – Edfu to Kom Ombo', activities: ['Edfu Temple tour','Sail toward Kom Ombo','Kom Ombo Temple visit','Sunset on deck','Dinner'] },
      { day: 'Day 4 – Aswan Experiences', activities: ['Philae Temple & High Dam','Unfinished Obelisk','Botanical Garden island (optional)','Nubian culture tour','Farewell dinner'] },
      { day: 'Day 5 – Departure', activities: ['Breakfast','Disembark & transfer'] },
    ],
    included: ['Meet and Assist in the airport or Train Station','Our assistance during your stay and excursions','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights on Nile cruises based on FB basis','Private Egyptologist tour guide','Entry fees to all sites as per itinerary','Complimentary 1 bottle of water per day per person','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.7, reviews: 512, bestSeller: false,
  },
  {
    id: 'sonesta-st-george',
    title: 'Sonesta St. George Nile Cruise',
    type: '4-5-night',
    style: 'luxury',
    price: 810,
    originalPrice: 1000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    gallery: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Sonesta St. George Nile Cruise - French Elegance Luxor-Aswan',
    seoDescription: 'Discover opulent luxury on the Sonesta St. George Nile Cruise, a 5-star vessel embodying French elegance. Featuring 47 deluxe cabins, 9 presidential suites, and one royal suite, all adorned with premium furnishings and amenities, this cruise promises unparalleled comfort and sophistication for your Nile adventure.',
    highlights: ['Luxor to Aswan','4–5 Days / Nights','French Elegance','47 Deluxe Cabins','Presidential Suites','Royal Suite'],
    description: 'Discover opulent luxury on the Sonesta St. George Nile Cruise, a 5-star vessel embodying French elegance. Featuring 47 deluxe cabins, 9 presidential suites, and one royal suite, all adorned with premium furnishings and amenities, this cruise promises unparalleled comfort and sophistication for your Nile adventure.',
    cabins: [
      { type: 'Deluxe Cabin', size: '25 sqm', price: 810, features: ['Nile view','King bed','Marble bathroom','French balcony'] },
      { type: 'Presidential Suite', size: '45 sqm', price: 1200, features: ['Panoramic view','Separate lounge','Jacuzzi','VIP service'] },
      { type: 'Royal Suite', size: '60 sqm', price: 1500, features: ['Full Nile panorama','Private terrace','Butler service','Exclusive amenities'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Embarkation', activities: ['Embark at Luxor','Visit Karnak Temple','Visit Luxor Temple','Welcome dinner'] },
      { day: 'Day 2 – West Bank Tour', activities: ['Valley of the Kings','Temple of Hatshepsut','Colossi of Memnon','Sail to Edfu','Dinner onboard'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Horus Temple in Edfu','Sail to Kom Ombo','Sobek Temple','Sun deck relaxation'] },
      { day: 'Day 4 – Aswan Exploration', activities: ['High Dam & Philae Temple','Unfinished Obelisk','Felucca ride','Cultural show'] },
      { day: 'Day 5 – Disembarkation', activities: ['Breakfast','Transfer to airport/train'] },
    ],
    included: ['Meet and Assist in the airport or Train Station','Our assistance during your stay and excursions','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights on Nile cruises based on FB basis','Private Egyptologist tour guide','Entry fees to all sites as per itinerary','Complimentary 1 bottle of water per day per person','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.8, reviews: 723, bestSeller: false,
  },
  {
    id: 'sonesta-moon-goddess',
    title: 'Sonesta Moon Goddess Nile Cruise',
    type: '4-5-night',
    style: 'luxury',
    price: 810,
    originalPrice: 1000,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Sonesta Moon Goddess Nile Cruise - Enchanting Luxury Nile Voyage',
    seoDescription: 'Immerse yourself in charm and luxury aboard the Sonesta Moon Goddess Nile Cruise, one of Egypt\'s most enchanting luxury vessels. Revel in fantastic comfort and exceptional service as you cruise the Nile, creating unforgettable memories with Egypt Time Travel.',
    highlights: ['Luxor to Aswan','4–5 Days / Nights','Enchanting Luxury','Exceptional Service','Nile Views','Cultural Shows'],
    description: 'Immerse yourself in charm and luxury aboard the Sonesta Moon Goddess Nile Cruise, one of Egypt\'s most enchanting luxury vessels. Revel in fantastic comfort and exceptional service as you cruise the Nile, creating unforgettable memories with Egypt Time Travel.',
    cabins: [
      { type: 'Deluxe Cabin', size: '25 sqm', price: 810, features: ['Nile view','King bed','Marble bathroom','French balcony'] },
      { type: 'Suite', size: '40 sqm', price: 1100, features: ['Panoramic view','Separate lounge','Jacuzzi','VIP amenities'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Start', activities: ['Embarkation','Karnak Temple','Luxor Temple','Dinner with show'] },
      { day: 'Day 2 – West Bank', activities: ['Valley of the Kings','Hatshepsut Temple','Colossi of Memnon','Sail to Edfu'] },
      { day: 'Day 3 – Temples & Sailing', activities: ['Edfu Temple','Kom Ombo Temple','Sun deck time'] },
      { day: 'Day 4 – Aswan Wonders', activities: ['Philae Temple','High Dam','Felucca ride','Farewell dinner'] },
      { day: 'Day 5 – End Journey', activities: ['Breakfast','Disembarkation','Transfer'] },
    ],
    included: ['Meet and Assist in the airport or Train Station','Our assistance during your stay and excursions','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights on Nile cruises based on FB basis','Private Egyptologist tour guide','Entry fees to all sites as per itinerary','Complimentary 1 bottle of water per day per person','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.8, reviews: 689, bestSeller: false,
  },
  {
    id: 'movenpick-royal-lotus',
    title: 'Movenpick Royal Lotus Nile Cruise',
    type: '4-5-night',
    style: 'luxury',
    price: 750,
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    seoTitle: 'Movenpick Royal Lotus Nile Cruise - Popular Luxury Nile Experience',
    seoDescription: 'Join the ranks of satisfied travelers on the highly popular Movenpick Royal Lotus Nile Cruise, renowned for its exceptional luxury and hassle-free vacations. Book your Nile cruise adventure with Egypt Time Travel for an unforgettable experience.',
    highlights: ['Luxor to Aswan','4–5 Days / Nights','Exceptional Luxury','Hassle-Free','Popular Choice','Full Service'],
    description: 'Join the ranks of satisfied travelers on the highly popular Movenpick Royal Lotus Nile Cruise, renowned for its exceptional luxury and hassle-free vacations. Book your Nile cruise adventure with Egypt Time Travel for an unforgettable experience.',
    cabins: [
      { type: 'Standard Cabin', size: '22 sqm', price: 750, features: ['Nile view','Twin beds','Private bath','AC'] },
      { type: 'Superior Cabin', size: '28 sqm', price: 850, features: ['Panoramic view','King bed','Balcony','Mini bar'] },
      { type: 'Suite', size: '35 sqm', price: 1050, features: ['Full panorama','Living area','Jacuzzi','VIP service'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor', activities: ['Embarkation','Karnak Temple','Luxor Temple','Welcome dinner'] },
      { day: 'Day 2 – West Bank', activities: ['Valley of the Kings','Hatshepsut','Colossi','Sail to Edfu'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Horus Temple','Sobek Temple','Sun deck'] },
      { day: 'Day 4 – Aswan', activities: ['High Dam','Philae Temple','Felucca ride'] },
      { day: 'Day 5 – Departure', activities: ['Breakfast','Transfer'] },
    ],
    included: ['Meet and Assist in the airport or Train Station','Our assistance during your stay and excursions','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights on Nile cruises based on FB basis','Private Egyptologist tour guide','Entry fees to all sites as per itinerary','Complimentary 1 bottle of water per day per person','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.7, reviews: 567, bestSeller: false,
  },
  {
    id: 'movenpick-royal-lily',
    title: 'Movenpick Royal Lily Nile Cruise',
    type: '4-5-night',
    style: 'luxury',
    price: 750,
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Movenpick Royal Lily Nile Cruise - Beautiful Nile Views & Ancient Wonders',
    seoDescription: 'Seize the opportunity to admire stunning views of the Nile\'s banks aboard the Movenpick Royal Lily Nile Cruise. Explore the magnificent temples and tombs of ancient Luxor and Aswan, with guest cabins thoughtfully arranged on upper floors featuring interior corridors for added convenience.',
    highlights: ['Luxor to Aswan','4–5 Days / Nights','Stunning Views','Ancient Wonders','Upper Floor Cabins','Interior Corridors'],
    description: 'Seize the opportunity to admire stunning views of the Nile\'s banks aboard the Movenpick Royal Lily Nile Cruise. Explore the magnificent temples and tombs of ancient Luxor and Aswan, with guest cabins thoughtfully arranged on upper floors featuring interior corridors for added convenience.',
    cabins: [
      { type: 'Standard Cabin', size: '22 sqm', price: 750, features: ['Nile view','Twin beds','Private bath','AC'] },
      { type: 'Superior Cabin', size: '28 sqm', price: 850, features: ['Panoramic view','King bed','Balcony','Mini bar'] },
      { type: 'Suite', size: '35 sqm', price: 1050, features: ['Full panorama','Living area','Jacuzzi','VIP service'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor', activities: ['Embarkation','Karnak Temple','Luxor Temple','Welcome dinner'] },
      { day: 'Day 2 – West Bank', activities: ['Valley of the Kings','Hatshepsut','Colossi','Sail to Edfu'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Horus Temple','Sobek Temple','Sun deck'] },
      { day: 'Day 4 – Aswan', activities: ['High Dam','Philae Temple','Felucca ride'] },
      { day: 'Day 5 – Departure', activities: ['Breakfast','Transfer'] },
    ],
    included: ['Meet and Assist in the airport or Train Station','Our assistance during your stay and excursions','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights on Nile cruises based on FB basis','Private Egyptologist tour guide','Entry fees to all sites as per itinerary','Complimentary 1 bottle of water per day per person','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.7, reviews: 534, bestSeller: false,
  },
  {
    id: 'princess-sarah',
    title: 'Princess Sarah Nile Cruise',
    type: '4-5-night',
    style: 'standard',
    price: 450,
    originalPrice: 550,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9c38f4?w=600',
    gallery: ['https://images.unsplash.com/photo-1504280390367-361c6d9c38f4?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Princess Sarah Nile Cruise - Excellent Service & Nile Sunset Views',
    seoDescription: 'Enjoy excellent service and comfort on the Princess Sarah Nile Cruise as you sail through the wonders of Upper Egypt between Luxor and Aswan. Sip drinks while watching sunsets on the Eternal Nile, complemented by nightly entertainment including belly dancing, Galabeya parties, and folklore shows. Explore other Luxor and Aswan Nile cruise options.',
    highlights: ['Luxor to Aswan','4–5 Days / Nights','Excellent Service','Nile Sunsets','Nightly Entertainment','Cultural Shows'],
    description: 'Enjoy excellent service and comfort on the Princess Sarah Nile Cruise as you sail through the wonders of Upper Egypt between Luxor and Aswan. Sip drinks while watching sunsets on the Eternal Nile, complemented by nightly entertainment including belly dancing, Galabeya parties, and folklore shows. Explore other Luxor and Aswan Nile cruise options.',
    cabins: [
      { type: 'Standard Cabin', size: '18 sqm', price: 450, features: ['River view','Twin beds','Private bath','AC'] },
      { type: 'Superior Cabin', size: '24 sqm', price: 550, features: ['Panoramic window','King bed','Balcony','Mini bar'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor', activities: ['Embarkation','Karnak Temple','Luxor Temple','Dinner & show'] },
      { day: 'Day 2 – West Bank', activities: ['Valley of the Kings','Hatshepsut','Colossi','Sail to Edfu'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Horus Temple','Sobek Temple','Sun deck'] },
      { day: 'Day 4 – Aswan', activities: ['High Dam','Philae Temple','Felucca ride','Farewell dinner'] },
      { day: 'Day 5 – Departure', activities: ['Breakfast','Transfer'] },
    ],
    included: ['Meet and Assist in the airport or Train Station','Our assistance during your stay and excursions','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights onboard the Nile cruises based on FB basis','Private Egyptologist tour guide','Entry fees to all sites as per itinerary','Complimentary 1 bottle of water per day per person','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.6, reviews: 423, bestSeller: false,
  },
  {
    id: 'ms-princess-sarah-2',
    title: 'MS Princess Sarah 2 Nile Cruise',
    type: '4-5-night',
    style: 'standard',
    price: 460,
    originalPrice: 560,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    gallery: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'MS Princess Sarah 2 Nile Cruise - Best Services & Immortal Nile Views',
    seoDescription: 'Experience the best services and excellent comfort on the MS Princess Sarah 2 Nile Cruise as you sail through the wonderful wonders of Upper Egypt in Luxor and Aswan. Enjoy drinks while watching sunsets on the immortal Nile, enhanced by numerous nightly entertainment shows. Book now for an unforgettable journey.',
    highlights: ['Luxor to Aswan','4–5 Days / Nights','Best Services','Immortal Nile','Nightly Shows','Unforgettable Journey'],
    description: 'Experience the best services and excellent comfort on the MS Princess Sarah 2 Nile Cruise as you sail through the wonderful wonders of Upper Egypt in Luxor and Aswan. Enjoy drinks while watching sunsets on the immortal Nile, enhanced by numerous nightly entertainment shows. Book now for an unforgettable journey.',
    cabins: [
      { type: 'Standard Cabin', size: '18 sqm', price: 460, features: ['River view','Twin beds','Private bath','AC'] },
      { type: 'Superior Cabin', size: '24 sqm', price: 560, features: ['Panoramic window','King bed','Balcony','Mini bar'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor', activities: ['Embarkation','Karnak Temple','Luxor Temple','Dinner & show'] },
      { day: 'Day 2 – West Bank', activities: ['Valley of the Kings','Hatshepsut','Colossi','Sail to Edfu'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Horus Temple','Sobek Temple','Sun deck'] },
      { day: 'Day 4 – Aswan', activities: ['High Dam','Philae Temple','Felucca ride','Farewell dinner'] },
      { day: 'Day 5 – Departure', activities: ['Breakfast','Transfer'] },
    ],
    included: ['Meet and Assist in the airport or Train Station','Our assistance during your stay and excursions','All transport by private air-conditioned vehicle','Accommodation for 4 or 3 nights onboard the Nile cruises based on FB basis','Private Egyptologist tour guide','Entry fees to all sites as per itinerary','Complimentary 1 bottle of water per day per person','All service charges & taxes'],
    excluded: ['Entry visa to Egypt','Personal expenses','Optional activities','Tipping'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.6, reviews: 398, bestSeller: false,
  },
]

const CruiseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cruise, setCruise] = useState(null)
  const [selectedCabin, setSelectedCabin] = useState(null)
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', nationality: '', 
    cabinType: '', travelDate: '', travelers: 2, specialRequests: '' 
  })
  const [formSuccess, setFormSuccess] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    const foundCruise = cruises.find(c => c.id === id)
    if (foundCruise) {
      setCruise(foundCruise)
      setSelectedCabin(foundCruise.cabins[0])
      setFormData(prev => ({ ...prev, cabinType: foundCruise.cabins[0].type }))
    } else {
      navigate('/nile-cruises')
    }
  }, [id, navigate])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const message = `Hello! I'd like to book a Nile Cruise:\n\n🚢 Cruise: ${cruise.title}\n🛏️ Cabin: ${formData.cabinType}\n💰 Price: $${selectedCabin?.price || cruise.price} per person\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n🌍 Nationality: ${formData.nationality}\n📅 Date: ${formData.travelDate}\n👥 Travelers: ${formData.travelers}\n📝 Notes: ${formData.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(message)}`, '_blank')
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 5000)
  }

  const handleStripeCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carName: cruise.title,
          carId: cruise.id,
          routeFrom: 'Nile Cruise',
          routeTo: cruise.type,
          distance: 0,
          transferDate: formData.travelDate || '',
          transferTime: '',
          passengers: formData.travelers || 2,
          amount: (selectedCabin?.price || cruise.price) * (formData.travelers || 2),
          customerEmail: formData.email || undefined
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Payment setup failed. Please try via WhatsApp.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (!cruise) return null

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-secondary-900 to-secondary-700">
        <div className="absolute inset-0 opacity-20">
          <img src={cruise.gallery[0]} alt={cruise.title} className="w-full h-full object-cover" />
        </div>
        <div className="relative container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/nile-cruises" className="hover:text-white">Nile Cruises</Link>
              <span>/</span>
              <span className="text-white">{cruise.title}</span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-4 py-1.5 bg-primary-500 text-white text-sm font-semibold rounded-full capitalize">{cruise.type}</span>
              {cruise.bestSeller && <span className="inline-block px-4 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full">🔥 Best Seller</span>}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{cruise.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg">{'★'.repeat(Math.floor(cruise.rating))}</span>
                <span className="text-white/80 text-sm">({cruise.reviews} reviews)</span>
              </div>
              <div className="text-white/60">|</div>
              <div className="text-white/80 text-sm">📍 {cruise.highlights[0]}</div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {cruise.highlights.slice(1).map((h, i) => (
                <span key={i} className="bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">{h}</span>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 inline-block">
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Starting from</p>
                  <div className="flex items-baseline gap-3">
                    {cruise.originalPrice > cruise.price && (
                      <span className="text-2xl text-white/50 line-through">${cruise.originalPrice}</span>
                    )}
                    <span className="text-5xl font-bold text-white">${cruise.price}</span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">per person</p>
                </div>
                <div className="ml-8">
                  <button onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary text-lg px-8 py-3">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cruise.gallery.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setLightbox({ open: true, images: cruise.gallery, index: i })}
              >
                <img src={img} alt={`${cruise.title} ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Description & Overview */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>About This Cruise</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{cruise.description}</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-4xl mb-3">🛳️</div>
                <h3 className="font-bold text-gray-900 mb-2">Duration</h3>
                <p className="text-gray-600">{cruise.type.replace('-', ' ').replace('night', 'nights')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-4xl mb-3">🍽️</div>
                <h3 className="font-bold text-gray-900 mb-2">Meals</h3>
                <p className="text-gray-600">{cruise.mealsIncluded}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-bold text-gray-900 mb-2">Rating</h3>
                <p className="text-gray-600">{cruise.rating}/5 ({cruise.reviews} reviews)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>📅 Day-by-Day Itinerary</h2>
            <div className="space-y-6">
              {cruise.itinerary.map((day, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{day.day}</h3>
                      <ul className="space-y-2">
                        {day.activities.map((activity, j) => (
                          <li key={j} className="flex items-start gap-3 text-gray-700">
                            <span className="text-primary-500 mt-1">✓</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cabin Options */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>🛏️ Choose Your Cabin</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {cruise.cabins.map((cabin, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    setSelectedCabin(cabin)
                    setFormData(prev => ({ ...prev, cabinType: cabin.type }))
                  }}
                  className={`bg-white rounded-2xl p-6 cursor-pointer transition-all border-2 ${selectedCabin?.type === cabin.type ? 'border-primary-500 shadow-xl scale-105' : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'}`}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{cabin.type}</h3>
                    <p className="text-sm text-gray-500 mb-3">{cabin.size}</p>
                    <div className="text-4xl font-bold text-primary-600">${cabin.price}</div>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                  <ul className="space-y-2">
                    {cabin.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {selectedCabin?.type === cabin.type && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                      <span className="text-primary-600 font-semibold text-sm">✓ Selected</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Included & Excluded */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-green-500">✓</span> What's Included
                </h2>
                <ul className="space-y-3">
                  {cruise.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-red-500">✕</span> Not Included
                </h2>
                <ul className="space-y-3">
                  {cruise.excluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-500">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-section" className="py-12 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Book Your Cruise</h2>
            <p className="text-gray-600 text-center mb-8">Complete the form below to reserve your Nile cruise adventure</p>

            {formSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
                ✓ Booking request sent! We'll contact you shortly via WhatsApp.
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.nationality}
                    onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.travelDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, travelDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Travelers *</label>
                  <input 
                    type="number" 
                    min="1" 
                    required 
                    value={formData.travelers}
                    onChange={(e) => setFormData(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selected Cabin</label>
                <select 
                  value={formData.cabinType}
                  onChange={(e) => {
                    const cabin = cruise.cabins.find(c => c.type === e.target.value)
                    setSelectedCabin(cabin)
                    setFormData(prev => ({ ...prev, cabinType: e.target.value }))
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {cruise.cabins.map(cabin => (
                    <option key={cabin.type} value={cabin.type}>{cabin.type} - ${cabin.price}/person</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests (Optional)</label>
                <textarea 
                  rows="4"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  placeholder="Any special requirements or requests..."
                ></textarea>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">Selected Cabin:</span>
                  <span className="text-gray-900">{selectedCabin?.type}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">Price per Person:</span>
                  <span className="text-gray-900">${selectedCabin?.price || cruise.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">Number of Travelers:</span>
                  <span className="text-gray-900">{formData.travelers}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Price:</span>
                    <span className="text-3xl font-bold text-primary-600">${(selectedCabin?.price || cruise.price) * formData.travelers}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" className="flex-1 btn btn-primary text-lg py-4">
                  📱 Book via WhatsApp
                </button>
                <button 
                  type="button" 
                  onClick={handleStripeCheckout} 
                  disabled={checkoutLoading}
                  className="flex-1 btn bg-purple-600 hover:bg-purple-700 text-white text-lg py-4 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  {checkoutLoading ? 'Processing...' : 'Pay Online'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Back to Cruises */}
      <section className="py-8 bg-white">
        <div className="container-custom text-center">
          <Link to="/nile-cruises" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold">
            ← View All Nile Cruises
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox({ ...lightbox, open: false })} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 cursor-pointer">
            <button onClick={() => setLightbox({ ...lightbox, open: false })} className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-[10000]">&times;</button>
            <img src={lightbox.images[lightbox.index]} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default CruiseDetail
