import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || ''

/* ─── Route Data ────────────────────────────────────────────── */
const routes = [
  { id: 'cairo-airport-5th',        label: 'Cairo Airport ↔ 5th Settlement',         from: 'Cairo Airport (CAI)', to: '5th Settlement / New Cairo', distance: 25 },
  { id: 'cairo-airport-downtown',   label: 'Cairo Airport ↔ Downtown Cairo',          from: 'Cairo Airport (CAI)', to: 'Downtown Cairo',             distance: 22 },
  { id: 'cairo-airport-giza',       label: 'Cairo Airport ↔ Giza / Pyramids',         from: 'Cairo Airport (CAI)', to: 'Giza / Pyramids Area',       distance: 45 },
  { id: 'cairo-airport-maadi',      label: 'Cairo Airport ↔ Maadi',                   from: 'Cairo Airport (CAI)', to: 'Maadi',                      distance: 30 },
  { id: 'cairo-airport-nasr-city',  label: 'Cairo Airport ↔ Nasr City / Heliopolis',  from: 'Cairo Airport (CAI)', to: 'Nasr City / Heliopolis',     distance: 12 },
  { id: 'cairo-airport-6oct',       label: 'Cairo Airport ↔ 6th October City',        from: 'Cairo Airport (CAI)', to: '6th October City',           distance: 60 },
  { id: 'cairo-airport-zamalek',    label: 'Cairo Airport ↔ Zamalek',                 from: 'Cairo Airport (CAI)', to: 'Zamalek',                    distance: 25 },
  { id: 'cairo-airport-alex',       label: 'Cairo Airport ↔ Alexandria',              from: 'Cairo Airport (CAI)', to: 'Alexandria',                 distance: 225 },
  { id: 'cairo-airport-sokhna',     label: 'Cairo Airport ↔ Ain Sokhna',              from: 'Cairo Airport (CAI)', to: 'Ain Sokhna',                 distance: 170 },
  { id: 'cairo-airport-hurghada',   label: 'Cairo Airport ↔ Hurghada',               from: 'Cairo Airport (CAI)', to: 'Hurghada',                   distance: 460 },
  { id: 'cairo-airport-sharm',      label: 'Cairo Airport ↔ Sharm El Sheikh',         from: 'Cairo Airport (CAI)', to: 'Sharm El Sheikh',            distance: 500 },
  { id: 'cairo-luxor',              label: 'Cairo ↔ Luxor',                           from: 'Cairo',               to: 'Luxor',                      distance: 660 },
  { id: 'cairo-aswan',              label: 'Cairo ↔ Aswan',                           from: 'Cairo',               to: 'Aswan',                      distance: 880 },
  { id: 'luxor-airport-hotel',      label: 'Luxor Airport ↔ Luxor Hotels',            from: 'Luxor Airport (LXR)', to: 'Luxor Hotels',               distance: 12 },
  { id: 'luxor-aswan',              label: 'Luxor ↔ Aswan',                           from: 'Luxor',               to: 'Aswan',                      distance: 230 },
  { id: 'aswan-airport-hotel',      label: 'Aswan Airport ↔ Aswan Hotels',            from: 'Aswan Airport (ASW)', to: 'Aswan Hotels',               distance: 25 },
  { id: 'aswan-abu-simbel',         label: 'Aswan ↔ Abu Simbel',                      from: 'Aswan',               to: 'Abu Simbel',                 distance: 290 },
  { id: 'hurghada-airport-hotel',   label: 'Hurghada Airport ↔ Hurghada Hotels',      from: 'Hurghada Airport',    to: 'Hurghada Hotels',            distance: 15 },
  { id: 'hurghada-luxor',           label: 'Hurghada ↔ Luxor',                        from: 'Hurghada',            to: 'Luxor',                      distance: 300 },
  { id: 'alex-port-cairo',          label: 'Alexandria Port ↔ Cairo / Giza',          from: 'Alexandria Port',     to: 'Cairo / Giza',               distance: 225 },
  { id: 'safaga-luxor',             label: 'Safaga Port ↔ Luxor',                     from: 'Safaga Port',         to: 'Luxor',                      distance: 235 },
  { id: 'sokhna-port-cairo',        label: 'Ain Sokhna Port ↔ Cairo / Giza',          from: 'Ain Sokhna Port',     to: 'Cairo / Giza',               distance: 145 },
]

