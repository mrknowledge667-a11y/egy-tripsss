import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

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
  { q: 'What is included in group tour packages?', a: 'Our group tours typically include accommodation, transportation within Egypt, English-speaking Egyptologist guide, entrance fees to sites, and meals as specified (usually breakfast, with full board on cruises). International flights and visa fees are not included.' },
  { q: 'What is the group size for these tours?', a: 'Our small group tours typically have 8-16 travelers, ensuring personalized attention while enjoying the social aspects of group travel. Private group options are also available for families or friends traveling together.' },
  { q: 'Are group tours suitable for seniors?', a: 'Yes! Many of our tours are designed with seniors in mind, featuring comfortable pacing, quality accommodations, and accessible options. Our senior-specific tours have extra rest time and avoid overly strenuous activities.' },
  { q: 'Can I customize a group tour?', a: 'While our standard group tours follow set itineraries, we offer tailor-made options where you can adjust days, add activities, or upgrade accommodations. Contact us to discuss your preferences.' },
  { q: 'What is the best time to visit Egypt?', a: 'October to April offers the best weather for sightseeing (20-30°C). Summer months (June-August) are hot but have lower prices and fewer crowds. Ramadan dates vary yearly and may affect some services.' },
  { q: 'Is Egypt safe for group travelers?', a: 'Yes, Egypt is very safe for tourists. Our groups travel with experienced guides, use reputable hotels and transport, and follow established tourist routes. Tourist areas have enhanced security measures.' },
  { q: 'What should I pack for an Egypt group tour?', a: 'Light, breathable clothing, comfortable walking shoes, hat, sunscreen, sunglasses, and modest clothing for temple/mosque visits (shoulders and knees covered). A light jacket for air-conditioned places and cool evenings is recommended.' },
  { q: 'How do I book and what is the payment process?', a: 'Book online or via WhatsApp. A 25% deposit secures your booking, with the balance due 30 days before departure. We accept credit cards and bank transfers. Free cancellation up to 30 days before travel.' },
]

const reviews = [
  { name: 'Michael & Susan', country: 'USA 🇺🇸', rating: 5, tour: '8 Days Cairo & Nile Cruise', text: 'Everything was perfectly organized. Our guide Ahmed was incredibly knowledgeable. The Nile cruise exceeded expectations - great food, beautiful views, and fascinating temples.', date: 'January 2026' },
  { name: 'Hans Mueller', country: 'Germany 🇩🇪', rating: 5, tour: '10 Days Complete Egypt', text: 'Best value for money! Visited Cairo, Alexandria, and did the Nile cruise. Small group meant we could ask lots of questions. Hotels were excellent quality.', date: 'December 2025' },
  { name: 'Emma Thompson', country: 'UK 🇬🇧', rating: 5, tour: '6 Days Seniors Tour', text: 'As a 68-year-old solo traveler, I was nervous but the tour was perfect. Good pace, accessible, and I made wonderful friends in the group. Egypt Time Travel took great care of us.', date: 'November 2025' },
  { name: 'Jean-Pierre & Marie', country: 'France 🇫🇷', rating: 5, tour: '12 Days with Desert Oasis', text: 'The White Desert camping was magical! Combined with pyramids and Nile cruise, this was the trip of a lifetime. Professional organization throughout.', date: 'February 2026' },
]

