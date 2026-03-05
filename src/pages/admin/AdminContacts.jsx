import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

/**
 * AdminContacts Component
 * View contact form submissions, mark as read, add notes, delete
 */
export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [filter, setFilter] = useState('all') // all, unread, read

  useEffect(() => { fetchContacts() }, [])

  const fetchContacts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setContacts(data || [])
    setLoading(false)
  }

  const toggleRead = async (contact) => {
    const { error } = await supabase
      .from('contacts')
      .update({ is_read: !contact.is_read })
      .eq('id', contact.id)
    if (!error) {
      setContacts(prev => prev.map(c =>
        c.id === contact.id ? { ...c, is_read: !c.is_read } : c
      ))
      if (selected?.id === contact.id) {
        setSelected(prev => ({ ...prev, is_read: !prev.is_read }))
      }
    }
  }

  const saveNotes = async (id, notes) => {
    const { error } = await supabase
      .from('contacts')
      .update({ notes })
      .eq('id', id)
    if (!error) {
      setContacts(prev => prev.map(c =>
        c.id === id ? { ...c, notes } : c
      ))
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (!error) {
      setContacts(prev => prev.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
    }
    setDeleteId(null)
  }

  const openContact = async (contact) => {
    setSelected(contact)
    // Auto-mark as read when opened
    if (!contact.is_read) {
      await supabase.from('contacts').update({ is_read: true }).eq('id', contact.id)
      setContacts(prev => prev.map(c =>
        c.id === contact.id ? { ...c, is_read: true } : c
      ))
    }
  }

  const filtered = contacts.filter(c => {
    if (filter === 'unread') return !c.is_read
    if (filter === 'read') return c.is_read
    return true
  })

  const unreadCount = contacts.filter(c => !c.is_read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {contacts.length} total · {unreadCount} unread
          </p>
        </div>
        {/* Filter Tabs */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'read', label: 'Read' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.key === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Contact List */}
        <div className={`${selected ? 'hidden lg:block lg:w-96' : 'w-full'} flex-shrink-0`}>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-48" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="text-4xl mb-3 block">📬</span>
              <p className="text-gray-500">
                {filter === 'unread' ? 'No unread messages!' : 'No contact messages yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => openContact(contact)}
                  className={`w-full text-left bg-white rounded-xl border p-4 hover:shadow-sm transition-all ${
                    selected?.id === contact.id
                      ? 'border-primary-300 ring-1 ring-primary-200'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !contact.is_read ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <span className={`font-semibold text-sm ${
                        !contact.is_read ? 'text-primary-700' : 'text-gray-500'
                      }`}>
                        {contact.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate ${
                          !contact.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                        }`}>
                          {contact.name}
                        </p>
                        {!contact.is_read && (
                          <span className="inline-flex w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {contact.subject || contact.message?.substring(0, 50)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(contact.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact Detail */}
        {selected && (
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold text-lg">
                      {selected.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{selected.name}</h3>
                    <p className="text-sm text-gray-500">{selected.email}</p>
                    {selected.phone && (
                      <p className="text-sm text-gray-500">{selected.phone}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRead(selected)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      selected.is_read
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                  >
                    {selected.is_read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => setDeleteId(selected.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Subject */}
              {selected.subject && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Subject</p>
                  <p className="text-gray-900 font-semibold">{selected.subject}</p>
                </div>
              )}

              {/* Message */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </div>
              </div>

              {/* Timestamp */}
              <div className="mb-6">
                <p className="text-xs text-gray-400">
                  Received: {new Date(selected.created_at).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Admin Notes */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Admin Notes</p>
                <textarea
                  value={selected.notes || ''}
                  onChange={e => setSelected(prev => ({ ...prev, notes: e.target.value }))}
                  onBlur={() => saveNotes(selected.id, selected.notes || '')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Add private notes about this contact..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Message?</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently remove this contact message.</p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}