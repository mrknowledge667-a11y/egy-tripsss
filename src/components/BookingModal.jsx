import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

/**
 * BookingModal Component
 * Modal form for booking a trip
 */
const BookingModal = ({ isOpen, onClose, trip }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    nationality: '',
    adults: 1,
    children: 0,
    travel_date: '',
    special_requests: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Validate
    if (!form.full_name || !form.email || !form.phone || !form.travel_date) {
      setError('Please fill in all required fields')
      setSubmitting(false)
      return
    }

    // Calculate total price
    const totalPrice = (trip.price || 0) * (form.adults + form.children * 0.5)

    const bookingData = {
      // Trip info
      trip_id: trip.id,
      trip_title: trip.title,
      trip_slug: trip.slug,
      trip_duration: trip.duration,
      trip_price: trip.price || 0,
      // Customer info
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      nationality: form.nationality,
      // Booking details
      adults: form.adults,
      children: form.children,
      travel_date: form.travel_date,
      special_requests: form.special_requests,
      total_price: totalPrice,
      // Status
      status: 'pending',
    }

    console.log('Submitting booking:', bookingData)

    const { error: dbError } = await supabase
      .from('bookings')
      .insert(bookingData)

    if (dbError) {
      console.error('Booking error:', dbError)
      setError('Failed to submit booking. Please try again or contact us directly.')
    } else {
      setSuccess(true)
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        setForm({
          full_name: '',
          email: '',
          phone: '',
          nationality: '',
          adults: 1,
          children: 0,
          travel_date: '',
          special_requests: '',
        })
        onClose()
      }, 3000)
    }
    setSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book This Trip</h2>
              <p className="text-sm text-gray-500">{trip?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
              <p className="text-gray-600">
                Thank you for your booking request. We'll contact you within 24 hours to confirm your trip.
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Trip Summary */}
              <div className="bg-primary-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">{trip?.duration} Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price per person</span>
                  <span className="font-bold text-primary-600">${trip?.price || 0}</span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={form.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="American"
                />
              </div>

              {/* Adults & Children */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adults <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.adults}
                    onChange={(e) => handleChange('adults', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Children (2-11)
                  </label>
                  <select
                    value={form.children}
                    onChange={(e) => handleChange('children', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Travel Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.travel_date}
                  onChange={(e) => handleChange('travel_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  value={form.special_requests}
                  onChange={(e) => handleChange('special_requests', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any dietary requirements, accessibility needs, or special requests..."
                />
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Adults ({form.adults} × ${trip?.price || 0})</span>
                  <span className="font-medium">${(trip?.price || 0) * form.adults}</span>
                </div>
                {form.children > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Children ({form.children} × ${(trip?.price || 0) * 0.5})</span>
                    <span className="font-medium">${(trip?.price || 0) * form.children * 0.5}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-primary-600">
                    ${(trip?.price || 0) * (form.adults + form.children * 0.5)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our terms and conditions. 
                We'll contact you within 24 hours to confirm your booking.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BookingModal
