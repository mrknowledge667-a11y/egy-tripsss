import { useState } from 'react'
import { motion } from 'framer-motion'
import { HeroSection } from '../components'
import { supabase } from '../lib/supabase'

/**
 * Contact Page
 * Contact form, office locations, map, and contact information for Egypt Travel Pro
 * Submits contact form data to Supabase
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    tripType: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Submit to Supabase contacts table
      const { error: submitError } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject,
            trip_type: formData.tripType || null,
            message: formData.message,
            status: 'unread',
          }
        ])

      if (submitError) throw submitError

      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', tripType: '', message: '' })
      setTimeout(() => setSubmitted(false), 6000)
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError('Failed to send message. Please try again or contact us via WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const contactMethods = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Call Us',
      details: ['+20 121 201 1881', '+20 123 456 7890'],
      description: 'Available 24/7 for your convenience',
      action: 'tel:+201212011881',
      actionLabel: 'Call Now',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      title: 'WhatsApp',
      details: ['+20 121 201 1881'],
      description: 'Quick responses, usually within minutes',
      action: 'https://wa.me/201212011881?text=Hello!%20I%20would%20like%20to%20book%20a%20transfer%20or%20tour%20with%20Egypt%20Time%20Travel.',
      actionLabel: 'Chat on WhatsApp',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Us',
      details: ['info@egypttimetravel.com', 'bookings@egypttimetravel.com'],
      description: 'We respond within 24 hours',
      action: 'mailto:info@egypttimetravel.com',
      actionLabel: 'Send Email',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Visit Our Office',
      details: ['12 El-Tahrir Square', 'Downtown Cairo, Egypt'],
      description: 'Open Sun–Thu: 9AM–6PM',
      action: 'https://maps.google.com/?q=Tahrir+Square+Cairo+Egypt',
      actionLabel: 'Get Directions',
    },
  ]

  const offices = [
    {
      city: 'Cairo (Head Office)',
      address: '12 El-Tahrir Square, Downtown Cairo',
      phone: '+20 121 201 1881',
      hours: 'Sun–Thu: 9:00 AM – 6:00 PM',
      image: '/number10.jpg',
    },
    {
      city: 'Luxor Office',
      address: 'Corniche El-Nile Street, Luxor City',
      phone: '+20 123 456 7891',
      hours: 'Sun–Thu: 9:00 AM – 5:00 PM',
      image: '/number11.jpg',
    },
    {
      city: 'Hurghada Office',
      address: 'Sheraton Road, El Dahar, Hurghada',
      phone: '+20 123 456 7892',
      hours: 'Daily: 10:00 AM – 8:00 PM',
      image: '/number12.jpg',
    },
  ]

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <HeroSection
        title="Contact Us"
        subtitle="Whether you need a transfer quote or want to plan a full tour — we're here to help"
        backgroundImage="/number14.jpg"
        height="h-[50vh]"
      />

      {/* Contact Methods */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              How to Reach Us
            </h2>
            <p className="section-subtitle">
              Choose the method that works best for you — we're always here to help
            </p>
            <div className="section-divider" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                {method.details.map((detail, i) => (
                  <p key={i} className="text-gray-700 font-medium text-sm">{detail}</p>
                ))}
                <p className="text-gray-500 text-xs mt-2 mb-4">{method.description}</p>
                <a
                  href={method.action}
                  target={method.action.startsWith('http') ? '_blank' : undefined}
                  rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1 text-primary-500 font-medium text-sm hover:text-primary-600 transition-colors"
                >
                  {method.actionLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and our travel experts will get back to you within 24 hours.
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                  >
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                  >
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
                    <p className="text-green-700">
                      Thank you for reaching out. Our team will respond within 24 hours. In the meantime, feel free to
                      WhatsApp us for faster assistance.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 890"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Trip Type</label>
                        <select
                          name="tripType"
                          value={formData.tripType}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Select a trip type</option>
                          <option value="airport-transfer">Airport Transfer</option>
                          <option value="intercity-transfer">Intercity Transfer</option>
                          <option value="day-tour">Day Tour</option>
                          <option value="multi-day">Multi-Day Tour</option>
                          <option value="nile-cruise">Nile Cruise</option>
                          <option value="desert-safari">Desert Safari</option>
                          <option value="custom">Custom / Private Trip</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="form-label">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What is your inquiry about?"
                        className="form-input"
                      />
                    </div>

                    <div className="mt-6">
                      <label className="form-label">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us about your travel plans, dates, group size, and any special requests..."
                        className="form-input resize-none"
                      />
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn btn-primary py-4 text-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Send Message
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Side Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Quick Response Guarantee */}
                <div className="bg-primary-500 text-white rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Quick Response Guarantee</h3>
                      <p className="text-white/80 text-sm">We reply within 24 hours</p>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm">
                    Our dedicated team monitors inquiries around the clock. For urgent matters,
                    WhatsApp us for an instant response.
                  </p>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Working Hours
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sunday – Thursday</span>
                      <span className="font-medium text-gray-900">9:00 AM – 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Friday</span>
                      <span className="font-medium text-gray-900">10:00 AM – 2:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-red-500">Closed</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        * WhatsApp support available 24/7, including holidays
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Shortcut */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">Have Questions?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Check our frequently asked questions for quick answers about tours, bookings, and travel tips.
                  </p>
                  <a href="/faq" className="inline-flex items-center gap-1 text-primary-500 font-medium text-sm hover:text-primary-600">
                    Visit FAQ Page
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Offices */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              Visit Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Offices Across Egypt
            </h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={office.image}
                    alt={office.city}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{office.city}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                      <svg className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-100">
        <div className="w-full h-[400px]">
          <iframe
            title="Egypt Travel Pro Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.7!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c57a0d8271%3A0x3d51e4e6d0e73776!2sTahrir%20Square!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  )
}

export default Contact