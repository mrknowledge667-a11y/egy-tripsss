import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
// Fallback data
import blogPostsFallback from '../data/blogPosts.json'

/**
 * BlogPost Page
 * Individual blog article with full content, author info, and related posts
 * Fetches data from Supabase with JSON fallback
 */
const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch post from Supabase
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single()

        if (postError) {
          if (postError.code === 'PGRST116') {
            // Not found in Supabase, try fallback
            const fallbackPost = blogPostsFallback.find(p => p.slug === slug)
            if (fallbackPost) {
              setPost(fallbackPost)
              const related = blogPostsFallback
                .filter(p => p.id !== fallbackPost.id && (
                  p.city === fallbackPost.city ||
                  p.tags?.some(tag => fallbackPost.tags?.includes(tag))
                ))
                .slice(0, 3)
              setRelatedPosts(related)
            } else {
              navigate('/blog')
            }
            setLoading(false)
            return
          }
          throw postError
        }

        // Transform post data
        const transformedPost = {
          ...postData,
          publishedAt: postData.published_at,
          readTime: postData.read_time,
          author: {
            name: postData.author_name || 'Egypt Travel Pro',
            avatar: postData.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
            role: postData.author_role || 'Travel Expert'
          }
        }
        setPost(transformedPost)

        // Fetch related posts
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select('*')
          .neq('id', postData.id)
          .eq('published', true)
          .or(`city.eq.${postData.city},tags.cs.{${postData.tags?.join(',') || ''}}`)
          .limit(3)

        if (relatedData) {
          const transformedRelated = relatedData.map(p => ({
            ...p,
            publishedAt: p.published_at,
            readTime: p.read_time,
            author: {
              name: p.author_name || 'Egypt Travel Pro',
              avatar: p.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
              role: p.author_role || 'Travel Expert'
            }
          }))
          setRelatedPosts(transformedRelated)
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        // Try fallback data
        const fallbackPost = blogPostsFallback.find(p => p.slug === slug)
        if (fallbackPost) {
          setPost(fallbackPost)
          const related = blogPostsFallback
            .filter(p => p.id !== fallbackPost.id && (
              p.city === fallbackPost.city ||
              p.tags?.some(tag => fallbackPost.tags?.includes(tag))
            ))
            .slice(0, 3)
          setRelatedPosts(related)
        } else {
          navigate('/blog')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn btn-primary">
            Browse All Articles
          </Link>
        </div>
      </div>
    )
  }

  // Parse markdown-like content to HTML
  const renderContent = (content) => {
    const lines = content.split('\n')
    const elements = []
    let listItems = []
    let inList = false

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc pl-6 mb-6 space-y-2">{listItems}</ul>)
          listItems = []
          inList = false
        }
        elements.push(
          <h2 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {line.substring(3)}
          </h2>
        )
      }
      // Sub-headers
      else if (line.startsWith('### ')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc pl-6 mb-6 space-y-2">{listItems}</ul>)
          listItems = []
          inList = false
        }
        elements.push(
          <h3 key={index} className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
            {line.substring(4)}
          </h3>
        )
      }
      // Bold headers (like **Don't miss:**)
      else if (line.startsWith('**') && line.endsWith('**')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc pl-6 mb-6 space-y-2">{listItems}</ul>)
          listItems = []
          inList = false
        }
        elements.push(
          <p key={index} className="font-bold text-gray-900 mt-6 mb-2">
            {line.replace(/\*\*/g, '')}
          </p>
        )
      }
      // List items
      else if (line.startsWith('- ')) {
        inList = true
        const text = line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        listItems.push(
          <li key={index} className="text-gray-700" dangerouslySetInnerHTML={{ __html: text }} />
        )
      }
      // Table (simple handling)
      else if (line.startsWith('|')) {
        // Skip table for now, could enhance later
      }
      // Regular paragraph
      else if (line.trim()) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc pl-6 mb-6 space-y-2">{listItems}</ul>)
          listItems = []
          inList = false
        }
        const text = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        elements.push(
          <p key={index} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: text }} />
        )
      }
    })

    // Close any remaining list
    if (inList) {
      elements.push(<ul key="final-list" className="list-disc pl-6 mb-6 space-y-2">{listItems}</ul>)
    }

    return elements
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <main className="pt-20 min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <nav className="flex items-center gap-2 text-white/80 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white">{post.city || post.category}</span>
          </nav>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {post.city && (
                  <span className="bg-primary-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {post.city}
                  </span>
                )}
                <span className="bg-white/20 backdrop-blur text-white text-sm px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="bg-white/20 backdrop-blur text-white text-sm px-3 py-1 rounded-full">
                  {post.readTime} min read
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Author & Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-8 border-b border-gray-200"
            >
              <div className="flex items-center gap-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-100"
                />
                <div>
                  <p className="font-semibold text-gray-900">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formattedDate}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likes.toLocaleString()}
                </span>
              </div>
            </motion.div>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 leading-relaxed mb-10 font-medium"
            >
              {post.excerpt}
            </motion.p>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="prose prose-lg max-w-none"
            >
              {renderContent(post.content)}
            </motion.div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag, i) => (
                  <Link
                    key={i}
                    to={`/blog?search=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-600 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-500">Share:</span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedPost.thumbnail}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {relatedPost.city && (
                      <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {relatedPost.city}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary-500">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Explore {post.city || 'Egypt'}?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Let us help you plan the perfect trip to experience everything you've just read about.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/trips" className="btn bg-white text-primary-500 hover:bg-gray-100">
              Browse Tours
            </Link>
            <Link to="/plan-trip" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-500">
              Plan Custom Trip
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default BlogPost