import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * VisitEgyptTrips Component
 * Fetches 20 trips scraped from visitegypt.com via the backend API
 * and displays them in a card grid matching the landing page style.
 * Uses content-matched images based on destination/activity.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Category badge colors
const getCategoryColor = (cat) => {
  const colors = {
    'Day Tours': 'bg-blue-100 text-blue-700',
    'Nile Cruises': 'bg-cyan-100 text-cyan-700',
    'Adventure': 'bg-orange-100 text-orange-700',
    'Culture': 'bg-purple-100 text-purple-700',
    'Visit Egypt': 'bg-emerald-100 text-emerald-700',
  }
  return colors[cat] || 'bg-gray-100 text-gray-700'
}

const formatPrice = (amount, curr) => {
  if (!amount || !curr) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 0,
  }).format(amount)
}

const VisitEgyptTrips = () => {
  // UI-only removal: do not render the Visit Egypt trips section.
  // This preserves the data and backend/API while removing the section from the public UI.
  return null
}

export default VisitEgyptTrips