const GroupTours = () => {
  const [searchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') || ''
  const [openFaq, setOpenFaq] = useState(null)
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nationality: '', selectedTour: '', travelDate: '', travelers: 2, specialRequests: '' })
  const [formSuccess, setFormSuccess] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Database packages state
  const [dbTours, setDbTours] = useState([])
  const [dbLoading, setDbLoading] = useState(true)

  // Fetch Group Tour packages from Supabase (Small Group or Group Tour style)
  useEffect(() => {
    const fetchGroupTours = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_published', true)
          .or('style.eq.Small Group,style.eq.Group Tour')
          .order('created_at', { ascending: false })
        
        if (!error && data && data.length > 0) {
          // Transform Supabase format to match tour format
          const transformed = data.map(pkg => ({
            id: pkg.slug || pkg.id,
            title: pkg.title,
            type: pkg.duration_filter || '8-day',
            style: 'group',
            price: pkg.price,
            originalPrice: pkg.original_price || pkg.price,
            image: pkg.image || 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
            gallery: pkg.gallery || [],
            seoTitle: pkg.title,
            seoDescription: pkg.description,
            highlights: pkg.highlights || [],
            description: pkg.description,
            itinerary: (pkg.itinerary || []).map((item, idx) => ({
              day: `Day ${item.day || idx + 1}`,
              activities: item.details ? item.details.split('\n').filter(Boolean) : [item.title || 'Activities'],
            })),
            included: pkg.included || [],
            excluded: pkg.excluded || [],
            mealsIncluded: 'As per itinerary',
            rating: pkg.rating || 4.5,
            reviews: pkg.reviews || 0,
            bestSeller: pkg.best_seller || false,
            fromDb: true,
          }))
          setDbTours(transformed)
          console.log('✅ Loaded', data.length, 'Group Tour packages from Supabase')
        }
      } catch (err) {
        console.log('⚠️ Using static Group Tours data:', err.message)
      }
      setDbLoading(false)
    }
    fetchGroupTours()
  }, [])

  // Combine database tours with static ones (database first)
  const allTours = [...dbTours, ...groupTourPackages.filter(t => !dbTours.find(dt => dt.id === t.id))]

  const filteredTours = allTours.filter(t => !typeFilter || t.type === typeFilter)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const message = `Hello! I'd like to book a Group Tour:\n\n🌍 Tour: ${formData.selectedTour}\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n🌍 Nationality: ${formData.nationality}\n📅 Date: ${formData.travelDate}\n👥 Travelers: ${formData.travelers}\n📝 Notes: ${formData.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(message)}`, '_blank')
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 5000)
  }

  const handleStripeCheckout = async (tour) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carName: tour.title, carId: tour.id, routeFrom: 'Group Tour', routeTo: tour.type, distance: 0, transferDate: formData.travelDate || '', transferTime: '', passengers: formData.travelers || 2, amount: tour.price * (formData.travelers || 2), customerEmail: formData.email || undefined }),
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
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-600 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0 opacity-60"><img src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&h=900&fit=crop&q=80" alt="Egypt Group Tours - Pyramids of Giza" className="w-full h-full object-cover object-center" /></div>
        <div className="relative container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6"><Link to="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Group Tours</span></nav>
            <span className="inline-block text-primary-200 text-sm font-semibold uppercase tracking-wider mb-3">🌍 Small Group Adventures</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Egypt Group Tours</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl">Join our expertly guided group tours to explore Egypt's ancient wonders. From pyramids to Nile cruises, experience the best of Egypt with like-minded travelers at unbeatable prices.</p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2"><span className="text-primary-300">✓</span> Small Groups (8-16)</div>
              <div className="flex items-center gap-2"><span className="text-primary-300">✓</span> Expert Egyptologist</div>
              <div className="flex items-center gap-2"><span className="text-primary-300">✓</span> Quality Hotels</div>
              <div className="flex items-center gap-2"><span className="text-primary-300">✓</span> All Entry Fees</div>
              <div className="flex items-center gap-2"><span className="text-primary-300">✓</span> Free Cancellation</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 py-4 justify-center items-center">
            <Link to="/group-tours" className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${!typeFilter ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}>All Tours</Link>
            {[{v:'4-day',l:'4 Days'},{v:'5-day',l:'5 Days'},{v:'6-day',l:'6 Days'},{v:'7-day',l:'7 Days'},{v:'8-day',l:'8 Days'},{v:'10-day',l:'10+ Days'}].map(f => (
              <Link key={f.v} to={`/group-tours?type=${f.v}`} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${typeFilter === f.v ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}>{f.l}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {filteredTours.length} Group Tour{filteredTours.length !== 1 ? 's' : ''} Available
            </h2>
            <p className="text-gray-600">Best deals for 2026/2027 - Book now with flexible cancellation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, index) => (
              <motion.div 
                key={tour.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: (index % 3) * 0.1 }} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: tour.gallery, index: 0 })}>
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {tour.gallery.length} Photos</div>
                  {tour.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize">{tour.type}</div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(tour.rating))}</span>
                    <span className="text-xs text-gray-500">({tour.reviews} reviews)</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{tour.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tour.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tour.highlights.slice(0, 3).map(h => (
                      <span key={h} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">🏛️ {h}</span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {tour.originalPrice > tour.price && (
                        <span className="text-sm text-gray-400 line-through">${tour.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-primary-600">${tour.price}</span>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <Link to={`/group-tours/${tour.id}`} className="btn btn-primary w-full text-sm text-center">
                      View Full Details
                    </Link>
                    <button 
                      onClick={() => { setFormData(p => ({ ...p, selectedTour: tour.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Book Your Group Tour</h2>
            <p className="text-gray-600">Fill out the form or chat directly on WhatsApp for instant booking</p>
          </div>
          <form onSubmit={handleFormSubmit} className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Your full name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="your@email.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp *</label><input type="tel" required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="+1 234 567 890" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label><input type="text" value={formData.nationality} onChange={e => setFormData(p => ({ ...p, nationality: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Your nationality" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Select Tour *</label><select required value={formData.selectedTour} onChange={e => setFormData(p => ({ ...p, selectedTour: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"><option value="">Choose a tour...</option>{groupTourPackages.map(t => (<option key={t.id} value={t.title}>{t.title} - ${t.price}</option>))}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Travel Date *</label><input type="date" required value={formData.travelDate} onChange={e => setFormData(p => ({ ...p, travelDate: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label><input type="number" min="1" max="20" value={formData.travelers} onChange={e => setFormData(p => ({ ...p, travelers: parseInt(e.target.value) }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label><textarea rows="3" value={formData.specialRequests} onChange={e => setFormData(p => ({ ...p, specialRequests: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Any dietary requirements, mobility needs, or special requests..."></textarea></div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="flex-1 btn btn-primary py-4 text-lg">📱 Book via WhatsApp</button>
              <button type="button" onClick={() => formData.selectedTour && handleStripeCheckout(groupTourPackages.find(t => t.title === formData.selectedTour))} disabled={checkoutLoading || !formData.selectedTour} className="flex-1 btn bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 text-lg disabled:opacity-50">{checkoutLoading ? 'Processing...' : '💳 Pay with Card'}</button>
            </div>
            {formSuccess && <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">✅ Opening WhatsApp... Please complete your booking there!</div>}
          </form>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Traveler Stories</span>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Group Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">{review.name.charAt(0)}</div>
                  <div><p className="font-semibold text-gray-900">{review.name}</p><p className="text-sm text-gray-500">{review.country}</p></div>
                </div>
                <div className="text-yellow-400 mb-2">{'★'.repeat(review.rating)}</div>
                <p className="text-xs text-primary-600 font-medium mb-2">{review.tour}</p>
                <p className="text-gray-600 text-sm italic">"{review.text}"</p>
                <p className="text-xs text-gray-400 mt-3">{review.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Questions?</span>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className={`text-2xl text-primary-500 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-5 pb-5 text-gray-600">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="container-custom text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Ready to Explore Egypt?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Join thousands of happy travelers who discovered Egypt with our expert-led group tours. Best prices guaranteed!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#booking-form" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">Book Your Tour Now</a>
            <a href="https://wa.me/201212011881" target="_blank" rel="noopener noreferrer" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg">💬 Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(p => ({ ...p, open: false }))}>
            <button className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300" onClick={() => setLightbox(p => ({ ...p, open: false }))}>×</button>
            <button className="absolute left-4 text-white text-4xl hover:text-gray-300 p-4" onClick={(e) => { e.stopPropagation(); setLightbox(p => ({ ...p, index: (p.index - 1 + p.images.length) % p.images.length })) }}>‹</button>
            <img src={lightbox.images[lightbox.index]} alt="" className="max-w-full max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
            <button className="absolute right-4 text-white text-4xl hover:text-gray-300 p-4" onClick={(e) => { e.stopPropagation(); setLightbox(p => ({ ...p, index: (p.index + 1) % p.images.length })) }}>›</button>
            <div className="absolute bottom-4 text-white text-sm">{lightbox.index + 1} / {lightbox.images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default GroupTours
