import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

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
    seoDescription: 'Al Hambra Nile Cruise: Elegant 4-5 day voyage with high-standard service, spacious cabins, all temples included from $650 per person.',
    highlights: ['Luxor to Aswan','4–5 Days / Nights','High-Standard Service','All Major Temples','Spacious Cabins','Full Board Meals'],
    description: 'The Al Hambra Nile Cruise combines comfort and elegance. Cruise between Luxor and Aswan, exploring the treasures of ancient Egypt, while enjoying high-standard service and spacious cabins with panoramic Nile views.',
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
    included: ['Transfers from airport or hotel','Professional Egyptologist guide','Full board (all meals)','Entrance fees to all temples','Onboard entertainment & shows','Service charges'],
    excluded: ['Personal expenses','Tips (discretionary)','Optional activities','Beverages (extra charge)'],
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
    seoDescription: 'M/Y Alyssa: Stylish Nile cruise with beautifully designed cabins, guided temple tours & Nile sailing. 4-5 days from $500, full meals included.',
    highlights: ['Luxor–Aswan Sailing','4–5 Days / Nights','Stylish Design','Desert & Temple Tours','Cultural Immersion','All-Inclusive Package'],
    description: 'Enjoy stylish cruising with M/Y Alyssa, featuring beautifully designed interiors and guided excursions along the Nile. Perfect for travelers seeking comfort and cultural immersion at an excellent value.',
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
    included: ['Transfers','Professional guide','All entrance fees','Full board meals','Onboard entertainment','Sightseeing activities'],
    excluded: ['Egypt visa','Personal expenses','Tips (optional)','Optional excursions (Abu Simbel)'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.7, reviews: 512, bestSeller: false,
  },
  {
    id: 'sonesta-st-george',
    title: 'Sonesta St. George Nile Cruise',
    type: '4-5-night',
    style: 'luxury',
    price: 810,
    originalPrice: 950,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Sonesta St. George Nile Cruise - French Luxury Cabins',
    seoDescription: 'Sonesta St. George: Luxury French-style cabins, exquisite dining, scenic Nile temples 4-5 days. Premium comfort from $810 per person.',
    highlights: ['French-Style Luxury','Exquisite Dining','Scenic Nile Route','All Temple Visits','Premium Cabins','Exceptional Service'],
    description: 'The Sonesta St. George offers luxury French-style cabins, exquisite dining, and scenic views of the Nile. Sail through Egypt\'s greatest temples with exceptional comfort and world-class service.',
    cabins: [
      { type: 'Deluxe Cabin', size: '24 sqm', price: 810, features: ['French design','King or twin bed','Marble bathroom','Balcony'] },
      { type: 'Junior Suite', size: '34 sqm', price: 950, features: ['Wrap-around view','King bed','Separate lounge','Premium amenities'] },
      { type: 'Sonesta Suite', size: '50 sqm', price: 1200, features: ['Full panorama windows','Master bedroom','Dining area','Concierge service'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Luxury Embarkation', activities: ['Board Sonesta St. George','Welcome champagne reception','Karnak Temple tour','Luxor Temple at sunset','Gala dinner'] },
      { day: 'Day 2 – Valley of the Kings', activities: ['Early West Bank tour','Valley of the Kings (3+ tombs)','Temple of Hatshepsut','Colossi of Memnon','Sail to Edfu','Gourmet lunch & dinner'] },
      { day: 'Day 3 – Kom Ombo Journey', activities: ['Edfu Temple full tour','Kom Ombo Temple visit','Sail through scenic locks','Sunset cocktails','Fine dining'] },
      { day: 'Day 4 – Aswan Finest', activities: ['Philae Temple deluxe tour','High Dam engineering visit','Optional felucca sail','Nubian dinner show','Spa access'] },
      { day: 'Day 5 – Graceful Farewell', activities: ['Breakfast in cabin (optional)','Disembark with memories'] },
    ],
    included: ['Deluxe cabin accommodation','Gourmet breakfast, lunch, dinner','Premium soft drinks & coffee','All entrance fees','Expert Egyptologist guide','Transfers','Entertainment & shows','Spa access'],
    excluded: ['Alcoholic beverages','Tips (customary 50 USD)','Personal expenses','Advanced excursions'],
    mealsIncluded: 'Full Board - Breakfast, Lunch, Dinner',
    rating: 4.9, reviews: 723, bestSeller: true,
  },
  {
    id: 'sonesta-moon-goddess',
    title: 'Sonesta Moon Goddess Nile Cruise',
    type: '4-5-night',
    style: 'luxury',
    price: 810,
    originalPrice: 950,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    gallery: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Sonesta Moon Goddess Nile Cruise - Scenic Luxury 4-5 Days',
    seoDescription: 'Sonesta Moon Goddess: Comfortable luxury cruise with scenic Nile views & guided tours. 4-5 days, full board with entertainment from $810.',
    highlights: ['Scenic Nile Sailing','Luxury Comfort','ALL Temples Included','Full Entertainment','Gourmet Meals','Expert Guides'],
    description: 'A comfortable luxury cruise offering scenic views, full board, and guided tours along the Nile between Luxor and Aswan. Experience Egypt\'s wonders with modern amenities and personalized service.',
    cabins: [
      { type: 'Standard Deluxe', size: '25 sqm', price: 810, features: ['River view window','Queen bed','Modern bathroom','AC & minibar'] },
      { type: 'Superior Deluxe', size: '30 sqm', price: 910, features: ['Panoramic window','King bed','Upgraded decor','Balcony'] },
      { type: 'Nile Suite', size: '42 sqm', price: 1150, features: ['Wraparound windows','Master bedroom','Lounge area','Butler service'] },
    ],
    itinerary: [
      { day: 'Day 1 – Embarkation at Luxor', activities: ['Welcome aboard Sonesta Moon Goddess','Lunch on the Nile','Karnak Temple exploration','Luxor Temple sunset','Captain\'s dinner'] },
      { day: 'Day 2 – West Bank Wonders', activities: ['Early morning West Bank tour','Valley of the Kings','Temple of Hatshepsut','Colossi of Memnon','Navigate to Edfu'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Horus Temple at Edfu','Sailing to Kom Ombo','Crocodile Temple visit','Nubian music evening'] },
      { day: 'Day 4 – Aswan Finale', activities: ['Philae Temple tour','High Dam visit','Unfinished Obelisk','Botanical Garden sailing','Traditional dinner'] },
      { day: 'Day 5 – Disembarkation', activities: ['Final breakfast onboard','Checkout by 09:00','Transfer to airport'] },
    ],
    included: ['4-5 nights luxury cabin','All meals & afternoon tea','Egyptologist guide services','All entrance fees','Transfers','Entertainment nightly','Sailing activities'],
    excluded: ['Beverages (bar service extra)','Personal items','Tips (45 USD suggested)','Optional Abu Simbel','Travel insurance'],
    mealsIncluded: 'Breakfast, Lunch, Dinner - Full Board',
    rating: 4.8, reviews: 634, bestSeller: false,
  },
  {
    id: 'movenpick-royal-lotus',
    title: 'Movenpick Royal Lotus Nile Cruise',
    type: '4-5-night',
    style: 'premium',
    price: 750,
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
    gallery: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Movenpick Royal Lotus - Premium Nile Cruise 4-5 Days',
    seoDescription: 'Movenpick Royal Lotus: Premium cruise, spacious cabins, panoramic Nile views, full sightseeing 4-5 days. Relax & explore from $750 pp.',
    highlights: ['Spacious Premium Cabins','Panoramic Nile Views','Full Board Included','All Major Sites','Relaxation & Sightseeing','Professional Service'],
    description: 'Premium cruise with spacious cabins, panoramic views, and full board, perfect for travelers who want both sightseeing and relaxation. Enjoy comfort while exploring ancient Egypt.',
    cabins: [
      { type: 'Cabin', size: '22 sqm', price: 750, features: ['River view','Twin or double','Ensuite bathroom','AC & minibar'] },
      { type: 'Deluxe Cabin', size: '28 sqm', price: 850, features: ['Panoramic window','King bed','Modern amenities','Private balcony'] },
      { type: 'Suite', size: '38 sqm', price: 1050, features: ['Full Nile panorama','King bed','Lounge area','VIP amenities'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Opening', activities: ['Board at Luxor','Welcome lunch','Karnak Temple tour','Luxor Temple at sunset','Dinner onboard'] },
      { day: 'Day 2 – West Bank Highlights', activities: ['Valley of the Kings','Hatshepsut Temple','Colossi of Memnon','Lunch onboard','Sail to Edfu','Dinner with show'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Edfu Temple','Kom Ombo Temple','Afternoon relaxation','Pool time & spa','Dinner'] },
      { day: 'Day 4 – Aswan Experiences', activities: ['High Dam tour','Philae Temple','Unfinished Obelisk','Felucca sailing','Dinner'] },
      { day: 'Day 5 – Departure', activities: ['Breakfast','Disembark & transfer'] },
    ],
    included: ['4-5 nights in premium cabin','Full board meals','All entrance fees','Guided sightseeing','English-speaking guide','Transfers','Entertainment','Spa access'],
    excluded: ['Tips (40–50 USD)','Personal items','Beverages (extra)','Advanced tours'],
    mealsIncluded: 'Full Board - Breakfast, Lunch, Dinner',
    rating: 4.8, reviews: 589, bestSeller: false,
  },
  {
    id: 'movenpick-royal-lily',
    title: 'Movenpick Royal Lily Nile Cruise',
    type: '4-5-night',
    style: 'premium',
    price: 750,
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Movenpick Royal Lily - Luxury Nile Cruise 4-5 Days',
    seoDescription: 'Movenpick Royal Lily: Luxurious Nile cruising, spacious cabins, panoramic views & guided temple tours 4-5 days from $750 per person.',
    highlights: ['Luxury Nile Cruising','Spacious Cabins','Panoramic Views','All Temple Excursions','Full Board Dining','Premium Amenities'],
    description: 'Experience luxurious Nile cruising aboard the Movenpick Royal Lily with spacious cabins, panoramic Nile views, and expertly guided excursions to major temples.',
    cabins: [
      { type: 'Standard Cabin', size: '21 sqm', price: 750, features: ['River view','Twin or double bed','Bathroom','AC & minibar'] },
      { type: 'Deluxe Cabin', size: '27 sqm', price: 850, features: ['Panoramic window','King bed','Upgraded bath','Balcony'] },
      { type: 'Premium Suite', size: '40 sqm', price: 1050, features: ['Full Nile view','Master bedroom','Lounge','Concierge'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Embarkation', activities: ['Welcome aboard','Lunch on board','Karnak Temple tour','Luxor Temple sunset','Gala dinner'] },
      { day: 'Day 2 – West Bank Exploration', activities: ['Valley of the Kings full tour','Temple of Hatshepsut','Colossi of Memnon','Scenic sail to Edfu','Dinner entertainment'] },
      { day: 'Day 3 – Edfu & Kom Ombo Day', activities: ['Horus Temple at Edfu','Kom Ombo Temple','Afternoon sailings','Pool & spa time','Dinner'] },
      { day: 'Day 4 – Aswan Adventure', activities: ['Philae Temple tour','High Dam engineering','Unfinished Obelisk','Felucca sail experience','Nubian dinner'] },
      { day: 'Day 5 – Graceful Exit', activities: ['Final breakfast','Checkout 09:00','Transfer to airport'] },
    ],
    included: ['4-5 nights premium accommodation','Breakfast, lunch, dinner daily','All entrance fees','Expert guide','Transfers','Entertainment shows','Pool & spa','Sailing excursions'],
    excluded: ['Tips (45–50 USD customary)','Personal expenses','Beverages (bar charge)','Optional tours','Travel insurance'],
    mealsIncluded: 'Breakfast, Lunch, Dinner - Full Board',
    rating: 4.9, reviews: 678, bestSeller: true,
  },
  {
    id: 'princess-sarah',
    title: 'Princess Sarah Nile Cruise',
    type: '4-5-night',
    style: 'standard',
    price: 450,
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    gallery: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'Princess Sarah Nile Cruise - Budget Luxury 4-5 Days',
    seoDescription: 'Princess Sarah: Budget-friendly Nile cruise with scenic sailing, temple visits & entertainment. Comfortable, economical from $450 per person.',
    highlights: ['Budget-Friendly','Scenic Sailing','All Temple Visits','Onboard Entertainment','Full Board Meals','Comfortable Cabins'],
    description: 'Budget-friendly Nile cruise offering scenic sailing, temple visits, and onboard entertainment. Ideal for travelers seeking a comfortable, economical journey through Egypt\'s wonders.',
    cabins: [
      { type: 'Standard Cabin', size: '18 sqm', price: 450, features: ['River view','Twin beds','Ensuite bathroom','AC'] },
      { type: 'Cabin Plus', size: '22 sqm', price: 550, features: ['Panoramic window','Queen bed','Modern amenities','Balcony'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Onboarding', activities: ['Embark at Luxor','Lunch onboard','Karnak Temple visit','Luxor Temple at dusk','Welcome dinner'] },
      { day: 'Day 2 – West Bank Tour', activities: ['Valley of the Kings exploration','Temple of Hatshepsut','Colossi of Memnon','Sail to Edfu','Dinner onboard'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Edfu Temple tour','Kom Ombo Temple','Afternoon free time','Evening entertainment'] },
      { day: 'Day 4 – Aswan Experience', activities: ['High Dam & Philae Temple','Unfinished Obelisk','Botanical Garden (optional)','Traditional dinner'] },
      { day: 'Day 5 – Departure', activities: ['Breakfast','Disembark & transfer'] },
    ],
    included: ['4-5 nights accommodation','All meals onboard','Guide services','Temple entrance fees','Transfers','Entertainment shows'],
    excluded: ['Personal expenses','Tips (optional)','Beverages (extra)','Optional excursions','Travel insurance'],
    mealsIncluded: 'Breakfast, Lunch, Dinner - Full Board',
    rating: 4.6, reviews: 445, bestSeller: false,
  },
  {
    id: 'ms-princess-sarah-2',
    title: 'MS Princess Sarah 2 Nile Cruise',
    type: '4-5-night',
    style: 'standard',
    price: 460,
    originalPrice: 610,
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600',
    gallery: ['https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: 'MS Princess Sarah 2 - Family Nile Cruise 4-5 Days',
    seoDescription: 'MS Princess Sarah 2: Family-friendly Nile cruise with full board, guided visits & scenic sailing 4-5 days. Great value from $460 per person.',
    highlights: ['Family-Friendly','Comfortable Cabins','Full Board Meals','Guided Site Visits','Scenic Sailing','Group Discounts'],
    description: 'Comfortable Nile cruise ideal for families or groups, with full board, guided visits to major monuments, and scenic sailing through Egypt\'s heartland.',
    cabins: [
      { type: 'Standard Cabin', size: '19 sqm', price: 460, features: ['River view','Twin beds','Ensuite bathroom','AC'] },
      { type: 'Deluxe Cabin', size: '24 sqm', price: 560, features: ['Panoramic view','Queen bed','Modern decor','Balcony'] },
      { type: 'Family Cabin', size: '35 sqm', price: 750, features: ['Separate sleeping areas','Queen + twin','Lounge','Family amenities'] },
    ],
    itinerary: [
      { day: 'Day 1 – Luxor Welcome', activities: ['Embark at Luxor','Lunch onboard','Karnak Temple guided tour','Luxor Temple sunset','Welcome dinner & animations'] },
      { day: 'Day 2 – West Bank Adventure', activities: ['Valley of the Kings (3+ tombs)','Temple of Hatshepsut','Colossi of Memnon photo','Sail to Edfu','Family dinner'] },
      { day: 'Day 3 – Edfu & Kom Ombo', activities: ['Horus Temple at Edfu','Kom Ombo Temple tour','Afternoon swimming','Kids entertainment','Dinner'] },
      { day: 'Day 4 – Aswan Family Day', activities: ['High Dam tour','Philae Temple (boat ride)','Unfinished Obelisk','Nubian village visit','Family entertainment'] },
      { day: 'Day 5 – Checkout', activities: ['Breakfast onboard','Family checkout by 09:00','Transfer to airport/hotel'] },
    ],
    included: ['4-5 nights family accommodation','All meals for family','Professional guide','All entrance fees','Family transfers','Entertainment programs','Kids activities'],
    excluded: ['Personal items','Tips (optional)','Beverages (extra)','Advanced excursions (Abu Simbel)'],
    mealsIncluded: 'Breakfast, Lunch, Dinner - Full Board for All',
    rating: 4.7, reviews: 521, bestSeller: false,
  },
]

const honeymoonPackages = [
  {
    id: 'cairo-hurghada-6d',
    title: '6 Days Honeymoon Package to Cairo & Hurghada',
    type: '6-day',
    style: 'romantic',
    price: 670,
    originalPrice: 850,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
    seoTitle: '6 Days Honeymoon Package to Cairo & Hurghada - Romantic Egypt',
    seoDescription: "Experience a romantic 6-day honeymoon in Egypt. Explore Cairo's ancient wonders - Pyramids, Sphinx, museums - then relax on Red Sea beaches in Hurghada. Perfect for couples.",
    highlights: ['Pyramids of Giza','Cairo Museum','Saqqara & Step Pyramid','Red Sea Resort','Beach Activities','All Meals Included'],
    description: 'Enjoy the magic of Cairo and the beauty of the Red Sea on this perfect honeymoon getaway. Visit the iconic pyramids, explore ancient sites, then unwind on pristine beaches in Hurghada.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Airport arrival & transfer','Hotel check-in','Nile riverside dinner','Overnight in Cairo'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Giza Pyramids tour','Great Sphinx photo stop','Saqqara Step Pyramid','Egyptian Museum','Relaxing evening'] },
      { day: 'Day 3 – Old Cairo', activities: ['Old Cairo historic tour','Islamic Cairo mosques','Khan El Khalili bazaar','Dinner cruise on Nile'] },
      { day: 'Day 4 – Cairo to Hurghada', activities: ['Flight to Hurghada','Resort check-in','Beach relaxation','Sunset on the water'] },
      { day: 'Day 5 – Hurghada Beach', activities: ['Snorkeling adventure','Water sports','Spa treatments','Beach dinner'] },
      { day: 'Day 6 – Departure', activities: ['Final beach time','Flight back to Cairo','Airport transfer'] },
    ],
    included: ['4 nights Cairo hotel','1 night Hurghada resort','All breakfasts & select meals','Cairo sightseeing tours','Airport transfers','Nile dinner cruise'],
    excluded: ['International flights','Visa','Optional activities','Alcoholic beverages'],
    mealsIncluded: 'Breakfast, Select Meals',
    rating: 4.8, reviews: 342, bestSeller: true,
  },
  {
    id: 'cairo-nile-8d',
    title: '8 Days Egypt Honeymoon Trip (Cairo & Nile Cruise)',
    type: '8-day',
    style: 'romantic',
    price: 1460,
    originalPrice: 1850,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    gallery: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: '8 Days Egypt Honeymoon - Cairo & Nile Cruise Luxury',
    seoDescription: "Discover ancient Egypt on this romantic 8-day journey. Experience Cairo's pyramids and museums, then sail the Nile exploring Luxor, Aswan, temples and historical sites.",
    highlights: ['Pyramids & Sphinx','Cairo Museum','5-Night Nile Cruise','Valley of Kings','Luxor & Aswan','All Inclusive'],
    description: "The ultimate romantic Egyptian adventure combining Cairo's ancient treasures with a luxurious 5-night Nile cruise exploring the temples of Luxor, Aswan, and Philae Temple.",
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Airport arrival','Hotel check-in','Nile dinner cruise','Overnight Cairo'] },
      { day: 'Day 2 – Cairo Exploration', activities: ['Pyramids of Giza tour','Sphinx & Saqqara','Egyptian Museum','Free evening'] },
      { day: 'Day 3 – Cairo to Luxor', activities: ['Flight to Luxor','Cruise embarkation','Karnak Temple','Luxor Temple sunset'] },
      { day: 'Day 4 – West Bank', activities: ['Valley of Kings tour','Hatshepsut Temple','Colossi of Memnon','Sail to Edfu'] },
      { day: 'Day 5 – Edfu & Kom Ombo', activities: ['Horus Temple Edfu','Kom Ombo Temple','Evening entertainment'] },
      { day: 'Day 6 – Aswan', activities: ['Philae Temple','High Dam','Felucca sailing','Local market'] },
      { day: 'Day 7 – More Aswan', activities: ['Nubian culture tour','Botanical gardens','Relaxation time'] },
      { day: 'Day 8 – Departure', activities: ['Final breakfast','Flight back'] },
    ],
    included: ['3 nights Cairo','5 nights luxury cruise','All meals','Guide services','All entrance fees','Transfers'],
    excluded: ['Visa','International flights','Tips','Abu Simbel extra'],
    mealsIncluded: 'Full Board - Breakfast, Lunch, Dinner',
    rating: 4.9, reviews: 487, bestSeller: true,
  },
  {
    id: 'pyramids-nile-hurghada-12d',
    title: '12 Days Pyramids, Nile & Hurghada for Honeymooners',
    type: '12-day',
    style: 'romantic',
    price: 1540,
    originalPrice: 1950,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
    seoTitle: '12 Days Pyramids, Nile & Hurghada Honeymoon Experience',
    seoDescription: '12-day ultimate honeymoon: Cairo pyramids, Nile cruise between Luxor & Aswan, and romantic Red Sea resort in Hurghada. All-inclusive romantic getaway.',
    highlights: ['Historic Cairo','7-Night Nile Cruise','Valley of Kings','Temple Tours','Red Sea Beach','Relaxation & Sightseeing'],
    description: 'Experience the complete Egyptian honeymoon: ancient monuments in Cairo, cultural treasures on an extended Nile cruise, and beach romance in Hurghada.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Airport greeting','Hotel check-in','Welcome dinner','Rose petal surprise'] },
      { day: 'Day 2 – Great Pyramids', activities: ['Giza Pyramids day tour','Sphinx visit','Saqqara exploration','Museum visit'] },
      { day: 'Day 3 – Old Cairo', activities: ['Historic Cairo tour','Islamic architecture','Khan El Khalili bazaar','Nile cruise'] },
      { day: 'Day 4 – Flight & Embark', activities: ['Flight to Luxor','Cruise embarkation','Temple tours','Welcome dinner'] },
      { day: 'Day 5 – West Bank', activities: ['Valley of Kings','Hatshepsut Temple','Colossi','Sail to Edfu'] },
      { day: 'Day 6 – Edfu & Kom Ombo', activities: ['Horus Temple','Kom Ombo Temple','Sailing afternoon'] },
      { day: 'Day 7 – Aswan City', activities: ['Philae Temple','High Dam','Unfinished Obelisk','Felucca sail'] },
      { day: 'Day 8 – Cruise Day', activities: ['Relaxation onboard','Culture activities','Sunset deck tea'] },
      { day: 'Day 9 – Return Sail', activities: ['Return sailing','Temples revisit','Entertainment'] },
      { day: 'Day 10 – Hurghada Arrival', activities: ['Flight to Hurghada','Resort check-in','Beach sunset','Romantic dinner'] },
      { day: 'Day 11 – Beach Romance', activities: ['Snorkeling & diving','Spa for two','Water sports','Nightlife'] },
      { day: 'Day 12 – Departure', activities: ['Final beach morning','Airport transfer'] },
    ],
    included: ['3 nights Cairo','7 nights cruise','2 nights Hurghada','All meals','Tours & guides','Transfers'],
    excluded: ['Flights','Visa','Tips','Premium beverages'],
    mealsIncluded: 'Full Board Throughout',
    rating: 4.9, reviews: 512, bestSeller: true,
  },
  {
    id: 'cairo-nile-7day-flight',
    title: '7 Days Romantic Trip to Cairo & Nile Cruise by Flight',
    type: '7-day',
    style: 'romantic',
    price: 1190,
    originalPrice: 1550,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
    gallery: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: '7 Days Romantic Cairo & Nile Cruise By Flight Experience',
    seoDescription: "Romantic 7-day Egyptian journey: explore Cairo's wonders, sail the historic Nile between Luxor & Aswan visiting temples, valleys, and pharaonic treasures.",
    highlights: ['Pyramids & Cairo','Upper Egypt Flight','Luxor & Aswan','Temple Tours','Luxury Cruise','Professional Guide'],
    description: "Experience romance on the immortal Nile. Visit Cairo's greatest monuments, then fly to Upper Egypt for a magical cruise past ancient temples and archaeological wonders.",
    itinerary: [
      { day: 'Day 1 – Cairo Welcome', activities: ['Arrival & hotel','Nile dinner cruise','City lights','Romantic evening'] },
      { day: 'Day 2 – Pyramids Day', activities: ['Giza pyramids','Sphinx','Step Pyramid','Cairo Museum'] },
      { day: 'Day 3 – Cairo Culture', activities: ['Old Cairo walking tour','Islamic museums','Bazaar shopping','Free evening'] },
      { day: 'Day 4 – Flight to Luxor', activities: ['Morning flight','Cruise embarkation','Karnak & Luxor temples','Sunset dinner'] },
      { day: 'Day 5 – West Bank & Sailing', activities: ['Valley of Kings','Hatshepsut','Sail toward Aswan'] },
      { day: 'Day 6 – Aswan Highlights', activities: ['High Dam visit','Philae Temple','Nubian market','Felucca sail'] },
      { day: 'Day 7 – Departure', activities: ['Breakfast','Transfer to airport'] },
    ],
    included: ['3 nights Cairo','3 nights cruise','Domestic flight','All meals','Guided tours','Transfers'],
    excluded: ['International flight','Visa','Personal items','Tips'],
    mealsIncluded: 'Breakfast, Lunch, Dinner',
    rating: 4.8, reviews: 398, bestSeller: true,
  },
  {
    id: 'cairo-alexandria-nile-9d',
    title: '9 Days Cairo, Alexandria & Nile Cruise',
    type: '9-day',
    style: 'romantic',
    price: 1410,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
    gallery: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: '9 Days Cairo, Alexandria & Nile Cruise - Complete Egypt',
    seoDescription: '9-day complete Egypt experience: Cairo\'s pyramids, Alexandria\'s Mediterranean charm, and Nile cruise to Luxor & Aswan. Ultimate honeymoon journey.',
    highlights: ['Cairo Wonders','Mediterranean City','6-Night Cruise','Luxor Temples','Aswan Beauty','Beach & Culture'],
    description: 'Combine Cairo\'s ancient wonders, Alexandria\'s Mediterranean charm, and a memorable Nile cruise exploring Upper Egypt\'s greatest temples and monuments.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Airport reception','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Pyramids Tour', activities: ['Giza pyramids','Sphinx & Saqqara','Museum visit'] },
      { day: 'Day 3 – Cairo Exploration', activities: ['Old Cairo historic','Islamic markets','Nile sunset cruise'] },
      { day: 'Day 4 – Alexandria Day', activities: ['Train to Alexandria','Mediterranean tour','Catacombs','Citadel visit'] },
      { day: 'Day 5 – Back to Cairo', activities: ['Return to Cairo','Relaxation day','Free evening'] },
      { day: 'Day 6 – Flight to Luxor', activities: ['Flight to Upper Egypt','Cruise embarkation','Temple tours'] },
      { day: 'Day 7 – Sailing', activities: ['Valley of Kings','Hatshepsut Temple','Sail to Aswan'] },
      { day: 'Day 8 – Aswan Days', activities: ['High Dam','Philae Temple','Felucca sailing'] },
      { day: 'Day 9 – Departure', activities: ['Final breakfast','Disembark'] },
    ],
    included: ['2 nights Cairo','1 night Alexandria','5 nights cruise','All meals','Tours','Transfers','Train tickets'],
    excluded: ['Visa','Flights','Tips','Premium activities'],
    mealsIncluded: 'Full Board',
    rating: 4.8, reviews: 456, bestSeller: true,
  },
  {
    id: 'cairo-sharm-5day',
    title: '5 Days Cairo & Sharm El Sheikh Honeymoon Tour',
    type: '5-day',
    style: 'romantic',
    price: 780,
    originalPrice: 1000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800','https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'],
    seoTitle: '5 Days Cairo & Sharm El Sheikh Honeymoon Package',
    seoDescription: 'Perfect short honeymoon: explore Cairo\'s pyramids in 2 days, then relax in Sharm El Sheikh. Snorkeling, diving, beach romance - all in 5 days.',
    highlights: ['Cairo Pyramids','Sharm Beach','Snorkeling & Diving','Resort Relaxation','Water Sports','Perfect Honeymoon Length'],
    description: 'Short but perfect honeymoon combining Cairo\'s archaeological wonders with Sharm El Sheikh\'s Red Sea resort experience and water sports.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival greeting','Hotel check-in','City tour','Dinner'] },
      { day: 'Day 2 – Pyramids & History', activities: ['Pyramids tour','Sphinx visit','Saqqara','Museum'] },
      { day: 'Day 3 – Sharm Journey', activities: ['Flight to Sharm','Resort check-in','Beach sunset','Romantic dinner'] },
      { day: 'Day 4 – Water Adventure', activities: ['Snorkeling trip','Diving option','Beach spa','Nightlife'] },
      { day: 'Day 5 – Beach & Depart', activities: ['Final beach morning','Airport transfer'] },
    ],
    included: ['2 nights Cairo','2 nights Sharm resort','Breakfast & select meals','Cairo tour','Transfers','Domestic flight'],
    excluded: ['International flights','Visa','Water sports extras','Tips'],
    mealsIncluded: 'Breakfast, Select Dinners',
    rating: 4.7, reviews: 289, bestSeller: true,
  },
  {
    id: 'cairo-4day-short',
    title: '4 Days Short Cairo Tour Package for Honeymooners',
    type: '4-day',
    style: 'romantic',
    price: 400,
    originalPrice: 550,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
    seoTitle: '4 Days Short Cairo Tour Package for Honeymooners',
    seoDescription: 'Quick romantic Cairo getaway for honeymooners. Visit Pyramids of Giza, Sphinx, Saqqara, Egyptian Museum, and enjoy the famous Sound & Light Show.',
    highlights: ['Pyramids of Giza','Great Sphinx','Saqqara','Egyptian Museum','Sound & Light Show'],
    description: 'Perfect for time-limited honeymooners. Explore Cairo\'s greatest monuments in just 4 days including the iconic pyramids, sphinx, ancient tombs, and museum treasures.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival greeting','Hotel check-in','Rest','Dinner'] },
      { day: 'Day 2 – Pyramids Day', activities: ['Giza Pyramids tour','Great Sphinx','Saqqara Temple','Egyptian Museum'] },
      { day: 'Day 3 – Cairo Wonders', activities: ['Old Cairo historic areas','Islamic monuments','Khan El Khalili bazaar','Sound & Light Show'] },
      { day: 'Day 4 – Departure', activities: ['Final breakfast','Airport transfer'] },
    ],
    included: ['3 nights hotel','Breakfast','Cairo tour guide','Entrance fees','Transfers','Sound & Light ticket'],
    excluded: ['International flights','Visa','Meals (except breakfast)','Tips'],
    mealsIncluded: 'Breakfast Daily',
    rating: 4.6, reviews: 234, bestSeller: false,
  },
  {
    id: 'cairo-private-5day',
    title: '5 Days Cairo Tour Package – Private Honeymoon Tour',
    type: '5-day',
    style: 'romantic',
    price: 520,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: '5 Days Cairo Private Honeymoon Tour Package',
    seoDescription: 'Exclusive 5-day private Cairo honeymoon tour. Pyramids of Giza, Old Cairo, Salah El Din Citadel, and romantic Felucca sailing on the Nile River.',
    highlights: ['Pyramids of Giza','Old Cairo','Salah El Din Citadel','Nile River Views','Felucca Sailing','Private Service'],
    description: 'Intimate private honeymoon tour of Cairo. Experience the pyramids, historic citadels, and romantic Felucca sailing on the Nile with personalized service.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Airport greeting','Private transfer','Hotel check-in','Romantic dinner'] },
      { day: 'Day 2 – Pyramids & History', activities: ['Private Pyramids tour','Sphinx visit','Saqqara exploration','Museum visit','Dinner'] },
      { day: 'Day 3 – Cairo Culture', activities: ['Salah El Din Citadel','Old Cairo walk','Islamic architecture','Bazaar shopping'] },
      { day: 'Day 4 – Nile Romance', activities: ['Felucca sailing','Sunset on Nile','Local market visit','Romantic dinner'] },
      { day: 'Day 5 – Departure', activities: ['Final breakfast','Private airport transfer'] },
    ],
    included: ['4 nights luxury hotel','Private guide','All entrance fees','Private transfers','Felucca sailing','Breakfasts & dinners'],
    excluded: ['International flights','Visa','Lunch meals','Tips'],
    mealsIncluded: 'Breakfast, Dinner',
    rating: 4.8, reviews: 267, bestSeller: false,
  },
  {
    id: 'cairo-nile-6day',
    title: '6 Days Cairo & Nile Cruise Honeymoon Tour Package',
    type: '6-day',
    style: 'romantic',
    price: 1070,
    originalPrice: 1350,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
    gallery: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: '6 Days Cairo & Nile Cruise Honeymoon Tour',
    seoDescription: "Romantic 6-day tour combining Cairo's archaeological treasures with a Nile cruise. Discover ancient Egyptian civilization through picturesque Nile sailing.",
    highlights: ['Cairo Archaeological Sites','Egyptian Civilization','Nile Cruise','Upper Egypt','Temple Visits','Luxury Experience'],
    description: "Discover the greatness of ancient Egypt in just 6 days. Visit Cairo's best sites then sail the Nile exploring Upper Egypt's archaeological wonders.",
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Hotel check-in','Nile dinner cruise','Welcome reception'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Pyramids tour','Egyptian Museum','Old Cairo','Bazaar'] },
      { day: 'Day 3 – Flight & Cruise', activities: ['Flight to Luxor','Cruise embarkation','Karnak Temple','Luxor Temple'] },
      { day: 'Day 4 – Nile Sailing', activities: ['West Bank tour','Sail to Edfu','Temple visits'] },
      { day: 'Day 5 – Aswan Journey', activities: ['Sail to Aswan','High Dam','Philae Temple','Felucca sail'] },
      { day: 'Day 6 – Return', activities: ['Flight back','Airport transfer'] },
    ],
    included: ['2 nights Cairo','3 nights cruise','Flight to Luxor','All meals','Guides','Entrance fees'],
    excluded: ['International flights','Visa','Tips','Abu Simbel extra'],
    mealsIncluded: 'Full Board',
    rating: 4.7, reviews: 301, bestSeller: false,
  },
  {
    id: 'cairo-sleeper-8day',
    title: '8 Days Honeymoon Trip to Cairo & Nile Cruise by Sleeper Train',
    type: '8-day',
    style: 'romantic',
    price: 1010,
    originalPrice: 1350,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    gallery: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: '8 Days Cairo & Nile Cruise Honeymoon by Sleeper Train',
    seoDescription: '8-day romantic honeymoon using scenic sleeper train. Cairo attractions, Nile cruise between Luxor & Aswan, and exploration of famous temples.',
    highlights: ['Cairo Attractions','Sleeper Train Journey','Nile Cruise','Luxor Temples','Aswan Beauty','Philae Temple'],
    description: "Romantic 8-day journey with scenic sleeper train rides. Tour Cairo's historical sites and cruise the Nile exploring Luxor's Valley of Kings and Aswan's temples.",
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Dinner'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Pyramids tour','Egyptian Museum','Saqqara','Free time'] },
      { day: 'Day 3 – Sleeper Train', activities: ['Evening sleeper train to Aswan','Romantic night travel'] },
      { day: 'Day 4 – Aswan', activities: ['Aswan city tour','High Dam','Nubian market','Evening sail'] },
      { day: 'Day 5 – Nile Cruise', activities: ['Cruise to Luxor','West Bank tour','Sail journey'] },
      { day: 'Day 6 – Luxor Day', activities: ['Valley of Kings','Hatshepsut Temple','Temple visits'] },
      { day: 'Day 7 – Cruise Relaxation', activities: ['Onboard activities','Pool time','Sunset deck'] },
      { day: 'Day 8 – Return', activities: ['Final activities','Return to Cairo','Airport transfer'] },
    ],
    included: ['2 nights Cairo','Sleeper train','5 nights cruise','Meals','Guides','Transfers'],
    excluded: ['Visa','International flights','Tips','Premium beverages'],
    mealsIncluded: 'Full Board',
    rating: 4.7, reviews: 278, bestSeller: false,
  },
  {
    id: 'cairo-luxor-hurghada-8d',
    title: '8 Days Cairo, Luxor & Hurghada Honeymooners Package',
    type: '8-day',
    style: 'romantic',
    price: 1060,
    originalPrice: 1380,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800','https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'],
    seoTitle: '8 Days Cairo, Luxor & Hurghada Honeymoon Package',
    seoDescription: '8-day package combining historic Cairo pyramids, temple-rich Luxor, and Red Sea resort bliss in Hurghada. Perfect honeymoon balance.',
    highlights: ['Cairo Landmarks','Luxor Highlights','Red Sea Beach','Historic Sites','Beach Activities','Complete Experience'],
    description: 'Experience the perfect blend of history and relaxation. Explore Cairo\'s pyramids and Luxor\'s temples, then unwind on Hurghada\'s pristine Red Sea beaches.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Nile dinner'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Pyramids of Giza','Egyptian Museum','Saqqara','Cairo historic tour'] },
      { day: 'Day 3 – Flight to Luxor', activities: ['Flight to Luxor','Karnak Temple','Luxor Temple','Welcome dinner'] },
      { day: 'Day 4 – West Bank', activities: ['Valley of Kings','Hatshepsut Temple','Colossi of Memnon'] },
      { day: 'Day 5 – Flight to Hurghada', activities: ['Flight to Hurghada','Resort check-in','Beach time','Sunset dinner'] },
      { day: 'Day 6 – Beach Activities', activities: ['Snorkeling adventure','Water sports','Spa treatments'] },
      { day: 'Day 7 – Beach Relaxation', activities: ['Beach time','Swimming','Diving option','Nightlife'] },
      { day: 'Day 8 – Departure', activities: ['Final beach time','Airport transfer'] },
    ],
    included: ['2 nights Cairo','2 nights Luxor','3 nights Hurghada','All flights','Meals','Tours','Transfers'],
    excluded: ['Visa','International flights','Tips','Water sports extras'],
    mealsIncluded: 'Full Board',
    rating: 4.7, reviews: 345, bestSeller: false,
  },
  {
    id: 'cairo-alexandria-nile-8d',
    title: '8 Days Tour Package to Cairo, Alexandria & Nile by Flight',
    type: '8-day',
    style: 'romantic',
    price: 1330,
    originalPrice: 1750,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
    gallery: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: '8 Days Cairo, Alexandria & Nile Cruise Honeymoon',
    seoDescription: '8-day romantic tour of Cairo\'s wonders, Alexandria\'s Mediterranean charm, and Nile cruise between Luxor & Aswan visiting famous temples.',
    highlights: ['Pyramids & Temples','Valley of Kings','Karnak Temple','Luxor Temple','Philae Temple','Mediterranean Alexandria'],
    description: "Epic 8-day Egyptian adventure visiting Cairo's pyramids, Alexandria's coast, and sailing the Nile past Luxor and Aswan's magnificent temples.",
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Pyramids of Giza','Salahuddin Castle','Cairo Museum'] },
      { day: 'Day 3 – Alexandria', activities: ['Train to Alexandria','Catacombs visit','Citadel tour','Beach time'] },
      { day: 'Day 4 – Back to Cairo', activities: ['Train back to Cairo','Relaxation','Dinner'] },
      { day: 'Day 5 – Flight & Cruise', activities: ['Flight to Luxor','Cruise embarkation','Temple tours'] },
      { day: 'Day 6 – Sailing', activities: ['Valley of Kings','West Bank tour','Sail to Aswan'] },
      { day: 'Day 7 – Aswan', activities: ['High Dam','Philae Temple','Unfinished Obelisk','Felucca sail'] },
      { day: 'Day 8 – Return', activities: ['Flight to Cairo','Airport transfer'] },
    ],
    included: ['2 nights Cairo','1 night Alexandria','4 nights cruise','Train tickets','Flights','All meals','Guides'],
    excluded: ['International flights','Visa','Tips','Premium activities'],
    mealsIncluded: 'Full Board',
    rating: 4.8, reviews: 412, bestSeller: false,
  },
  {
    id: 'cairo-nile-9day',
    title: '9 Days Cairo & Nile Cruise – Egypt Honeymoon',
    type: '9-day',
    style: 'romantic',
    price: 1220,
    originalPrice: 1600,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
    gallery: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    seoTitle: '9 Days Cairo & Nile Cruise Egypt Honeymoon',
    seoDescription: '9 days of pure Egyptian romance. Cairo\'s finest attractions and a complete Nile cruise between Luxor & Aswan visiting all major temples and sites.',
    highlights: ['Cairo Sightseeing','Nile Cruise','Luxor Attractions','Aswan Beauty','Temple Visits','All-Inclusive'],
    description: "Nine-day romantic Egyptian experience. Explore Cairo's treasures thoroughly, then cruise the Nile discovering Luxor and Aswan's greatest monuments.",
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Orientation'] },
      { day: 'Day 2 – Pyramids Day', activities: ['Giza Pyramids','Sphinx','Saqqara','Egyptian Museum'] },
      { day: 'Day 3 – Cairo Culture', activities: ['Old Cairo walk','Islamic monuments','Khan El Khalili'] },
      { day: 'Day 4 – Flight to Luxor', activities: ['Flight to Luxor','Cruise embarkation','Karnak & Luxor temples'] },
      { day: 'Day 5 – West Bank', activities: ['Valley of Kings','Hatshepsut Temple','Colossi of Memnon'] },
      { day: 'Day 6 – Sailing', activities: ['Sail to Edfu','Horus Temple','Edfu exploration'] },
      { day: 'Day 7 – Kom Ombo', activities: ['Kom Ombo Temple','Crocodile Museum','Evening entertainment'] },
      { day: 'Day 8 – Aswan', activities: ['Aswan High Dam','Philae Temple','Unfinished Obelisk','Felucca sail'] },
      { day: 'Day 9 – Return', activities: ['Final breakfast','Flight back','Airport transfer'] },
    ],
    included: ['2 nights Cairo','6 nights cruise','Domestic flight','All meals','All guides','All entrance fees'],
    excluded: ['International flights','Visa','Tips','Abu Simbel extra'],
    mealsIncluded: 'Full Board',
    rating: 4.8, reviews: 389, bestSeller: false,
  },
  {
    id: 'cairo-alexandria-nile-10d',
    title: '10 Days Honeymoon Cairo, Alexandria & Cruise Tour Package',
    type: '10-day',
    style: 'romantic',
    price: 1650,
    originalPrice: 2100,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
    gallery: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
    seoTitle: '10 Days Cairo, Alexandria & Nile Cruise Honeymoon Package',
    seoDescription: '10-day luxury honeymoon: Cairo antiquities, Alexandria Mediterranean, and scenic Nile cruise between Luxor & Aswan discovering ancient Egypt.',
    highlights: ['Cairo Antiquities','Alexandria Mediterranean','Luxor & Aswan','Nile Sailing','Temple Visits','Premium Experience'],
    description: 'Ultimate 10-day honeymoon with extended time in Cairo, coastal Alexandria, and a leisure Nile cruise exploring Luxor and Aswan simultaneously.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival greeting','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Cairo Exploration', activities: ['Pyramids & Sphinx','Saqqara','Egyptian Museum'] },
      { day: 'Day 3 – Historic Cairo', activities: ['Old Cairo tour','Islamic museums','Islamic architecture'] },
      { day: 'Day 4 – Alexandria', activities: ['Train to Alexandria','Mediterranean tour','Catacombs','Citadel'] },
      { day: 'Day 5 – Alexandria Beach', activities: ['Beach relaxation','Local attractions','Seafood dinner'] },
      { day: 'Day 6 – Return & Sail', activities: ['Train back to Cairo','Flight to Luxor','Cruise embarkation'] },
      { day: 'Day 7 – Nile Begin', activities: ['Karnak Temple','Luxor Temple','Sail to Edfu'] },
      { day: 'Day 8 – Sailing', activities: ['Edfu Temple','Kom Ombo Temple','Sail to Aswan'] },
      { day: 'Day 9 – Aswan', activities: ['Philae Temple','High Dam','Nubian experience','Felucca sail'] },
      { day: 'Day 10 – Return', activities: ['Final breakfast','Flight back','Airport transfer'] },
    ],
    included: ['2 nights Cairo','2 nights Alexandria','5 nights cruise','Trains & flights','All meals','Guides','Entrance fees'],
    excluded: ['International flights','Visa','Tips','Premium beverages'],
    mealsIncluded: 'Full Board',
    rating: 4.9, reviews: 467, bestSeller: false,
  },
  {
    id: 'cairo-nile-sharm-11d',
    title: '11 Days Cairo, Nile Cruise & Sharm',
    type: '11-day',
    style: 'romantic',
    price: 1750,
    originalPrice: 2250,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    gallery: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
    seoTitle: '11 Days Cairo, Nile Cruise & Sharm Honeymoon Package',
    seoDescription: '11-day ultimate honeymoon combining Cairo\'s history, Nile cruise, and Sharm El Sheikh beach resort luxury. Perfect balance of culture and relaxation.',
    highlights: ['Cairo Pyramids','Nile Cruise','Luxor & Aswan','Sharm Beach','Resort Luxury','Complete Experience'],
    description: "Perfect 11-day honeymoon journey. Explore Cairo's wonders, sail the Nile exploring Upper Egypt's temples, then relax on Sharm El Sheikh's Red Sea beaches.",
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Dinner'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Pyramids of Giza','Egyptian Museum','Saqqara'] },
      { day: 'Day 3 – Cairo Culture', activities: ['Old Cairo','Islamic monuments','Bazaar'] },
      { day: 'Day 4 – Flight to Luxor', activities: ['Flight','Cruise embarkation','Temple tour'] },
      { day: 'Day 5 – West Bank', activities: ['Valley of Kings','Hatshepsut Temple'] },
      { day: 'Day 6 – Nile Sailing', activities: ['Sail to Edfu','Edfu Temple','Sail to Kom Ombo'] },
      { day: 'Day 7 – Kom Ombo', activities: ['Kom Ombo Temple','Relaxation','Entertainment'] },
      { day: 'Day 8 – Aswan', activities: ['Aswan High Dam','Philae Temple','Felucca sail'] },
      { day: 'Day 9 – Sharm Journey', activities: ['Flight to Sharm','Resort check-in','Beach time'] },
      { day: 'Day 10 – Sharm Beach', activities: ['Snorkeling','Diving','Spa','Water sports'] },
      { day: 'Day 11 – Departure', activities: ['Final beach time','Airport transfer'] },
    ],
    included: ['2 nights Cairo','5 nights cruise','3 nights Sharm','All flights','All meals','Guides','Transfers'],
    excluded: ['Visa','International flights','Tips','Water sports extras'],
    mealsIncluded: 'Full Board',
    rating: 4.8, reviews: 523, bestSeller: false,
  },
  {
    id: 'cairo-hurghada-11d',
    title: '11 Days Cairo, Cruise & Hurghada – Egypt Honeymoon Package',
    type: '11-day',
    style: 'romantic',
    price: 1350,
    originalPrice: 1750,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800','https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'],
    seoTitle: '11 Days Cairo, Cruise & Hurghada Honeymoon Package',
    seoDescription: '11-day honeymoon with Cairo attractions, Nile cruise, Luxor, Aswan, and Hurghada Red Sea resort. Discover hidden secrets of ancient Egypt.',
    highlights: ['Cairo Landmarks','Luxor & Aswan','Nile Cruise','Hurghada Beach','Complete Experience','Value Package'],
    description: "Excellent 11-day package balancing Cairo sightseeing, Nile's cultural riches, and Hurghada's beach resort relaxation for value-conscious honeymooners.",
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Pyramids','Sphinx','Museum','Old Cairo'] },
      { day: 'Day 3 – Cairo Heritage', activities: ['Historic sites','Islamic architecture','Bazaar'] },
      { day: 'Day 4 – Luxor Journey', activities: ['Flight to Luxor','Cruise embarkation','Temple tours'] },
      { day: 'Day 5 – West Bank', activities: ['Valley of Kings','Hatshepsut Temple'] },
      { day: 'Day 6 – Nile Cruise', activities: ['Sail to Edfu','Edfu Temple','Sailing'] },
      { day: 'Day 7 – Aswan', activities: ['Kom Ombo','Aswan High Dam','Philae Temple'] },
      { day: 'Day 8 – Hurghada', activities: ['Flight to Hurghada','Resort check-in','Beach'] },
      { day: 'Day 9 – Beach Activities', activities: ['Snorkeling','Water sports','Spa'] },
      { day: 'Day 10 – Relaxation', activities: ['Beach time','Swimming','Diving'] },
      { day: 'Day 11 – Departure', activities: ['Final beach morning','Airport transfer'] },
    ],
    included: ['2 nights Cairo','5 nights cruise','3 nights Hurghada','All flights','Meals','Guides','Transfers'],
    excluded: ['Visa','International flights','Tips','Water sports extras'],
    mealsIncluded: 'Full Board',
    rating: 4.8, reviews: 445, bestSeller: false,
  },
  {
    id: 'cairo-alexandria-nile-oasis-12d',
    title: '12 Days Cairo, Alexandria, Nile & Oasis – Honeymoon in Egypt',
    type: '12-day',
    style: 'romantic',
    price: 1880,
    originalPrice: 2450,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    seoTitle: '12 Days Cairo, Alexandria, Nile & Oasis Honeymoon',
    seoDescription: '12-day premium honeymoon. Cairo pyramids, Alexandria coast, Nile cruise, and White Desert camping. Complete Egyptian romance and adventure.',
    highlights: ['Ancient Civilizations','Nile Cruise','Luxor & Aswan','White Desert','Oasis Experience','Premium Adventure'],
    description: 'Ultimate 12-day honeymoon adventure. Explore Cairo and Alexandria, sail the Nile, and experience the magical White Desert with desert camping.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Pyramids','Sphinx','Saqqara','Museum'] },
      { day: 'Day 3 – Cairo Culture', activities: ['Old Cairo walk','Islamic monuments','Bazaar'] },
      { day: 'Day 4 – Alexandria', activities: ['Train to Alexandria','Mediterranean tour','Catacombs','Citadel'] },
      { day: 'Day 5 – Alexandria Beach', activities: ['Beach relaxation','Local attractions','Seafood dinner'] },
      { day: 'Day 6 – Luxor Flight', activities: ['Train back','Flight to Luxor','Cruise embarkation'] },
      { day: 'Day 7 – Temple Tours', activities: ['Karnak Temple','Luxor Temple','West Bank tour'] },
      { day: 'Day 8 – Nile Sailing', activities: ['Sail to Edfu','Edfu Temple','Sail to Aswan'] },
      { day: 'Day 9 – Aswan Beauty', activities: ['Philae Temple','High Dam','Felucca sail'] },
      { day: 'Day 10 – Desert Journey', activities: ['Drive to White Desert','Desert landscape','Camping'] },
      { day: 'Day 11 – Desert Camp', activities: ['Desert safari','Sunset views','Stargazing','Bonfire dinner'] },
      { day: 'Day 12 – Return', activities: ['Return to Cairo','Airport transfer'] },
    ],
    included: ['2 nights Cairo','2 nights Alexandria','4 nights cruise','2 nights desert camp','Trains & flights','All meals','Guides'],
    excluded: ['International flights','Visa','Tips','Extreme activities'],
    mealsIncluded: 'Full Board',
    rating: 4.9, reviews: 598, bestSeller: true,
  },
  {
    id: 'cairo-nile-sharm-12d',
    title: '12 Days Egypt Honeymoon Package to Cairo, Nile & Sharm',
    type: '12-day',
    style: 'romantic',
    price: 1865,
    originalPrice: 2380,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
    seoTitle: '12 Days Egypt Honeymoon Cairo, Nile & Sharm Package',
    seoDescription: '12-day luxury honeymoon: Cairo pyramids, Nile cruise from Luxor to Aswan, and Red Sea resort in Sharm El Sheikh. The perfect vacation.',
    highlights: ['Pyramids Complex','Salah El Din Castle','Nile Cruise','Red Sea Beach','Complete Egypt','Ultimate Experience'],
    description: 'Perfect 12-day honeymoon combining ancient Egypt wonders from Cairo, a complete Nile cruise, and beach paradise in Sharm El Sheikh.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Saqqara'] },
      { day: 'Day 3 – Cairo Heritage', activities: ['Salah El Din Castle','Old Cairo','Islamic monuments'] },
      { day: 'Day 4 – Museum Day', activities: ['Egyptian Museum','Cairo exploration','Bazaar'] },
      { day: 'Day 5 – Luxor Flight', activities: ['Flight to Luxor','Cruise embarkation','Karnak Temple'] },
      { day: 'Day 6 – Luxor Temples', activities: ['Luxor Temple','Valley of Kings','Hatshepsut'] },
      { day: 'Day 7 – Nile Sailing', activities: ['Sail toward Edfu','Edfu Temple','Sailing adventure'] },
      { day: 'Day 8 – Kom Ombo', activities: ['Kom Ombo Temple','Crocodile Museum','Entertainment'] },
      { day: 'Day 9 – Aswan', activities: ['Aswan High Dam','Philae Temple','Unfinished Obelisk'] },
      { day: 'Day 10 – Sharm Trip', activities: ['Flight to Sharm','Resort check-in','Beach time'] },
      { day: 'Day 11 – Sharm Beach', activities: ['Snorkeling','Diving','Water sports','Spa'] },
      { day: 'Day 12 – Departure', activities: ['Final beach morning','Airport transfer'] },
    ],
    included: ['2 nights Cairo','5 nights cruise','3 nights Sharm','All flights','All meals','All guides','All transfers'],
    excluded: ['Visa','International flights','Tips','Water sports extras'],
    mealsIncluded: 'Full Board',
    rating: 4.9, reviews: 589, bestSeller: true,
  },
  {
    id: 'cairo-alexandria-nile-cruise-12d',
    title: '12 Days Honeymoon in Egypt – Cairo, Alexandria & Nile Cruise',
    type: '12-day',
    style: 'romantic',
    price: 1665,
    originalPrice: 2150,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    gallery: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    seoTitle: '12 Days Cairo, Alexandria & Nile Cruise Honeymoon',
    seoDescription: '12-day complete Egyptian honeymoon. Cairo Pyramids Complex, Alexandria Mediterranean coast, and Nile cruise exploring Luxor & Aswan temples.',
    highlights: ['Cairo Sites','Alexandria View','Luxor & Aswan','Nile Cruise','Temple Circuit','Best of Egypt'],
    description: "Comprehensive 12-day honeymoon tour. Experience Cairo's pyramids, Alexandria's beaches, and a luxurious Nile cruise discovering Upper Egypt.",
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Arrival','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Cairo Wonders', activities: ['Pyramids Complex','Sphinx','Saqqara'] },
      { day: 'Day 3 – Historic Cairo', activities: ['Salah El Din Castle','Old Cairo','Islamic architecture'] },
      { day: 'Day 4 – Cairo Museum', activities: ['Egyptian Museum','Modern Cairo','Shopping'] },
      { day: 'Day 5 – Alexandria', activities: ['Train to Alexandria','Mediterranean tour','Catacombs'] },
      { day: 'Day 6 – Alexandria Beach', activities: ['Citadel visit','Beach relaxation','Seafood'] },
      { day: 'Day 7 – Luxor Journey', activities: ['Train back','Flight to Luxor','Cruise embarkation'] },
      { day: 'Day 8 – Temple Tour', activities: ['Karnak Temple','Luxor Temple','West Bank tour'] },
      { day: 'Day 9 – Valley Kings', activities: ['Valley of Kings','Hatshepsut Temple','Sailing'] },
      { day: 'Day 10 – Sailing', activities: ['Sail to Edfu','Edfu Temple','Kom Ombo Temple'] },
      { day: 'Day 11 – Aswan', activities: ['Aswan High Dam','Philae Temple','Felucca sail'] },
      { day: 'Day 12 – Return', activities: ['Final breakfast','Airport transfer'] },
    ],
    included: ['2 nights Cairo','2 nights Alexandria','5 nights cruise','Trains & flights','All meals','Guides','Entrance fees'],
    excluded: ['Visa','International flights','Tips','Premium activities'],
    mealsIncluded: 'Full Board',
    rating: 4.9, reviews: 567, bestSeller: true,
  },
]

