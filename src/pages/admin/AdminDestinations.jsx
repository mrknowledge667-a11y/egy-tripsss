import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

/**
 * AdminDestinations Component
 * Full CRUD for managing destinations — list, create, edit, delete
 */
export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const emptyDest = {
    name: '', slug: '', country: 'Egypt', description: '', short_description: '',
    image: '', hero_image: '', region: '', climate: '',
    best_time_to_visit: '', average_temperature: '',
    highlights: [''], activities: [''],
  }

  const [form, setForm] = useState(emptyDest)

  useEffect(() => { fetchDestinations() }, [])

  const fetchDestinations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('name', { ascending: true })
    if (!error) setDestinations(data || [])
    setLoading(false)
  }

  const handleEdit = (dest) => {
    setForm({
      ...dest,
      highlights: dest.highlights?.length ? dest.highlights : [''],
      activities: dest.activities?.length ? dest.activities : [''],
    })
    setEditing(dest)
  }

  const handleNew = () => {
    setForm(emptyDest)
    setEditing('new')
  }

  const handleCancel = () => {
    setEditing(null)
    setForm(emptyDest)
  }

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && !editing?.id ? { slug: generateSlug(value) } : {}),
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setForm(prev => {
      const arr = [...(prev[field] || [])]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const addArrayItem = (field) => {
    setForm(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }))
  }

  const removeArrayItem = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      name: form.name,
      slug: form.slug,
      country: form.country,
      description: form.description,
      short_description: form.short_description,
      image: form.image,
      hero_image: form.hero_image,
      region: form.region,
      climate: form.climate,
      best_time_to_visit: form.best_time_to_visit,
      average_temperature: form.average_temperature,
      highlights: form.highlights.filter(h => h.trim()),
      activities: form.activities.filter(a => a.trim()),
    }

    let error
    if (editing === 'new') {
      ({ error } = await supabase.from('destinations').insert(payload))
    } else {
      ({ error } = await supabase.from('destinations').update(payload).eq('id', editing.id))
    }

    if (error) {
      alert('Error saving: ' + error.message)
    } else {
      await fetchDestinations()
      handleCancel()
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('destinations').delete().eq('id', id)
    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      await fetchDestinations()
    }
    setDeleteId(null)
  }

  // ─── FORM VIEW ───
  if (editing) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {editing === 'new' ? 'Add New Destination' : `Edit: ${form.name}`}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text" value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Cairo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text" value={form.slug}
                onChange={e => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="cairo"
              />
            </div>
          </div>

          {/* Country & Region */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text" value={form.country}
                onChange={e => handleChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <input
                type="text" value={form.region}
                onChange={e => handleChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Upper Egypt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Climate</label>
              <input
                type="text" value={form.climate}
                onChange={e => handleChange('climate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Desert"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input
              type="text" value={form.short_description}
              onChange={e => handleChange('short_description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief description for cards"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea
              value={form.description} rows={4}
              onChange={e => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Best Time & Temperature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
              <input
                type="text" value={form.best_time_to_visit}
                onChange={e => handleChange('best_time_to_visit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="October to April"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Temperature</label>
              <input
                type="text" value={form.average_temperature}
                onChange={e => handleChange('average_temperature', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="25°C"
              />
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Image URL</label>
              <input
                type="url" value={form.image}
                onChange={e => handleChange('image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input
                type="url" value={form.hero_image}
                onChange={e => handleChange('hero_image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
            {form.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text" value={h}
                  onChange={e => handleArrayChange('highlights', i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder={`Highlight ${i + 1}`}
                />
                {form.highlights.length > 1 && (
                  <button onClick={() => removeArrayItem('highlights', i)} className="px-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                )}
              </div>
            ))}
            <button onClick={() => addArrayItem('highlights')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Highlight
            </button>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activities</label>
            {form.activities.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text" value={a}
                  onChange={e => handleArrayChange('activities', i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder={`Activity ${i + 1}`}
                />
                {form.activities.length > 1 && (
                  <button onClick={() => removeArrayItem('activities', i)} className="px-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                )}
              </div>
            ))}
            <button onClick={() => addArrayItem('activities')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Activity
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleSave} disabled={saving || !form.name}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : editing === 'new' ? 'Create Destination' : 'Save Changes'}
            </button>
            <button onClick={handleCancel} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── LIST VIEW ───
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Destinations</h2>
          <p className="text-sm text-gray-500 mt-0.5">{destinations.length} destinations</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span> New Destination
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="text-4xl mb-3 block">🗺️</span>
          <p className="text-gray-500">No destinations yet. Add your first destination!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all group">
              <div className="h-36 bg-gray-100 relative overflow-hidden">
                {dest.image ? (
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-50">🏞️</div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleEdit(dest)}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteId(dest.id)}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{dest.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{dest.region} · {dest.climate}</p>
                {dest.highlights?.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2 truncate">{dest.highlights.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Destination?</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently remove this destination and its relationships.</p>
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