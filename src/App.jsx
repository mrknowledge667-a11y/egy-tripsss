import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navbar, Footer, PopupModal, FloatingButtons, EgyptChatbot } from './components'
import { Home, PlanTrip, Trips, TripDetails, Destinations, DestinationDetails, Gallery, Blog, BlogPost, About, Contact, FAQ,EgyptPackages, PackageDetail, DayTours, TourDetail, NileCruises, CruiseDetail, ShoreExcursions, ExcursionDetail, AllTours, Transfers, Ads, GroupTours } from './pages'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import PaymentPolicy from './pages/PaymentPolicy'
import { AdminLogin, AdminLayout, AdminDashboard, AdminTrips, AdminPackages, AdminDestinations, AdminGallery, AdminBlog, AdminContacts, AdminBookings, AdminDataCleanup } from './pages/admin'

/**
 * App Component
 * Main application component with routing and layout structure
 * Includes scroll restoration and page transition animations
 * Admin panel routes are separate — no Navbar/Footer
 */
function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // ─── Admin Routes (separate layout, no site chrome) ───
  if (isAdminRoute) {
    return (
      <Routes location={location}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="trips" element={<AdminTrips />} />
          <Route path="destinations" element={<AdminDestinations />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="cleanup" element={<AdminDataCleanup />} />
        </Route>
      </Routes>
    )
  }

  // ─── Public Routes (with Navbar, Footer, etc.) ───
  return (
    <div className="flex flex-col min-h-screen">
      {/* Popup Modal - Shows on first visit */}
      <PopupModal imageSrc="/popup.jpg.jpg" delay={2000} />

      {/* Navigation */}
      <Navbar />

      {/* Main Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
          
          {/* Plan Trip Page */}
          <Route path="/plan-trip" element={<PlanTrip />} />
          
          {/* Trips Pages */}
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:slug" element={<TripDetails />} />
          
          {/* Destinations Pages */}
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetails />} />
          
          {/* Gallery Page */}
          <Route path="/gallery" element={<Gallery />} />
          
          {/* Blog Pages */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          
          {/* About, Contact, FAQ */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* Authentication Pages */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* New Section Pages */}
          <Route path="/egypt-packages" element={<EgyptPackages />} />
          <Route path="/egypt-packages/:slug" element={<PackageDetail />} />
          <Route path="/tours" element={<AllTours />} />
          <Route path="/day-tours" element={<DayTours />} />
          <Route path="/day-tours/:id" element={<TourDetail />} />
          <Route path="/nile-cruises" element={<NileCruises />} />
          <Route path="/nile-cruises/:id" element={<CruiseDetail />} />
          <Route path="/group-tours" element={<GroupTours />} />
          <Route path="/group-tours/:id" element={<CruiseDetail />} />
          <Route path="/shore-excursions" element={<ShoreExcursions />} />
          <Route path="/shore-excursions/:id" element={<ExcursionDetail />} />
          <Route path="/transfers" element={<Transfers />} />
          
          {/* Ads / Sponsored Deals Page */}
          <Route path="/ads" element={<Ads />} />
          
          {/* Policy Pages */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/payment-policy" element={<PaymentPolicy />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp & Chatbot Buttons */}
      <FloatingButtons />

      {/* Egypt Knowledge Chatbot */}
      <EgyptChatbot />
    </div>
  )
}

/**
 * NotFound Component
 * 404 error page for unmatched routes
 */
function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gray-50 pt-20">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🧭</div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Looks like you've wandered off the map! Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="btn btn-primary">
            Go Home
          </a>
          <a href="/trips" className="btn btn-secondary">
            Explore Trips
          </a>
        </div>
      </div>
    </main>
  )
}

export default App