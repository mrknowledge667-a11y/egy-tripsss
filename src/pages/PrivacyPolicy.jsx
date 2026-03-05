import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Privacy Policy Page
 * Comprehensive privacy policy for EgyptTravelPro.com
 */
const PrivacyPolicy = () => {
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
            Privacy Policy
          </motion.h1>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            How we collect, use, and protect your personal information
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
              EgyptTravelPro.com ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, make a booking, or use any of our services. By using our website and services, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Information We Collect
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.1 Personal Information You Provide</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Full name, date of birth, and nationality</li>
                  <li>Email address and phone number</li>
                  <li>Passport details and visa information</li>
                  <li>Billing and payment information (credit/debit card details)</li>
                  <li>Travel preferences, dietary requirements, and special needs</li>
                  <li>Hotel and accommodation preferences</li>
                  <li>Emergency contact information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.2 Information Collected Automatically</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information (operating system, screen resolution)</li>
                  <li>Pages visited, time spent on pages, and click patterns</li>
                  <li>Referring website URL</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location data (with your consent)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.3 Information from Third Parties</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Travel agents or booking platforms that refer you to us</li>
                  <li>Social media platforms (if you interact with our social media pages)</li>
                  <li>Payment processors (transaction confirmation details)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              How We Use Your Information
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Delivery:</strong> To process your bookings, arrange transfers, tours, accommodations, and other travel services.</li>
                <li><strong>Communication:</strong> To send booking confirmations, itinerary updates, travel documents, and respond to your inquiries.</li>
                <li><strong>Payment Processing:</strong> To process payments securely through our payment partners (Stripe, etc.).</li>
                <li><strong>Personalization:</strong> To tailor our services, offers, and recommendations to your preferences.</li>
                <li><strong>Marketing:</strong> To send promotional offers, newsletters, and travel inspiration (you can opt out at any time).</li>
                <li><strong>Analytics:</strong> To analyze website usage patterns and improve our services, website performance, and user experience.</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
                <li><strong>Safety & Security:</strong> To protect our clients, employees, and business from fraud and security threats.</li>
              </ul>
            </div>
          </section>

          {/* 4. Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Cookies & Tracking Technologies
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Our website uses cookies and similar technologies to enhance your browsing experience. Types of cookies we use:</p>
              <div className="bg-gray-50 rounded-xl p-6 my-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-900 font-semibold">Cookie Type</th>
                      <th className="text-left py-2 text-gray-900 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">Essential Cookies</td>
                      <td className="py-2">Required for website functionality (login, cart, security)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">Analytics Cookies</td>
                      <td className="py-2">Help us understand how visitors use our website (Google Analytics)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">Marketing Cookies</td>
                      <td className="py-2">Used to deliver relevant advertisements and track campaign performance</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Preference Cookies</td>
                      <td className="py-2">Remember your settings and preferences (language, currency)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>You can manage cookie preferences through your browser settings. Disabling essential cookies may affect website functionality.</p>
            </div>
          </section>

          {/* 5. Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Data Sharing & Disclosure
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>We may share your personal information with the following parties:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Hotels, airlines, cruise operators, transport companies, and tour guides who deliver the services you booked.</li>
                <li><strong>Payment Processors:</strong> Stripe and other secure payment gateways for transaction processing.</li>
                <li><strong>Government Authorities:</strong> When required by law, court order, or government regulation (e.g., immigration, customs).</li>
                <li><strong>Analytics Partners:</strong> Google Analytics and similar tools for website performance analysis (anonymized data).</li>
                <li><strong>Marketing Partners:</strong> Only with your explicit consent for co-marketing campaigns.</li>
              </ul>
              <p className="mt-4 font-medium text-gray-800">We do NOT sell, rent, or trade your personal information to third parties for their own marketing purposes.</p>
            </div>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Data Security
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>We implement industry-standard security measures to protect your personal information, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL/TLS encryption for all data transmissions</li>
                <li>PCI-DSS compliant payment processing</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and employee training on data protection</li>
                <li>Secure data storage with encryption at rest</li>
              </ul>
              <p>While we take every reasonable precaution, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security of your data.</p>
            </div>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
              Data Retention
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Specifically:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Booking records:</strong> Retained for 7 years for tax and legal compliance</li>
                <li><strong>Marketing preferences:</strong> Until you opt out or withdraw consent</li>
                <li><strong>Website analytics data:</strong> Retained for 26 months (anonymized)</li>
                <li><strong>Account information:</strong> Until you request account deletion</li>
              </ul>
            </div>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
              Your Rights
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Depending on your location, you may have the following rights regarding your personal data:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                {[
                  { icon: '📋', title: 'Right to Access', desc: 'Request a copy of your personal data we hold' },
                  { icon: '✏️', title: 'Right to Rectification', desc: 'Request correction of inaccurate or incomplete data' },
                  { icon: '🗑️', title: 'Right to Erasure', desc: 'Request deletion of your personal data ("right to be forgotten")' },
                  { icon: '🚫', title: 'Right to Restrict', desc: 'Request restriction of processing your data' },
                  { icon: '📦', title: 'Right to Portability', desc: 'Receive your data in a structured, commonly used format' },
                  { icon: '✋', title: 'Right to Object', desc: 'Object to processing of your data for marketing purposes' },
                ].map((right) => (
                  <div key={right.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{right.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{right.title}</p>
                        <p className="text-gray-500 text-xs mt-1">{right.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p>To exercise any of these rights, please contact us at <a href="mailto:info@egypttravelpro.com" className="text-primary-500 hover:underline">info@egypttravelpro.com</a>. We will respond within 30 days.</p>
            </div>
          </section>

          {/* 9. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">9</span>
              Children's Privacy
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information promptly.</p>
            </div>
          </section>

          {/* 10. International Data Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">10</span>
              International Data Transfers
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Your personal data may be transferred to and processed in countries other than Egypt, including countries where our service providers operate. We ensure appropriate safeguards are in place, including standard contractual clauses and data processing agreements, to protect your data during international transfers.</p>
            </div>
          </section>

          {/* 11. Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">11</span>
              Third-Party Links
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Our website may contain links to third-party websites (e.g., hotel booking sites, airline websites, social media platforms). We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.</p>
            </div>
          </section>

          {/* 12. Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">12</span>
              Changes to This Policy
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
            </div>
          </section>

          {/* 13. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">13</span>
              Contact Us
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4">
                <p><strong>EgyptTravelPro.com — Data Protection</strong></p>
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
              <Link to="/terms-and-conditions" className="btn btn-outline-primary text-sm px-4 py-2">
                Terms & Conditions
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

export default PrivacyPolicy