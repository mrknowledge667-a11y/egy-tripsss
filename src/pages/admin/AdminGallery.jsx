import { useState, useEffect, useRef } from 'react'
import { supabase, uploadFile, getStorageUrl, deleteFiles } from '../../lib/supabase'

/**
 * AdminGallery Component
 * Gallery management with image uploads to Supabase Storage
 */
export default function AdminGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editingImage, setEditingImage] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', tags: '' })
  const fileInputRef = useRef(null)

  const categories = ['Pyramids', 'Temples', 'Nile', 'Red Sea', 'Desert', 'Cities', 'Culture', 'Food', 'People', 'Nature', 'Other']

  useEffect(() => { fetchImages() }, [])

  const fetchImages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setImages(data || [])
    setLoading(false)
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setUploading(true)

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const filePath = `gallery/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await uploadFile('gallery', filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      // Get public URL
      const publicUrl = getStorageUrl('gallery', filePath)

      // Save metadata to gallery_images table
      const { error: dbError } = await supabase.from('gallery_images').insert({
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        image_url: publicUrl,
        storage_path: filePath,
        category: 'Other',
        tags: [],
      })

      if (dbError) {
        console.error('DB error:', dbError)
      }
    }

    await fetchImages()
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUrlUpload = async () => {
    const url = prompt('Enter image URL:')
    if (!url) return

    const { error } = await supabase.from('gallery_images').insert({
      title: 'Untitled',
      image_url: url,
      storage_path: null,
      category: 'Other',
      tags: [],
    })

    if (!error) await fetchImages()
    else alert('Error adding image: ' + error.message)
  }

  const handleDelete = async (image) => {
    // Delete from storage if it has a storage path
    if (image.storage_path) {
      await deleteFiles('gallery', [image.storage_path])
    }

    // Delete from database
    const { error } = await supabase.from('gallery_images').delete().eq('id', image.id)
    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      await fetchImages()
    }
    setDeleteId(null)
  }

  const handleEditSave = async () => {
    const { error } = await supabase
      .from('gallery_images')
      .update({
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      })
      .eq('id', editingImage.id)

    if (error) {
      alert('Error updating: ' + error.message)
    } else {
      await fetchImages()
      setEditingImage(null)
    }
  }

  const openEdit = (image) => {
    setEditingImage(image)
    setEditForm({
      title: image.title || '',
      description: image.description || '',
      category: image.category || 'Other',
      tags: (image.tags || []).join(', '),
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
          <p className="text-sm text-gray-500 mt-0.5">{images.length} images</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUrlUpload}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Add URL
          </button>
          <label className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer text-sm">
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>📸 Upload Photos</>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="text-4xl mb-3 block">🖼️</span>
          <p className="text-gray-500 mb-4">No images yet. Upload your first photo!</p>
          <label className="inline-flex px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors cursor-pointer text-sm">
            📸 Upload Photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  {image.category && (
                    <p className="text-white/70 text-xs">{image.category}</p>
                  )}
                </div>
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openEdit(image)}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteId(image)}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Image</h3>
            <div className="space-y-4">
              <div className="h-40 rounded-lg overflow-hidden bg-gray-100">
                <img src={editingImage.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text" value={editForm.title}
                  onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description} rows={2}
                  onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editForm.category}
                  onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text" value={editForm.tags}
                  onChange={e => setEditForm(p => ({ ...p, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="egypt, pyramids, travel"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end mt-6">
              <button onClick={() => setEditingImage(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Cancel
              </button>
              <button onClick={handleEditSave} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Image?</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently remove this image from the gallery and storage.</p>
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