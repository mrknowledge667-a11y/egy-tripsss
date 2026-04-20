import { supabase } from './supabase'

/**
 * Centralized Booking Utility
 * Saves all booking data to Supabase for admin management
 */
export const submitBookingToDatabase = async (bookingData) => {
  try {
    const normalizedTravelDate = bookingData.travel_date || bookingData.travelDate || bookingData.tourDate || null
    const normalizedAdults = parseInt(bookingData.adults || bookingData.travelers || 1)
    const normalizedChildren = parseInt(bookingData.children || 0)
    const normalizedTripPrice = parseFloat(bookingData.trip_price || bookingData.price || 0)
    const normalizedTotalPrice = parseFloat(
      bookingData.total_price ||
      normalizedTripPrice * (normalizedAdults + normalizedChildren * 0.5)
    )
    const normalizedName = bookingData.full_name || bookingData.name

    // Ensure all required fields are present for the current bookings schema
    const booking = {
      // Trip information
      trip_title: bookingData.trip_title || bookingData.selectedTour || bookingData.selectedPackage || bookingData.selectedCruise || bookingData.selectedExcursion || 'Unknown Trip',
      trip_duration: bookingData.trip_duration || bookingData.duration || null,
      trip_price: normalizedTripPrice,
      
      // Customer information
      full_name: normalizedName,
      email: bookingData.email,
      phone: bookingData.phone,
      nationality: bookingData.nationality || null,
      
      // Booking details
      adults: normalizedAdults,
      children: normalizedChildren,
      travel_date: normalizedTravelDate,
      special_requests: bookingData.special_requests || bookingData.specialRequests || null,
      
      // Additional fields for specific tour types
      cabin_type: bookingData.cabinType || null,
      ship_name: bookingData.shipName || null,
      cabin_number: bookingData.cabinNumber || null,
      arrival_date: bookingData.arrivalDate || null,
      pickup_location: bookingData.pickupLocation || null,
      rooms: parseInt(bookingData.rooms || 1),
      hotel_grade: bookingData.hotelGrade || null,
      
      // Calculate total price
      total_price: normalizedTotalPrice,

      // Booking metadata
      status: 'pending',
      booking_source: bookingData.booking_source || 'website',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Include trip_id only if present (and valid UUID when provided)
    if (bookingData.trip_id) {
      booking.trip_id = bookingData.trip_id
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()

    if (error) {
      console.error('Database booking error:', error)
      const errorMessage = (error.message || '').toLowerCase()
      const likelyRlsIssue = errorMessage.includes('row-level security') || errorMessage.includes('permission denied')
      return {
        success: false,
        error: error.message,
        code: error.code,
        hint: likelyRlsIssue
          ? 'Supabase RLS is blocking inserts for anonymous users on bookings table.'
          : null,
      }
    }

    console.log('Booking saved to database:', data)
    return { success: true, booking: data[0] }
  } catch (err) {
    console.error('Booking submission error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Dual Booking Function - Save to DB + Send WhatsApp
 * This ensures all bookings are captured in admin panel AND sent via WhatsApp
 */
export const submitDualBooking = async (bookingData, whatsappMessage) => {
  // Save to database first
  const dbResult = await submitBookingToDatabase(bookingData)

  // Send WhatsApp message regardless of DB result (as backup)
  let whatsappOpened = false
  if (whatsappMessage) {
    const whatsappUrl = `https://wa.me/201212011881?text=${encodeURIComponent(whatsappMessage)}`
    const win = window.open(whatsappUrl, '_blank')
    whatsappOpened = !!win
  }

  if (dbResult.success) {
    return { ...dbResult, savedToDatabase: true, sentToWhatsApp: whatsappOpened }
  }

  // If DB failed but WhatsApp opened, treat as successful customer submission fallback.
  if (!dbResult.success && whatsappOpened) {
    return {
      success: true,
      savedToDatabase: false,
      sentToWhatsApp: true,
      warning: dbResult.hint || dbResult.error || 'Booking was sent to WhatsApp but not saved to database.',
      booking: null,
    }
  }

  return dbResult
}

/**
 * Get formatted WhatsApp message for any booking type
 */
export const getWhatsAppMessage = (bookingData) => {
  const tripType = bookingData.trip_title || bookingData.selectedTour || bookingData.selectedPackage || 'Trip'
  
  let message = `Hello! I'd like to book: ${tripType}\n\n`
  message += `👤 Name: ${bookingData.full_name || bookingData.name}\n`
  message += `📧 Email: ${bookingData.email}\n`
  message += `📱 Phone: ${bookingData.phone}\n`
  
  if (bookingData.nationality) message += `🌍 Nationality: ${bookingData.nationality}\n`
  if (bookingData.travel_date || bookingData.travelDate || bookingData.tourDate) {
    message += `📅 Date: ${bookingData.travel_date || bookingData.travelDate || bookingData.tourDate}\n`
  }
  if (bookingData.adults || bookingData.travelers) {
    message += `👥 Travelers: ${bookingData.adults || bookingData.travelers}`
    if (bookingData.children) message += ` adults + ${bookingData.children} children`
    message += `\n`
  }
  
  // Add specific fields based on booking type
  if (bookingData.cabinType) message += `🛏️ Cabin: ${bookingData.cabinType}\n`
  if (bookingData.shipName) message += `🚢 Ship: ${bookingData.shipName}\n`
  if (bookingData.cabinNumber) message += `🔑 Cabin: ${bookingData.cabinNumber}\n`
  if (bookingData.pickupLocation) message += `📍 Pickup: ${bookingData.pickupLocation}\n`
  if (bookingData.rooms) message += `🏨 Rooms: ${bookingData.rooms}\n`
  if (bookingData.hotelGrade) message += `⭐ Hotel Grade: ${bookingData.hotelGrade}\n`
  
  if (bookingData.special_requests || bookingData.specialRequests) {
    message += `📝 Notes: ${bookingData.special_requests || bookingData.specialRequests}\n`
  } else {
    message += `📝 Notes: None\n`
  }
  
  return message
}

export default { submitBookingToDatabase, submitDualBooking, getWhatsAppMessage }