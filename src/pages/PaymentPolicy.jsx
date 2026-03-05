import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Payment Policy Page
 * Comprehensive payment policy for EgyptTravelPro.com
 */
const PaymentPolicy = () => {
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
            Payment Policy
          </motion.h1>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Transparent and secure payment options for your Egypt travel experience
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

          {/* 1. Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Overview
            </h2>
            <p className="text-gray-600 leading-relaxed">
              EgyptTravelPro.com is committed to providing secure, transparent, and flexible payment options for all our travel services. This Payment Policy outlines the accepted payment methods, deposit requirements, payment schedules, currency information, and refund procedures. By making a booking with us, you agree to the terms outlined in this policy.
            </p>
          </section>

          {/* 2. Accepted Payment Methods */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Accepted Payment Methods
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>We accept the following payment methods for your convenience:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                {[
                  { icon: '💳', title: 'Credit & Debit Cards', desc: 'Visa, MasterCard, American Express — processed securely via Stripe', highlight: true },
                  { icon: '🏦', title: 'Bank Transfer (Wire)', desc: 'Direct bank transfer to our company account in Egypt or international SWIFT transfer' },
                  { icon: '💵', title: 'Cash on Arrival', desc: 'Pay in USD, EUR, or EGP upon arrival in Egypt (for select services only)' },
                  { icon: '🔗', title: 'Online Payment Link', desc: 'Receive a secure Stripe checkout link via email to complete your payment' },
                ].map((method) => (
                  <div key={method.title} className={`rounded-xl p-5 border ${method.highlight ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{method.title}</p>
                        <p className="text-gray-500 text-xs mt-1">{method.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Currency */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Currency & Pricing
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>3.1.</strong> All prices on our website are quoted in <strong>US Dollars (USD)</strong> unless otherwise stated.</p>
              <p><strong>3.2.</strong> If you choose to pay in a currency other than USD, the conversion will be based on the exchange rate at the time of payment as determined by your bank or payment provider.</p>
              <p><strong>3.3.</strong> EgyptTravelPro.com is not responsible for any additional charges imposed by your bank, such as currency conversion fees or international transaction fees.</p>
              <p><strong>3.4.</strong> For cash payments in Egypt, we accept USD, EUR, and EGP at the prevailing exchange rate on the day of payment.</p>
              <p><strong>3.5.</strong> Prices are subject to change without notice. However, once a booking is confirmed and deposit is paid, the quoted price is locked in for that booking.</p>
            </div>
          </section>

          {/* 4. Deposit & Payment Schedule */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Deposit & Payment Schedule
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Our standard payment schedule is as follows:</p>
              <div className="bg-gray-50 rounded-xl p-6 my-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-900 font-semibold">Payment Stage</th>
                      <th className="text-right py-2 text-gray-900 font-semibold">Amount</th>
                      <th className="text-right py-2 text-gray-900 font-semibold">When Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Booking Deposit</td>
                      <td className="text-right py-3 font-medium text-primary-600">30% of total</td>
                      <td className="text-right py-3">At time of booking</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Final Balance</td>
                      <td className="text-right py-3 font-medium text-primary-600">Remaining 70%</td>
                      <td className="text-right py-3">30 days before departure</td>
                    </tr>
                    <tr>
                      <td className="py-3">Last-Minute Bookings</td>
                      <td className="text-right py-3 font-medium text-primary-600">100% full payment</td>
                      <td className="text-right py-3">If booked within 30 days of departure</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p><strong>4.1.</strong> The deposit is <strong>non-refundable</strong> and secures your booking and all reserved services.</p>
              <p><strong>4.2.</strong> Failure to pay the final balance by the due date may result in automatic cancellation of your booking.</p>
              <p><strong>4.3.</strong> For high-season bookings (December–January, Easter, and Summer), we may require a <strong>50% deposit</strong> to secure your reservation.</p>
              <p><strong>4.4.</strong> Custom or luxury packages may have different deposit requirements, which will be communicated at the time of booking.</p>
            </div>
          </section>

          {/* 5. Payment for Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              Payment for Private Transfers
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>5.1.</strong> Airport transfers and intercity transfers require <strong>full payment</strong> at the time of booking.</p>
              <p><strong>5.2.</strong> Transfer prices are fixed and include vehicle, driver, fuel, tolls, and waiting time (up to 60 minutes for airport pickups).</p>
              <p><strong>5.3.</strong> Additional waiting time beyond 60 minutes will be charged at <strong>$10 USD per hour</strong>.</p>
              <p><strong>5.4.</strong> Cash payment to the driver is accepted for single transfers booked within 24 hours of the service.</p>
            </div>
          </section>

          {/* 6. Payment for Nile Cruises */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              Payment for Nile Cruises
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>6.1.</strong> Nile cruise bookings require a <strong>50% deposit</strong> at the time of booking due to limited cabin availability.</p>
              <p><strong>6.2.</strong> The remaining 50% must be paid at least <strong>45 days</strong> before the cruise departure date.</p>
              <p><strong>6.3.</strong> Cancellation of Nile cruise bookings follows a stricter schedule — please refer to our <Link to="/terms-and-conditions" className="text-primary-500 hover:underline font-medium">Terms & Conditions</Link> for details.</p>
            </div>
          </section>

          {/* 7. Invoicing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
              Invoicing & Receipts
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>7.1.</strong> A detailed invoice will be sent to your email upon booking confirmation.</p>
              <p><strong>7.2.</strong> A final receipt will be issued after full payment is received.</p>
              <p><strong>7.3.</strong> For business travelers, we can provide company-addressed invoices with VAT details upon request.</p>
              <p><strong>7.4.</strong> All invoices are issued in USD. If you need an invoice in another currency for accounting purposes, please contact us.</p>
            </div>
          </section>

          {/* 8. Refund Processing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
              Refund Processing
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Refunds, where applicable (as per our <Link to="/terms-and-conditions" className="text-primary-500 hover:underline font-medium">Cancellation Policy</Link>), are processed as follows:</p>
              <div className="bg-gray-50 rounded-xl p-6 my-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-900 font-semibold">Payment Method</th>
                      <th className="text-right py-2 text-gray-900 font-semibold">Refund Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Credit / Debit Card</td>
                      <td className="text-right py-2">7–14 business days</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Bank Transfer</td>
                      <td className="text-right py-2">10–21 business days</td>
                    </tr>
                    <tr>
                      <td className="py-2">Cash (paid on arrival)</td>
                      <td className="text-right py-2">Via bank transfer within 14 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p><strong>8.1.</strong> Refunds are issued to the original payment method unless otherwise agreed.</p>
              <p><strong>8.2.</strong> Any bank fees or currency conversion losses incurred during the refund process are the responsibility of the client.</p>
              <p><strong>8.3.</strong> Processing fees charged by payment processors (e.g., Stripe) are non-refundable.</p>
            </div>
          </section>

          {/* 9. Payment Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">9</span>
              Payment Security
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Your payment security is our top priority:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>SSL Encryption:</strong> All payment pages are secured with 256-bit SSL encryption.</li>
                <li><strong>PCI-DSS Compliance:</strong> Our payment processor (Stripe) is PCI Level 1 certified — the highest level of payment security.</li>
                <li><strong>No Card Storage:</strong> We do not store your credit card details on our servers. All card information is securely handled by Stripe.</li>
                <li><strong>3D Secure:</strong> We support 3D Secure (Verified by Visa, MasterCard SecureCode) for additional fraud protection.</li>
                <li><strong>Fraud Monitoring:</strong> All transactions are monitored for suspicious activity.</li>
              </ul>
            </div>
          </section>

          {/* 10. Chargebacks & Disputes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">10</span>
              Chargebacks & Payment Disputes
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>10.1.</strong> If you wish to dispute a charge, please contact us directly at <a href="mailto:info@egypttravelpro.com" className="text-primary-500 hover:underline">info@egypttravelpro.com</a> before initiating a chargeback with your bank.</p>
              <p><strong>10.2.</strong> Fraudulent chargebacks (where services were delivered as agreed) may result in legal action to recover the disputed amount plus associated fees.</p>
              <p><strong>10.3.</strong> We maintain detailed records of all bookings, communications, and services delivered to resolve disputes efficiently.</p>
            </div>
          </section>

          {/* 11. Special Offers & Discounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">11</span>
              Special Offers & Discount Codes
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p><strong>11.1.</strong> Promotional discounts and coupon codes are subject to specific terms and expiry dates as stated at the time of the offer.</p>
              <p><strong>11.2.</strong> Discount codes cannot be combined with other offers unless explicitly stated.</p>
              <p><strong>11.3.</strong> We reserve the right to withdraw or modify promotional offers at any time without prior notice.</p>
              <p><strong>11.4.</strong> Early bird discounts, group rates, and loyalty rewards may be available — contact us for details.</p>
            </div>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">12</span>
              Contact Us
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>For payment inquiries, invoice requests, or refund questions, please contact our finance team:</p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4">
                <p><strong>EgyptTravelPro.com — Payments Department</strong></p>
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
              <Link to="/privacy-policy" className="btn btn-outline-primary text-sm px-4 py-2">
                Privacy Policy
              </Link>
            </div>
          </section>
        </motion.div>
      </div>
    </motion.main>
  )
}

export default PaymentPolicy