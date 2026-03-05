import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

/**
 * PlanTripForm Component
 * Form for trip planning with date selection, travelers count, and travel style
 * Calculates trip duration and filters matching trips
 */
const PlanTripForm = ({ onSubmit, className = '' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      arrivalDate: '',
      departureDate: '',
      travelers: 2,
      travelStyle: '',
    },
  })

  // Watch dates to calculate duration
  const arrivalDate = watch('arrivalDate')
  const departureDate = watch('departureDate')

  // Calculate number of days between dates
  const calculateDays = () => {
    if (!arrivalDate || !departureDate) return null
    const start = new Date(arrivalDate)
    const end = new Date(departureDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : null
  }

  const tripDays = calculateDays()

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get minimum departure date (day after arrival)
  const getMinDepartureDate = () => {
    if (!arrivalDate) return getMinDate()
    const arrival = new Date(arrivalDate)
    arrival.setDate(arrival.getDate() + 1)
    return arrival.toISOString().split('T')[0]
  }

  // Travel style options
  const travelStyles = [
    { value: '', label: 'Any Style' },
    { value: 'Adventure', label: '🏔️ Adventure', description: 'Active and thrilling experiences' },
    { value: 'Culture', label: '🏛️ Culture', description: 'Historical and cultural immersion' },
    { value: 'Relax', label: '🏖️ Relaxation', description: 'Rest and rejuvenation' },
  ]

  // Handle form submission
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    
    // Calculate days and add to form data
    const formData = {
      ...data,
      days: tripDays,
    }
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (onSubmit) {
      onSubmit(formData)
    }
    
    setIsSubmitting(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`bg-white rounded-2xl shadow-card p-6 md:p-8 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arrival Date */}
        <div>
          <label htmlFor="arrivalDate" className="form-label">
            Arrival Date
          </label>
          <input
            type="date"
            id="arrivalDate"
            min={getMinDate()}
            className={`form-input ${errors.arrivalDate ? 'border-red-500' : ''}`}
            {...register('arrivalDate', { 
              required: 'Arrival date is required',
            })}
          />
          {errors.arrivalDate && (
            <p className="mt-1 text-sm text-red-500">{errors.arrivalDate.message}</p>
          )}
        </div>

        {/* Departure Date */}
        <div>
          <label htmlFor="departureDate" className="form-label">
            Departure Date
          </label>
          <input
            type="date"
            id="departureDate"
            min={getMinDepartureDate()}
            className={`form-input ${errors.departureDate ? 'border-red-500' : ''}`}
            {...register('departureDate', { 
              required: 'Departure date is required',
              validate: (value) => {
                if (arrivalDate && new Date(value) <= new Date(arrivalDate)) {
                  return 'Departure must be after arrival'
                }
                return true
              }
            })}
          />
          {errors.departureDate && (
            <p className="mt-1 text-sm text-red-500">{errors.departureDate.message}</p>
          )}
        </div>

        {/* Number of Travelers */}
        <div>
          <label htmlFor="travelers" className="form-label">
            Number of Travelers
          </label>
          <div className="relative">
            <select
              id="travelers"
              className={`form-select ${errors.travelers ? 'border-red-500' : ''}`}
              {...register('travelers', { required: 'Number of travelers is required' })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Traveler' : 'Travelers'}
                </option>
              ))}
              <option value="10+">10+ Travelers (Group)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.travelers && (
            <p className="mt-1 text-sm text-red-500">{errors.travelers.message}</p>
          )}
        </div>

        {/* Travel Style */}
        <div>
          <label htmlFor="travelStyle" className="form-label">
            Travel Style
          </label>
          <div className="relative">
            <select
              id="travelStyle"
              className="form-select"
              {...register('travelStyle')}
            >
              {travelStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Duration Display */}
      {tripDays && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
            <div>
              <p className="text-sm text-primary-700">Your trip duration</p>
              <p className="text-lg font-semibold text-primary-900">
                {tripDays} {tripDays === 1 ? 'Day' : 'Days'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Finding Trips...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Find Matching Trips
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </motion.form>
  )
}

export default PlanTripForm