const groupTourPackages = [
  {
    id: 'seniors-cairo-hurghada-6d',
    title: '6 Days Egypt Group Tours for Seniors to Cairo & Hurghada',
    type: '6-day',
    style: 'group',
    price: 670,
    originalPrice: 820,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    gallery: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800','https://images.unsplash.com/photo-1568322503050-1fa74e2506f4?w=800','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800'],
    seoTitle: '6 Days Egypt Group Tours for Seniors to Cairo & Hurghada',
    seoDescription: 'Experience the magic of Cairo and Hurghada with our senior-friendly group tour. Visit Pyramids, Sakkara, Old Cairo, Cairo Museum, and relax on Red Sea beaches.',
    highlights: ['Pyramids of Giza','Sakkara','Old Cairo','Cairo Museum','Red Sea Coast','Senior-Friendly'],
    description: 'These 6 days Egypt Group tours for seniors will take you to the real magic of Cairo and Hurghada. See the Pyramids of Giza, Sakkara, Old Cairo, and Cairo Museum, afterward you will spend a wonderful time on the Red Sea coast while staying in Hurghada with a lot of activities to do.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo airport arrival','Hotel transfer','Welcome dinner'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Sakkara Step Pyramid'] },
      { day: 'Day 3 – Cairo Tours', activities: ['Egyptian Museum','Old Cairo','Khan el-Khalili'] },
      { day: 'Day 4 – Hurghada', activities: ['Transfer to Hurghada','Beach check-in','Free time'] },
      { day: 'Day 5 – Red Sea', activities: ['Beach activities','Snorkeling option','Resort relaxation'] },
      { day: 'Day 6 – Departure', activities: ['Final breakfast','Airport transfer'] },
    ],
    included: ['3 nights Cairo hotel','2 nights Hurghada resort','All transfers','Guided tours','Entry fees','Breakfast daily'],
    excluded: ['Visa','International flights','Tips','Optional activities'],
    mealsIncluded: 'Breakfast',
    rating: 4.8, reviews: 312, bestSeller: false,
  },
  {
    id: 'cairo-nile-cruise-8d',
    title: '8 Days Cairo & Nile Cruise – Egypt Group Tours',
    type: '8-day',
    style: 'group',
    price: 1460,
    originalPrice: 1750,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
    gallery: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    seoTitle: '8 Days Cairo & Nile Cruise – Egypt Group Tours Package',
    seoDescription: 'Discover the best of ancient Egypt from Cairo to Aswan with 8 Days Cairo & Nile Cruise. Explore Pyramids, Sphinx, Karnak Temple, Luxor, High Dam, Philae and more.',
    highlights: ['Pyramids of Giza','Sphinx','Karnak Temple','Luxor Temple','High Dam','Philae Island'],
    description: 'Discover the best of ancient Egypt, from Cairo to Aswan with a fascinating 8 Days Cairo & Nile Cruise. Join our Group Tours to Egypt to explore some of the greatest historical attractions including the Pyramids of Giza, the Sphinx, the Karnak Temple, Luxor, the High Dam, Philae Island, and much more.',
    itinerary: [
      { day: 'Day 1 – Cairo Arrival', activities: ['Airport welcome','Hotel transfer','City orientation'] },
      { day: 'Day 2 – Giza Pyramids', activities: ['Great Pyramid','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Fly to Aswan', activities: ['Domestic flight','Cruise embarkation','Philae Temple'] },
      { day: 'Day 4 – Aswan', activities: ['High Dam','Unfinished Obelisk','Sail to Kom Ombo'] },
      { day: 'Day 5 – Kom Ombo & Edfu', activities: ['Kom Ombo Temple','Sail to Edfu','Edfu Temple'] },
      { day: 'Day 6 – Luxor East', activities: ['Karnak Temple','Luxor Temple','Sound & Light show'] },
      { day: 'Day 7 – Luxor West', activities: ['Valley of Kings','Hatshepsut Temple','Colossi of Memnon'] },
      { day: 'Day 8 – Departure', activities: ['Disembarkation','Flight to Cairo','Final transfer'] },
    ],
    included: ['2 nights Cairo','4 nights Nile cruise','Domestic flights','All meals on cruise','Guided tours','Entry fees'],
    excluded: ['Visa','International flights','Tips','Personal expenses'],
    mealsIncluded: 'Full Board on Cruise',
    rating: 4.9, reviews: 489, bestSeller: true,
  },
  {
    id: 'cairo-nile-cruise-7d',
    title: '7 Days Egypt Group Tour Packages to Cairo & Nile Cruise',
    type: '7-day',
    style: 'group',
    price: 1190,
    originalPrice: 1450,
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600',
    gallery: ['https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    seoTitle: '7 Days Egypt Group Tour to Cairo & Nile Cruise',
    seoDescription: 'Enjoy Egypt immortal Nile while visiting the pyramids, Saqqara, and Memphis. Sail between Luxor and Aswan visiting ancient temples.',
    highlights: ['Pyramids & Sphinx','Saqqara','Memphis','Old Cairo','Cairo Museum','Nile Cruise'],
    description: 'Our 7 Days Egypt Group Tour Packages to Cairo & Nile Cruise will take you to enjoy Egypt immortal Nile while visiting the pyramids, Saqqara, and Memphis. You will also enjoy walking in the small streets of old Cairo with a wonderful visit to the Cairo Museum, then travel to Upper Egypt to spend nights sailing the Nile River between Luxor and Aswan.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo airport pickup','Hotel check-in','Welcome briefing'] },
      { day: 'Day 2 – Pyramids Area', activities: ['Giza Pyramids','Sphinx','Saqqara','Memphis'] },
      { day: 'Day 3 – Cairo Sights', activities: ['Egyptian Museum','Old Cairo','Coptic churches'] },
      { day: 'Day 4 – Fly to Luxor', activities: ['Flight to Luxor','Cruise boarding','Karnak Temple'] },
      { day: 'Day 5 – Luxor Tours', activities: ['Valley of Kings','Hatshepsut','Colossi of Memnon'] },
      { day: 'Day 6 – Sailing', activities: ['Edfu Temple','Kom Ombo Temple','Sail to Aswan'] },
      { day: 'Day 7 – Aswan & Return', activities: ['High Dam','Philae Temple','Fly to Cairo','Departure'] },
    ],
    included: ['2 nights Cairo','3 nights cruise','Domestic flights','Meals on cruise','Guides','Entry fees'],
    excluded: ['Visa','International flights','Tips','Drinks'],
    mealsIncluded: 'Full Board on Cruise',
    rating: 4.8, reviews: 356, bestSeller: false,
  },
  {
    id: 'cairo-alexandria-4d',
    title: 'Group Trips to Egypt for 4 Days in Cairo & Alexandria',
    type: '4-day',
    style: 'group',
    price: 395,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
    gallery: ['https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    seoTitle: '4 Days Cairo & Alexandria Group Trips to Egypt',
    seoDescription: 'Enjoy Cairo pyramids, museums, and travel to Alexandria to see Library of Alexandria, Qaitbay Citadel, Catacombs of Kom El Shoqafa and more.',
    highlights: ['Pyramids of Giza','Egyptian Museum','Library of Alexandria','Qaitbay Citadel','Catacombs','Montazah Gardens'],
    description: 'We offer you amazing Group Trips to Egypt for 4 Days in Cairo & Alexandria to enjoy scenes and life-changing experiences. Dip yourself in Cairo full of unique features, pyramids, and museums full of antiquities and travel to Alexandria to get to know the new Library of Alexandria, Qaitbay Citadel, Catacombs of Kom El Shoqafa, and more with your Egyptologist.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo airport pickup','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Cairo Tour', activities: ['Pyramids of Giza','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Alexandria', activities: ['Drive to Alexandria','Library','Citadel','Catacombs'] },
      { day: 'Day 4 – Departure', activities: ['Montazah Gardens','Return to Cairo','Airport transfer'] },
    ],
    included: ['3 nights Cairo hotel','Private transport','Guided tours','Entry fees','Breakfast daily'],
    excluded: ['Visa','International flights','Tips','Lunch & dinner'],
    mealsIncluded: 'Breakfast',
    rating: 4.7, reviews: 234, bestSeller: false,
  },
  {
    id: 'cairo-sharm-5d',
    title: '5 Days Cairo & Sharm El Sheikh Group Tour',
    type: '5-day',
    style: 'group',
    price: 780,
    originalPrice: 950,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    seoTitle: '5 Days Cairo & Sharm El Sheikh Group Tour',
    seoDescription: 'A 5-day tour of Cairo and Sharm El-Sheikh. Discover ancient pyramids in Cairo and spend nights in Sharm El Sheikh with diving and snorkeling.',
    highlights: ['Pyramids of Giza','Sphinx','Red Sea Resort','Diving & Snorkeling','Beach Relaxation','Sharm El Sheikh'],
    description: 'A 5-day tour of Cairo and Sharm El-Sheikh will give you the opportunity to enjoy a short break full of entertainment and history. You will discover ancient pyramids and other attractions in Cairo dating back thousands of years and spend two nights of imagination in Sharm El Sheikh where you can swim in the Red Sea, go diving, snorkeling, or simply relax in the resort.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo airport pickup','Hotel check-in','Evening free'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Egyptian Museum','Khan el-Khalili'] },
      { day: 'Day 3 – Sharm El Sheikh', activities: ['Morning flight to Sharm','Resort check-in','Beach time'] },
      { day: 'Day 4 – Red Sea', activities: ['Snorkeling trip','Diving option','Resort relaxation'] },
      { day: 'Day 5 – Departure', activities: ['Final breakfast','Airport transfer'] },
    ],
    included: ['2 nights Cairo','2 nights Sharm resort','Domestic flight','Guided tours','Entry fees','Breakfast'],
    excluded: ['Visa','International flights','Tips','Water sports optional'],
    mealsIncluded: 'Breakfast',
    rating: 4.8, reviews: 278, bestSeller: false,
  },
  {
    id: 'cairo-nile-train-8d',
    title: '8 Days Cairo & Nile Cruise by Train for Groups',
    type: '8-day',
    style: 'group',
    price: 1010,
    originalPrice: 1250,
    image: 'https://images.unsplash.com/photo-1568322503050-1fa74e2506f4?w=600',
    gallery: ['https://images.unsplash.com/photo-1568322503050-1fa74e2506f4?w=800','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800'],
    seoTitle: '8 Days Cairo & Nile Cruise by Train for Groups',
    seoDescription: 'Tour famous attractions in Cairo and sail between Aswan and Luxor. Travel by sleeper train for an authentic Egyptian experience.',
    highlights: ['Cairo Monuments','Sleeper Train Experience','Philae Temple','Edfu Temple','Luxor Temple','Valley of Kings'],
    description: 'Tour the famous historical attractions in Cairo, and sail between Aswan and Luxor on an 8-day cruise. Explore the wonders of the ancient world, then travel to Aswan to explore the picturesque attractions including the famous Philae Temple, and discover many attractions in Luxor while sailing on the Nile.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo airport pickup','Hotel check-in','City tour'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Complex','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Train to Aswan', activities: ['Old Cairo tour','Evening sleeper train'] },
      { day: 'Day 4 – Aswan', activities: ['Arrive Aswan','Cruise boarding','Philae Temple'] },
      { day: 'Day 5 – Sailing', activities: ['High Dam','Kom Ombo Temple','Sail to Edfu'] },
      { day: 'Day 6 – Edfu & Luxor', activities: ['Edfu Temple','Sail to Luxor','Luxor Temple'] },
      { day: 'Day 7 – Luxor Tours', activities: ['Valley of Kings','Hatshepsut Temple','Karnak'] },
      { day: 'Day 8 – Return', activities: ['Disembark','Fly to Cairo','Departure'] },
    ],
    included: ['2 nights Cairo','Sleeper train','4 nights cruise','Domestic flight','Meals on cruise','Guides'],
    excluded: ['Visa','International flights','Tips','Personal expenses'],
    mealsIncluded: 'Full Board on Cruise',
    rating: 4.7, reviews: 198, bestSeller: false,
  },
  {
    id: 'cairo-nile-small-6d',
    title: '6 Days Egypt Small Group Tours to Cairo & Nile Cruise',
    type: '6-day',
    style: 'group',
    price: 1070,
    originalPrice: 1300,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    seoTitle: '6 Days Egypt Small Group Tours to Cairo & Nile Cruise',
    seoDescription: '6-day Egypt itinerary to discover ancient Egyptian civilization. Visit the best archaeological sites in Cairo and Upper Egypt through a Nile cruise.',
    highlights: ['Cairo Pyramids','Sphinx','Nile Cruise','Luxor Temples','Valley of Kings','Aswan'],
    description: '6-day Egypt itinerary is a good opportunity to discover the greatness and richness of ancient Egyptian civilization. You will be able to visit the most wonderful and best archaeological sites in Cairo and Upper Egypt through a picturesque Nile cruise.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo arrival','Hotel transfer','Welcome dinner'] },
      { day: 'Day 2 – Cairo', activities: ['Pyramids','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Fly to Aswan', activities: ['Flight to Aswan','Cruise check-in','Philae'] },
      { day: 'Day 4 – Sailing', activities: ['Kom Ombo','Edfu Temple','Sail to Luxor'] },
      { day: 'Day 5 – Luxor', activities: ['Valley of Kings','Karnak Temple','Luxor Temple'] },
      { day: 'Day 6 – Return', activities: ['Fly to Cairo','Final sightseeing','Departure'] },
    ],
    included: ['1 night Cairo','3 nights cruise','Domestic flights','Meals on cruise','Tours','Entry fees'],
    excluded: ['Visa','International flights','Tips','Drinks'],
    mealsIncluded: 'Full Board on Cruise',
    rating: 4.8, reviews: 267, bestSeller: false,
  },
  {
    id: 'cairo-luxor-hurghada-8d',
    title: '8 Days Cairo, Luxor & Hurghada – Egypt Group Tours',
    type: '8-day',
    style: 'group',
    price: 980,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    seoTitle: '8 Days Cairo, Luxor & Hurghada Egypt Group Tours',
    seoDescription: 'Discover Luxor attractions and spend nights in Cairo and Hurghada. Explore pyramids, Luxor sights, and relax at Red Sea beaches.',
    highlights: ['Pyramids of Giza','Luxor Temples','Valley of Kings','Red Sea Beach','Karnak Temple','Hurghada Resort'],
    description: 'Discover Luxor best attractions and spend some nights in Cairo and Hurghada for 8 days. Explore the pyramids of Giza and the most prominent landmarks of Cairo, then travel to Luxor to explore the best sights there and then, head to spend some time at the picturesque Red Sea beach in Hurghada.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo arrival','Hotel transfer','Free evening'] },
      { day: 'Day 2 – Cairo Tour', activities: ['Pyramids','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Luxor', activities: ['Fly to Luxor','Karnak Temple','Luxor Temple'] },
      { day: 'Day 4 – West Bank', activities: ['Valley of Kings','Hatshepsut','Colossi of Memnon'] },
      { day: 'Day 5 – Hurghada', activities: ['Transfer to Hurghada','Beach resort check-in'] },
      { day: 'Day 6 – Red Sea', activities: ['Beach day','Snorkeling option','Resort activities'] },
      { day: 'Day 7 – Free Day', activities: ['Optional diving','Desert safari','Relaxation'] },
      { day: 'Day 8 – Departure', activities: ['Transfer to airport','Final departure'] },
    ],
    included: ['2 nights Cairo','2 nights Luxor','3 nights Hurghada','Domestic flight','Tours','Entry fees'],
    excluded: ['Visa','International flights','Tips','Optional activities'],
    mealsIncluded: 'Breakfast',
    rating: 4.7, reviews: 324, bestSeller: false,
  },
  {
    id: 'cairo-group-4d',
    title: '4 Days Cairo Group Tour Package',
    type: '4-day',
    style: 'group',
    price: 400,
    originalPrice: 520,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    gallery: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800'],
    seoTitle: '4 Days Cairo Group Tour Package',
    seoDescription: 'Visit the Pyramids of Giza, the Sphinx, Egyptian Museum, Saqqara and Old Cairo. Attend the Sound and Light show at the pyramids.',
    highlights: ['Pyramids of Giza','Sphinx','Egyptian Museum','Saqqara','Old Cairo','Sound & Light Show'],
    description: 'Book 4 days in Cairo and visit the Pyramids of Giza, the Sphinx and the Egyptian Museum in addition to Saqqara and Old Cairo. You can also attend the sound and light show in the pyramids.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Airport pickup','Hotel check-in','Welcome orientation'] },
      { day: 'Day 2 – Giza', activities: ['Pyramids of Giza','Great Sphinx','Sound & Light Show'] },
      { day: 'Day 3 – Cairo', activities: ['Egyptian Museum','Saqqara','Memphis','Old Cairo'] },
      { day: 'Day 4 – Departure', activities: ['Final shopping','Airport transfer','Departure'] },
    ],
    included: ['3 nights Cairo hotel','Airport transfers','Guided tours','Entry fees','Breakfast daily'],
    excluded: ['Visa','International flights','Tips','Lunch & dinner'],
    mealsIncluded: 'Breakfast',
    rating: 4.6, reviews: 189, bestSeller: false,
  },
  {
    id: 'cairo-alex-fayoum-8d',
    title: '8 Days Cairo, Alexandria & Fayoum Tour Package',
    type: '8-day',
    style: 'group',
    price: 970,
    originalPrice: 1180,
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
    gallery: ['https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    seoTitle: '8 Days Cairo, Alexandria & Fayoum Tour Package',
    seoDescription: 'Discover Egypt with the eyes of locals. 8 days in Cairo, Alexandria, and Fayoum Oasis to experience civilization across different ages.',
    highlights: ['Cairo Pyramids','Alexandria Mediterranean','Fayoum Oasis','Wadi El Rayan','Lake Qarun','Desert Safari'],
    description: 'Take a trip and discover the land of the Pharaohs with the eyes of the locals in a way that you can not dream. We offer you the best 8 days in Cairo, Alexandria, and Fayoum to discover the splendor and civilization of Egypt in different ages.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo arrival','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Old Cairo', activities: ['Coptic Cairo','Islamic Cairo','Khan el-Khalili'] },
      { day: 'Day 4 – Alexandria', activities: ['Drive to Alexandria','Library','Citadel'] },
      { day: 'Day 5 – Alexandria', activities: ['Catacombs','Montazah Palace','Seafood dinner'] },
      { day: 'Day 6 – Fayoum', activities: ['Drive to Fayoum','Lake Qarun','Wadi El Hitan'] },
      { day: 'Day 7 – Fayoum Safari', activities: ['Wadi El Rayan waterfalls','Sandboarding','Desert camping'] },
      { day: 'Day 8 – Return', activities: ['Return to Cairo','Final sightseeing','Departure'] },
    ],
    included: ['3 nights Cairo','2 nights Alexandria','2 nights Fayoum','Transport','Tours','Entry fees'],
    excluded: ['Visa','International flights','Tips','Some meals'],
    mealsIncluded: 'Breakfast + Some Dinners',
    rating: 4.8, reviews: 156, bestSeller: false,
  },
  {
    id: 'cairo-private-5d',
    title: '5 Days Cairo Tour Package – Private Small Group Tour',
    type: '5-day',
    style: 'group',
    price: 520,
    originalPrice: 680,
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600',
    gallery: ['https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    seoTitle: '5 Days Cairo Tour Package – Private Small Group Tour',
    seoDescription: 'Visit and experience the best landmarks in Cairo for 5 days. See pyramids, Old Cairo, Salah El Din Citadel, and enjoy Felucca ride on the Nile.',
    highlights: ['Pyramids of Giza','Old Cairo','Salah El Din Citadel','Nile River Views','Felucca Ride','Egyptian Museum'],
    description: 'Visit and experience the best landmarks in Cairo for a 5-day trip, see the pyramids of Giza, Old Cairo, and Salah El Din Citadel, and enjoy the beautiful views of the Nile River while riding Felucca in one of the most enjoyable local activities.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Airport pickup','Hotel check-in','City orientation'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Valley Temple','Camel ride'] },
      { day: 'Day 3 – Museums', activities: ['Egyptian Museum','Saqqara Pyramids','Memphis'] },
      { day: 'Day 4 – Cairo Sites', activities: ['Citadel of Saladin','Old Cairo','Felucca on Nile'] },
      { day: 'Day 5 – Departure', activities: ['Final shopping','Khan el-Khalili','Airport transfer'] },
    ],
    included: ['4 nights Cairo hotel','Private transport','Expert guide','Entry fees','Breakfast','Felucca ride'],
    excluded: ['Visa','International flights','Tips','Lunch & dinner'],
    mealsIncluded: 'Breakfast',
    rating: 4.7, reviews: 223, bestSeller: false,
  },
  {
    id: 'cairo-alex-nile-8d',
    title: '8 Days Cairo, Alexandria & Nile – Egypt Group Tour',
    type: '8-day',
    style: 'group',
    price: 1330,
    originalPrice: 1580,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
    gallery: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800','https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800'],
    seoTitle: '8 Days Cairo, Alexandria & Nile Egypt Group Tour',
    seoDescription: 'See amazing relics in Cairo and Luxor. Visit Pyramids, Salahuddin Castle, Valley of the Kings, Karnak Temple, Philae Temple and more.',
    highlights: ['Pyramids of Giza','Salahuddin Castle','Valley of Kings','Karnak Temple','Philae Temple','Alexandria'],
    description: 'See some amazing relics and artifacts in the magical cities of Cairo and Luxor, such as the Pyramids of Giza, the Salahuddin Castle, the Valley of the Kings, Karnak Temple, Luxor Temple, Philae Temple, and many others. Experience the true meaning of adventure.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo arrival','Hotel transfer','Welcome dinner'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Alexandria', activities: ['Drive to Alexandria','Library','Citadel','Catacombs'] },
      { day: 'Day 4 – Return & Fly', activities: ['Return to Cairo','Fly to Aswan','Cruise boarding'] },
      { day: 'Day 5 – Aswan', activities: ['Philae Temple','High Dam','Sail to Kom Ombo'] },
      { day: 'Day 6 – Sailing', activities: ['Kom Ombo Temple','Edfu Temple','Sail to Luxor'] },
      { day: 'Day 7 – Luxor', activities: ['Valley of Kings','Hatshepsut','Karnak Temple'] },
      { day: 'Day 8 – Departure', activities: ['Fly to Cairo','Final transfer','Departure'] },
    ],
    included: ['2 nights Cairo','1 night Alexandria','4 nights cruise','Flights','Meals on cruise','Tours'],
    excluded: ['Visa','International flights','Tips','Personal items'],
    mealsIncluded: 'Full Board on Cruise',
    rating: 4.9, reviews: 267, bestSeller: true,
  },
  {
    id: 'cairo-alex-nile-flight-10d',
    title: '10 Days Cairo and Alexandria with Nile Cruise by Flight',
    type: '10-day',
    style: 'group',
    price: 1650,
    originalPrice: 1950,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800','https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800'],
    seoTitle: '10 Days Cairo and Alexandria with Nile Cruise by Flight',
    seoDescription: '10-day vacation in Egypt including Nile cruise between Luxor and Aswan with private tours in Cairo and Alexandria. Discover the real magic of Egypt.',
    highlights: ['Cairo Pyramids','Alexandria Coast','Nile Cruise','Luxor Temples','Aswan Temples','Private Tours'],
    description: 'Give yourself time and book a 10-day vacation in Egypt, including a Nile cruise between Luxor and Aswan with the most amazing private tours in Cairo and Alexandria to discover the real magic that characterizes every city.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo arrival','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Sound & Light show'] },
      { day: 'Day 3 – Cairo Tour', activities: ['Egyptian Museum','Saqqara','Memphis'] },
      { day: 'Day 4 – Alexandria', activities: ['Drive to Alexandria','Library','Citadel'] },
      { day: 'Day 5 – Alexandria', activities: ['Catacombs','Montazah','Mediterranean views'] },
      { day: 'Day 6 – Fly to Aswan', activities: ['Return to Cairo','Fly to Aswan','Cruise boarding'] },
      { day: 'Day 7 – Aswan', activities: ['Philae Temple','High Dam','Unfinished Obelisk'] },
      { day: 'Day 8 – Sailing', activities: ['Kom Ombo','Edfu Temple','Sail to Luxor'] },
      { day: 'Day 9 – Luxor', activities: ['Valley of Kings','Hatshepsut','Karnak'] },
      { day: 'Day 10 – Return', activities: ['Fly to Cairo','Final shopping','Departure'] },
    ],
    included: ['3 nights Cairo','2 nights Alexandria','4 nights cruise','Domestic flights','Meals on cruise','Guides'],
    excluded: ['Visa','International flights','Tips','Personal items'],
    mealsIncluded: 'Full Board on Cruise',
    rating: 4.9, reviews: 345, bestSeller: true,
  },
  {
    id: 'cairo-alex-small-6d',
    title: '6 Days Cairo & Alexandria Tour – Egypt Small Group Tour',
    type: '6-day',
    style: 'group',
    price: 685,
    originalPrice: 850,
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
    gallery: ['https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    seoTitle: '6 Days Cairo & Alexandria Tour – Egypt Small Group Tour',
    seoDescription: 'One of the best tours in Egypt. 6-day tour in Cairo and Alexandria visiting pyramids, Coptic and Islamic monuments, and famous Alexandria landmarks.',
    highlights: ['Pyramids of Giza','Coptic Monuments','Islamic Cairo','Alexandria Library','Citadel','Mediterranean Coast'],
    description: 'This tour package to Egypt is one of the best tours in Egypt to enjoy a wonderful holiday. In this 6-day tour in Cairo and Alexandria, you will visit the pyramids of Giza and the Coptic and Islamic monuments in Old Cairo in addition to the famous landmarks of Alexandria.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo arrival','Hotel transfer','City orientation'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Old Cairo', activities: ['Coptic Cairo','Islamic Cairo','Citadel'] },
      { day: 'Day 4 – Alexandria', activities: ['Drive to Alexandria','Library','Qaitbay Citadel'] },
      { day: 'Day 5 – Alexandria', activities: ['Catacombs','Montazah Gardens','Seafood dinner'] },
      { day: 'Day 6 – Departure', activities: ['Return to Cairo','Final sightseeing','Airport transfer'] },
    ],
    included: ['3 nights Cairo','2 nights Alexandria','Transport','Guided tours','Entry fees','Breakfast'],
    excluded: ['Visa','International flights','Tips','Lunch & dinner'],
    mealsIncluded: 'Breakfast',
    rating: 4.7, reviews: 234, bestSeller: false,
  },
  {
    id: 'cairo-alex-nile-oasis-12d',
    title: '12 Days Cairo, Alexandria, Nile & Oasis For Groups',
    type: '12-day',
    style: 'group',
    price: 1880,
    originalPrice: 2250,
    image: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=600',
    gallery: ['https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800'],
    seoTitle: '12 Days Cairo, Alexandria, Nile & Oasis For Groups',
    seoDescription: 'Discover ancient civilizations with Nile cruise, Alexandria coast, and camp in White Desert. One of the most wonderful experiences in Egypt.',
    highlights: ['Cairo Pyramids','Alexandria','Nile Cruise','White Desert','Oasis Camping','Luxor & Aswan'],
    description: 'Take advantage of the opportunity and discover ancient civilizations in Egypt with a Nile cruise to discover what its banks contain. Spend an unparalleled night while camping in the white desert, one of the most wonderful places in Egypt.',
    itinerary: [
      { day: 'Day 1 – Arrival', activities: ['Cairo arrival','Hotel check-in','Welcome dinner'] },
      { day: 'Day 2 – Pyramids', activities: ['Giza Pyramids','Sphinx','Egyptian Museum'] },
      { day: 'Day 3 – Old Cairo', activities: ['Coptic Cairo','Citadel','Khan el-Khalili'] },
      { day: 'Day 4 – Alexandria', activities: ['Drive to Alexandria','Library','Citadel'] },
      { day: 'Day 5 – Alexandria', activities: ['Catacombs','Montazah','Return to Cairo'] },
      { day: 'Day 6 – Fly to Aswan', activities: ['Flight to Aswan','Cruise boarding','Philae Temple'] },
      { day: 'Day 7 – Aswan', activities: ['High Dam','Unfinished Obelisk','Sail to Kom Ombo'] },
      { day: 'Day 8 – Sailing', activities: ['Kom Ombo Temple','Edfu Temple','Sail to Luxor'] },
      { day: 'Day 9 – Luxor', activities: ['Valley of Kings','Hatshepsut','Karnak Temple'] },
      { day: 'Day 10 – White Desert', activities: ['Fly to Cairo','Drive to Bahariya Oasis','Desert safari'] },
      { day: 'Day 11 – Oasis', activities: ['White Desert exploration','Sandboarding','Desert camping'] },
      { day: 'Day 12 – Return', activities: ['Return to Cairo','Final shopping','Departure'] },
    ],
    included: ['3 nights Cairo','1 night Alexandria','4 nights cruise','2 nights desert camping','Flights','All meals'],
    excluded: ['Visa','International flights','Tips','Personal items'],
    mealsIncluded: 'Full Board',
    rating: 4.9, reviews: 178, bestSeller: true,
  },
]

