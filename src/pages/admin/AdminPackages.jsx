import { useState, useEffect, useRef } from 'react'
import { supabase, uploadFile } from '../../lib/supabase'
import { packages as staticPackages } from '../../data/egyptPackages'
import { VALID_SECTIONS, STYLE_OPTIONS, DEPRECATED_STYLES, getMigrationTarget, isValidStyle } from '../../lib/sectionConfig'

/**
 * AdminPackages Component
 * Full CRUD for managing Egypt packages — import from static file, list, create, edit, delete
 */
export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = list, 'new' = create, package object = edit
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [importProgress, setImportProgress] = useState({ running: false, current: 0, total: 0, errors: [] })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStyle, setFilterStyle] = useState('')
  const [moveModal, setMoveModal] = useState(null) // { pkg, currentStyle } or null
  const [selectedPackages, setSelectedPackages] = useState([]) // for bulk move
  const [bulkMoveStyle, setBulkMoveStyle] = useState('')
  const [uploading, setUploading] = useState({}) // Track upload status per field
  const [toast, setToast] = useState(null) // Toast notifications { type: 'success' | 'error', message: string }
  
  // File input refs
  const imageInputRef = useRef(null)
  const galleryInputRefs = useRef({})

  const emptyPackage = {
    slug: '', title: '', description: '', long_description: '',
    duration: '', duration_days: 1, duration_filter: '3-5',
    style: 'budget', tour_type: 'Cultural & Historical',
    price: 0, original_price: 0, currency: 'USD',
    image: '', gallery: [''],
    highlights: [''], included: [''], excluded: [''],
    itinerary: [{ day: 1, title: '', details: '', meals: '', accommodation: '' }],
    rating: 4.5, reviews: 0, best_seller: false,
    locations: [''], group_size: 'Private Tour (2-15 people)',
    languages: ['English'], start_point: 'Cairo Airport', end_point: 'Cairo Airport',
    is_published: true,
  }

  const [form, setForm] = useState(emptyPackage)

  useEffect(() => { fetchPackages() }, [])

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

  const fetchPackages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPackages(data || [])
    setLoading(false)
  }

  // Import all packages from static file to Supabase
  const handleImportAll = async () => {
    if (!confirm(`Import ${staticPackages.length} packages to Supabase? This will add all packages that don't already exist (by slug).`)) return

    setImportProgress({ running: true, current: 0, total: staticPackages.length, errors: [] })
    const errors = []

    for (let i = 0; i < staticPackages.length; i++) {
      const pkg = staticPackages[i]
      setImportProgress(prev => ({ ...prev, current: i + 1 }))

      // Check if already exists
      const { data: existing, error: checkError } = await supabase
        .from('packages')
        .select('id')
        .eq('slug', pkg.slug)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = not found, which is expected
        console.error('Check error for', pkg.slug, ':', checkError.message)
      }

      if (existing) {
        continue // Skip existing
      }

      // Transform to database format
      const payload = {
        slug: pkg.slug,
        title: pkg.title,
        description: pkg.description,
        long_description: pkg.longDescription || pkg.description,
        duration: pkg.duration,
        duration_days: pkg.durationDays || 1,
        duration_filter: pkg.durationFilter || '3-5',
        style: pkg.style || 'budget',
        tour_type: pkg.tourType || 'Cultural & Historical',
        price: pkg.price || 0,
        original_price: pkg.originalPrice || pkg.price || 0,
        currency: pkg.currency || 'USD',
        image: pkg.image || '',
        gallery: pkg.gallery || [],
        highlights: pkg.highlights || [],
        included: pkg.included || [],
        excluded: pkg.excluded || [],
        itinerary: pkg.itinerary || [],
        rating: pkg.rating || 4.5,
        reviews: pkg.reviews || 0,
        best_seller: pkg.bestSeller || false,
        locations: pkg.locations || [],
        group_size: pkg.groupSize || 'Private Tour',
        languages: pkg.languages || ['English'],
        start_point: pkg.startPoint || 'Cairo',
        end_point: pkg.endPoint || 'Cairo',
        is_published: true,
      }

      console.log('Inserting package:', pkg.slug, payload)
      const { error } = await supabase.from('packages').insert(payload)
      if (error) {
        console.error('Insert error for', pkg.slug, ':', error.message, error)
        errors.push({ slug: pkg.slug, error: error.message })
      }
    }

    setImportProgress({ running: false, current: staticPackages.length, total: staticPackages.length, errors })
    if (errors.length === 0) {
      alert('Import complete! All packages imported successfully.')
    } else {
      alert(`Import complete with ${errors.length} errors. Check browser console (F12) for details.`)
      console.error('Import errors:', errors)
    }
    fetchPackages()
  }

  const handleEdit = (pkg) => {
    setForm({
      ...pkg,
      gallery: pkg.gallery?.length ? pkg.gallery : [''],
      highlights: pkg.highlights?.length ? pkg.highlights : [''],
      included: pkg.included?.length ? pkg.included : [''],
      excluded: pkg.excluded?.length ? pkg.excluded : [''],
      itinerary: pkg.itinerary?.length ? pkg.itinerary : [{ day: 1, title: '', details: '', meals: '', accommodation: '' }],
      locations: pkg.locations?.length ? pkg.locations : [''],
      languages: pkg.languages?.length ? pkg.languages : ['English'],
    })
    setEditing(pkg)
  }

  const handleNew = () => {
    setForm(emptyPackage)
    setEditing('new')
  }

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  // Upload image to Supabase Storage
  const handleImageUpload = async (file, field, galleryIndex = null) => {
    if (!file) return
    
    const uploadKey = galleryIndex !== null ? `${field}_${galleryIndex}` : field
    setUploading(prev => ({ ...prev, [uploadKey]: true }))
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `packages/${fileName}`
      
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
      
      console.log('Public URL:', publicUrl)
      
      if (publicUrl) {
        if (galleryIndex !== null) {
          handleArrayChange(field, galleryIndex, publicUrl)
        } else {
          handleChange(field, publicUrl)
        }
        console.log('✅ Image uploaded! URL:', publicUrl)
      } else {
        alert('Upload succeeded but could not get URL')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Error uploading image')
    } finally {
      setUploading(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  const handleArrayChange = (field, index, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }))
  }

  const addArrayItem = (field) => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayItem = (field, index) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const handleItineraryChange = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }))
  }

  const addItineraryDay = () => {
    setForm(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', details: '', meals: '', accommodation: '' }],
    }))
  }

  const removeItineraryDay = (index) => {
    setForm(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      slug: form.slug,
      title: form.title,
      description: form.description,
      long_description: form.long_description,
      duration: form.duration,
      duration_days: parseInt(form.duration_days) || 1,
      duration_filter: form.duration_filter,
      style: form.style,
      tour_type: form.tour_type,
      price: parseFloat(form.price) || 0,
      original_price: parseFloat(form.original_price) || 0,
      currency: form.currency,
      image: form.image,
      gallery: form.gallery.filter(g => g.trim()),
      highlights: form.highlights.filter(h => h.trim()),
      included: form.included.filter(i => i.trim()),
      excluded: form.excluded.filter(e => e.trim()),
      itinerary: form.itinerary.filter(it => it.title.trim() || it.details.trim()),
      rating: parseFloat(form.rating) || 4.5,
      reviews: parseInt(form.reviews) || 0,
      best_seller: form.best_seller,
      locations: form.locations.filter(l => l.trim()),
      group_size: form.group_size,
      languages: form.languages.filter(l => l.trim()),
      start_point: form.start_point,
      end_point: form.end_point,
      is_published: form.is_published,
    }

    console.log('Saving package:', editing === 'new' ? 'INSERT' : 'UPDATE', payload)

    let error
    if (editing === 'new') {
      const result = await supabase.from('packages').insert(payload).select()
      error = result.error
      console.log('Insert result:', result)
    } else {
      const result = await supabase.from('packages').update(payload).eq('id', editing.id).select()
      error = result.error
      console.log('Update result:', result)
    }

    if (error) {
      console.error('Save error:', error)
      alert('Error saving: ' + error.message + '\n\nDetails: ' + JSON.stringify(error))
    } else {
      alert('✅ Package saved successfully!')
      setEditing(null)
      await fetchPackages()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('packages').delete().eq('id', deleteId)
    if (error) alert('Error deleting: ' + error.message)
    else {
      setDeleteId(null)
      fetchPackages()
    }
  }

  // Move package to different section/style
  const handleMoveToSection = async (pkgId, newStyle) => {
    console.log('=== MOVE PACKAGE START ===')
    console.log('Package ID:', pkgId)
    console.log('New Style:', newStyle)
    console.log('Current packages count:', packages.length)
    
    // Find package name for the toast message
    const pkg = packages.find(p => p.id === pkgId)
    console.log('Found package:', pkg)
    
    if (!pkg) {
      console.error('Package not found in local state!')
      showToast('error', 'Package not found')
      return
    }
    
    const pkgName = pkg?.title || 'Package'
    const oldStyle = pkg?.style || 'unknown'
    
    console.log('Old style:', oldStyle, '-> New style:', newStyle)
    
    // Don't do anything if selecting the same style
    if (oldStyle === newStyle) {
      console.log('Same style selected, skipping')
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({ style: newStyle })
        .eq('id', pkgId)
        .select()
      
      console.log('Supabase response - data:', data)
      console.log('Supabase response - error:', error)
      
      if (error) {
        console.error('Move error:', error)
        showToast('error', 'Error moving package: ' + error.message)
      } else if (!data || data.length === 0) {
        console.error('No data returned - update may have failed due to RLS')
        showToast('error', 'Update failed - check database permissions')
      } else {
        console.log('✅ Move successful!')
        // Update local state immediately for faster UI feedback
        setPackages(prev => prev.map(p => 
          p.id === pkgId ? { ...p, style: newStyle } : p
        ))
        setMoveModal(null)
        showToast('success', `"${pkgName}" moved to ${newStyle} section`)
      }
    } catch (err) {
      console.error('Exception during move:', err)
      showToast('error', 'Unexpected error: ' + err.message)
    }
    
    console.log('=== MOVE PACKAGE END ===')
  }

  // Bulk move selected packages
  const handleBulkMove = async () => {
    if (!bulkMoveStyle || selectedPackages.length === 0) return
    
    const count = selectedPackages.length
    console.log('Bulk moving packages:', selectedPackages, 'to style:', bulkMoveStyle)
    
    const { data, error } = await supabase
      .from('packages')
      .update({ style: bulkMoveStyle })
      .in('id', selectedPackages)
      .select()
    
    console.log('Bulk move result:', { data, error })
    
    if (error) {
      console.error('Bulk move error:', error)
      showToast('error', 'Error moving packages: ' + error.message)
    } else {
      // Update local state immediately
      setPackages(prev => prev.map(p => 
        selectedPackages.includes(p.id) ? { ...p, style: bulkMoveStyle } : p
      ))
      setSelectedPackages([])
      setBulkMoveStyle('')
      showToast('success', `${count} package${count > 1 ? 's' : ''} moved to ${bulkMoveStyle} section`)
    }
  }

  // Toggle package selection
  const togglePackageSelection = (pkgId) => {
    setSelectedPackages(prev => 
      prev.includes(pkgId) 
        ? prev.filter(id => id !== pkgId)
        : [...prev, pkgId]
    )
  }

  // Select all visible packages
  const selectAllVisible = () => {
    const visibleIds = filteredPackages.map(p => p.id)
    const allSelected = visibleIds.every(id => selectedPackages.includes(id))
    if (allSelected) {
      setSelectedPackages(prev => prev.filter(id => !visibleIds.includes(id)))
    } else {
      setSelectedPackages(prev => [...new Set([...prev, ...visibleIds])])
    }
  }

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = !searchTerm || 
      pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStyle = !filterStyle || pkg.style === filterStyle
    return matchesSearch && matchesStyle
  })

  // Use centralized section configuration - only valid frontend sections
  const styleOptions = STYLE_OPTIONS
  
  // Find packages with deprecated/invalid styles
  const packagesWithInvalidStyles = packages.filter(p => !isValidStyle(p.style))
  const hasInvalidStyles = packagesWithInvalidStyles.length > 0

  // ─── EDIT / CREATE FORM ───────────────────────────────────────
  if (editing) {
    return (
      <div className="max-w-5xl mx-auto pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {editing === 'new' ? 'Add New Package' : 'Edit Package'}
          </h2>
          <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to list
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="3 Days Cairo Tour Package"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                value={form.slug}
                onChange={e => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="3-days-cairo-tour-package"
              />
            </div>
          </div>

          {/* Duration & Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration Text</label>
              <input
                value={form.duration}
                onChange={e => handleChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="3 Days / 2 Nights"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
              <input
                type="number" min="1" value={form.duration_days}
                onChange={e => handleChange('duration_days', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration Filter</label>
              <select
                value={form.duration_filter}
                onChange={e => handleChange('duration_filter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="3-5">3–5 Days</option>
                <option value="6-8">6–8 Days</option>
                <option value="9+">9+ Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <select
                value={form.style}
                onChange={e => handleChange('style', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                {styleOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Tour Type & Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type</label>
              <input
                value={form.tour_type}
                onChange={e => handleChange('tour_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="Cultural & Historical"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
              <input
                value={form.group_size}
                onChange={e => handleChange('group_size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="Private Tour (2-15 people)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start / End Points</label>
              <div className="flex gap-2">
                <input
                  value={form.start_point}
                  onChange={e => handleChange('start_point', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Start"
                />
                <input
                  value={form.end_point}
                  onChange={e => handleChange('end_point', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="End"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number" min="0" value={form.price}
                onChange={e => handleChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
              <input
                type="number" min="0" value={form.original_price}
                onChange={e => handleChange('original_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="For showing discount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number" min="0" max="5" step="0.1" value={form.rating}
                onChange={e => handleChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
              <input
                type="number" min="0" value={form.reviews}
                onChange={e => handleChange('reviews', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              rows={2} value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="Brief overview shown in cards"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
            <textarea
              rows={4} value={form.long_description}
              onChange={e => handleChange('long_description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="Detailed description for package page"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
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
              <img 
                key={form.image} 
                src={form.image} 
                alt="Preview" 
                className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-200" 
                onError={(e) => {
                  console.error('Image failed to load:', form.image)
                  e.target.style.border = '2px solid red'
                }}
                onLoad={() => console.log('Image loaded successfully:', form.image)}
              />
            )}
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📷 Gallery Images</label>
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
                      <img src={img} alt={`Gallery ${i + 1}`} className="mt-2 h-20 w-32 object-cover rounded-lg" />
                    )}
                  </div>
                  {form.gallery.length > 1 && (
                    <button onClick={() => removeArrayItem('gallery', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => addArrayItem('gallery')} className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Gallery Image
            </button>
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">✨ Highlights</label>
            <div className="space-y-2">
              {form.highlights.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={h}
                    onChange={e => handleArrayChange('highlights', i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder={`Highlight ${i + 1}`}
                  />
                  {form.highlights.length > 1 && (
                    <button onClick={() => removeArrayItem('highlights', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => addArrayItem('highlights')} className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Highlight
            </button>
          </div>

          {/* Included */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">✅ Included</label>
            <div className="space-y-2">
              {form.included.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={e => handleArrayChange('included', i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder={`Included item ${i + 1}`}
                  />
                  {form.included.length > 1 && (
                    <button onClick={() => removeArrayItem('included', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => addArrayItem('included')} className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Included Item
            </button>
          </div>

          {/* Excluded */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">❌ Excluded</label>
            <div className="space-y-2">
              {form.excluded.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={e => handleArrayChange('excluded', i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder={`Excluded item ${i + 1}`}
                  />
                  {form.excluded.length > 1 && (
                    <button onClick={() => removeArrayItem('excluded', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => addArrayItem('excluded')} className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Excluded Item
            </button>
          </div>

          {/* Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📍 Locations</label>
            <div className="flex flex-wrap gap-2">
              {form.locations.map((loc, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <input
                    value={loc}
                    onChange={e => handleArrayChange('locations', i, e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Cairo"
                  />
                  {form.locations.length > 1 && (
                    <button onClick={() => removeArrayItem('locations', i)} className="text-red-500 hover:bg-red-50 rounded p-1">✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => addArrayItem('locations')} className="px-3 py-2 text-sm text-primary-600 border border-dashed border-primary-300 rounded-lg hover:bg-primary-50">
                + Add
              </button>
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🌐 Languages</label>
            <div className="flex flex-wrap gap-2">
              {form.languages.map((lang, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <input
                    value={lang}
                    onChange={e => handleArrayChange('languages', i, e.target.value)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="English"
                  />
                  {form.languages.length > 1 && (
                    <button onClick={() => removeArrayItem('languages', i)} className="text-red-500 hover:bg-red-50 rounded p-1">✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => addArrayItem('languages')} className="px-3 py-2 text-sm text-primary-600 border border-dashed border-primary-300 rounded-lg hover:bg-primary-50">
                + Add
              </button>
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📅 Day-by-Day Itinerary</label>
            <div className="space-y-4">
              {form.itinerary.map((day, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-primary-600">Day {day.day}</span>
                    {form.itinerary.length > 1 && (
                      <button onClick={() => removeItineraryDay(i)} className="text-red-500 hover:bg-red-100 rounded px-2 py-1 text-sm">
                        Remove Day
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={day.title}
                      onChange={e => handleItineraryChange(i, 'title', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Day title (e.g., Arrival & Pyramids)"
                    />
                    <input
                      value={day.meals}
                      onChange={e => handleItineraryChange(i, 'meals', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Meals (e.g., Breakfast, Lunch)"
                    />
                    <textarea
                      rows={2} value={day.details}
                      onChange={e => handleItineraryChange(i, 'details', e.target.value)}
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Day details..."
                    />
                    <input
                      value={day.accommodation}
                      onChange={e => handleItineraryChange(i, 'accommodation', e.target.value)}
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Accommodation (e.g., 5-Star Hotel in Cairo)"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addItineraryDay} className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Day
            </button>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.best_seller}
                onChange={e => handleChange('best_seller', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">⭐ Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.is_published}
                onChange={e => handleChange('is_published', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">✓ Published</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.slug}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Saving...' : 'Save Package'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── LIST VIEW ───────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Packages</h2>
          <p className="text-sm text-gray-500">{packages.length} packages in database • {staticPackages.length} in static file</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleImportAll}
            disabled={importProgress.running}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 font-medium text-sm flex items-center gap-2"
          >
            {importProgress.running ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Importing {importProgress.current}/{importProgress.total}
              </>
            ) : (
              <>📥 Import All from Static</>
            )}
          </button>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm"
          >
            + Add Package
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search packages..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <select
          value={filterStyle}
          onChange={e => setFilterStyle(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Sections</option>
          {styleOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Bulk Move Bar */}
      {selectedPackages.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-primary-700 font-medium">
              {selectedPackages.length} package{selectedPackages.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedPackages([])}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Move to:</span>
            <select
              value={bulkMoveStyle}
              onChange={e => setBulkMoveStyle(e.target.value)}
              className="px-3 py-1.5 border border-primary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select section...</option>
              {styleOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={handleBulkMove}
              disabled={!bulkMoveStyle}
              className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Move Selected
            </button>
          </div>
        </div>
      )}

      {/* Package List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading packages...</div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 mb-4">No packages found in database</p>
          <button onClick={handleImportAll} className="text-primary-600 hover:underline">
            Import packages from static file →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Select All Checkbox */}
          <div className="col-span-full flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={filteredPackages.length > 0 && filteredPackages.every(p => selectedPackages.includes(p.id))}
              onChange={selectAllVisible}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">Select all visible ({filteredPackages.length})</span>
          </div>
          
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${selectedPackages.includes(pkg.id) ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-100'}`}>
              {/* Selection checkbox overlay */}
              <div className="relative">
                {pkg.image && (
                  <img src={pkg.image} alt={pkg.title} className="w-full h-40 object-cover" />
                )}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedPackages.includes(pkg.id)}
                    onChange={() => togglePackageSelection(pkg.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 bg-white"
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{pkg.title}</h3>
                  {pkg.best_seller && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Best Seller</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>{pkg.duration}</span>
                  <span>•</span>
                  <span className="capitalize">{pkg.style}</span>
                </div>
                
                {/* Quick Move Dropdown */}
                <div className="mb-3">
                  <select
                    value={pkg.style}
                    onChange={e => handleMoveToSection(pkg.id, e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {styleOptions.map(s => (
                      <option key={s} value={s}>
                        {s === pkg.style ? `📍 ${s} (current)` : `➡️ Move to ${s}`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">${pkg.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteId(pkg.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {!pkg.is_published && (
                  <span className="mt-2 inline-block text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Draft</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Package?</h3>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
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