/* ─── Vehicle Fleet ─────────────────────────────────────────── */
const vehicles = [
  {
    id: 'sedan-economy',
    name: 'Economy Sedan',
    subtitle: 'Toyota Corolla or similar',
    passengers: '1–3',
    luggage: '2 suitcases',
    pricePerKm: 0.40,
    minPrice: 20,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=250&fit=crop',
    features: ['Air Conditioning', 'Free WiFi', 'Bottled Water', 'Meet & Greet'],
  },
  {
    id: 'sedan-comfort',
    name: 'Comfort Sedan',
    subtitle: 'Toyota Camry or similar',
    passengers: '1–3',
    luggage: '3 suitcases',
    pricePerKm: 0.55,
    minPrice: 25,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=250&fit=crop',
    features: ['Air Conditioning', 'Free WiFi', 'Bottled Water', 'Meet & Greet', 'Leather Seats'],
  },
  {
    id: 'suv',
    name: 'SUV',
    subtitle: 'Toyota Fortuner or similar',
    passengers: '1–4',
    luggage: '4 suitcases',
    pricePerKm: 0.65,
    minPrice: 30,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop',
    features: ['Air Conditioning', 'Free WiFi', 'Bottled Water', 'Meet & Greet', '4WD', 'Spacious'],
  },
  {
    id: 'van',
    name: 'Minivan',
    subtitle: 'Mercedes Vito or similar',
    passengers: '1–6',
    luggage: '6 suitcases',
    pricePerKm: 0.75,
    minPrice: 40,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop',
    features: ['Air Conditioning', 'Free WiFi', 'Bottled Water', 'Meet & Greet', 'USB Charging', 'Sliding Doors'],
  },
  {
    id: 'luxury-sedan',
    name: 'Luxury Sedan',
    subtitle: 'Mercedes E-Class or similar',
    passengers: '1–3',
    luggage: '3 suitcases',
    pricePerKm: 0.95,
    minPrice: 45,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop',
    features: ['Air Conditioning', 'Free WiFi', 'Bottled Water', 'Meet & Greet', 'Premium Interior', 'Tinted Windows'],
  },
  {
    id: 'luxury-van',
    name: 'Luxury Van',
    subtitle: 'Mercedes V-Class or similar',
    passengers: '1–6',
    luggage: '6 suitcases',
    pricePerKm: 1.15,
    minPrice: 60,
    image: 'https://images.unsplash.com/photo-1609520505218-7421df70ba90?w=400&h=250&fit=crop',
    features: ['Air Conditioning', 'Free WiFi', 'Bottled Water', 'Meet & Greet', 'Captain Seats', 'Premium Sound'],
  },
  {
    id: 'minibus',
    name: 'Minibus',
    subtitle: 'Toyota Coaster (15 seats)',
    passengers: '7–15',
    luggage: '15 bags',
    pricePerKm: 1.00,
    minPrice: 55,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop',
    features: ['Air Conditioning', 'PA System', 'Bottled Water', 'Meet & Greet', 'Large Luggage Bay'],
  },
]

/* ─── FAQs ──────────────────────────────────────────────────── */
const faqs = [
  { q: 'How do I know my driver will be on time?', a: 'Our drivers arrive 15–30 minutes early for all pickups. For airport pickups, we track your flight in real-time and adjust the arrival time if your flight is delayed. You\'ll receive a WhatsApp message with your driver\'s name, photo, and phone number the evening before.' },
  { q: 'What type of vehicles do you use?', a: 'We use modern, well-maintained vehicles from Toyota, Mercedes, and Hyundai. All cars are air-conditioned, non-smoking, insured, and equipped with WiFi and bottled water. Vehicles are no more than 3 years old.' },
  { q: 'Is there a meet-and-greet at the airport?', a: 'Yes! For all airport pickups your driver will be waiting in the arrivals hall holding a sign with your name. They will help with your luggage and guide you to the vehicle.' },
  { q: 'What if my flight is delayed?', a: 'We monitor all flights in real-time. If your flight is delayed, we automatically adjust your pickup time — no need to contact us. The first 60 minutes of waiting are free.' },
  { q: 'Can I book a round trip?', a: 'Yes! Select "Round Trip" in the transfer type and get a 10% discount automatically applied. You can specify different dates and times for each leg.' },
  { q: 'Do you offer child car seats?', a: 'Yes, we provide child/baby car seats free of charge on request. Please mention the child\'s age in Special Requests.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 12 hours before pickup. Cancellations within 12 hours: 50% charge. No-shows are non-refundable.' },
  { q: 'Can I make stops along the way?', a: 'One 15-minute comfort stop is included free on routes over 2 hours. Additional stops or detours can be arranged with the driver for a small fee.' },
]

