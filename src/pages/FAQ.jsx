import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroSection } from '../components'

/**
 * FAQ Page
 * Frequently Asked Questions about Egypt transfers, tours, bookings, and practical info
 */
const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general')
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (id) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const categories = [
    { id: 'general', label: 'General', icon: '🌍' },
    { id: 'booking', label: 'Booking & Payment', icon: '💳' },
    { id: 'tours', label: 'Tours & Itineraries', icon: '🗺️' },
    { id: 'travel', label: 'Travel Practicalities', icon: '✈️' },
    { id: 'safety', label: 'Safety & Health', icon: '🛡️' },
    { id: 'custom', label: 'Custom Trips', icon: '✨' },
  ]

  const faqs = {
    general: [
      {
        id: 'g1',
        question: 'What is Egypt Travel Pro?',
        answer: 'Egypt Travel Pro is a licensed Egyptian travel and transport company founded in 2010. We specialize in private transfers (airport pickups, intercity rides) and curated guided tours across Egypt — from the Pyramids of Giza and Nile cruises to Red Sea resorts and desert safaris. With 15+ years of experience and 20,000+ satisfied customers, we are one of Egypt\'s most trusted travel service providers.',
      },
      {
        id: 'g2',
        question: 'Why should I book with Egypt Travel Pro instead of other agencies?',
        answer: 'We are locally owned and operated with a modern fleet of vehicles and English-speaking drivers. Our advantages include: licensed by the Egyptian Ministry of Tourism, 24/7 on-ground support, transparent fixed pricing with no hidden fees, flight-tracking for airport pickups, a 99% on-time rate, and a 4.9★ rating on Google Reviews.',
      },
      {
        id: 'g3',
        question: 'What services do you offer?',
        answer: 'We offer: private airport transfers (Cairo, Luxor, Hurghada, Sharm El Sheikh), intercity transfers between any two cities in Egypt, guided day tours with certified Egyptologists, multi-day Nile cruise packages (Luxor to Aswan), desert safari adventures, Red Sea excursions, and fully customizable private tours and itineraries.',
      },
      {
        id: 'g4',
        question: 'Do you offer tours in languages other than English?',
        answer: 'Yes! Our guides are fluent in multiple languages including English, Arabic, French, Spanish, German, Italian, and Russian. Please specify your preferred language when booking and we will assign an appropriate guide.',
      },
      {
        id: 'g5',
        question: 'What is the best time to visit Egypt?',
        answer: 'The best time to visit Egypt is from October to April when temperatures are pleasant (20-25°C / 68-77°F). This is ideal for sightseeing at ancient sites. Summer (May-September) is hot but perfect for Red Sea beach resorts like Hurghada and Sharm El Sheikh where sea breezes keep things comfortable. Ramadan dates vary yearly — tours still operate but some restaurants may have adjusted hours.',
      },
    ],
    booking: [
      {
        id: 'b1',
        question: 'How do I book a transfer or tour?',
        answer: 'You can book through our website by using the "Book Your Transfer" section on the home page, contact us via WhatsApp at +20 121 201 1881 for instant assistance, email us at bookings@egypttimetravel.com, or call our office directly. We\'ll confirm your booking within 24 hours with a detailed quote and pickup instructions.',
      },
      {
        id: 'b2',
        question: 'What payment methods do you accept?',
        answer: 'We accept Visa, MasterCard, American Express, bank transfers, and cash payment upon arrival in Egypt. A 20% deposit is required to confirm your booking, with the remaining balance due 30 days before your tour start date. For last-minute bookings (within 14 days), full payment is required.',
      },
      {
        id: 'b3',
        question: 'What is your cancellation policy?',
        answer: 'Free cancellation up to 30 days before the tour start date (full refund). 15-29 days before: 50% refund. 7-14 days before: 25% refund. Less than 7 days: no refund. We strongly recommend travel insurance to protect against unexpected changes. Force majeure events are handled case-by-case.',
      },
      {
        id: 'b4',
        question: 'Can I modify my booking after confirmation?',
        answer: 'Yes, modifications are free of charge if requested more than 14 days before the tour date, subject to availability. Changes within 14 days may incur a small adjustment fee depending on the nature of the change. Contact us as early as possible for the smoothest modifications.',
      },
      {
        id: 'b5',
        question: 'Do your prices include everything?',
        answer: 'Our tour prices typically include: accommodation, transportation (AC vehicles), professional Egyptologist guide, entrance fees to sites listed in the itinerary, meals as specified (usually breakfast, some lunches). Not included: international flights, visa fees, personal expenses, tips/gratuities, travel insurance, and optional activities unless specified.',
      },
    ],
    tours: [
      {
        id: 't1',
        question: 'What does a typical day on a tour look like?',
        answer: 'A typical day starts with breakfast at your hotel (7-8 AM), followed by morning sightseeing at major attractions with your Egyptologist guide. You\'ll enjoy lunch at a local restaurant, then continue with afternoon visits or leisure time. Evenings are usually free for you to explore local markets, enjoy dinner, or relax. Some tours include special evening experiences like Sound & Light shows at the Pyramids.',
      },
      {
        id: 't2',
        question: 'What are the group sizes for tours?',
        answer: 'Our standard group tours have a maximum of 12 travelers to ensure a personal experience. Average group size is 6-8 people. We also offer private tours for couples, families, or solo travelers who prefer a completely personalized experience. Private tours can be arranged for any group size.',
      },
      {
        id: 't3',
        question: 'What kind of hotels do you use?',
        answer: 'We use carefully selected 4-5 star hotels that combine comfort with authentic Egyptian character. In Cairo, we use hotels near the Pyramids or in Garden City. For Nile cruises, we partner with 5-star vessels like the MS Nile Premium. In Luxor and Aswan, we choose riverside hotels with stunning views. All hotels are regularly inspected by our team.',
      },
      {
        id: 't4',
        question: 'Are your Nile cruises worth it?',
        answer: 'Absolutely! Our Nile cruises are among our most popular offerings. You\'ll sail between Luxor and Aswan (3-4 nights) visiting Karnak Temple, Valley of the Kings, Edfu Temple, Kom Ombo, and Philae Temple. The cruise includes all meals, entertainment, guided tours at each stop, and the magical experience of watching sunset over the Nile from your private balcony.',
      },
      {
        id: 't5',
        question: 'Can I combine multiple destinations in one trip?',
        answer: 'Yes, this is what we do best! Our multi-day packages combine Cairo, Luxor, Aswan, Alexandria, the Red Sea, and desert destinations. For example, our popular 10-day "Egypt Highlights" tour covers Cairo (Pyramids, Egyptian Museum), a Nile cruise (Luxor to Aswan), and Hurghada (Red Sea beaches). We can also create custom itineraries mixing any destinations.',
      },
    ],
    travel: [
      {
        id: 'tr1',
        question: 'Do I need a visa to visit Egypt?',
        answer: 'Most nationalities can obtain a visa on arrival at Egyptian airports for approximately $25 USD (single entry, 30 days). Citizens of the USA, EU, UK, Canada, Australia, and many other countries are eligible. You can also apply for an e-visa online at visa2egypt.gov.eg before your trip. Your passport must be valid for at least 6 months from your arrival date.',
      },
      {
        id: 'tr2',
        question: 'What currency is used in Egypt? Should I bring cash?',
        answer: 'The Egyptian Pound (EGP) is the local currency. We recommend bringing USD, EUR, or GBP to exchange locally — you\'ll get better rates at exchange offices than banks. ATMs are widely available in cities. Credit cards are accepted at hotels, large restaurants, and tourist shops. Keep small bills for tips, markets, and small vendors. Your guide can help with currency exchange.',
      },
      {
        id: 'tr3',
        question: 'What should I pack for an Egypt trip?',
        answer: 'Essentials include: lightweight, breathable clothing (cotton or linen), comfortable walking shoes, sunscreen (SPF 50+), sunglasses, hat, light jacket for air-conditioned spaces and cool desert nights, modest clothing for mosque/temple visits (shoulders and knees covered), swimwear for hotels and Red Sea, a small daypack, and any prescription medications.',
      },
      {
        id: 'tr4',
        question: 'How do I get around between cities?',
        answer: 'All transportation between cities is included in our tour packages. We use air-conditioned minibuses, private cars, and domestic flights (Cairo to Luxor/Aswan/Hurghada). Nile cruises handle the Luxor-Aswan stretch. For independent travelers, Egypt has good domestic flight connections (EgyptAir), comfortable sleeper trains, and a modern highway network.',
      },
      {
        id: 'tr5',
        question: 'Is tipping expected in Egypt?',
        answer: 'Tipping (baksheesh) is a customary part of Egyptian culture. General guidelines: Tour guides (50-100 EGP per day per person), drivers (30-50 EGP per day), hotel porters (20-30 EGP), restaurant waiters (10-15% of the bill), cruise staff (100-150 EGP total per person for the trip). Tips are always appreciated but never mandatory. Your guide can advise on appropriate amounts.',
      },
    ],
    safety: [
      {
        id: 's1',
        question: 'Is Egypt safe for tourists?',
        answer: 'Yes, Egypt is generally safe for tourists. Tourist areas including Cairo, Luxor, Aswan, the Red Sea resorts, and Alexandria are well-policed with dedicated tourist police. Egypt welcomes millions of tourists annually. We closely monitor safety advisories and only operate in areas confirmed safe. Our guides are trained in safety protocols and maintain constant communication with our operations center.',
      },
      {
        id: 's2',
        question: 'Is it safe for solo female travelers?',
        answer: 'Yes, many solo female travelers visit Egypt safely every year. We recommend: dressing modestly (covering shoulders and knees), joining guided tours for major sites, avoiding walking alone late at night in unfamiliar areas, and using reputable transportation. Our female guides are available upon request, and our team provides 24/7 support throughout your stay.',
      },
      {
        id: 's3',
        question: 'Do I need any vaccinations for Egypt?',
        answer: 'No mandatory vaccinations are required for Egypt. However, the CDC recommends being up to date on routine vaccines (MMR, tetanus, hepatitis A & B). Drink bottled water only — it\'s cheap and available everywhere. Avoid tap water and ice from unknown sources. Bring basic stomach remedies and sunburn cream. Travel insurance with medical coverage is strongly recommended.',
      },
      {
        id: 's4',
        question: 'What about food safety?',
        answer: 'Egyptian cuisine is delicious and generally safe when eaten at reputable restaurants, which our tours exclusively use. Try local favorites like koshari, foul medames, shawarma, and fresh seafood. Avoid street food if you have a sensitive stomach. Peel fruits yourself, drink bottled water, and your guide will recommend the best local restaurants for authentic, safe dining experiences.',
      },
      {
        id: 's5',
        question: 'What happens if I have an emergency during my tour?',
        answer: 'We provide 24/7 emergency support via phone and WhatsApp. Our guides carry first aid kits and know the nearest hospitals at every destination. We have partnerships with international hospitals in Cairo, Luxor, and Red Sea resorts. All our vehicles are equipped with emergency supplies. We strongly recommend travel insurance that covers medical evacuation.',
      },
    ],
    custom: [
      {
        id: 'c1',
        question: 'Can I create a completely custom itinerary?',
        answer: 'Absolutely! Custom trips are our specialty. Tell us your interests (history, adventure, relaxation, food), preferred dates, budget range, and group size. Our travel designers will craft a personalized itinerary within 48 hours. You can modify it until it\'s perfect. Custom trips can include off-the-beaten-path destinations most tourists never see.',
      },
      {
        id: 'c2',
        question: 'How far in advance should I book a custom trip?',
        answer: 'We recommend booking at least 4-6 weeks in advance for custom trips to ensure the best hotel availability and guide selection. During peak season (October-March), 8-12 weeks advance notice is ideal. However, we can also accommodate last-minute custom requests — just contact us and we\'ll do our best!',
      },
      {
        id: 'c3',
        question: 'Can you arrange special experiences like hot air balloon rides?',
        answer: 'Yes! We can arrange many special experiences including: hot air balloon rides over Luxor\'s West Bank at sunrise, private dinner at the Pyramids, scuba diving certification in the Red Sea, sandboarding in the Great Sand Sea, felucca sailing at sunset in Aswan, cooking classes with Egyptian families, sound and light shows, and camel treks through desert oases.',
      },
      {
        id: 'c4',
        question: 'Do you offer honeymoon or anniversary packages?',
        answer: 'Yes, we create romantic Egypt packages perfect for honeymooners and couples celebrating milestones. These include: luxury Nile cruise suites, private tours of the Pyramids at sunrise, romantic dinners overlooking the Nile, spa treatments, Red Sea beach resorts, and special touches like flowers, champagne, and personalized welcome amenities.',
      },
      {
        id: 'c5',
        question: 'Can you help with accessibility needs?',
        answer: 'We are committed to making Egypt accessible to all travelers. We offer wheelchair-accessible vehicles, modified itineraries for mobility-impaired travelers, and guides experienced with special needs groups. While some ancient sites have limited accessibility, our team knows the best routes and alternatives. Please share your specific needs when booking so we can prepare accordingly.',
      },
    ],
  }

  const currentFaqs = faqs[activeCategory] || []

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <HeroSection
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about traveling to Egypt with us"
        backgroundImage="/number15.jpg"
        height="h-[50vh]"
      />

      {/* Category Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40">
        <div className="container-custom py-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {categories.find(c => c.id === activeCategory)?.icon}{' '}
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <p className="text-gray-600">
                {currentFaqs.length} questions in this category
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {currentFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <svg
                        className={`w-5 h-5 text-primary-500 flex-shrink-0 transition-transform duration-300 ${
                          openItems[faq.id] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {openItems[faq.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="text-5xl mb-6">🤔</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Still Have Questions?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Can't find what you're looking for? Our travel experts are ready to help you plan the perfect Egyptian adventure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Contact Us
              </Link>
              <a
                href="https://wa.me/201212011881?text=Hello!%20I%20have%20a%20question%20about%20your%20transfers%20and%20tours."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
            >
              <div className="text-3xl mb-4">🗺️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Browse Tours</h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore our curated collection of Egypt tours and find your perfect adventure.
              </p>
              <Link to="/trips" className="text-primary-500 font-medium text-sm hover:text-primary-600 inline-flex items-center gap-1">
                View All Tours
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
            >
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Read Our Blog</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get travel tips, destination guides, and insider knowledge about Egypt.
              </p>
              <Link to="/blog" className="text-primary-500 font-medium text-sm hover:text-primary-600 inline-flex items-center gap-1">
                Visit Blog
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
            >
              <div className="text-3xl mb-4">✏️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Plan Custom Trip</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tell us your preferences and we'll create a tailor-made Egyptian journey.
              </p>
              <Link to="/plan-trip" className="text-primary-500 font-medium text-sm hover:text-primary-600 inline-flex items-center gap-1">
                Start Planning
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default FAQ