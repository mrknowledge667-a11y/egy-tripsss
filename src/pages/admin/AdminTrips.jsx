import { useState, useEffect, useRef } from 'react'
import { supabase, uploadFile } from '../../lib/supabase'
import { STYLE_OPTIONS, isValidStyle } from '../../lib/sectionConfig'

/**
 * AdminTrips Component
 * Full CRUD for managing trips — list, create, edit, delete
 */
export default function AdminTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = list, 'new' = create, trip object = edit
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [filterStyle, setFilterStyle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [uploading, setUploading] = useState({}) // Track upload status per field
  const [toast, setToast] = useState(null) // Toast notifications { type: 'success' | 'error', message: string }
  
  // File input refs
  const imageInputRef = useRef(null)
  const heroImageInputRef = useRef(null)
  const galleryInputRefs = useRef({})

  // Use centralized section configuration - only valid frontend sections
  const travelStyleOptions = STYLE_OPTIONS
  
  // Find trips with deprecated/invalid styles
  const tripsWithInvalidStyles = trips.filter(t => !isValidStyle(t.travel_style))
  const hasInvalidStyles = tripsWithInvalidStyles.length > 0

  const emptyTrip = {
    title: '', slug: '', description: '', short_description: '',
    duration: 1, price: 0, currency: 'USD', image: '', hero_image: '',
    gallery: [''],
    travel_style: 'Culture', rating: 4.5, reviews: 0,
    highlights: [''], included: [''],
    is_featured: false, is_published: true,
  }

  const [form, setForm] = useState(emptyTrip)

  useEffect(() => { fetchTrips() }, [])

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (type, message) => {
    setToast({ type, message })
  }

  const fetchTrips = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setTrips(data || [])
    setLoading(false)
  }

  const handleEdit = (trip) => {
    setForm({
      ...trip,
      gallery: trip.gallery?.length ? trip.gallery : [''],
      highlights: trip.highlights?.length ? trip.highlights : [''],
      included: trip.included?.length ? trip.included : [''],
    })
    setEditing(trip)
  }

  const handleNew = () => {
    setForm(emptyTrip)
    setEditing('new')
  }

  const handleCancel = () => {
    setEditing(null)
    setForm(emptyTrip)
  }

  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // Upload image to Supabase Storage
  const handleImageUpload = async (file, field, galleryIndex = null) => {
    if (!file) return
    
    const uploadKey = galleryIndex !== null ? `${field}_${galleryIndex}` : field
    setUploading(prev => ({ ...prev, [uploadKey]: true }))
    
    console.log('Starting upload for field:', field, 'file:', file.name)
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `trips/${fileName}`
      
      console.log('Uploading to path:', filePath)
      
      // Upload to Supabase Storage
      const { data, error } = await uploadFile('images', filePath, file)
      
      console.log('Upload result:', { data, error })
      
      if (error) {
        console.error('Upload error:', error)
        alert('Error uploading image: ' + error.message)
        return
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath)
      const publicUrl = urlData?.publicUrl
      
      console.log('Public URL generated:', publicUrl)
      
      if (publicUrl) {
        console.log('Setting URL to form field:', field, galleryIndex)
        if (galleryIndex !== null) {
          handleArrayChange(field, galleryIndex, publicUrl)
        } else {
          handleChange(field, publicUrl)
        }
        // Show success
        console.log('✅ Image uploaded successfully:', publicUrl)
      } else {
        console.error('No public URL returned')
        alert('Upload succeeded but could not get image URL')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Error uploading image: ' + err.message)
    } finally {
      setUploading(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !editing?.id ? { slug: generateSlug(value) } : {}),
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
      title: form.title,
      slug: form.slug,
      description: form.description,
      short_description: form.short_description,
      duration: parseInt(form.duration) || 1,
      price: parseFloat(form.price) || 0,
      currency: form.currency,
      image: form.image || null,
      hero_image: form.hero_image || null,
      gallery: (form.gallery || []).filter(g => g && g.trim()),
      travel_style: form.travel_style || 'Culture',
      rating: parseFloat(form.rating) || 4.5,
      reviews: parseInt(form.reviews) || 0,
      highlights: (form.highlights || []).filter(h => h && h.trim()),
      included: (form.included || []).filter(i => i && i.trim()),
      is_featured: form.is_featured || false,
      is_published: form.is_published !== false,
    }

    console.log('Saving trip payload:', payload)

    let error, data
    if (editing === 'new') {
      ({ data, error } = await supabase.from('trips').insert(payload).select())
      console.log('Insert result:', { data, error })
    } else {
      ({ data, error } = await supabase.from('trips').update(payload).eq('id', editing.id).select())
      console.log('Update result:', { data, error })
    }

    if (error) {
      console.error('Save error details:', error)
      alert('Error saving: ' + error.message)
    } else {
      await fetchTrips()
      handleCancel()
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      await fetchTrips()
    }
    setDeleteId(null)
  }

  // Move trip to different travel style/section
  const handleMoveToStyle = async (tripId, newStyle) => {
    console.log('=== MOVE TRIP START ===')
    console.log('Trip ID:', tripId)
    console.log('New Style:', newStyle)
    console.log('Current trips count:', trips.length)
    
    // Find trip name for the toast message
    const trip = trips.find(t => t.id === tripId)
    console.log('Found trip:', trip)
    
    if (!trip) {
      console.error('Trip not found in local state!')
      showToast('error', 'Trip not found')
      return
    }
    
    const tripName = trip?.title || 'Trip'
    const oldStyle = trip?.travel_style || 'unknown'
    
    console.log('Old style:', oldStyle, '-> New style:', newStyle)
    
    // Don't do anything if selecting the same style
    if (oldStyle === newStyle) {
      console.log('Same style selected, skipping')
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .update({ travel_style: newStyle })
        .eq('id', tripId)
        .select()
      
      console.log('Supabase response - data:', data)
      console.log('Supabase response - error:', error)
      
      if (error) {
        console.error('Move error:', error)
        showToast('error', 'Error moving trip: ' + error.message)
      } else if (!data || data.length === 0) {
        console.error('No data returned - update may have failed due to RLS')
        showToast('error', 'Update failed - check database permissions')
      } else {
        console.log('✅ Move successful!')
        // Update local state immediately for faster UI feedback
        setTrips(prev => prev.map(t => 
          t.id === tripId ? { ...t, travel_style: newStyle } : t
        ))
        showToast('success', `"${tripName}" moved to ${newStyle} section`)
      }
    } catch (err) {
      console.error('Exception during move:', err)
      showToast('error', 'Unexpected error: ' + err.message)
    }
    
    console.log('=== MOVE TRIP END ===')
  }

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = !searchTerm || 
      trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStyle = !filterStyle || trip.travel_style === filterStyle
    return matchesSearch && matchesStyle
  })

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
            {editing === 'new' ? 'Create New Trip' : `Edit: ${form.title}`}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text" value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ancient Egypt Explorer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text" value={form.slug}
                onChange={e => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="ancient-egypt-explorer"
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
              placeholder="Brief tagline for cards"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea
              value={form.description} rows={4}
              onChange={e => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Detailed trip description..."
            />
          </div>

          {/* Duration, Price, Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input
                type="number" min="1" value={form.duration}
                onChange={e => handleChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number" min="0" step="0.01" value={form.price}
                onChange={e => handleChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style / Section</label>
              <select
                value={form.travel_style}
                onChange={e => handleChange('travel_style', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {travelStyleOptions.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number" min="0" max="5" step="0.1" value={form.rating}
                onChange={e => handleChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Image</label>
              <div className="flex gap-2">
                <input
                  type="url" value={form.image}
                  onChange={e => handleChange('image', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Paste URL or upload..."
                />
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageUpload(e.target.files[0], 'image')}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading.image}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {uploading.image ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>📤 Upload</>
                  )}
                </button>
              </div>
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
              <div className="flex gap-2">
                <input
                  type="url" value={form.hero_image}
                  onChange={e => handleChange('hero_image', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Paste URL or upload..."
                />
                <input
                  type="file"
                  ref={heroImageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageUpload(e.target.files[0], 'hero_image')}
                />
                <button
                  type="button"
                  onClick={() => heroImageInputRef.current?.click()}
                  disabled={uploading.hero_image}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {uploading.hero_image ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>📤 Upload</>
                  )}
                </button>
              </div>
              {form.hero_image && (
                <img src={form.hero_image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg" />
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📷 Gallery Images</label>
            <p className="text-xs text-gray-500 mb-3">Add multiple photos that will appear in the trip detail page gallery</p>
            <div className="space-y-3">
              {form.gallery.map((img, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="url" value={img}
                        onChange={e => handleArrayChange('gallery', i, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder={`Gallery image ${i + 1} URL or upload`}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={el => galleryInputRefs.current[i] = el}
                        onChange={e => handleImageUpload(e.target.files[0], 'gallery', i)}
                      />
                      <button
                        type="button"
                        onClick={() => galleryInputRefs.current[i]?.click()}
                        disabled={uploading[`gallery_${i}`]}
                        className="px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {uploading[`gallery_${i}`] ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <>📤</>
                        )}
                      </button>
                    </div>
                    {img && (
                      <img src={img} alt={`Gallery ${i + 1}`} className="mt-2 h-20 w-32 object-cover rounded-lg border border-gray-200" />
                    )}
                  </div>
                  {form.gallery.length > 1 && (
                    <button onClick={() => removeArrayItem('gallery', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => addArrayItem('gallery')} className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Gallery Image
            </button>
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

          {/* Included */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
            {form.included.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text" value={item}
                  onChange={e => handleArrayChange('included', i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder={`Included item ${i + 1}`}
                />
                {form.included.length > 1 && (
                  <button onClick={() => removeArrayItem('included', i)} className="px-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                )}
              </div>
            ))}
            <button onClick={() => addArrayItem('included')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Item
            </button>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.is_featured}
                onChange={e => handleChange('is_featured', e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.is_published}
                onChange={e => handleChange('is_published', e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleSave} disabled={saving || !form.title}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : editing === 'new' ? 'Create Trip' : 'Save Changes'}
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
          <h2 className="text-xl font-bold text-gray-900">Trips</h2>
          <p className="text-sm text-gray-500 mt-0.5">{trips.length} total trips</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span> New Trip
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search trips..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <select
          value={filterStyle}
          onChange={e => setFilterStyle(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Sections</option>
          {travelStyleOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4">
              <div className="w-20 h-14 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="text-4xl mb-3 block">✈️</span>
          <p className="text-gray-500">{trips.length === 0 ? 'No trips yet. Create your first trip!' : 'No trips match your filter.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all flex items-center gap-4">
              {/* Image */}
              <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {trip.image ? (
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏞️</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{trip.title}</h3>
                  {trip.is_featured && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">Featured</span>
                  )}
                  {!trip.is_published && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Draft</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {trip.duration} days · ${trip.price} · {trip.travel_style}
                </p>
              </div>

              {/* Move to Section Dropdown */}
              <div className="flex-shrink-0">
                <select
                  value={trip.travel_style}
                  onChange={e => handleMoveToStyle(trip.id, e.target.value)}
                  className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {travelStyleOptions.map(s => (
                    <option key={s} value={s}>
                      {s === trip.travel_style ? `📍 ${s}` : `➡️ ${s}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEdit(trip)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteId(trip.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Trip?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. All related itinerary data will also be removed.</p>
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-slide-down">
          <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px] ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white ring-4 ring-green-300/50' 
              : 'bg-red-500 text-white ring-4 ring-red-300/50'
          }`}>
            {toast.type === 'success' ? (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <span className="font-medium">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-auto hover:opacity-80 transition-opacity p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}