/* ─── Reviews ───────────────────────────────────────────────── */
const reviews = [
  { name: 'Michael B.', country: '🇺🇸 USA', rating: 5, route: 'Pyramids & Egyptian Museum', text: 'Had an amazing experience with EgyptTravelPro! The trip to the Pyramids and the Egyptian Museum was perfectly organized. Our guide was very knowledgeable and friendly. Highly recommended!', date: 'Jan 2026' },
  { name: 'Laura & David', country: '🇬🇧 UK', rating: 5, route: 'Luxor & Aswan Tour', text: 'Everything was smooth and well-arranged. We visited Luxor and Aswan, and every detail was taken care of. This company really knows how to show you the beauty of Egypt.', date: 'Dec 2025' },
  { name: 'Алексей К.', country: '🇷🇺 Russia', rating: 5, route: 'Pyramids & Temples', text: 'Это было незабываемое путешествие! Египетские пирамиды и храмы впечатляют. Спасибо EgyptTravelPro за отличную организацию и внимательный подход.', date: 'Nov 2025' },
  { name: 'James T.', country: '🇦🇺 Australia', rating: 5, route: 'Full Egypt Tour', text: "I've traveled a lot, but this tour was something special. The guide explained the history of each temple in such an engaging way. Thank you EgyptTravelPro for this great adventure!", date: 'Feb 2026' },
  { name: 'Sophie R.', country: '🇨🇦 Canada', rating: 5, route: 'Cairo & Giza Transfer', text: 'Booking was easy and communication was fast. Definitely the best way to explore Egyptian heritage safely and comfortably. Will travel with them again next year!', date: 'Jan 2026' },
  { name: 'Марина С.', country: '🇷🇺 Russia', rating: 5, route: 'Ancient Egypt Tour', text: 'Компания работает очень профессионально. Гид рассказал много интересных фактов об истории Древнего Египта. Всё было супер!', date: 'Dec 2025' },
  { name: 'Marco P.', country: '🇮🇹 Italy', rating: 5, route: 'Egypt Discovery', text: "Organizzazione impeccabile, tour ben strutturato e assistenza continua. Consiglio vivamente a chi vuole scoprire la storia dell'Egitto.", date: 'Nov 2025' },
  { name: 'Emma & Tom', country: '🇬🇧 UK', rating: 5, route: 'Nile Cruise', text: 'Great customer service and affordable prices. The Nile cruise organized by EgyptTravelPro was unforgettable — beautiful scenery and excellent hospitality onboard.', date: 'Feb 2026' },
]

/* ═══════════════════════════════════════════════════════════════ */

