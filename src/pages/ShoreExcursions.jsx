import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

const excursions = [
  // Alexandria Port Excursions (6 trips)
  {
    id: 'alexandria-day-tour',
    title: 'Alexandria Day Tour from Alexandria Port',
    port: 'alexandria',
    duration: '5 Hours',
    price: 130,
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
    gallery: ['https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    highlights: ['Catacombs of Kom El Shoqafa','Pompey\'s Pillar','Qaitbay Citadel','Bibliotheca Alexandrina','Mediterranean Views'],
    description: 'Alexandria is a combination of Pharaonic, Roman and modern styles. Visit the Qaitbay citadel, the Catacombs, the Pillar of Pompeii and the Library of Alexandria as main attractions.',
    itinerary: [
      { time: '08:00', activity: 'Meet at Alexandria Port' },
      { time: '08:30', activity: 'Catacombs of Kom El Shoqafa tour' },
      { time: '10:00', activity: 'Pompey\'s Pillar visit' },
      { time: '11:00', activity: 'Qaitbay Citadel exploration' },
      { time: '12:00', activity: 'Lunch' },
      { time: '13:00', activity: 'Bibliotheca Alexandrina tour' },
      { time: '14:30', activity: 'Return to Alexandria Port' },
    ],
    included: ['Private AC vehicle','Licensed guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal expenses','Beverages'],
    rating: 4.8, reviews: 645, bestSeller: true,
    link: 'https://egypttimetravel.com/tour/alexandria-day-tour-from-alexandria-port/'
  },
  {
    id: 'alex-cairo-city-tour',
    title: 'Cairo City Tour from Alexandria Port',
    port: 'alexandria',
    duration: '8 Hours',
    price: 170,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
    gallery: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    highlights: ['Egyptian Museum','Citadel of Saladin','Hanging Church','Santa Barbara Church','Ben Ezra Synagogue','Old Cairo'],
    description: 'An interesting cultural tour of the Egyptian Museum and the Old Cairo area. Get to know the Citadel of Saladin, the Suspended Church, a Church of Santa Barbara and Abu Segra and the Synagogue of Ben Ezra.',
    itinerary: [
      { time: '06:00', activity: 'Meet at Alexandria Port' },
      { time: '06:30', activity: 'Depart for Cairo (3 hrs)' },
      { time: '09:30', activity: 'Egyptian Museum visit (2 hrs)' },
      { time: '11:30', activity: 'Citadel of Saladin tour' },
      { time: '13:00', activity: 'Lunch' },
      { time: '14:00', activity: 'Old Cairo - Coptic area tour' },
      { time: '16:00', activity: 'Return to Alexandria' },
      { time: '19:00', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Egyptologist guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal items'],
    rating: 4.9, reviews: 523, bestSeller: false,
    link: 'https://egypttimetravel.com/cairo-city-tour-from-alexandria-port'
  },
  {
    id: 'alex-memphis-sakkara',
    title: 'Memphis and Sakkara Day Tour from Alexandria Port',
    port: 'alexandria',
    duration: '6 Hours',
    price: 170,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    highlights: ['Memphis First Capital','Step Pyramid of Djoser','Sakkara Necropolis','Ancient History','Pharaonic Monuments'],
    description: 'A fascinating day trip to Egypt\'s first capital, Memphis and Djoser\'s Pyramid of steps in Sakkara, the first built.',
    itinerary: [
      { time: '06:00', activity: 'Meet at Alexandria Port' },
      { time: '06:30', activity: 'Depart for Cairo area (3 hrs)' },
      { time: '09:30', activity: 'Memphis open-air museum visit' },
      { time: '11:00', activity: 'Sakkara necropolis tour' },
      { time: '13:00', activity: 'Lunch' },
      { time: '14:00', activity: 'Return to Alexandria' },
      { time: '17:00', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Expert guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal expenses'],
    rating: 4.7, reviews: 412, bestSeller: false,
    link: 'https://egypttimetravel.com/memphis-and-sakkara-day-tour-from-alexandria-port'
  },
  {
    id: 'alex-memphis-sakkara-giza',
    title: 'Memphis, Saqqara and Pyramids of Giza Tour from Alexandria Port',
    port: 'alexandria',
    duration: '8 Hours',
    price: 170,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    gallery: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800','https://images.unsplash.com/photo-1586862449400-5ab7dda8e7a4?w=800'],
    highlights: ['Pyramids of Giza','Step Pyramid','Memphis Museum','Great Sphinx','Seven Wonders','Ancient Egypt'],
    description: 'Enjoy a full day to visit the Pyramids of Egypt. Visit the Pyramids of Giza, one of the seven wonders of the world and the Step Pyramid of Zoser. And also the first Egyptian capital, Memphis.',
    itinerary: [
      { time: '06:00', activity: 'Meet at Alexandria Port' },
      { time: '06:30', activity: 'Depart for Cairo (3 hrs)' },
      { time: '09:30', activity: 'Giza Pyramids & Sphinx tour' },
      { time: '11:30', activity: 'Memphis visit' },
      { time: '13:00', activity: 'Lunch' },
      { time: '14:00', activity: 'Sakkara complex tour' },
      { time: '16:00', activity: 'Return to Alexandria' },
      { time: '19:00', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Egyptologist guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Inside pyramid entry','Personal items'],
    rating: 4.9, reviews: 782, bestSeller: true,
    link: 'https://egypttimetravel.com/memphis-saqqara-and-pyramids-of-giza-tour-from-alexandria-port'
  },
  {
    id: 'alex-dahshur-sakkara',
    title: 'Tour of the Pyramids of Dahshur and Saqqara from Alexandria Port',
    port: 'alexandria',
    duration: '8 Hours',
    price: 170,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    highlights: ['Dahshur Pyramids','Red Pyramid','Bent Pyramid','Step Pyramid','Sakkara Complex','Ancient Pyramids'],
    description: 'The pyramids of Saqqara and Dahshur in 1 unique and lovely tour. Visit Step Pyramid - the first pyramid built, the Red Pyramid, and a curved one.',
    itinerary: [
      { time: '06:00', activity: 'Meet at Alexandria Port' },
      { time: '06:30', activity: 'Depart for Dahshur (3.5 hrs)' },
      { time: '10:00', activity: 'Dahshur pyramids - Red & Bent' },
      { time: '12:00', activity: 'Sakkara complex tour' },
      { time: '13:30', activity: 'Lunch' },
      { time: '14:30', activity: 'Return to Alexandria' },
      { time: '18:00', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Licensed guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal expenses'],
    rating: 4.8, reviews: 356, bestSeller: false,
    link: 'https://egypttimetravel.com/tour-of-the-pyramids-of-dahshur-and-saqqara-from-alexandria-port'
  },
  {
    id: 'alex-giza-museum',
    title: 'Tour to Giza Pyramids and Egyptian Museum from Alexandria Port',
    port: 'alexandria',
    duration: '5 Hours',
    price: 160,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    gallery: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800','https://images.unsplash.com/photo-1586862449400-5ab7dda8e7a4?w=800'],
    highlights: ['Pyramids of Giza','Egyptian Museum','Great Sphinx','Tutankhamun Treasures','Mummies','Ancient Artifacts'],
    description: 'From Alexandria Port to Cairo, immerse yourself in ancient Egypt for a short time by visiting the pyramids of Giza and the Egyptian Museum.',
    itinerary: [
      { time: '06:00', activity: 'Meet at Alexandria Port' },
      { time: '06:30', activity: 'Depart for Cairo (3 hrs)' },
      { time: '09:30', activity: 'Giza Pyramids & Sphinx tour' },
      { time: '11:30', activity: 'Egyptian Museum visit' },
      { time: '13:30', activity: 'Lunch' },
      { time: '14:30', activity: 'Return to Alexandria' },
      { time: '17:30', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Egyptologist guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Inside pyramid entry','Personal items'],
    rating: 4.9, reviews: 698, bestSeller: true,
    link: 'https://egypttimetravel.com/tour/cairo-tour-from-alexandria-port/'
  },
  // Port Said Excursions (6 trips)
  {
    id: 'port-said-cairo-tour',
    title: 'Cairo Tour From Port Said Port',
    port: 'port-said',
    duration: '5 Hours',
    price: 160,
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600',
    gallery: ['https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    highlights: ['Pyramids of Giza','Egyptian Museum','Great Sphinx','Cairo Highlights','Ancient Egypt','Quick Tour'],
    description: 'During your transit in Cairo, immerse yourself in ancient Egypt for a short time by visiting the pyramids of Giza and the Egyptian Museum.',
    itinerary: [
      { time: '07:00', activity: 'Meet at Port Said' },
      { time: '07:30', activity: 'Depart for Cairo (2.5 hrs)' },
      { time: '10:00', activity: 'Giza Pyramids & Sphinx tour' },
      { time: '12:00', activity: 'Egyptian Museum visit' },
      { time: '14:00', activity: 'Lunch' },
      { time: '15:00', activity: 'Return to Port Said' },
      { time: '17:30', activity: 'Arrive at port' },
    ],
    included: ['Private vehicle','Licensed guide','All entrance fees','Lunch','Water','Port pickup/dropoff','Ship guarantee'],
    excluded: ['Tips','Personal items'],
    rating: 4.8, reviews: 534, bestSeller: true,
    link: 'https://egypttimetravel.com/tour/cairo-tour-from-port-said-port/'
  },
  {
    id: 'port-said-saqqara-giza',
    title: 'Saqqara and Giza Pyramids Tour From Port Said',
    port: 'port-said',
    duration: '5 Hours',
    price: 160,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'],
    highlights: ['Pyramids of Giza','Step Pyramid of Zoser','Memphis','Seven Wonders','Ancient Capital','Pharaonic History'],
    description: 'Enjoy a full day to visit the Pyramids of Egypt. Visit the Pyramids of Giza, one of the seven wonders of the world and the Step Pyramid of Zoser. And also the first Egyptian capital, Memphis.',
    itinerary: [
      { time: '07:00', activity: 'Meet at Port Said' },
      { time: '07:30', activity: 'Depart for Cairo (2.5 hrs)' },
      { time: '10:00', activity: 'Giza Pyramids tour' },
      { time: '12:00', activity: 'Sakkara & Step Pyramid' },
      { time: '13:30', activity: 'Memphis visit' },
      { time: '14:30', activity: 'Lunch' },
      { time: '15:30', activity: 'Return to Port Said' },
      { time: '18:00', activity: 'Arrive at port' },
    ],
    included: ['Private vehicle','Egyptologist guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal expenses'],
    rating: 4.9, reviews: 467, bestSeller: false,
    link: 'https://egypttimetravel.com/tour/saqqara-and-giza-pyramids-tour-from-port-said/'
  },
  {
    id: 'port-said-alexandria-day',
    title: 'Alexandria Day Tour from Port Said',
    port: 'port-said',
    duration: '5 Hours',
    price: 130,
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
    gallery: ['https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    highlights: ['Qaitbay Citadel','Catacombs','Pompey Pillar','Alexandria Library','Mediterranean','Pharaonic & Roman'],
    description: 'Alexandria is a combination of Pharaonic, Roman and modern styles. Visit the Qaitbay citadel, the Catacombs, the Pillar of Pompeii and the Library of Alexandria as main attractions.',
    itinerary: [
      { time: '07:00', activity: 'Meet at Port Said' },
      { time: '07:30', activity: 'Drive to Alexandria (2 hrs)' },
      { time: '09:30', activity: 'Catacombs tour' },
      { time: '10:30', activity: 'Pompey Pillar & Qaitbay Citadel' },
      { time: '12:00', activity: 'Lunch' },
      { time: '13:00', activity: 'Bibliotheca Alexandrina' },
      { time: '14:30', activity: 'Return to Port Said' },
      { time: '16:30', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Licensed guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal expenses','Beverages'],
    rating: 4.7, reviews: 389, bestSeller: false,
    link: 'https://egypttimetravel.com/alexandria-day-tour-from-port-said'
  },
  {
    id: 'port-said-cairo-city',
    title: 'Cairo City Tour from Port Said',
    port: 'port-said',
    duration: '8 Hours',
    price: 170,
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600',
    gallery: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    highlights: ['Egyptian Museum','Citadel of Saladin','Hanging Church','Ben Ezra Synagogue','Old Cairo','Islamic Cairo'],
    description: 'An interesting cultural tour of the Egyptian Museum and the Old Cairo area. Get to know the Citadel of Saladin, the Suspended Church, a Church of Santa Barbara and Abu Segra and the Synagogue of Ben Ezra.',
    itinerary: [
      { time: '06:30', activity: 'Meet at Port Said' },
      { time: '07:00', activity: 'Depart for Cairo (2.5 hrs)' },
      { time: '09:30', activity: 'Egyptian Museum visit' },
      { time: '11:30', activity: 'Citadel of Saladin' },
      { time: '13:00', activity: 'Lunch' },
      { time: '14:00', activity: 'Old Cairo - Coptic area' },
      { time: '16:00', activity: 'Return to Port Said' },
      { time: '18:30', activity: 'Arrive at port' },
    ],
    included: ['Private transport','Expert guide','All tickets','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal expenses'],
    rating: 4.8, reviews: 398, bestSeller: false,
    link: 'https://egypttimetravel.com/cairo-city-tour-from-port-said'
  },
  {
    id: 'port-said-memphis-sakkara',
    title: 'Memphis and Sakkara Day Tour from Port Said',
    port: 'port-said',
    duration: '6 Hours',
    price: 170,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    highlights: ['Memphis Capital','Step Pyramid','Sakkara Necropolis','Ancient History','Pharaonic Sites','Djoser Pyramid'],
    description: 'A fascinating day trip to Egypt\'s first capital, Memphis and Djoser\'s Pyramid of steps in Sakkara, the first built.',
    itinerary: [
      { time: '06:30', activity: 'Meet at Port Said' },
      { time: '07:00', activity: 'Depart for Memphis area (2.5 hrs)' },
      { time: '09:30', activity: 'Memphis open-air museum' },
      { time: '11:00', activity: 'Sakkara necropolis & Step Pyramid' },
      { time: '13:00', activity: 'Lunch' },
      { time: '14:00', activity: 'Return to Port Said' },
      { time: '16:30', activity: 'Arrive at port' },
    ],
    included: ['Private vehicle','Expert guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal expenses'],
    rating: 4.7, reviews: 342, bestSeller: false,
    link: 'https://egypttimetravel.com/memphis-and-sakkara-day-tour-from-port-said'
  },
  {
    id: 'port-said-dahshur-sakkara',
    title: 'Tour of the Pyramids of Dahshur and Saqqara from Port Said',
    port: 'port-said',
    duration: '8 Hours',
    price: 170,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    highlights: ['Step Pyramid','Red Pyramid','Bent Pyramid','Dahshur','Sakkara','Ancient Pyramids'],
    description: 'The pyramids of Saqqara and Dahshur in 1 unique and lovely tour. Visit Step Pyramid - the first pyramid built, the Red Pyramid, and a curved one.',
    itinerary: [
      { time: '06:30', activity: 'Meet at Port Said' },
      { time: '07:00', activity: 'Depart for Dahshur (3 hrs)' },
      { time: '10:00', activity: 'Dahshur - Red & Bent pyramids' },
      { time: '12:00', activity: 'Sakkara complex tour' },
      { time: '13:30', activity: 'Lunch' },
      { time: '14:30', activity: 'Return to Port Said' },
      { time: '17:30', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Licensed guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal expenses'],
    rating: 4.8, reviews: 298, bestSeller: false,
    link: 'https://egypttimetravel.com/tour-of-the-pyramids-of-dahshur-and-saqqara-from-port-said'
  },
  // Safaga Port Excursions (7 trips)
  {
    id: 'safaga-luxor-day',
    title: 'Day Tour to Luxor from Safaga Port',
    port: 'safaga',
    duration: '5 Hours',
    price: 380,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'],
    highlights: ['Valley of the Kings','Karnak Temple','Temple of Hatshepsut','Colossi of Memnon','Luxor Temples','Ancient Thebes'],
    description: 'Discover the wonders of ancient Thebes with visits to Valley of the Kings, Karnak Temple complex, Hatshepsut Temple, and the Colossi of Memnon. A comprehensive Luxor experience from Safaga Port.',
    itinerary: [
      { time: '05:00', activity: 'Meet at Safaga Port' },
      { time: '05:30', activity: 'Drive to Luxor (3.5 hrs)' },
      { time: '09:00', activity: 'Valley of the Kings tour' },
      { time: '11:00', activity: 'Hatshepsut Temple & Colossi' },
      { time: '12:30', activity: 'Lunch' },
      { time: '13:30', activity: 'Karnak Temple complex' },
      { time: '15:30', activity: 'Return to Safaga' },
      { time: '19:00', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Egyptologist guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Optional tomb entries','Beverages'],
    rating: 4.9, reviews: 923, bestSeller: true,
    link: 'https://egypttimetravel.com/tour/luxor-day-tour-from-safaga-port/'
  },
  {
    id: 'safaga-snorkeling',
    title: 'Snorkeling Trip from Safaga Port',
    port: 'safaga',
    duration: '5 Hours',
    price: 80,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
    gallery: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    highlights: ['Coral Reefs','Tropical Fish','Red Sea','Snorkeling Spots','Marine Life','Beach Time'],
    description: 'Explore the stunning coral reefs and colorful marine life of the Red Sea. Perfect for snorkeling enthusiasts seeking underwater adventures from Safaga Port.',
    itinerary: [
      { time: '08:00', activity: 'Meet at Safaga Port' },
      { time: '08:30', activity: 'Boat departure' },
      { time: '09:00', activity: 'First snorkeling spot' },
      { time: '10:30', activity: 'Second reef location' },
      { time: '12:00', activity: 'Lunch onboard' },
      { time: '13:00', activity: 'Beach relaxation' },
      { time: '14:00', activity: 'Return to port' },
    ],
    included: ['Boat trip','Snorkeling equipment','Life jackets','Lunch','Drinks','Port pickup/dropoff','Ship guarantee'],
    excluded: ['Tips','Underwater photos','Personal items'],
    rating: 4.8, reviews: 612, bestSeller: false,
    link: 'https://egypttimetravel.com/snorkeling-trip-from-safaga-port'
  },
  {
    id: 'safaga-semi-submarine',
    title: 'Semi Submarine Tour from Safaga Port',
    port: 'safaga',
    duration: '5 Hours',
    price: 170,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
    gallery: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800','https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    highlights: ['Semi Submarine','Coral Reefs','Red Sea','Underwater Views','Marine Life','Family Friendly'],
    description: 'Experience the Red Sea\'s underwater world without getting wet! Perfect for families and non-swimmers to view coral reefs and tropical fish through semi-submarine windows.',
    itinerary: [
      { time: '08:30', activity: 'Meet at Safaga Port' },
      { time: '09:00', activity: 'Board semi-submarine' },
      { time: '09:30', activity: 'Underwater reef viewing' },
      { time: '11:30', activity: 'Return to surface' },
      { time: '12:00', activity: 'Refreshments' },
      { time: '13:00', activity: 'Return to port' },
    ],
    included: ['Semi-submarine ride','Refreshments','Life jackets','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal items'],
    rating: 4.7, reviews: 445, bestSeller: false,
    link: 'https://egypttimetravel.com/semi-submarine-tour-from-safaga-port'
  },
  {
    id: 'safaga-jeep-safari',
    title: 'Jeep Safari with Camel Ride & Bedouin Dinner from Safaga Port',
    port: 'safaga',
    duration: '5 Hours',
    price: 100,
    image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600',
    gallery: ['https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800','https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'],
    highlights: ['Jeep Safari','Camel Ride','Bedouin Camp','Desert Experience','Traditional Dinner','Sunset Views'],
    description: 'Adventure through the desert on a thrilling jeep safari, ride camels, visit a traditional Bedouin camp, and enjoy an authentic dinner under the stars.',
    itinerary: [
      { time: '14:00', activity: 'Meet at Safaga Port' },
      { time: '14:30', activity: 'Jeep safari begins' },
      { time: '15:30', activity: 'Camel ride experience' },
      { time: '16:30', activity: 'Bedouin camp visit' },
      { time: '17:00', activity: 'Traditional dinner' },
      { time: '18:30', activity: 'Return to port' },
    ],
    included: ['Jeep safari','Camel ride','Bedouin dinner','Tea','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal items','Extra beverages'],
    rating: 4.8, reviews: 567, bestSeller: false,
    link: 'https://egypttimetravel.com/jeep-safari-bedouin-dinner-safaga-port'
  },
  {
    id: 'safaga-quad-sunset',
    title: 'Quad Bike at Sunset from Safaga Port',
    port: 'safaga',
    duration: '5 Hours',
    price: 80,
    image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600',
    gallery: ['https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800','https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'],
    highlights: ['Quad Biking','Desert Adventure','Sunset Views','Thrilling Ride','Photo Opportunities','Desert Landscapes'],
    description: 'Ride through the desert on powerful quad bikes and watch the spectacular sunset over the dunes. An adrenaline-filled adventure from Safaga Port.',
    itinerary: [
      { time: '14:30', activity: 'Meet at Safaga Port' },
      { time: '15:00', activity: 'Safety briefing & practice' },
      { time: '15:30', activity: 'Quad biking adventure' },
      { time: '17:00', activity: 'Sunset viewing stop' },
      { time: '17:45', activity: 'Return ride' },
      { time: '18:30', activity: 'Arrive at port' },
    ],
    included: ['Quad bike rental','Safety equipment','Guide','Tea','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal items','Photos'],
    rating: 4.9, reviews: 489, bestSeller: false,
    link: 'https://egypttimetravel.com/quad-bike-sunset-safaga-port'
  },
  {
    id: 'safaga-hot-air-balloon',
    title: 'Hot Air Balloon in Luxor from Safaga Port',
    port: 'safaga',
    duration: '5 Hours',
    price: 200,
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=600',
    gallery: ['https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800','https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800'],
    highlights: ['Hot Air Balloon','Aerial Views','Luxor Sunrise','Valley of the Kings','Nile River','Unforgettable Experience'],
    description: 'Soar above Luxor at sunrise in a hot air balloon. Witness breathtaking views of the Valley of the Kings, temples, and the Nile River from the sky. An unforgettable bucket-list experience.',
    itinerary: [
      { time: '04:00', activity: 'Meet at Safaga Port' },
      { time: '04:30', activity: 'Drive to Luxor West Bank' },
      { time: '05:30', activity: 'Hot air balloon preparation' },
      { time: '06:00', activity: 'Sunrise balloon flight (45 min)' },
      { time: '07:00', activity: 'Landing & celebration' },
      { time: '07:30', activity: 'Return to Safaga' },
      { time: '09:30', activity: 'Arrive at port' },
    ],
    included: ['Hot air balloon ride','Transportation','Certificate','Snacks','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal items'],
    rating: 5.0, reviews: 789, bestSeller: true,
    link: 'https://egypttimetravel.com/hot-air-balloon-luxor-safaga-port'
  },
  {
    id: 'safaga-luxor-overnight',
    title: 'Overnight Luxor Tour from Safaga Port',
    port: 'safaga',
    duration: '2 Days',
    price: 240,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'],
    highlights: ['Two Day Tour','Valley of the Kings','Karnak Temple','Luxor Temple','Hotel Accommodation','Comprehensive Tour'],
    description: 'Extended tour of Luxor with overnight hotel stay. Visit all major attractions including Valley of the Kings, Karnak, Luxor Temple, and more without rushing. Perfect for cruise ships staying overnight at Sa faga Port.',
    itinerary: [
      { time: 'Day 1 - 05:00', activity: 'Meet at Safaga Port' },
      { time: 'Day 1 - 09:00', activity: 'Valley of the Kings' },
      { time: 'Day 1 - 11:00', activity: 'Hatshepsut Temple' },
      { time: 'Day 1 - 13:00', activity: 'Lunch' },
      { time: 'Day 1 - 14:00', activity: 'Karnak Temple' },
      { time: 'Day 1 - 18:00', activity: 'Hotel check-in & dinner' },
      { time: 'Day 2 - 09:00', activity: 'Luxor Temple visit' },
      { time: 'Day 2 - 11:00', activity: 'Free time/shopping' },
      { time: 'Day 2 - 13:00', activity: 'Return to Safaga' },
    ],
    included: ['Hotel accommodation','All meals','Egyptologist guide','All entrance fees','Transport','Port transfers','Ship guarantee'],
    excluded: ['Tips','Personal items','Beverages'],
    rating: 4.9, reviews: 345, bestSeller: false,
    link: 'https://egypttimetravel.com/overnight-luxor-tour-safaga-port'
  },
  // Sokhna Port Excursions (2 trips)
  {
    id: 'sokhna-giza-museum-khan',
    title: 'Giza Pyramids, Museum & Khan El Khalili from Sokhna Port',
    port: 'sokhna',
    duration: '12 Hours',
    price: 105,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600',
    gallery: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800','https://images.unsplash.com/photo-1586862449400-5ab7dda8e7a4?w=800'],
    highlights: ['Pyramids of Giza','Egyptian Museum','Khan El Khalili','Great Sphinx','Cairo Highlights','Shopping'],
    description: 'From Sokhna Port, the closest port to Cairo, visit the Giza Pyramids, Egyptian Museum with Tutankhamun treasures, and shop at the famous Khan El Khalili Bazaar. The perfect Cairo introduction.',
    itinerary: [
      { time: '07:00', activity: 'Meet at Sokhna Port' },
      { time: '07:15', activity: 'Depart for Cairo (2 hrs)' },
      { time: '09:15', activity: 'Giza Pyramids & Sphinx' },
      { time: '11:45', activity: 'Lunch' },
      { time: '12:45', activity: 'Egyptian Museum' },
      { time: '14:45', activity: 'Khan El Khalili Bazaar' },
      { time: '16:15', activity: 'Return to Sokhna' },
      { time: '18:15', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Egyptologist guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Inside pyramid entry','Shopping','Personal items'],
    rating: 4.9, reviews: 789, bestSeller: true,
    link: 'https://egypttimetravel.com/giza-pyramids-museum-khan-sokhna-port'
  },
  {
    id: 'sokhna-giza-memphis-sakkara',
    title: 'Giza Pyramids, Memphis & Sakkara from Sokhna Port',
    port: 'sokhna',
    duration: '12 Hours',
    price: 180,
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600',
    gallery: ['https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800','https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'],
    highlights: ['Pyramids of Giza','Memphis Capital','Step Pyramid','Sakkara Complex','Ancient Egypt','Pharaonic Sites'],
    description: 'Comprehensive ancient Egypt tour from Sokhna Port. Visit Giza Pyramids, Memphis (first capital), and Sakkara with the Step Pyramid - the oldest pyramid in the world. Discover secrets of Egypt\'s civilization.',
    itinerary: [
      { time: '07:00', activity: 'Meet at Sokhna Port' },
      { time: '07:15', activity: 'Depart for Cairo (2 hrs)' },
      { time: '09:15', activity: 'Giza Pyramids & Sphinx' },
      { time: '10:45', activity: 'Drive to Memphis' },
      { time: '11:30', activity: 'Memphis open-air museum' },
      { time: '13:00', activity: 'Lunch' },
      { time: '13:45', activity: 'Sakkara & Step Pyramid' },
      { time: '16:15', activity: 'Return to Sokhna' },
      { time: '18:15', activity: 'Arrive at port' },
    ],
    included: ['Private AC vehicle','Egyptologist guide','All entrance fees','Lunch','Water','Port transfers','Ship guarantee'],
    excluded: ['Tips','Inside pyramid entry','Personal expenses'],
    rating: 4.9, reviews: 856, bestSeller: true,
    link: 'https://egypttimetravel.com/giza-memphis-sakkara-sokhna-port'
  },
]

const faqs = [
  { q: 'Will I make it back to my cruise ship on time?', a: 'Absolutely — we GUARANTEE you\'ll return to port before your ship departs. We monitor sailing times, allow buffer time, and maintain constant communication with port authorities. In 10+ years, we\'ve never missed a ship departure.' },
  { q: 'Do you pick up directly from the cruise port?', a: 'Yes! Your guide meets you right at the port exit holding a sign with your name. No taxis, no confusion. At the end of the tour, we drop you back at the same port entrance.' },
  { q: 'What if my ship arrives late or the port schedule changes?', a: 'We monitor all ship arrivals in real-time. If your ship is delayed, we adjust the pickup time automatically. If the port schedule changes, we\'ll contact you immediately to reschedule.' },
  { q: 'How many people will be in my tour group?', a: 'All our shore excursions are 100% private — just your party. No waiting for others, no fixed schedules, no large group crowds. You decide the pace.' },
  { q: 'Is it safe to do a shore excursion independently?', a: 'Yes, Egypt is very safe for tourists. Our guides are licensed by the Ministry of Tourism, vehicles are modern and insured, and we follow all safety regulations. You\'re in expert hands from port to port.' },
  { q: 'What if I want to see both the Pyramids and Alexandria in one day?', a: 'This is possible but very long (14+ hours). We recommend choosing one: Pyramids/Cairo for first-time visitors, Alexandria for those who\'ve seen the Pyramids. Contact us to discuss the best option for your port time.' },
  { q: 'Can I do a shore excursion with children?', a: 'Absolutely! All our tours are family-friendly. We provide car seats for toddlers, shorter walking routes for young children, and kid-friendly restaurant options. Children under 6 are free.' },
  { q: 'What is the cancellation policy for shore excursions?', a: 'Free cancellation up to 48 hours before your ship\'s arrival. Within 48 hours: 50% charge. If your ship skips the port due to weather or other reasons, full refund guaranteed.' },
]

const reviews = [
  { name: 'Robert & Jane', country: 'USA 🇺🇸', rating: 5, excursion: 'Alexandria → Pyramids', text: 'We were worried about making it back to our cruise, but the driver was so efficient. Saw the Pyramids AND the museum and were back at port 2 hours early. Best shore excursion of our Mediterranean cruise!', date: 'January 2026' },
  { name: 'Thomas Müller', country: 'Germany 🇩🇪', rating: 5, excursion: 'Safaga → Luxor', text: 'Long day but incredibly worth it. Valley of the Kings was a dream come true. Our Egyptologist made the temples come alive with stories. Would do this 100 times over.', date: 'December 2025' },
  { name: 'Sarah O\'Connor', country: 'Ireland 🇮🇪', rating: 5, excursion: 'Ain Sokhna → Cairo', text: 'So much better than the ship\'s excursion — private car, no crowds, our own guide. We even had time for Khan El Khalili shopping. Half the price of the cruise line option!', date: 'November 2025' },
  { name: 'Akiko & Hiroshi', country: 'Japan 🇯🇵', rating: 5, excursion: 'Safaga → Snorkeling', text: 'The Red Sea snorkeling was breathtaking! Crystal clear water, colorful fish everywhere. A perfect break from all the temple visits. The Giftun Island beach was paradise.', date: 'February 2026' },
]

const ShoreExcursions = () => {
  const [searchParams] = useSearchParams()
  const portFilter = searchParams.get('port') || ''
  const [openFaq, setOpenFaq] = useState(null)
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', shipName: '', selectedExcursion: '', arrivalDate: '', travelers: 2, cabinNumber: '', specialRequests: '' })
  const [formSuccess, setFormSuccess] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Database packages state
  const [dbExcursions, setDbExcursions] = useState([])
  const [dbLoading, setDbLoading] = useState(true)

  // Fetch Shore Excursion packages from Supabase
  useEffect(() => {
    const fetchShoreExcursions = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_published', true)
          .eq('style', 'Shore Excursion')
          .order('created_at', { ascending: false })
        
        if (!error && data && data.length > 0) {
          // Transform Supabase format to match excursion format
          const transformed = data.map(pkg => ({
            id: pkg.slug || pkg.id,
            title: pkg.title,
            port: 'alexandria', // default
            duration: pkg.duration || `${pkg.duration_days} Hours`,
            price: pkg.price,
            image: pkg.image || 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600',
            gallery: pkg.gallery || [],
            highlights: pkg.highlights || [],
            description: pkg.description,
            itinerary: (pkg.itinerary || []).map((item, idx) => ({
              time: item.title || `Stop ${idx + 1}`,
              activity: item.details || '',
            })),
            included: pkg.included || [],
            excluded: pkg.excluded || [],
            rating: pkg.rating || 4.5,
            reviews: pkg.reviews || 0,
            bestSeller: pkg.best_seller || false,
            link: '#',
            fromDb: true,
          }))
          setDbExcursions(transformed)
          console.log('✅ Loaded', data.length, 'Shore Excursion packages from Supabase')
        }
      } catch (err) {
        console.log('⚠️ Using static Shore Excursions data:', err.message)
      }
      setDbLoading(false)
    }
    fetchShoreExcursions()
  }, [])

  // Combine database excursions with static ones (database first)
  const allExcursions = [...dbExcursions, ...excursions.filter(e => !dbExcursions.find(de => de.id === e.id))]

  const filteredExcursions = allExcursions.filter(e => !portFilter || e.port === portFilter)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const message = `Hello! I'd like to book a Shore Excursion:\n\n⚓ Excursion: ${formData.selectedExcursion}\n🚢 Ship: ${formData.shipName}\n🔑 Cabin: ${formData.cabinNumber}\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n📅 Arrival Date: ${formData.arrivalDate}\n👥 Travelers: ${formData.travelers}\n📝 Notes: ${formData.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(message)}`, '_blank')
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 5000)
  }

  const handleStripeCheckout = async (exc) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carName: exc.title, carId: exc.id, routeFrom: 'Shore Excursion', routeTo: exc.port, distance: 0, transferDate: formData.arrivalDate || '', transferTime: '', passengers: formData.travelers || 2, amount: exc.price * (formData.travelers || 2), customerEmail: formData.email || undefined }),
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
        <div className="absolute inset-0 opacity-75"><img src="https://i0.wp.com/egypttimetravel.com/wp-content/uploads/2021/06/page-header-52.jpg?resize=1920%2C900&ssl=1" alt="Egyptian coastal port with cruise ships" className="w-full h-full object-cover object-center" /></div>
        <div className="relative container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6"><Link to="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Shore Excursions</span></nav>
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">From Your Cruise Ship</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Shore Excursions in Egypt</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl">Private day trips from Egypt's cruise ports. See the Pyramids, explore Luxor, or snorkel the Red Sea — and we guarantee you'll be back on your ship on time.</p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Port Pickup</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Ship Return Guarantee</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Private Tours</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Licensed Guides</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> 50% Less Than Ship Prices</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ship Return Guarantee Banner */}
      <section className="bg-green-50 border-b border-green-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-center gap-3 text-green-800">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="font-semibold text-sm md:text-base">🛡️ Ship Return Guarantee — We've NEVER missed a ship departure in 10+ years. If we're late, we pay for your taxi to the next port.</span>
          </div>
        </div>
      </section>

      {/* Best Alexandria Port Shore Excursions */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Best Alexandria Port Shore Excursions</h2>
            <p className="text-gray-600">Explore ancient wonders from Egypt's Mediterranean jewel</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.filter(e => e.port === 'alexandria').map((exc, index) => (
              <motion.div 
                key={exc.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: (index % 3) * 0.1 }} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: exc.gallery, index: 0 })}>
                  <img src={exc.image} alt={exc.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {exc.gallery.length} Photos</div>
                  {exc.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize">⚓ {exc.port.replace('-', ' ')}</div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Duration & Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">⏱ {exc.duration}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(exc.rating))}</span>
                    <span className="text-xs text-gray-500">({exc.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{exc.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{exc.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exc.highlights.slice(0, 3).map(h => (
                      <span key={h} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">✓ {h}</span>
                    ))}
                  </div>

                  {/* Full Program/Itinerary Preview */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Itinerary Preview:</h4>
                    <div className="space-y-1">
                      {exc.itinerary.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="text-xs text-primary-600 font-semibold">{item.time}</span>
                          <span className="text-xs text-gray-600 line-clamp-1">{item.activity}</span>
                        </div>
                      ))}
                      {exc.itinerary.length > 3 && (
                        <p className="text-xs text-gray-500 italic mt-2">+ {exc.itinerary.length - 3} more stops...</p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {exc.originalPrice > exc.price && (
                        <span className="text-sm text-gray-400 line-through">${exc.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-primary-600">${exc.price}</span>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">✓ Guaranteed return to ship on time</p>
                  </div>

                  {/* Included/Excluded Summary */}
                  <div className="mb-4 text-xs text-gray-600">
                    <div className="flex items-start gap-1 mb-1">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="line-clamp-2">{exc.included.join(', ')}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-red-400 font-bold">✕</span>
                      <span className="line-clamp-1">{exc.excluded.join(', ')}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <Link 
                      to={`/shore-excursions/${exc.id}`}
                      className="btn btn-primary w-full text-sm text-center"
                    >
                      Trip Details
                    </Link>
                    <button 
                      onClick={() => { setFormData(p => ({ ...p, selectedExcursion: exc.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} 
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

      {/* Port Said Shore Excursions */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Port Said Shore Excursions</h2>
            <p className="text-gray-600">Gateway to Cairo and Islamic treasures</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.filter(e => e.port === 'port-said').map((exc, index) => (
              <motion.div 
                key={exc.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: (index % 3) * 0.1 }} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: exc.gallery, index: 0 })}>
                  <img src={exc.image} alt={exc.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {exc.gallery.length} Photos</div>
                  {exc.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize">⚓ {exc.port.replace('-', ' ')}</div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Duration & Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">⏱ {exc.duration}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(exc.rating))}</span>
                    <span className="text-xs text-gray-500">({exc.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{exc.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{exc.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exc.highlights.slice(0, 3).map(h => (
                      <span key={h} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">✓ {h}</span>
                    ))}
                  </div>

                  {/* Full Program/Itinerary Preview */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Itinerary Preview:</h4>
                    <div className="space-y-1">
                      {exc.itinerary.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="text-xs text-primary-600 font-semibold">{item.time}</span>
                          <span className="text-xs text-gray-600 line-clamp-1">{item.activity}</span>
                        </div>
                      ))}
                      {exc.itinerary.length > 3 && (
                        <p className="text-xs text-gray-500 italic mt-2">+ {exc.itinerary.length - 3} more stops...</p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {exc.originalPrice > exc.price && (
                        <span className="text-sm text-gray-400 line-through">${exc.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-primary-600">${exc.price}</span>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">✓ Guaranteed return to ship on time</p>
                  </div>

                  {/* Included/Excluded Summary */}
                  <div className="mb-4 text-xs text-gray-600">
                    <div className="flex items-start gap-1 mb-1">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="line-clamp-2">{exc.included.join(', ')}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-red-400 font-bold">✕</span>
                      <span className="line-clamp-1">{exc.excluded.join(', ')}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <Link 
                      to={`/shore-excursions/${exc.id}`}
                      className="btn btn-primary w-full text-sm text-center"
                    >
                      Trip Details
                    </Link>
                    <button 
                      onClick={() => { setFormData(p => ({ ...p, selectedExcursion: exc.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} 
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

      {/* Safaga Port Shore Excursions */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Safaga Port Shore Excursions</h2>
            <p className="text-gray-600">Discover Luxor temples and Red Sea adventures</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.filter(e => e.port === 'safaga').map((exc, index) => (
              <motion.div 
                key={exc.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: (index % 3) * 0.1 }} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: exc.gallery, index: 0 })}>
                  <img src={exc.image} alt={exc.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {exc.gallery.length} Photos</div>
                  {exc.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize">⚓ {exc.port.replace('-', ' ')}</div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Duration & Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">⏱ {exc.duration}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(exc.rating))}</span>
                    <span className="text-xs text-gray-500">({exc.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{exc.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{exc.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exc.highlights.slice(0, 3).map(h => (
                      <span key={h} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">✓ {h}</span>
                    ))}
                  </div>

                  {/* Full Program/Itinerary Preview */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Itinerary Preview:</h4>
                    <div className="space-y-1">
                      {exc.itinerary.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="text-xs text-primary-600 font-semibold">{item.time}</span>
                          <span className="text-xs text-gray-600 line-clamp-1">{item.activity}</span>
                        </div>
                      ))}
                      {exc.itinerary.length > 3 && (
                        <p className="text-xs text-gray-500 italic mt-2">+ {exc.itinerary.length - 3} more stops...</p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {exc.originalPrice > exc.price && (
                        <span className="text-sm text-gray-400 line-through">${exc.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-primary-600">${exc.price}</span>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">✓ Guaranteed return to ship on time</p>
                  </div>

                  {/* Included/Excluded Summary */}
                  <div className="mb-4 text-xs text-gray-600">
                    <div className="flex items-start gap-1 mb-1">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="line-clamp-2">{exc.included.join(', ')}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-red-400 font-bold">✕</span>
                      <span className="line-clamp-1">{exc.excluded.join(', ')}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <Link 
                      to={`/shore-excursions/${exc.id}`}
                      className="btn btn-primary w-full text-sm text-center"
                    >
                      Trip Details
                    </Link>
                    <button 
                      onClick={() => { setFormData(p => ({ ...p, selectedExcursion: exc.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} 
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

      {/* Sokhna Port Shore Excursions */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Sokhna Port Shore Excursions</h2>
            <p className="text-gray-600">Closest port to Cairo's legendary pyramids</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.filter(e => e.port === 'sokhna').map((exc, index) => (
              <motion.div 
                key={exc.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: (index % 3) * 0.1 }} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setLightbox({ open: true, images: exc.gallery, index: 0 })}>
                  <img src={exc.image} alt={exc.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">📷 {exc.gallery.length} Photos</div>
                  {exc.bestSeller && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔥 Best Seller</div>}
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize">⚓ {exc.port.replace('-', ' ')}</div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Duration & Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">⏱ {exc.duration}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(exc.rating))}</span>
                    <span className="text-xs text-gray-500">({exc.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{exc.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{exc.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exc.highlights.slice(0, 3).map(h => (
                      <span key={h} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">✓ {h}</span>
                    ))}
                  </div>

                  {/* Full Program/Itinerary Preview */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Itinerary Preview:</h4>
                    <div className="space-y-1">
                      {exc.itinerary.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="text-xs text-primary-600 font-semibold">{item.time}</span>
                          <span className="text-xs text-gray-600 line-clamp-1">{item.activity}</span>
                        </div>
                      ))}
                      {exc.itinerary.length > 3 && (
                        <p className="text-xs text-gray-500 italic mt-2">+ {exc.itinerary.length - 3} more stops...</p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      {exc.originalPrice > exc.price && (
                        <span className="text-sm text-gray-400 line-through">${exc.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-primary-600">${exc.price}</span>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">✓ Guaranteed return to ship on time</p>
                  </div>

                  {/* Included/Excluded Summary */}
                  <div className="mb-4 text-xs text-gray-600">
                    <div className="flex items-start gap-1 mb-1">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="line-clamp-2">{exc.included.join(', ')}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-red-400 font-bold">✕</span>
                      <span className="line-clamp-1">{exc.excluded.join(', ')}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <Link 
                      to={`/shore-excursions/${exc.id}`}
                      className="btn btn-primary w-full text-sm text-center"
                    >
                      Trip Details
                    </Link>
                    <button 
                      onClick={() => { setFormData(p => ({ ...p, selectedExcursion: exc.title })); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }) }} 
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
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Book Now</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Reserve Your Shore Excursion</h2>
            <p className="text-gray-600">Tell us your ship details — we'll handle the rest</p>
          </div>
          {formSuccess && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center text-green-700 font-medium">✅ Excursion booked! We'll confirm within 2 hours.</div>}
          <form onSubmit={handleFormSubmit} className="bg-gray-50 rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label><input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="John Smith" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="john@example.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp</label><input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="+1 234 567 8900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Cruise Ship Name *</label><input type="text" required value={formData.shipName} onChange={e => setFormData(p => ({ ...p, shipName: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="e.g. MSC Bellissima" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Select Excursion *</label>
                <select required value={formData.selectedExcursion} onChange={e => setFormData(p => ({ ...p, selectedExcursion: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option value="">Choose an excursion</option>{excursions.map(e => <option key={e.id} value={e.title}>{e.title} — ${e.price}/pp</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Cabin Number</label><input type="text" value={formData.cabinNumber} onChange={e => setFormData(p => ({ ...p, cabinNumber: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="e.g. 8042" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Port Arrival Date *</label><input type="date" required value={formData.arrivalDate} onChange={e => setFormData(p => ({ ...p, arrivalDate: e.target.value }))} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Travelers *</label>
                <select required value={formData.travelers} onChange={e => setFormData(p => ({ ...p, travelers: Number(e.target.value) }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label><textarea rows={3} value={formData.specialRequests} onChange={e => setFormData(p => ({ ...p, specialRequests: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="Ship departure time, wheelchair access, children's ages..." /></div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="btn btn-primary flex-1 justify-center text-base py-3.5">⚓ Book Shore Excursion</button>
              <a href="https://wa.me/201212011881?text=Hi!%20I%20need%20a%20shore%20excursion%20from%20my%20cruise%20ship" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary flex-1 justify-center text-base py-3.5">💬 Book via WhatsApp</a>
            </div>
          </form>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Cruise Passengers Say</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Excursion Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-yellow-400 mb-3">{'★'.repeat(r.rating)}</div>
                <p className="text-gray-600 text-sm italic mb-4">"{r.text}"</p>
                <div className="border-t pt-3"><p className="font-semibold text-gray-900 text-sm">{r.name}</p><p className="text-xs text-gray-500">{r.country} • {r.excursion}</p></div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Shore Excursion Questions</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Not Sure Which Excursion?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">Send us your ship name, port, and arrival time — we'll recommend the perfect excursion and guarantee you're back on time.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/201212011881?text=Hi!%20My%20cruise%20ship%20is%20stopping%20in%20Egypt%20and%20I%20need%20help%20choosing%20an%20excursion" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">💬 Chat on WhatsApp</a>
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

export default ShoreExcursions