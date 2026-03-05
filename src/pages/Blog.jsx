import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
// Fallback data
import blogPostsFallback from '../data/blogPosts.json'
import { BlogGenerator } from '../components'

/**
 * Blog Page
 * Discover Egypt Blog – Trips & Experiences in the Land of the Pharaohs
 * Fetches data from Supabase with JSON fallback
 */
const Blog = () => {
  const [blogPosts, setBlogPosts] = useState(blogPostsFallback)
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedActivity, setSelectedActivity] = useState('all')
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Fetch blog posts from Supabase
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })

        if (error) throw error
        
        // Transform data to match expected format
        if (data && data.length > 0) {
          const transformedPosts = data.map(post => ({
            ...post,
            publishedAt: post.published_at,
            readTime: post.read_time,
            author: {
              name: post.author_name || 'Egypt Travel Pro',
              avatar: post.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
              role: post.author_role || 'Travel Expert'
            }
          }))
          setBlogPosts(transformedPosts)
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        // Keep fallback data on error
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Get unique values for filters
  const cities = ['all', 'Cairo', 'Alexandria', 'Luxor', 'Aswan', 'Sharm El-Sheikh']
  const activities = ['all', 'Sightseeing', 'Culture', 'Adventure', 'Diving', 'Beach', 'Food', 'History', 'Relaxation', 'Nature', 'Shopping']
  const seasons = ['all', 'Year-round', 'Winter', 'Spring/Summer']

  // Filter and sort blog posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCity = selectedCity === 'all' || post.city === selectedCity
      const matchesActivity = selectedActivity === 'all' || post.activities?.includes(selectedActivity)
      const matchesSeason = selectedSeason === 'all' || post.season === selectedSeason
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesCity && matchesActivity && matchesSeason && matchesSearch
    })
  }, [selectedCity, selectedActivity, selectedSeason, searchQuery])

  // Featured posts (city guides)
  const featuredPosts = blogPosts.filter(post => post.featured)

  // Latest posts
  const latestPosts = [...blogPosts].sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  ).slice(0, 6)

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <main className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920"
            alt="Egypt Blog Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-primary-400 text-sm font-semibold uppercase tracking-wider mb-4"
          >
            Egypt Travel Blog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Discover Egypt Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            Trips & Experiences in the Land of the Pharaohs
          </motion.p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome to Your Egyptian Adventure
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Egypt is a timeless destination where ancient wonders meet vibrant modern culture. From the iconic 
              Pyramids of Giza to the crystal-clear waters of the Red Sea, from the bustling streets of Cairo to 
              the serene temples of Luxor — every corner of this magnificent country tells a story that spans 
              thousands of years.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our blog is your ultimate guide to exploring Egypt's most stunning cities, hidden gems, and 
              unforgettable experiences. Whether you're planning your first trip or returning for another 
              adventure, discover travel tips, cultural insights, and insider knowledge from our team of 
              expert writers and local guides.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured City Guides */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-primary-500 text-sm font-semibold uppercase tracking-wider mb-4">
              City Guides
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Explore Egypt's Top Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In-depth guides to Egypt's most popular cities — everything you need to know before you go
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredPosts.slice(0, 5).map((post, index) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className={`relative overflow-hidden ${index === 0 ? 'h-72' : 'h-56'}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      {post.city && (
                        <span className="inline-block bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                          {post.city}
                        </span>
                      )}
                      <h3 className="text-white text-xl md:text-2xl font-bold line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-500">{post.author.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{post.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
              >
                <option value="all">All Cities</option>
                {cities.slice(1).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
              >
                <option value="all">All Activities</option>
                {activities.slice(1).map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>

              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
              >
                <option value="all">All Seasons</option>
                {seasons.slice(1).map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>

              {(selectedCity !== 'all' || selectedActivity !== 'all' || selectedSeason !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCity('all')
                    setSelectedActivity('all')
                    setSelectedSeason('all')
                    setSearchQuery('')
                  }}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filtered Posts / Latest Posts */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {selectedCity !== 'all' || selectedActivity !== 'all' || selectedSeason !== 'all' || searchQuery
                ? `Filtered Results (${filteredPosts.length})`
                : 'Latest Articles'}
            </h2>
          </div>

          {filteredPosts.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeInUp}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {post.city && (
                          <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            {post.city}
                          </span>
                        )}
                        <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.activities?.slice(0, 3).map((activity, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {activity}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs text-gray-500">{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {(post.views / 1000).toFixed(1)}k
                          </span>
                          <span>{post.readTime} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSelectedCity('all')
                  setSelectedActivity('all')
                  setSelectedSeason('all')
                  setSearchQuery('')
                }}
                className="btn btn-primary"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center text-white"
          >
            <span className="inline-block text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">
              Stay Updated
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white/90 mb-8">
              Get the latest travel tips, destination guides, and exclusive offers delivered straight to your inbox.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/20 rounded-xl p-6"
              >
                <div className="text-4xl mb-3">✅</div>
                <p className="text-lg font-semibold">Thank you for subscribing!</p>
                <p className="text-white/80 text-sm">Check your inbox for a welcome message.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="px-5 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none min-w-[300px]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-white/60 text-xs mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Popular Topics
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Trips to Egypt',
              'Cairo tourism',
              'Alexandria tourism',
              'Luxor tourism',
              'Aswan tourism',
              'Sharm El-Sheikh tourism',
              'Vacation in Egypt',
              'Travel Egypt Tours',
              'Best time to visit Egypt',
              'Egyptian food',
              'Nile cruises',
              'Red Sea diving',
              'Pyramids guide'
            ].map((tag, i) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors"
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Blog