import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const sections = [
  {
    title: 'Day Tours',
    subtitle: 'Private Guided Tours',
    icon: '🏛️',
    description: 'Explore Egypt\'s most iconic sites with private Egyptologist guides. Visit the Pyramids, Luxor temples, Aswan highlights, and more — all in a single day with hotel pickup, lunch, and entrance fees included.',
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&h=500&fit=crop&q=80',
    link: '/day-tours',
    tourCount: 6,
    priceFrom: 55,
    highlights: ['Pyramids & Sphinx', 'Luxor Temples', 'Aswan & Philae', 'Alexandria', 'Saqqara & Memphis', 'Islamic Cairo'],
    badges: ['Hotel Pickup', 'Lunch Included', 'Expert Guide', 'Free Cancellation'],
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
  {
    title: 'Nile Cruises',
    subtitle: 'Sail the Ancient Nile',
    icon: '🚢',
    description: 'Cruise between Luxor and Aswan aboard luxury 5-star ships or intimate Dahabiya sailing boats. Visit every major temple along the Nile with full board meals, nightly entertainment, and an expert Egyptologist.',
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&h=500&fit=crop&q=80',
    link: '/nile-cruises',
    tourCount: 4,
    priceFrom: 320,
    highlights: ['3 to 7 Night Options', 'Luxury 5-Star Ships', 'Dahabiya Sailing', 'All Temples Included', 'Full Board Meals', 'Abu Simbel Option'],
    badges: ['Full Board', 'All Temples', 'Entertainment', 'Egyptologist Guide'],
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    title: 'Shore Excursions',
    subtitle: 'From Your Cruise Ship',
    icon: '⚓',
    description: 'Private day trips from Egypt\'s cruise ports — Alexandria, Safaga, Ain Sokhna, and Port Said. See the Pyramids, explore Luxor, or snorkel the Red Sea with our ship return guarantee.',
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&h=500&fit=crop&q=80',
    link: '/shore-excursions',
    tourCount: 6,
    priceFrom: 65,
    highlights: ['Alexandria Port', 'Safaga Port', 'Ain Sokhna Port', 'Port Said', 'Pyramids from Port', 'Red Sea Snorkeling'],
    badges: ['Port Pickup', 'Ship Guarantee', 'Private Tour', '50% Less Than Ship'],
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
  },
]

const stats = [
  { value: '16+', label: 'Tours & Experiences' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '8,000+', label: 'Happy Travelers' },
  { value: '100%', label: 'Private Tours' },
]

const reviews = [
  { name: 'Marco & Lucia', country: 'Italy 🇮🇹', rating: 5, tour: 'Pyramids & Museum', text: 'Our guide Mahmoud was exceptional — so knowledgeable and passionate. The private car was comfortable and the whole day was perfectly organized.', date: 'January 2026' },
  { name: 'James & Helen', country: 'UK 🇬🇧', rating: 5, tour: 'Al Hambra Nile Cruise', text: 'Absolutely magical week on the Nile. Waking up to new temples every morning, the crew was outstanding, food was excellent.', date: 'January 2026' },
  { name: 'Robert & Jane', country: 'USA 🇺🇸', rating: 5, tour: 'Alexandria → Pyramids', text: 'We were worried about making it back to our cruise, but the driver was so efficient. Saw the Pyramids AND the museum and were back at port 2 hours early!', date: 'January 2026' },
  { name: 'Yuki Tanaka', country: 'Japan 🇯🇵', rating: 5, tour: 'Merit Dahabiya', text: 'The Dahabiya experience is unlike anything else. Sailing by wind, visiting hidden temples no one else sees, and sleeping under the stars on deck.', date: 'December 2025' },
  { name: 'David Miller', country: 'Canada 🇨🇦', rating: 5, tour: 'Luxor Full Day', text: 'Valley of the Kings blew my mind. Having a private Egyptologist explain everything made it 10x better than wandering alone.', date: 'December 2025' },
  { name: 'Sophie Laurent', country: 'France 🇫🇷', rating: 5, tour: 'Pyramids, Saqqara & Memphis', text: 'Saqqara was a wonderful surprise — much quieter than Giza and the Step Pyramid is incredible. Our guide\'s knowledge was impressive!', date: 'February 2026' },
  { name: 'Sarah O\'Connor', country: 'Ireland 🇮🇪', rating: 5, tour: 'Ain Sokhna → Cairo', text: 'So much better than the ship\'s excursion — private car, no crowds, our own guide. Half the price of the cruise line option!', date: 'November 2025' },
  { name: 'Anna Schmidt', country: 'Germany 🇩🇪', rating: 5, tour: '3-Night Cruise', text: 'Perfect for our tight schedule. Three nights was enough to see the key temples between Aswan and Luxor. Comfortable cabin, good food.', date: 'February 2026' },
]

const AllTours = () => {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-secondary-500 overflow-hidden">
        <div className="absolute inset-0 opacity-75">
          <img src="https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1920&h=900&fit=crop&q=80" alt="Egyptian temples and monuments" className="w-full h-full object-cover object-center" />
        </div>
        <div className="relative container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link to="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Tours</span>
            </nav>
            <span className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Explore Egypt Your Way</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>All Tours & Experiences</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl">
              Choose from day tours, Nile cruises, and shore excursions — each on its own dedicated page with full details, itineraries, photos, and instant booking.
            </p>
            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Private Tours</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Expert Guides</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Meals Included</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Hotel Pickup</div>
              <div className="flex items-center gap-2"><span className="text-primary-400">✓</span> Free Cancellation</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Browse by Category</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Choose Your Experience</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Each category has its own dedicated page with full tour details, photo galleries, itineraries, booking forms, FAQs, and reviews.</p>
          </div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                  {/* Image Side */}
                  <div className="lg:w-1/2 relative">
                    <div className="relative h-72 lg:h-full min-h-[360px] overflow-hidden">
                      <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-30`} />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        {section.icon} {section.tourCount} Experiences
                      </div>
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 font-bold px-4 py-2 rounded-full shadow-lg">
                        From <span className="text-primary-600 text-lg">${section.priceFrom}</span> <span className="text-xs text-gray-500 font-normal">/ person</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col">
                    <div className="mb-2">
                      <span className={`inline-block text-xs font-semibold uppercase tracking-wider ${section.textColor} mb-2`}>{section.subtitle}</span>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {section.icon} {section.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-5 leading-relaxed">{section.description}</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {section.badges.map(badge => (
                        <span key={badge} className={`inline-flex items-center gap-1 text-xs font-medium ${section.bgColor} ${section.textColor} px-3 py-1.5 rounded-full ${section.borderColor} border`}>
                          ✓ {badge}
                        </span>
                      ))}
                    </div>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {section.highlights.map(h => (
                        <div key={h} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-primary-500 text-xs">▸</span> {h}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto flex flex-wrap gap-3">
                      <Link to={section.link} className="btn btn-primary text-sm px-8 py-3">
                        View All {section.title} →
                      </Link>
                      <a
                        href={`https://wa.me/201212011881?text=${encodeURIComponent(`Hi! I'm interested in your ${section.title}. Can you help me choose?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary text-sm px-6 py-3"
                      >
                        💬 Ask on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Quick Access</h2>
            <p className="text-gray-600 mt-2">Jump straight to the tours you're interested in</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map((section, i) => (
              <motion.div key={section.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link
                  to={section.link}
                  className={`block p-6 rounded-xl border-2 ${section.borderColor} ${section.bgColor} hover:shadow-lg transition-all duration-300 group`}
                >
                  <div className="text-4xl mb-3">{section.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{section.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.tourCount} experiences from ${section.priceFrom}</p>
                  <div className={`mt-3 text-sm font-semibold ${section.textColor} flex items-center gap-1`}>
                    Browse {section.title} <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-3">Traveler Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Guests Say</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="text-gray-700 font-semibold">4.9/5</span>
              <span className="text-gray-500 text-sm">based on 8,000+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-yellow-400 mb-3">{'★'.repeat(r.rating)}</div>
                <p className="text-gray-600 text-sm italic mb-4">"{r.text}"</p>
                <div className="border-t pt-3"><p className="font-semibold text-gray-900 text-sm">{r.name}</p><p className="text-xs text-gray-500">{r.country} • {r.tour}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Need a Custom Tour?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">We can design any tour, cruise, or excursion to match your schedule and interests. Tell us what you want to see!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/201212011881?text=Hi!%20I%20want%20a%20custom%20tour%20in%20Egypt" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">💬 Chat on WhatsApp</a>
            <Link to="/contact" className="btn btn-outline btn-lg">✉️ Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AllTours