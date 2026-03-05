import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { excursionsData } from '../data/allExcursions'

const API_URL = import.meta.env.VITE_API_URL || ''

const ExcursionDetail = () => {
  const { id } = useParams()
  const excursion = excursionsData[id]
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', shipName: '', arrivalDate: '', travelers: 2,
    cabinNumber: '', specialRequests: ''
  })
  const [formSuccess, setFormSuccess] = useState(false)

  if (!excursion) {
    return (
      <main className="pt-32 pb-20">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold mb-4">Excursion Not Found</h1>
          <Link to="/shore-excursions" className="btn btn-primary">Back to Shore Excursions</Link>
        </div>
      </main>
    )
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const message = `Hello! I'd like to book this Shore Excursion:\n\n⚓ ${excursion.title}\n🚢 Ship: ${formData.shipName}\n🔑 Cabin: ${formData.cabinNumber}\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n📅 Arrival Date: ${formData.arrivalDate}\n👥 Travelers: ${formData.travelers}\n📝 Notes: ${formData.specialRequests || 'None'}`
    window.open(`https://wa.me/201212011881?text=${encodeURIComponent(message)}`, '_blank')
    setFormSuccess(true)
    setTimeout(() => setFormSuccess(false), 5000)
  }

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-secondary-500">
        <div className="absolute inset-0 opacity-75">
          <img src={excursion.image} alt={excursion.title} className="w-full h-full object-cover" />
        </div>
        <div className="relative container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/shore-excursions" className="hover:text-white">Shore Excursions</Link>
              <span>/</span>
              <span className="text-white">{excursion.title}</span>
            </nav>
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3 capitalize">
              {excursion.port} Port
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {excursion.title}
            </h1>
            <div className="flex flex-wrap gap-6 items-center text-white/90 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-primary-400">⏱</span>
                <span>{excursion.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-400">💵</span>
                <span className="text-2xl font-bold">${excursion.price}</span>
                <span className="text-sm">per person</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Photo Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {excursion.gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setLightbox({ open: true, index: i })}
              >
                <img src={img} alt={`${excursion.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Description & Highlights */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                About This Excursion
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">{excursion.description}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {excursion.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Complete Itinerary
          </h2>
          <div className="space-y-4">
            {excursion.itinerary.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start bg-white rounded-xl p-5 shadow-md"
              >
                <div className="flex-shrink-0 bg-primary-100 text-primary-700 font-bold px-4 py-2 rounded-lg text-sm">
                  {item.time}
                </div>
                <div className="flex-grow">
                  <p className="text-gray-700 font-medium">{item.activity}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included/Excluded */}
      <section className="py-12 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ What's Included</h3>
              <ul className="space-y-3">
                {excursion.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">❌ Not Included</h3>
              <ul className="space-y-3">
                {excursion.excluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Book This Excursion
            </h2>
            <p className="text-gray-600">Fill in your details and we'll confirm within 2 hours</p>
          </div>
          {formSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center text-green-700 font-medium">
              ✅ Booking request sent! We'll contact you shortly.
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cruise Ship Name *</label>
                <input
                  type="text"
                  required
                  value={formData.shipName}
                  onChange={e => setFormData(p => ({ ...p, shipName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. MSC Bellissima"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cabin Number</label>
                <input
                  type="text"
                  value={formData.cabinNumber}
                  onChange={e => setFormData(p => ({ ...p, cabinNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. 8042"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Port Arrival Date *</label>
                <input
                  type="date"
                  required
                  value={formData.arrivalDate}
                  onChange={e => setFormData(p => ({ ...p, arrivalDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travelers *</label>
                <select
                  required
                  value={formData.travelers}
                  onChange={e => setFormData(p => ({ ...p, travelers: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
              <textarea
                rows={3}
                value={formData.specialRequests}
                onChange={e => setFormData(p => ({ ...p, specialRequests: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ship departure time, dietary requirements, accessibility needs..."
              />
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="btn btn-primary flex-1 justify-center text-base py-3.5">
                ⚓ Book via WhatsApp
              </button>
              <Link to="/shore-excursions" className="btn btn-outline-primary flex-1 justify-center text-base py-3.5">
                ← Back to All Excursions
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox.open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox({ ...lightbox, open: false })}>
          <button className="absolute top-4 right-4 text-white text-4xl hover:text-primary-400" onClick={() => setLightbox({ ...lightbox, open: false })}>×</button>
          <img src={excursion.gallery[lightbox.index]} alt="Gallery" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </main>
  )
}

export default ExcursionDetail