const faqs = [
  { q: 'What is the best time to do a Nile Cruise?', a: 'October to April is the best season — pleasant weather (20-30°C), clear skies, and peak conditions for sightseeing. December-February are the most popular months. Summer (June-August) is hot but prices are significantly lower.' },
  { q: 'What is the difference between a Nile Cruise and a Dahabiya?', a: 'A Nile Cruise is a large floating hotel (50-75 cabins) with pools, restaurants, and entertainment. A Dahabiya is a small traditional sailing boat (6-10 cabins) powered by wind — more intimate, slower-paced, and visits unique sites that large ships can\'t reach.' },
  { q: 'Is the Nile Cruise safe?', a: 'Yes, Nile Cruises are very safe. All boats are regularly inspected, have safety equipment, and sail well-known routes. The Luxor-Aswan stretch is one of the most traveled waterways in the world with no safety concerns.' },
  { q: 'What should I pack for a Nile Cruise?', a: 'Light, breathable clothing, comfortable walking shoes for temple visits, a hat, sunscreen, sunglasses, a light jacket for evenings, and modest clothing for temple visits (shoulders and knees covered). Formal dress is optional for the captain\'s dinner.' },
  { q: 'Are meals included on the cruise?', a: 'Yes, all cruises include full board — breakfast, lunch, and dinner buffets with Egyptian and international cuisine. Drinks are usually extra (purchased from the bar) unless you book an all-inclusive package.' },
  { q: 'Can I visit Abu Simbel during my cruise?', a: 'Yes! Abu Simbel is offered as an optional excursion from Aswan (early morning flight or 3-hour drive). Some cruises include it; others offer it for $80-100 extra. We highly recommend it — it\'s one of Egypt\'s most spectacular monuments.' },
  { q: 'Do I need to tip the crew?', a: 'Tipping is customary and expected. The recommended amount is $40-70 per person for the cruise duration, placed in the communal tip box at the end. For your private guide and driver, $10-15/day each is appropriate.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 30 days before departure. 15-30 days: 25% charge. 7-14 days: 50% charge. Less than 7 days: 100% charge. Travel insurance is strongly recommended.' },
]

