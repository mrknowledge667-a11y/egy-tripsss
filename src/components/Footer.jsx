import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

/**
 * Footer Component
 * Responsive footer with navigation links, social media, and contact info
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Footer navigation sections
  const footerSections = [
    {
      title: 'Tours & Packages',
      links: [
        { to: '/egypt-packages', label: 'Egypt Packages' },
        { to: '/tours', label: 'All Tours' },
        { to: '/day-tours', label: 'Day Tours' },
        { to: '/nile-cruises', label: 'Nile Cruises' },
        { to: '/shore-excursions', label: 'Shore Excursions' },
        { to: '/transfers', label: 'Transfers' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { to: '/destinations', label: 'Destinations' },
        { to: '/trips', label: 'All Trips' },
        { to: '/blog', label: 'Blog' },
        { to: '/gallery', label: 'Gallery' },
      ],
    },
    {
      title: 'Support',
      links: [
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/faq', label: 'FAQs' },
        { to: '/plan-trip', label: 'Plan Your Trip' },
      ],
    },
    {
      title: 'Policies',
      links: [
        { to: '/privacy-policy', label: 'Privacy Policy' },
        { to: '/terms-and-conditions', label: 'Terms & Conditions' },
        { to: '/payment-policy', label: 'Payment Policy' },
      ],
    },
  ]

  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'YouTube', icon: '📺', url: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img src="/Untitled17.png" alt="Egypt Travel Pro" className="h-14 w-14 rounded-full object-cover shadow-md" />
              <span className="font-display text-2xl font-bold">Egypt Travel Pro</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Private transfers, guided tours, and complete travel packages across Egypt.
              From airport pickups to Nile cruises — we make every journey seamless.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white mb-1">Subscribe to our newsletter</h4>
              <p className="text-gray-400 text-sm">Get travel inspiration and exclusive deals</p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="btn btn-primary whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {currentYear} Egypt Travel Pro. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link to="/payment-policy" className="hover:text-white transition-colors">Payment Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer