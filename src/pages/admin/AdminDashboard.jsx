import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

/**
 * AdminDashboard Component
 * Overview page with stats cards and recent activity
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    trips: 0,
    destinations: 0,
    blogPosts: 0,
    contacts: 0,
    gallery: 0,
    experiences: 0,
  })
  const [recentContacts, setRecentContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [
        { count: trips },
        { count: destinations },
        { count: blogPosts },
        { count: contacts },
        { count: gallery },
        { count: experiences },
      ] = await Promise.all([
        supabase.from('trips').select('*', { count: 'exact', head: true }),
        supabase.from('destinations').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('experiences').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        trips: trips || 0,
        destinations: destinations || 0,
        blogPosts: blogPosts || 0,
        contacts: contacts || 0,
        gallery: gallery || 0,
        experiences: experiences || 0,
      })

      // Fetch recent contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentContacts(contactsData || [])
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Trips', value: stats.trips, icon: '✈️', color: 'bg-blue-500', link: '/admin/trips' },
    { label: 'Destinations', value: stats.destinations, icon: '🗺️', color: 'bg-emerald-500', link: '/admin/destinations' },
    { label: 'Blog Posts', value: stats.blogPosts, icon: '📝', color: 'bg-purple-500', link: '/admin/blog' },
    { label: 'Contacts', value: stats.contacts, icon: '📬', color: 'bg-amber-500', link: '/admin/contacts' },
    { label: 'Gallery Images', value: stats.gallery, icon: '🖼️', color: 'bg-pink-500', link: '/admin/gallery' },
    { label: 'Experiences', value: stats.experiences, icon: '🎯', color: 'bg-cyan-500', link: '/admin/trips' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary-700 to-secondary-800 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-display font-bold mb-1">Welcome back! 👋</h2>
        <p className="text-secondary-200 text-sm">
          Here's what's happening with Egypt Travel Pro today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-card-hover hover:border-gray-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/trips"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <span className="text-xs font-medium text-center">Add Trip</span>
          </Link>
          <Link
            to="/admin/gallery"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors"
          >
            <span className="text-2xl">📸</span>
            <span className="text-xs font-medium text-center">Upload Photos</span>
          </Link>
          <Link
            to="/admin/blog"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
          >
            <span className="text-2xl">✍️</span>
            <span className="text-xs font-medium text-center">Write Post</span>
          </Link>
          <Link
            to="/admin/contacts"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
          >
            <span className="text-2xl">📨</span>
            <span className="text-xs font-medium text-center">View Messages</span>
          </Link>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
          <Link to="/admin/contacts" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {recentContacts.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No messages yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentContacts.map((contact) => (
              <div key={contact.id} className="py-3 flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-semibold text-sm">
                    {contact.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                    {!contact.is_read && (
                      <span className="inline-flex w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{contact.subject || contact.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(contact.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}