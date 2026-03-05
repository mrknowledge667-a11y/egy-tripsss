import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroSection } from '../components'

gsap.registerPlugin(ScrollTrigger)

/**
 * About Page
 * Company story, mission, team, and values for Egypt Travel Pro
 */
const About = () => {
  const timelineRef = useRef(null)
  const valuesRef = useRef(null)

  useEffect(() => {
    if (timelineRef.current) {
      gsap.fromTo(
        timelineRef.current.querySelectorAll('.timeline-item'),
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    if (valuesRef.current) {
      gsap.fromTo(
        valuesRef.current.querySelectorAll('.value-card'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  }

  const team = [
    {
      name: 'Ahmed Hassan',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Born and raised in Cairo, Ahmed has over 25 years of experience in Egyptian tourism. A certified Egyptologist with a passion for sharing his homeland.',
    },
    {
      name: 'Fatima El-Sayed',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      bio: 'With a background in hospitality management, Fatima ensures every tour runs seamlessly from start to finish.',
    },
    {
      name: 'Omar Khalil',
      role: 'Senior Tour Guide',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      bio: 'A licensed Egyptologist fluent in 4 languages, Omar brings ancient history to life with his engaging storytelling.',
    },
    {
      name: 'Nour Ibrahim',
      role: 'Customer Experience Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      bio: 'Nour is dedicated to making every traveler feel welcome and ensuring their experience exceeds expectations.',
    },
  ]

  const milestones = [
    { year: '2010', title: 'Founded in Cairo', description: 'Egypt Travel Pro was launched to provide reliable private transfers and guided tours across Egypt.' },
    { year: '2013', title: 'Fleet Expansion', description: 'Grew our fleet from 5 vehicles to 25+, adding SUVs, minivans, and luxury sedans.' },
    { year: '2016', title: 'Tour Packages Added', description: 'Expanded beyond transfers into full guided tour packages with certified Egyptologists.' },
    { year: '2019', title: '10,000 Transfers Completed', description: 'Reached a major milestone with a 99% on-time delivery rate across all routes.' },
    { year: '2022', title: 'Online Booking Platform', description: 'Launched instant online booking with real-time availability and WhatsApp integration.' },
    { year: '2025', title: '20,000+ Happy Travelers', description: 'Continuing to grow with new routes, luxury vehicles, and an expanding team of drivers.' },
  ]

  const values = [
    {
      icon: '🚗',
      title: 'Reliability',
      description: 'We show up on time, every time. Our drivers track your flight in real-time and adjust for delays — no extra charge.',
    },
    {
      icon: '🛡️',
      title: 'Safety First',
      description: 'Licensed by the Egyptian Ministry of Tourism, with fully insured vehicles, vetted drivers, and 24/7 on-ground support.',
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No surge pricing, no hidden fees. You get a fixed quote before you book, and that\'s exactly what you pay.',
    },
    {
      icon: '✨',
      title: 'Comfort & Quality',
      description: 'Air-conditioned vehicles, bottled water, and Wi-Fi available on select rides. We go beyond basic transport.',
    },
    {
      icon: '❤️',
      title: 'Passion for Egypt',
      description: 'We\'re locals who love sharing our country. Whether it\'s a quick airport run or a multi-day tour, we make it special.',
    },
    {
      icon: '🎯',
      title: 'Flexible & Custom',
      description: 'Need a last-minute change? Extra stops along the way? We adapt to your needs — your trip, your rules.',
    },
  ]

  const certifications = [
    'Egyptian Ministry of Tourism Licensed Operator',
    'Fully Insured Fleet of Vehicles',
    'TripAdvisor Certificate of Excellence (2020–2025)',
    'Google Reviews 4.9★ Rating',
    'Safe Travels Certified by WTTC',
  ]

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <HeroSection
        title="About Egypt Travel Pro"
        subtitle="Your trusted partner for private transfers, guided tours, and travel across Egypt since 2010"
        backgroundImage="/number3.jpg"
        height="h-[55vh]"
      />

      {/* Our Story */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Travel Egypt with Confidence
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Egypt Travel Pro was founded in 2010 by a team of local travel professionals who saw a need for
                reliable, comfortable, and fairly-priced transport for visitors exploring Egypt. We started with
                airport transfers and quickly expanded into full guided tours.
              </p>
              <p className="text-gray-600 mb-6">
                What began with a small fleet of five cars has grown into a full-service travel company with 30+ vehicles,
                a team of experienced drivers and certified Egyptologists, and over 20,000 satisfied customers
                from 60+ countries. We offer everything from a quick airport pickup to a 14-day all-inclusive Egypt tour.
              </p>
              <p className="text-gray-600 mb-8">
                Our promise is simple: on-time service, transparent pricing, and a friendly team that treats
                every traveler like family. Whether you're here for business or adventure, we've got you covered.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/trips" className="btn btn-primary">
                  Explore Our Tours
                </Link>
                <Link to="/contact" className="btn btn-outline-primary">
                  Get in Touch
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img src="/number1.jpg" alt="Egypt pyramids tour" className="w-full h-48 md:h-64 object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img src="/number2.jpg" alt="Nile cruise experience" className="w-full h-32 md:h-40 object-cover" />
                  </div>
                </div>
                <div className="pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img src="/number4.jpg" alt="Egypt temple visit" className="w-full h-64 md:h-80 object-cover" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary-500 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-center">
                  <span className="block text-4xl font-bold">15+</span>
                  <span className="text-sm">Years on the Road</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-secondary-500 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our Mission
              </h3>
              <p className="text-white/80 text-lg">
                To provide safe, comfortable, and affordable private transfers and guided tours across Egypt —
                connecting travelers with the rich history, vibrant culture, and warm hospitality of our country
                while delivering unmatched on-time reliability.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🔭</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our Vision
              </h3>
              <p className="text-white/80 text-lg">
                To be the most trusted name in Egyptian travel and transport, known for our modern fleet,
                professional drivers, and customer-first approach — making it effortless for anyone to
                explore Egypt safely and comfortably.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Core Values
            </h2>
            <p className="section-subtitle">
              These principles guide everything we do at Egypt Travel Pro
            </p>
            <div className="section-divider" />
          </motion.div>

          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="value-card bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
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
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              15 Years on the Road
            </h2>
            <div className="section-divider" />
          </motion.div>

          <div ref={timelineRef} className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="timeline-item relative pl-12 pb-10 last:pb-0">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold z-10">
                  {index + 1}
                </div>
                {index < milestones.length - 1 && (
                  <div className="absolute left-[15px] top-8 w-0.5 h-full bg-primary-200" />
                )}
                <div className="ml-4">
                  <span className="inline-block text-primary-500 font-bold text-lg mb-1">{milestone.year}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              The People Behind Your Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Meet Our Team
            </h2>
            <p className="section-subtitle">
              Passionate locals dedicated to making your Egyptian adventure extraordinary
            </p>
            <div className="section-divider" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-primary-500 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Licensed & Certified
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Your safety and satisfaction are guaranteed by recognized industry certifications
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full"
              >
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{cert}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/number9.jpg" alt="Egypt adventure" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-800/90 to-secondary-900/85" />
        </div>
        <div className="relative z-10 container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Experience Egypt With Us?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Join 20,000+ happy travelers who chose Egypt Travel Pro for seamless transfers and unforgettable tours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/plan-trip" className="btn btn-primary btn-lg">
                Plan Your Trip
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default About