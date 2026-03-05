import { supabase, handleCors } from './_lib/config.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      pickupDate,
      pickupTime,
      route,
      routeFrom,
      routeTo,
      transferType,
      distance,
      vehicleId,
      vehicleName,
      vehiclePrice,
      fullName,
      email,
      phone,
      whatsapp,
      flightNumber,
      specialRequests,
      passengers,
    } = req.body

    if (!pickupDate || !routeFrom || !routeTo || !vehicleName || !fullName || !email) {
      return res.status(400).json({
        error: 'Missing required fields: pickupDate, routeFrom, routeTo, vehicleName, fullName, email',
      })
    }

    let dbRecord = null
    try {
      const { data, error } = await supabase.from('transfer_bookings').insert({
        pickup_date: pickupDate,
        pickup_time: pickupTime || null,
        route_from: routeFrom,
        route_to: routeTo,
        route_label: route || `${routeFrom} → ${routeTo}`,
        transfer_type: transferType || 'one-way',
        distance_km: distance || 0,
        vehicle_id: vehicleId || null,
        vehicle_name: vehicleName,
        vehicle_price_usd: vehiclePrice || 0,
        full_name: fullName,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        flight_number: flightNumber || null,
        special_requests: specialRequests || null,
        passengers: passengers || 1,
        status: 'pending',
      }).select().single()

      if (error) {
        console.error('⚠️  Supabase insert error (transfer_bookings):', error.message)
      } else {
        dbRecord = data
        console.log('✅ Transfer booking saved:', data.id)
      }
    } catch (dbErr) {
      console.error('⚠️  DB insert failed:', dbErr.message)
    }

    res.json({
      success: true,
      message: 'Transfer booking received! We will confirm within 1 hour.',
      booking: {
        id: dbRecord?.id || `TRF-${Date.now()}`,
        pickupDate,
        pickupTime,
        route: route || `${routeFrom} → ${routeTo}`,
        transferType,
        vehicle: vehicleName,
        price: vehiclePrice,
        name: fullName,
        email,
      },
    })
  } catch (err) {
    console.error('❌ Book transfer error:', err)
    res.status(500).json({ error: 'Failed to process booking', message: err.message })
  }
}