import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Terms and Conditions Page
 * Comprehensive terms for EgyptTravelPro.com services
 */
const TermsAndConditions = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 bg-gray-50 min-h-screen"
    >
      {/* Hero Banner */}
      <section className="relative bg-secondary-500 py-16 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-secondary-700/80" />
        <div className="container-custom relative z-10 text-center">
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Please read these terms carefully before using our services
          </motion.p>
          <div className="w-24 h-1 bg-primary-500 mx-auto mt-6" />
        </div>
      </section>

      {/* Content */}
      <div className="container-custom max-w-4xl">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-10"
        >
          {/* Last Updated */}
          <p className="text-sm text-gray-400">Last updated: February 2026</p>

          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to EgyptTravelPro.com ("Company", "we", "our", "us"). These Terms and Conditions govern your use of our website and services, including but not limited to private transfers, guided tours, Nile cruises, shore excursions, and travel packages across Egypt. By accessing or using our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our services.
            </p>
          </section>

          {/* 2. Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Definitions
            </h2>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2 ml-4">
              <li><strong>"Client"</strong> or <strong>"You"</strong> refers to any person or entity who books or uses our services.</li>
              <li><strong>"Services"</strong> refers to all travel-related services offered by EgyptTravelPro.com, including transfers, tours, accommodations, and packages.</li>
              <li><strong>"Booking"</strong> refers to a confirmed reservation for any of our services.</li>
              <li><strong>"Itinerary"</strong> refers to the travel plan and schedule provided for your trip.</li>
              <li><strong>"Force Majeure"</strong> refers to events beyond our reasonable control, including natural disasters, wars, pandemics, government actions, and similar events.</li>
            </ul>
          </section>

          {/* 3. Booking & Reservations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Booking & Reservations
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>All bookings are subject to availability and confirmation by EgyptTravelPro.com. A booking is only confirmed once you receive a written confirmation via email.</p>
              <p><strong>3.1.</strong> To make a booking, you must provide accurate personal information including full name, contact details, passport information, and any special requirements.</p>
              <p><strong>3.2.</strong> A deposit of <strong>30%</strong> of the total tour price is required to confirm your booking. The remaining balance must be paid no later than <strong>30 days</strong> before the departure date.</p>
              <p><strong>3.3.</strong> For bookings made within 30 days of the departure date, full payment is required at the time of booking.</p>
              <p><strong>3.4.</strong> All prices are quoted in US Dollars (USD) unless otherwise stated. We reserve the right to adjust prices due to currency fluctuations, fuel surcharges, or changes in government taxes.</p>
              <p><strong>3.5.</strong> Group bookings (10+ travelers) may be subject to different terms. Please contact us directly for group rates and conditions.</p>
            </div>
          </section>

          {/* 4. Cancellation & Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Cancellation & Refund Policy
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>All cancellations must be submitted in writing via email. Cancellation charges are as follows:</p>
              <div className="bg-gray-50 rounded-xl p-6 my-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-900 font-semibold">Cancellation Period</th>
                      <th className="text-right py-2 text-gray-900 font-semibold">Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">More than 60 days before departure</td>
                      <td className="text-right py-2 text-green-600 font-medium">Deposit only (non-refundable)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">30–60 days before departure</td>
                      <td className="text-right py-2 text-yellow-600 font-medium">50% of total cost</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">15–29 days before departure</td>
                      <td className="text-right py-2 text-orange-600 font-medium">75% of total cost</td>
                    </tr>
                    <tr>
                      <td className="py-2">Less than 15 days before departure</td>
                      <td className="text-right py-2 text-red-600 font-medium">100% of total cost</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p><strong>4.1.</strong> No-shows or failure to join the tour without prior notice will result in 100% forfeiture of the total amount paid.</p>
              <p><strong>4.2.</strong> If EgyptTravelPro.com cancels a tour due to insufficient participants or operational reasons, you will receive a full refund or the option to reschedule at no additional cost.</p>
              <p><strong>4.3.</strong> Refunds will be processed within 14 business days via the original payment method.</p>
            </div>
          </section>

          {/* 5. Travel Insurance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Travel Insurance
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>We <strong>strongly recommend</strong> that all travelers obtain comprehensive travel insurance covering trip cancellation, medical emergencies, baggage loss, and personal liability before departure.</p>
              <p>EgyptTravelPro.com is not responsible for any costs arising from illness, injury, lost belongings, or other unforeseen events during your trip.</p>
            </div>
          </section>

          {/* 6. Itinerary Changes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Itinerary Changes
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>6.1.</strong> While we strive to follow the published itinerary, we reserve the right to make changes due to weather conditions, security concerns, site closures, or other circumstances beyond our control.</p>
              <p><strong>6.2.</strong> In such cases, we will provide suitable alternatives of equal or higher value whenever possible.</p>
              <p><strong>6.3.</strong> No refund will be provided for minor itinerary adjustments that do not substantially alter the tour experience.</p>
            </div>
          </section>

          {/* 7. Client Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
              Client Responsibilities
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>7.1.</strong> You are responsible for ensuring that you hold a valid passport (with at least 6 months validity), necessary visas, and any required travel documents for entry into Egypt.</p>
              <p><strong>7.2.</strong> You must comply with local laws, customs, and regulations during your stay in Egypt.</p>
              <p><strong>7.3.</strong> You must be at the designated pick-up location at the scheduled time. We are not responsible for delays caused by the client.</p>
              <p><strong>7.4.</strong> You agree to follow the instructions and safety guidelines provided by our drivers, tour guides, and representatives at all times.</p>
              <p><strong>7.5.</strong> Any damage to vehicles, hotel property, or tour equipment caused by the client will be charged to the client.</p>
            </div>
          </section>

          {/* 8. Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
              Limitation of Liability
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>8.1.</strong> EgyptTravelPro.com acts as an intermediary between clients and third-party service providers (hotels, airlines, cruise operators, etc.). We are not liable for the acts, omissions, or defaults of these third-party providers.</p>
              <p><strong>8.2.</strong> Our total liability for any claim arising from our services shall not exceed the total amount paid by the client for the specific service in question.</p>
              <p><strong>8.3.</strong> We shall not be liable for any indirect, incidental, special, or consequential damages, including loss of enjoyment, lost profits, or emotional distress.</p>
              <p><strong>8.4.</strong> We are not liable for any loss or damage arising from Force Majeure events.</p>
            </div>
          </section>

          {/* 9. Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">9</span>
              Intellectual Property
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>All content on the EgyptTravelPro.com website, including text, images, logos, graphics, videos, and software, is the property of EgyptTravelPro.com and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.</p>
            </div>
          </section>

          {/* 10. Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">10</span>
              Privacy & Data Protection
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Your personal data is collected and processed in accordance with our <Link to="/privacy-policy" className="text-primary-500 hover:underline font-medium">Privacy Policy</Link>. By using our services, you consent to the collection and use of your information as described therein.</p>
            </div>
          </section>

          {/* 11. Complaints */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">11</span>
              Complaints & Dispute Resolution
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>11.1.</strong> If you have any concerns during your trip, please notify your tour guide or our local representative immediately so we can attempt to resolve the issue on the spot.</p>
              <p><strong>11.2.</strong> Formal complaints must be submitted in writing within <strong>14 days</strong> of the completion of your trip.</p>
              <p><strong>11.3.</strong> Any disputes shall be governed by the laws of the Arab Republic of Egypt and shall be subject to the exclusive jurisdiction of the courts of Cairo, Egypt.</p>
            </div>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">12</span>
              Governing Law
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>These Terms and Conditions are governed by and construed in accordance with the laws of the Arab Republic of Egypt. Any disputes arising from or in connection with these Terms shall be resolved in the courts of Cairo, Egypt.</p>
            </div>
          </section>

          {/* 13. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">13</span>
              Contact Us
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>If you have any questions about these Terms and Conditions, please contact us:</p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4">
                <p><strong>EgyptTravelPro.com</strong></p>
                <p>Email: <a href="mailto:info@egypttravelpro.com" className="text-primary-500 hover:underline">info@egypttravelpro.com</a></p>
                <p>WhatsApp: <a href="https://wa.me/201212011881" className="text-primary-500 hover:underline">+20 121 201 1881</a></p>
                <p>Website: <a href="https://egypttravelpro.com" className="text-primary-500 hover:underline">www.egypttravelpro.com</a></p>
              </div>
            </div>
          </section>

          {/* Related Policies */}
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/privacy-policy" className="btn btn-outline-primary text-sm px-4 py-2">
                Privacy Policy
              </Link>
              <Link to="/payment-policy" className="btn btn-outline-primary text-sm px-4 py-2">
                Payment Policy
              </Link>
            </div>
          </section>
        </motion.div>
      </div>
    </motion.main>
  )
}

export default TermsAndConditions