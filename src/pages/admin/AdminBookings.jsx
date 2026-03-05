import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

/**
 * AdminBookings Component
 * View and manage all trip bookings
 */
export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const statusOptions = ['pending', 'confirmed', 'paid', 'completed', 'cancelled']
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  const updateStatus = async (bookingId, newStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', bookingId)

    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      fetchBookings()
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }))
      }
    }
  }

  const deleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    if (error) {
      alert('Error deleting booking: ' + error.message)
    } else {
      fetchBookings()
      setSelectedBooking(null)
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm ||
      booking.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.trip_title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || booking.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.status === 'paid' || b.status === 'completed')
      .reduce((sum, b) => sum + (b.total_price || 0), 0),
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600">Manage trip booking requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-sm text-blue-600">Confirmed</p>
          <p className="text-2xl font-bold text-blue-700">{stats.confirmed}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-sm text-green-600">Revenue</p>
          <p className="text-2xl font-bold text-green-700">${stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or trip..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Travel Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Travelers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{booking.full_name}</p>
                        <p className="text-sm text-gray-500">{booking.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{booking.trip_title}</p>
                      <p className="text-sm text-gray-500">{booking.trip_duration} days</p>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {formatDate(booking.travel_date)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {booking.adults} A{booking.children > 0 ? ` + ${booking.children} C` : ''}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${booking.total_price?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedBooking.status]}`}>
                  {selectedBooking.status?.charAt(0).toUpperCase() + selectedBooking.status?.slice(1)}
                </span>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Name</span>
                  <span className="text-gray-900">{selectedBooking.full_name}</span>
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{selectedBooking.email}</span>
                  <span className="text-gray-500">Phone</span>
                  <span className="text-gray-900">{selectedBooking.phone}</span>
                  <span className="text-gray-500">Nationality</span>
                  <span className="text-gray-900">{selectedBooking.nationality || '-'}</span>
                </div>
              </div>

              {/* Trip Info */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Trip Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Trip</span>
                  <span className="text-gray-900">{selectedBooking.trip_title}</span>
                  <span className="text-gray-500">Duration</span>
                  <span className="text-gray-900">{selectedBooking.trip_duration} days</span>
                  <span className="text-gray-500">Travel Date</span>
                  <span className="text-gray-900">{formatDate(selectedBooking.travel_date)}</span>
                  <span className="text-gray-500">Adults</span>
                  <span className="text-gray-900">{selectedBooking.adults}</span>
                  <span className="text-gray-500">Children</span>
                  <span className="text-gray-900">{selectedBooking.children || 0}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Pricing</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Price per person</span>
                  <span className="text-gray-900">${selectedBooking.trip_price}</span>
                  <span className="text-gray-500 font-medium">Total</span>
                  <span className="text-gray-900 font-bold text-lg">${selectedBooking.total_price?.toLocaleString()}</span>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.special_requests && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Special Requests</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.special_requests}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4 text-xs text-gray-400">
                <p>Created: {formatDateTime(selectedBooking.created_at)}</p>
                <p>Updated: {formatDateTime(selectedBooking.updated_at)}</p>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-4 flex gap-2">
                <a
                  href={`mailto:${selectedBooking.email}?subject=Your Booking: ${selectedBooking.trip_title}`}
                  className="flex-1 btn btn-primary text-center"
                >
                  Email Customer
                </a>
                <a
                  href={`tel:${selectedBooking.phone}`}
                  className="flex-1 btn btn-secondary text-center"
                >
                  Call Customer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