const Transfers = () => {
  // Wizard step: 1 = Ride Details, 2 = Choose Vehicle, 3 = Contact Details
  const [step, setStep] = useState(1)

  // Step 1 state
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [transferType, setTransferType] = useState('one-way')
  const [routeSearch, setRouteSearch] = useState('')

  // Step 2 state
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  // Step 3 state
  const [contact, setContact] = useState({ fullName: '', email: '', phone: '', whatsapp: '', flightNumber: '', specialRequests: '', passengers: 2 })

  // General
  const [openFaq, setOpenFaq] = useState(null)
  const [bookingResult, setBookingResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [paymobLoading, setPaymobLoading] = useState(false)

  // Computed price
  const computePrice = (vehicle, route) => {
    if (!vehicle || !route) return 0
    const raw = vehicle.pricePerKm * route.distance
    const price = Math.max(raw, vehicle.minPrice)
    return transferType === 'round-trip' ? Math.round(price * 2 * 0.9) : Math.round(price)
  }
  const estimatedPrice = computePrice(selectedVehicle, selectedRoute)

  // Filter routes
  const filteredRoutes = routeSearch.trim()
    ? routes.filter(r => r.label.toLowerCase().includes(routeSearch.toLowerCase()) || r.from.toLowerCase().includes(routeSearch.toLowerCase()) || r.to.toLowerCase().includes(routeSearch.toLowerCase()))
    : routes

  // ── Step navigation ──────────────────────────────────────
  const canProceedStep1 = pickupDate && pickupTime && selectedRoute
  const canProceedStep2 = selectedVehicle
  const canSubmitStep3 = contact.fullName && contact.email && contact.phone

  const goStep = (n) => {
    if (n === 2 && !canProceedStep1) return
    if (n === 3 && !canProceedStep2) return
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Submit booking (backend) ─────────────────────────────
  const handleBookTransfer = useCallback(async () => {
    if (!canSubmitStep3) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/book-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupDate,
          pickupTime,
          route: selectedRoute.label,
          routeFrom: selectedRoute.from,
          routeTo: selectedRoute.to,
          transferType,
          distance: selectedRoute.distance,
          vehicleId: selectedVehicle.id,
          vehicleName: selectedVehicle.name,
          vehiclePrice: estimatedPrice,
          fullName: contact.fullName,
          email: contact.email,
          phone: contact.phone,
          whatsapp: contact.whatsapp,
          flightNumber: contact.flightNumber,
          specialRequests: contact.specialRequests,
          passengers: contact.passengers,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setBookingResult(data.booking)
      } else {
        alert(data.error || 'Booking failed. Please try WhatsApp.')
      }
    } catch {
      alert('Network error. Please try WhatsApp booking.')
    } finally {
      setLoading(false)
    }
  }, [pickupDate, pickupTime, selectedRoute, transferType, selectedVehicle, estimatedPrice, contact, canSubmitStep3])

  // ── WhatsApp booking ─────────────────────────────────────
  const handleWhatsApp = () => {
    const msg = `Hello! I'd like to book a Cairo Airport Transfer:\n\n📍 Route: ${selectedRoute?.label || 'Not selected'}\n🔄 Type: ${transferType}\n📅 Date: ${pickupDate}\n⏰ Time: ${pickupTime}\n🚗 Vehicle: ${selectedVehicle?.name || 'Not selected'}\n💰 Price: $${estimatedPrice}\n👤 Name: ${contact.fullName}\n📧 Email: ${contact.email}\n📱 Phone: ${contact.phone}\n✈️ Flight: ${contact.flightNumber || 'N/A'}\n👥 Passengers: ${contact.passengers}\n📝 Notes: ${contact.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // ── Stripe checkout ──────────────────────────────────────
  const handleStripeCheckout = useCallback(async () => {
    if (!selectedVehicle || !selectedRoute || estimatedPrice <= 0) return
    setCheckoutLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carName: selectedVehicle.name,
          carId: selectedVehicle.id,
          routeFrom: selectedRoute.from,
          routeTo: selectedRoute.to,
          distance: selectedRoute.distance,
          transferDate: pickupDate,
          transferTime: pickupTime,
          passengers: contact.passengers || 2,
          amount: estimatedPrice,
          customerEmail: contact.email || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Payment setup failed. Please try WhatsApp booking.')
    } finally {
      setCheckoutLoading(false)
    }
  }, [selectedVehicle, selectedRoute, estimatedPrice, pickupDate, pickupTime, contact])

  // ── Paymob checkout ──────────────────────────────────────
  const handlePaymobCheckout = useCallback(async () => {
    if (!selectedVehicle || !selectedRoute || estimatedPrice <= 0) return
    setPaymobLoading(true)
    try {
      // Parse first/last name from fullName
      const nameParts = (contact.fullName || '').trim().split(' ')
      const firstName = nameParts[0] || 'Guest'
      const lastName = nameParts.slice(1).join(' ') || 'Traveler'

      const res = await fetch(`${API_URL}/api/paymob/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carName: selectedVehicle.name,
          carId: selectedVehicle.id,
          routeFrom: selectedRoute.from,
          routeTo: selectedRoute.to,
          distance: selectedRoute.distance,
          transferDate: pickupDate,
          transferTime: pickupTime,
          passengers: contact.passengers || 2,
          amount: estimatedPrice,
          customerEmail: contact.email || undefined,
          customerFirstName: firstName,
          customerLastName: lastName,
          customerPhone: contact.phone || undefined,
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed')
      }
      const data = await res.json()
      if (data.iframeUrl) {
        window.location.href = data.iframeUrl
      }
    } catch (err) {
      console.error('Paymob checkout error:', err)
      alert('Paymob payment setup failed. Please try Stripe or WhatsApp booking.')
    } finally {
      setPaymobLoading(false)
    }
  }, [selectedVehicle, selectedRoute, estimatedPrice, pickupDate, pickupTime, contact])

  // ── Step indicator ───────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-10">
      {[
        { n: 1, label: 'Enter Ride Details', icon: '📍' },
        { n: 2, label: 'Choose a Vehicle', icon: '🚗' },
        { n: 3, label: 'Enter Contact Details', icon: '📋' },
      ].map((s, i) => (
        <div key={s.n} className="flex items-center">
          <button
            onClick={() => { if (s.n < step || (s.n === 1)) goStep(s.n) }}
            className={`flex flex-col items-center group cursor-pointer ${s.n <= step ? '' : 'opacity-50'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
              s.n === step ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' :
              s.n < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s.n < step ? '✓' : s.n}
            </div>
            <span className={`mt-2 text-xs font-medium hidden sm:block ${
              s.n === step ? 'text-primary-600' : s.n < step ? 'text-green-600' : 'text-gray-400'
            }`}>{s.label}</span>
          </button>
          {i < 2 && (
            <div className={`w-16 md:w-24 h-0.5 mx-2 mt-[-20px] sm:mt-0 ${s.n < step ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )

  /* ═══════════════════════════════════════════════════════════ */
  /* BOOKING SUCCESS VIEW                                       */
  /* ═══════════════════════════════════════════════════════════ */
  if (bookingResult) {
    return (
      <main className="overflow-hidden">
        <section className="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white min-h-screen">
          <div className="container-custom max-w-2xl text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: 'spring' }}>
              <div className="text-7xl mb-6">✅</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Booking Confirmed!</h1>
              <p className="text-gray-600 text-lg mb-8">Your transfer has been booked. We'll confirm via email within 1 hour.</p>
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-left space-y-4 border border-gray-100">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Booking ID</span><span className="font-mono font-bold text-primary-600">{bookingResult.id}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Route</span><span className="font-semibold">{bookingResult.route}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Type</span><span className="font-semibold capitalize">{bookingResult.transferType}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Date & Time</span><span className="font-semibold">{bookingResult.pickupDate} at {bookingResult.pickupTime}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Vehicle</span><span className="font-semibold">{bookingResult.vehicle}</span></div>
                <div className="flex justify-between text-sm border-t pt-3"><span className="text-gray-500 font-medium">Total Price</span><span className="text-2xl font-bold text-primary-600">${bookingResult.price}</span></div>
              </div>
              <div className="mt-8 space-y-3">
                <p className="text-sm text-gray-500">A confirmation email has been sent to <strong>{bookingResult.email}</strong></p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={`https://wa.me/201212011881?text=${encodeURIComponent(`Hi! My booking ID is ${bookingResult.id}. I have a question about my transfer.`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">💬 WhatsApp Support</a>
                  <Link to="/" className="btn btn-outline-primary">🏠 Back to Home</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    )
  }

  /* ═══════════════════════════════════════════════════════════ */
  /* MAIN WIZARD VIEW                                           */
  /* ═══════════════════════════════════════════════════════════ */
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-40 pb-28 bg-secondary-500 overflow-hidden">
        <div className="absolute inset-0 opacity-75">
          <img src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1920&h=900&fit=crop&q=80" alt="Cairo cityscape for airport transfers" className="w-full h-full object-cover object-center" />
        </div>
        <div className="relative container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link to="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Transfers</span>
            </nav>
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Private Airport Transfers</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Cairo Airport Transfers</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl">Fixed-price private transfers across Egypt. Meet & greet, flight tracking, and 24/7 service included.</p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Fixed Prices</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Flight Tracking</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Meet & Greet</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> 24/7 Service</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Free Cancellation</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wizard Section */}
      <section className="py-10 bg-gray-50">
        <div className="container-custom max-w-5xl">
          <StepIndicator />

          <AnimatePresence mode="wait">
            {/* ─────────────────── STEP 1: RIDE DETAILS ─────────────────── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Ride Details
                  </h2>
                  <p className="text-gray-500 text-sm mb-8">Select your pickup date, time, route, and transfer type.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Pickup Date */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📅 Pickup Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        onChange={e => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition-colors"
                      />
                    </div>

                    {/* Pickup Time */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ⏰ Pickup Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        required
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Transfer Type */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🔄 Transfer Type
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: 'one-way', label: 'One Way', icon: '→' },
                        { value: 'round-trip', label: 'Round Trip (10% off)', icon: '↔' },
                      ].map(t => (
                        <button
                          key={t.value}
                          onClick={() => setTransferType(t.value)}
                          className={`flex-1 py-3.5 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                            transferType === t.value
                              ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-lg mr-2">{t.icon}</span> {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Route Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      📍 Route <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Search routes... (e.g. 5th Settlement, Giza, Alexandria)"
                      value={routeSearch}
                      onChange={e => setRouteSearch(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white mb-4 text-sm"
                    />
                    <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {filteredRoutes.map(route => (
                        <button
                          key={route.id}
                          onClick={() => setSelectedRoute(route)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                            selectedRoute?.id === route.id
                              ? 'border-primary-500 bg-primary-50 shadow-sm'
                              : 'border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white'
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{route.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{route.distance} km</p>
                          </div>
                          {selectedRoute?.id === route.id && (
                            <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                          )}
                        </button>
                      ))}
                      {filteredRoutes.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          No routes found. Try a different search or <a href="https://wa.me/201212011881?text=Hi!%20I%20need%20a%20custom%20transfer%20route" target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">contact us</a> for custom routes.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => goStep(2)}
                      disabled={!canProceedStep1}
                      className={`px-8 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                        canProceedStep1
                          ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue to Vehicles <span>→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─────────────────── STEP 2: CHOOSE VEHICLE ───────────────── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Choose a Vehicle</h2>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{selectedRoute?.label}</p>
                      <p className="text-xs text-gray-400">{pickupDate} at {pickupTime} • {transferType}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-8">All vehicles include AC, WiFi, water & professional driver.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {vehicles.map(vehicle => {
                      const price = computePrice(vehicle, selectedRoute)
                      const isSelected = selectedVehicle?.id === vehicle.id
                      return (
                        <motion.button
                          key={vehicle.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedVehicle(vehicle)}
                          className={`text-left rounded-xl border-2 overflow-hidden transition-all ${
                            isSelected
                              ? 'border-primary-500 shadow-lg shadow-primary-500/15 ring-1 ring-primary-500'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          {/* Vehicle Image */}
                          <div className="relative h-40 overflow-hidden bg-gray-100">
                            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                            )}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                              <p className="text-white font-bold">{vehicle.name}</p>
                              <p className="text-white/70 text-xs">{vehicle.subtitle}</p>
                            </div>
                          </div>
                          {/* Vehicle Info */}
                          <div className="p-4">
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                              <span className="flex items-center gap-1">👥 {vehicle.passengers}</span>
                              <span className="flex items-center gap-1">🧳 {vehicle.luggage}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {vehicle.features.slice(0, 4).map(f => (
                                <span key={f} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                              ))}
                              {vehicle.features.length > 4 && (
                                <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">+{vehicle.features.length - 4}</span>
                              )}
                            </div>
                            <div className="flex items-end justify-between border-t pt-3">
                              <div>
                                <span className="text-2xl font-bold text-primary-600">${price}</span>
                                <span className="text-xs text-gray-400 ml-1">{transferType === 'round-trip' ? 'round trip' : 'one way'}</span>
                              </div>
                              {isSelected && <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Selected</span>}
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Nav Buttons */}
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => goStep(1)} className="px-6 py-3 rounded-xl font-medium text-sm text-gray-600 border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <span>←</span> Back
                    </button>
                    <button
                      onClick={() => goStep(3)}
                      disabled={!canProceedStep2}
                      className={`px-8 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                        canProceedStep2
                          ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue to Contact <span>→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─────────────────── STEP 3: CONTACT DETAILS ──────────────── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}>
                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Contact Form (3 cols) */}
                  <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Details</h2>
                    <p className="text-gray-500 text-sm mb-8">Enter your info — we'll send confirmation via email & WhatsApp.</p>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" required value={contact.fullName} onChange={e => setContact(p => ({ ...p, fullName: e.target.value }))} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="John Smith" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                          <input type="email" required value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="john@example.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone <span className="text-red-500">*</span></label>
                          <input type="tel" required value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="+1 234 567 8900" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp (optional)</label>
                          <input type="tel" value={contact.whatsapp} onChange={e => setContact(p => ({ ...p, whatsapp: e.target.value }))} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="Same as phone?" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Flight Number (optional)</label>
                          <input type="text" value={contact.flightNumber} onChange={e => setContact(p => ({ ...p, flightNumber: e.target.value }))} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="e.g. MS 777" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Passengers</label>
                        <select value={contact.passengers} onChange={e => setContact(p => ({ ...p, passengers: Number(e.target.value) }))} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
                        <textarea rows={3} value={contact.specialRequests} onChange={e => setContact(p => ({ ...p, specialRequests: e.target.value }))} className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="Child seat, extra stop, hotel name..." />
                      </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6">
                      <button onClick={() => goStep(2)} className="px-6 py-3 rounded-xl font-medium text-sm text-gray-600 border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <span>←</span> Back to Vehicles
                      </button>
                    </div>
                  </div>

                  {/* Booking Summary (2 cols) */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                      <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Booking Summary</h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Route</span><span className="font-semibold text-gray-900 text-right max-w-[180px]">{selectedRoute?.label}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-semibold capitalize text-gray-900">{transferType.replace('-', ' ')}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold text-gray-900">{pickupDate}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold text-gray-900">{pickupTime}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Distance</span><span className="font-semibold text-gray-900">{selectedRoute?.distance} km</span></div>
                        <hr className="border-gray-100" />
                        <div className="flex justify-between"><span className="text-gray-500">Vehicle</span><span className="font-semibold text-gray-900">{selectedVehicle?.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Passengers</span><span className="font-semibold text-gray-900">{contact.passengers}</span></div>
                        <hr className="border-gray-100" />
                        <div className="flex justify-between items-end pt-2">
                          <span className="text-gray-700 font-semibold">Total Price</span>
                          <span className="text-3xl font-bold text-primary-600">${estimatedPrice}</span>
                        </div>
                        {transferType === 'round-trip' && (
                          <p className="text-xs text-green-600 text-right">10% round trip discount applied!</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 space-y-3">
                        <button
                          onClick={handleBookTransfer}
                          disabled={!canSubmitStep3 || loading}
                          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                            canSubmitStep3 && !loading
                              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {loading ? <span className="animate-spin">⟳</span> : '📩'} Confirm Booking
                        </button>

                        <button
                          onClick={handleStripeCheckout}
                          disabled={!canSubmitStep3 || checkoutLoading}
                          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-purple-600 hover:bg-purple-700 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {checkoutLoading ? <span className="animate-spin">⟳</span> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                          Pay ${estimatedPrice} via Stripe
                        </button>

                        <button
                          onClick={handlePaymobCheckout}
                          disabled={!canSubmitStep3 || paymobLoading}
                          className="w-full py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {paymobLoading ? <span className="animate-spin">⟳</span> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                          Pay via Paymob (EGP)
                        </button>

                        <button
                          onClick={handleWhatsApp}
                          className="w-full py-3.5 rounded-xl font-semibold text-sm border-2 border-green-500 text-green-700 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                        >
                          💬 Book via WhatsApp
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-gray-400">
                        <span>🔒 SSL</span><span>💳 Stripe</span><span>🏧 Paymob</span><span>🏧 Visa/MC</span><span>✅ Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Why Book With Us?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🛡️', title: 'Fixed Prices', desc: 'No meters, no surge, no surprises. The price you see is the price you pay — guaranteed.' },
              { icon: '✈️', title: 'Flight Tracking', desc: 'We monitor your flight in real-time. Delayed? We adjust automatically — no extra charge.' },
              { icon: '🧑‍✈️', title: 'Pro Drivers', desc: 'Licensed, vetted, English-speaking drivers who know every road in Egypt.' },
              { icon: '🕐', title: '24/7 Service', desc: 'Landing at 3 AM? No problem. We operate round the clock, 365 days a year.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Passenger Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Passengers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-yellow-400 mb-3">{'★'.repeat(r.rating)}</div>
                <p className="text-gray-600 text-sm italic mb-4">"{r.text}"</p>
                <div className="border-t pt-3"><p className="font-semibold text-gray-900 text-sm">{r.name}</p><p className="text-xs text-gray-500">{r.country} • {r.route}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">FAQs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Transfer Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <svg className={`w-5 h-5 text-primary-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t pt-4">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-secondary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Need a Custom Route?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">We cover every city, airport, and port in Egypt. Tell us where you need to go — we'll quote you within minutes.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/201212011881?text=Hi!%20I%20need%20a%20custom%20transfer%20in%20Egypt" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">💬 Get a Quote on WhatsApp</a>
            <Link to="/contact" className="btn btn-outline btn-lg">✉️ Email Us</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Transfers