const reviews = [
  { name: 'James & Helen', country: 'UK 🇬🇧', rating: 5, cruise: 'Al Hambra 5-Star', text: 'Absolutely magical week on the Nile. Waking up to new temples every morning, the crew was outstanding, food was excellent. The highlight was Philae Temple at sunset.', date: 'January 2026' },
  { name: 'Yuki Tanaka', country: 'Japan 🇯🇵', rating: 5, cruise: 'Merit Dahabiya', text: 'The Dahabiya experience is unlike anything else. Sailing by wind, visiting hidden temples no one else sees, and sleeping under the stars on deck. Pure magic.', date: 'December 2025' },
  { name: 'Carlos & Maria', country: 'Spain 🇪🇸', rating: 5, cruise: 'Grand Nile 7-Night', text: 'We chose the 7-night cruise and it was the best decision. No rushing, every temple visited properly, Abu Simbel included. The spa and cooking class were great bonuses.', date: 'November 2025' },
  { name: 'Anna Schmidt', country: 'Germany 🇩🇪', rating: 5, cruise: '3-Night Cruise', text: 'Perfect for our tight schedule. Three nights was enough to see the key temples between Aswan and Luxor. Comfortable cabin, good food, great guide. Would do it again!', date: 'February 2026' },
]

const NileCruises = () => {
  const [searchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') || ''
  const [openFaq, setOpenFaq] = useState(null)
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nationality: '', selectedCruise: '', cabinType: '', travelDate: '', travelers: 2, specialRequests: '' })
  const [formSuccess, setFormSuccess] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  
  // Honeymoon packages from Supabase (with static fallback)
  const [dbHoneymoonPackages, setDbHoneymoonPackages] = useState([])
  const [honeymoonLoading, setHoneymoonLoading] = useState(true)
  
  // Nile Cruise packages from Supabase
  const [dbCruisePackages, setDbCruisePackages] = useState([])
  const [cruiseLoading, setCruiseLoading] = useState(true)

  // Fetch honeymoon packages from Supabase on mount
  useEffect(() => {
    const fetchHoneymoonPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_published', true)
          .eq('style', 'Honeymoon')
          .order('created_at', { ascending: false })
        
        if (!error && data && data.length > 0) {
          // Transform Supabase format to match static data format
          const transformed = data.map(pkg => ({
            id: pkg.id,
            slug: pkg.slug,
            title: pkg.title,
            type: pkg.duration_filter || '6-day',
            style: 'romantic', // For display consistency
            price: pkg.price,
            originalPrice: pkg.original_price || pkg.price,
            image: pkg.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
            gallery: pkg.gallery || [],
            seoTitle: pkg.title,
            seoDescription: pkg.description,
            highlights: pkg.highlights || [],
            description: pkg.description,
            itinerary: (pkg.itinerary || []).map((item, idx) => ({
              day: `Day ${item.day || idx + 1} – ${item.title || 'Activities'}`,
              activities: item.details ? item.details.split('\n').filter(Boolean) : [item.title || 'Explore'],
            })),
            included: pkg.included || [],
            excluded: pkg.excluded || [],
            mealsIncluded: 'Full Board',
            rating: pkg.rating || 4.8,
            reviews: pkg.reviews || 100,
            bestSeller: pkg.best_seller || false,
          }))
          setDbHoneymoonPackages(transformed)
          console.log('✅ Loaded', data.length, 'honeymoon packages from Supabase')
        } else {
          console.log('⚠️ No honeymoon packages from Supabase, using static data')
        }
      } catch (err) {
        console.log('⚠️ Using static honeymoon packages:', err.message)
      }
      setHoneymoonLoading(false)
    }
    fetchHoneymoonPackages()
  }, [])

  // Fetch Nile Cruise packages from Supabase
  useEffect(() => {
    const fetchCruisePackages = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_published', true)
          .eq('style', 'Nile Cruise')
          .order('created_at', { ascending: false })
        
        if (!error && data && data.length > 0) {
          const transformed = data.map(pkg => ({
            id: pkg.slug || pkg.id,
            title: pkg.title,
            type: pkg.duration_filter || '4-5-night',
            style: 'luxury',
            price: pkg.price,
            originalPrice: pkg.original_price || pkg.price,
            image: pkg.image || 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
            gallery: pkg.gallery || [],
            seoTitle: pkg.title,
            seoDescription: pkg.description,
            highlights: pkg.highlights || [],
            description: pkg.description,
            cabins: [],
            itinerary: (pkg.itinerary || []).map((item, idx) => ({
              day: `Day ${item.day || idx + 1} – ${item.title || 'Activities'}`,
              activities: item.details ? item.details.split('\n').filter(Boolean) : [item.title || 'Explore'],
            })),
            included: pkg.included || [],
            excluded: pkg.excluded || [],
            mealsIncluded: 'Full Board',
            rating: pkg.rating || 4.5,
            reviews: pkg.reviews || 0,
            bestSeller: pkg.best_seller || false,
            fromDb: true,
          }))
          setDbCruisePackages(transformed)
          console.log('✅ Loaded', data.length, 'Nile Cruise packages from Supabase')
        }
      } catch (err) {
        console.log('⚠️ Using static Nile Cruise data:', err.message)
      }
      setCruiseLoading(false)
    }
    fetchCruisePackages()
  }, [])

  // Combine database and static honeymoon packages (database takes priority)
  const allHoneymoonPackages = dbHoneymoonPackages.length > 0 
    ? [...dbHoneymoonPackages, ...honeymoonPackages.filter(sp => !dbHoneymoonPackages.find(dp => dp.slug === sp.id))]
    : honeymoonPackages

  // Combine database and static cruise packages
  const allCruises = [...dbCruisePackages, ...cruises.filter(c => !dbCruisePackages.find(dc => dc.id === c.id))]

  const filteredCruises = typeFilter === 'romantic' 
    ? allHoneymoonPackages 
    : allCruises.filter(c => !typeFilter || c.type === typeFilter || c.style === typeFilter)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const message = `Hello! I'd like to book a Nile Cruise:\n\n🚢 Cruise: ${formData.selectedCruise}\n🛏️ Cabin: ${formData.cabinType}\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n🌍 Nationality: ${formData.nationality}\n📅 Date: ${formData.travelDate}\n👥 Travelers: ${formData.travelers}\n📝 Notes: ${formData.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(message)}`, '_blank')
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 5000)
  }

  const handleStripeCheckout = async (cruise) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carName: cruise.title, carId: cruise.id, routeFrom: 'Nile Cruise', routeTo: cruise.type, distance: 0, transferDate: formData.travelDate || '', transferTime: '', passengers: formData.travelers || 2, amount: cruise.price * (formData.travelers || 2), customerEmail: formData.email || undefined }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { alert('Payment setup failed. Please try via WhatsApp.') }
    finally { setCheckoutLoading(false) }
  }

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-secondary-500 overflow-hidden">
        <div className="absolute inset-0 opacity-75"><img src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1920&h=900&fit=crop&q=80" alt="Nile River cruise sailing at sunset in Egypt" className="w-full h-full object-cover object-center" /></div>
        <div className="relative container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6"><Link to="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Nile Cruises</span></nav>
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Sail the Ancient Nile</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Nile Cruises</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl">Cruise between Luxor and Aswan aboard luxury 5-star ships or intimate Dahabiya sailing boats. All temples, all meals, all memories included.</p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Full Board Meals</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Egyptologist Guide</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> All Temple Entries</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Nightly Entertainment</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Free Cancellation</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Honeymoon Packages Section */}
      <section id="honeymoon-packages" className="py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-pink-600 text-sm font-semibold uppercase tracking-wider mb-3">💕 Special Occasions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Romantic Honeymoon Packages</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Combine ancient wonders with romance. Our curated packages blend Cairo's historic treasures, Nile cruising, and beach relaxation for the perfect honeymoon escape.</p>
          </div>

          {honeymoonLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allHoneymoonPackages.map((pkg, index) => (
              <motion.div 
                key={pkg.id || pkg.slug} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: (index % 3) * 0.1 }} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 border-t-4 border-pink-400"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: pkg.gallery, index: 0 })}>
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {pkg.gallery.length} Photos</div>
                  {pkg.bestSeller && <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">💑 Popular</div>}
                  <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize">{pkg.type}</div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(pkg.rating))}</span>
                    <span className="text-xs text-gray-500">({pkg.reviews} reviews)</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{pkg.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.highlights.slice(0, 3).map(h => (
                      <span key={h} className="inline-flex items-center gap-1 text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full">💗 {h}</span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {pkg.originalPrice > pkg.price && (
                        <span className="text-sm text-gray-400 line-through">${pkg.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-pink-600">${pkg.price}</span>
                      <span className="text-xs text-gray-500">per couple</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <Link to={`/nile-cruises/${pkg.id}`} className="btn bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white w-full text-sm text-center">
                      View Itinerary
                    </Link>
                    <button 
                      onClick={() => { setFormData(p => ({ ...p, selectedCruise: pkg.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} 
                      className="btn btn-outline-primary w-full text-sm"
                    >
                      Inquire Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          {/* Honeymoon Special CTA */}
          <div className="mt-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Make It Unforgettable</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">Add room roses, champagne, private dinners, or special activities to customize your perfect honeymoon moment.</p>
            <a href="https://wa.me/201212011881?text=Hi!%20I'd%20like%20to%20customize%20our%20honeymoon%20package%20with%20special%20touches" target="_blank" rel="noopener noreferrer" className="btn bg-white text-pink-600 hover:bg-gray-50 font-bold">
              💬 Plan Your Perfect Honeymoon
            </a>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 py-4 justify-center items-center">
            <Link to="/nile-cruises" className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${!typeFilter ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}>All Cruises</Link>
            {[{v:'3-night',l:'3 Nights'},{v:'4-night',l:'4 Nights'},{v:'7-night',l:'7 Nights'},{v:'dahabiya',l:'Dahabiya'},{v:'luxury',l:'Luxury'}].map(f => (
              <Link key={f.v} to={`/nile-cruises?type=${f.v}`} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${typeFilter === f.v ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}>{f.l}</Link>
            ))}
            <Link 
              to="/nile-cruises?type=romantic"
              className={`px-6 py-3 bg-gradient-to-r ${typeFilter === 'romantic' ? 'from-pink-600 to-rose-600' : 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2`}
            >
              💕 Honeymoon Packages
            </Link>
            <Link 
              to="/group-tours"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              🌍 Group Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Cruise Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCruises.map((cruise, index) => (
              <motion.div 
                key={cruise.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: (index % 3) * 0.1 }} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: cruise.gallery, index: 0 })}>
                  <img src={cruise.image} alt={cruise.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {cruise.gallery.length} Photos</div>
                  {cruise.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize">{cruise.type}</div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(cruise.rating))}</span>
                    <span className="text-xs text-gray-500">({cruise.reviews} reviews)</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{cruise.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{cruise.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cruise.highlights.slice(0, 3).map(h => (
                      <span key={h} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">🚢 {h}</span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {cruise.originalPrice > cruise.price && (
                        <span className="text-sm text-gray-400 line-through">${cruise.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-primary-600">${cruise.price}</span>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <Link to={`/nile-cruises/${cruise.id}`} className="btn btn-primary w-full text-sm text-center">
                      View Full Details
                    </Link>
                    <button 
                      onClick={() => { setFormData(p => ({ ...p, selectedCruise: cruise.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} 
                      className="btn btn-outline-primary w-full text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-white" id="booking-form">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Reserve Your Spot</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Book Your Nile Cruise</h2>
            <p className="text-gray-600">Limited cabins available — book early for the best selection</p>
          </div>
          {formSuccess && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center text-green-700 font-medium">✅ Booking request sent! We'll confirm your cabin shortly.</div>}
          <form onSubmit={handleFormSubmit} className="bg-gray-50 rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="John Smith" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="john@example.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp</label><input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="+1 234 567 8900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label><input type="text" value={formData.nationality} onChange={e => setFormData(p => ({ ...p, nationality: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="e.g. American" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Select Cruise *</label>
                <select required value={formData.selectedCruise} onChange={e => setFormData(p => ({ ...p, selectedCruise: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option value="">Choose a cruise</option>{cruises.map(c => <option key={c.id} value={c.title}>{c.title} — From ${c.price}/pp</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Cabin Preference</label>
                <select value={formData.cabinType} onChange={e => setFormData(p => ({ ...p, cabinType: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option value="">Any available</option><option value="Standard">Standard</option><option value="Deluxe">Deluxe / Superior</option><option value="Suite">Suite / Royal</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Travel Date *</label><input type="date" required value={formData.travelDate} onChange={e => setFormData(p => ({ ...p, travelDate: e.target.value }))} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Travelers *</label>
                <select required value={formData.travelers} onChange={e => setFormData(p => ({ ...p, travelers: Number(e.target.value) }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label><textarea rows={3} value={formData.specialRequests} onChange={e => setFormData(p => ({ ...p, specialRequests: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="Honeymoon setup, dietary needs, Abu Simbel add-on..." /></div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="btn btn-primary flex-1 justify-center text-base py-3.5">🚢 Request Cruise Booking</button>
              <a href="https://wa.me/201212011881?text=Hi!%20I%27d%20like%20to%20book%20a%20Nile%20Cruise" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary flex-1 justify-center text-base py-3.5">💬 Book via WhatsApp</a>
            </div>
          </form>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Guest Experiences</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Cruise Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-yellow-400 mb-3">{'★'.repeat(r.rating)}</div>
                <p className="text-gray-600 text-sm italic mb-4">"{r.text}"</p>
                <div className="border-t pt-3"><p className="font-semibold text-gray-900 text-sm">{r.name}</p><p className="text-xs text-gray-500">{r.country} • {r.cruise}</p></div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Nile Cruise Questions</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Can't Decide? We'll Help!</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">Our Nile cruise experts have sailed every ship. Tell us your dates and preferences — we'll recommend the perfect cruise for you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/201212011881?text=Hi!%20I%20need%20help%20choosing%20a%20Nile%20Cruise" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">💬 Ask an Expert</a>
            <Link to="/contact" className="btn btn-outline btn-lg">✉️ Email Us</Link>
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

export default NileCruises