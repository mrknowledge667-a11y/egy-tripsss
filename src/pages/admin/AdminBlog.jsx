import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

/**
 * AdminBlog Component
 * Full CRUD for managing blog posts — list, create, edit, delete
 */
export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const emptyPost = {
    title: '', slug: '', excerpt: '', content: '',
    image: '', author: '', author_avatar: '',
    category: 'City Guide', tags: [''],
    read_time: '5 min', is_featured: false, is_published: true,
    published_at: new Date().toISOString().split('T')[0],
  }

  const [form, setForm] = useState(emptyPost)

  const categories = ['City Guide', 'Travel Tips', 'Culture', 'Adventure', 'Food & Drink', 'History', 'Budget Travel']

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPosts(data || [])
    setLoading(false)
  }

  const handleEdit = (post) => {
    setForm({
      ...post,
      tags: post.tags?.length ? post.tags : [''],
      published_at: post.published_at || new Date().toISOString().split('T')[0],
    })
    setEditing(post)
  }

  const handleNew = () => {
    setForm(emptyPost)
    setEditing('new')
  }

  const handleCancel = () => {
    setEditing(null)
    setForm(emptyPost)
  }

  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !editing?.id ? { slug: generateSlug(value) } : {}),
    }))
  }

  const handleTagChange = (index, value) => {
    setForm(prev => {
      const tags = [...(prev.tags || [])]
      tags[index] = value
      return { ...prev, tags }
    })
  }

  const addTag = () => {
    setForm(prev => ({ ...prev, tags: [...(prev.tags || []), ''] }))
  }

  const removeTag = (index) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      image: form.image,
      author: form.author,
      author_avatar: form.author_avatar,
      category: form.category,
      tags: form.tags.filter(t => t.trim()),
      read_time: form.read_time,
      is_featured: form.is_featured,
      is_published: form.is_published,
      published_at: form.published_at,
    }

    let error
    if (editing === 'new') {
      ({ error } = await supabase.from('blog_posts').insert(payload))
    } else {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', editing.id))
    }

    if (error) {
      alert('Error saving: ' + error.message)
    } else {
      await fetchPosts()
      handleCancel()
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      await fetchPosts()
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
            {editing === 'new' ? 'Create New Post' : `Edit: ${form.title}`}
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
                placeholder="Blog post title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text" value={form.slug}
                onChange={e => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt} rows={2}
              onChange={e => handleChange('excerpt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief summary for cards..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown supported)</label>
            <textarea
              value={form.content} rows={12}
              onChange={e => handleChange('content', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              placeholder="Write your blog post content here... Markdown formatting is supported."
            />
          </div>

          {/* Author & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text" value={form.author}
                onChange={e => handleChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
              <input
                type="text" value={form.read_time}
                onChange={e => handleChange('read_time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="5 min"
              />
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input
                type="url" value={form.image}
                onChange={e => handleChange('image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="https://images.unsplash.com/..."
              />
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Avatar URL</label>
              <input
                type="url" value={form.author_avatar}
                onChange={e => handleChange('author_avatar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Publish Date */}
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
            <input
              type="date" value={form.published_at}
              onChange={e => handleChange('published_at', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            {form.tags.map((tag, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text" value={tag}
                  onChange={e => handleTagChange(i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder={`Tag ${i + 1}`}
                />
                {form.tags.length > 1 && (
                  <button onClick={() => removeTag(i)} className="px-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                )}
              </div>
            ))}
            <button onClick={addTag} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              + Add Tag
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
              {saving ? 'Saving...' : editing === 'new' ? 'Create Post' : 'Save Changes'}
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
          <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} posts</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span> New Post
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4">
              <div className="w-24 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-64" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <span className="text-4xl mb-3 block">📝</span>
          <p className="text-gray-500">No blog posts yet. Write your first post!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all flex items-center gap-4">
              {/* Image */}
              <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📝</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                  {post.is_featured && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Featured</span>
                  )}
                  {!post.is_published && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Draft</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{post.author}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{post.category}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{post.published_at}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteId(post.id)}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently remove this blog post.</p>
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