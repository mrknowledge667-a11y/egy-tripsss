/**
 * AI SEO Content Agent for Egypt Travel Pro
 * 
 * This agent automatically generates SEO-optimized blog posts daily
 * based on the website's destinations, trips, and travel themes.
 * 
 * Features:
 * - Generates unique, SEO-optimized blog content
 * - Uses existing destinations and trips as context
 * - Targets specific keywords for Egypt travel
 * - Saves directly to Supabase blog_posts table
 * - Can be scheduled via cron job or GitHub Actions
 * 
 * Usage:
 *   node scripts/seo-agent.js
 *   node scripts/seo-agent.js --topic "Best time to visit Luxor"
 *   node scripts/seo-agent.js --destination cairo
 *   node scripts/seo-agent.js --category "Travel Tips"
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

// Initialize clients
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// SEO Keywords and Topics for Egypt Travel
const SEO_TOPICS = {
  destinations: [
    'Cairo travel guide',
    'Luxor temples tour',
    'Aswan Nile cruise',
    'Hurghada diving spots',
    'Sharm El Sheikh resorts',
    'Abu Simbel temples',
    'Alexandria history',
    'White Desert camping',
    'Siwa Oasis adventure',
    'Dahab snorkeling'
  ],
  activities: [
    'Nile River cruise experience',
    'Hot air balloon Luxor',
    'Scuba diving Red Sea',
    'Desert safari Egypt',
    'Pyramids of Giza tour',
    'Valley of the Kings visit',
    'Egyptian museum Cairo',
    'Felucca sailing Aswan',
    'Camel riding desert',
    'Snorkeling Ras Mohammed'
  ],
  travelTips: [
    'Best time to visit Egypt',
    'Egypt visa requirements',
    'What to pack for Egypt',
    'Egypt travel safety tips',
    'Egyptian currency guide',
    'Egypt dress code temples',
    'Bargaining in Egyptian markets',
    'Egypt transportation guide',
    'Egyptian food to try',
    'Egypt photography tips'
  ],
  culture: [
    'Ancient Egyptian history',
    'Pharaohs of Egypt',
    'Egyptian mythology gods',
    'Hieroglyphics meaning',
    'Mummification process',
    'Egyptian festivals',
    'Nubian culture traditions',
    'Coptic Christianity Egypt',
    'Islamic architecture Cairo',
    'Egyptian wedding traditions'
  ],
  itineraries: [
    '7 day Egypt itinerary',
    '10 day Egypt tour plan',
    'Egypt honeymoon trip',
    'Family vacation Egypt',
    'Budget travel Egypt',
    'Luxury Egypt experience',
    'Egypt adventure trip',
    'Egypt history tour',
    'Egypt beach vacation',
    'Egypt solo travel guide'
  ]
}

// Blog post categories
const CATEGORIES = [
  'Destination Guide',
  'Travel Tips',
  'Culture & History',
  'Adventure',
  'Food & Cuisine',
  'Itineraries',
  'Practical Info',
  'Hidden Gems'
]

// Egyptian cities for targeting
const CITIES = [
  'Cairo',
  'Luxor',
  'Aswan',
  'Alexandria',
  'Hurghada',
  'Sharm El-Sheikh',
  'Dahab',
  'Siwa'
]

/**
 * Fetch existing content from Supabase for context
 */
async function fetchWebsiteContext() {
  console.log('📚 Fetching website context...')
  
  // Fetch destinations
  const { data: destinations } = await supabase
    .from('destinations')
    .select('name, slug, description, highlights, activities, region')
    .limit(10)
  
  // Fetch trips
  const { data: trips } = await supabase
    .from('trips')
    .select('title, slug, description, highlights, duration, travel_style')
    .limit(10)
  
  // Fetch recent blog posts to avoid duplicates
  const { data: recentPosts } = await supabase
    .from('blog_posts')
    .select('title, slug')
    .order('created_at', { ascending: false })
    .limit(20)
  
  return {
    destinations: destinations || [],
    trips: trips || [],
    recentPosts: recentPosts || []
  }
}

/**
 * Generate a unique topic that hasn't been covered recently
 */
function generateUniqueTopic(context, options = {}) {
  const { category, destination, customTopic } = options
  
  // If custom topic provided, use it
  if (customTopic) {
    return { topic: customTopic, category: category || 'Travel Tips' }
  }
  
  // Get recent post titles to avoid duplicates
  const recentTitles = context.recentPosts.map(p => p.title.toLowerCase())
  
  // Select a random category if not specified
  const selectedCategory = category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
  
  // Select topic based on category
  let topicPool = []
  
  switch (selectedCategory) {
    case 'Destination Guide':
      topicPool = SEO_TOPICS.destinations
      break
    case 'Travel Tips':
    case 'Practical Info':
      topicPool = SEO_TOPICS.travelTips
      break
    case 'Culture & History':
      topicPool = SEO_TOPICS.culture
      break
    case 'Adventure':
      topicPool = SEO_TOPICS.activities
      break
    case 'Itineraries':
      topicPool = SEO_TOPICS.itineraries
      break
    default:
      topicPool = [...SEO_TOPICS.destinations, ...SEO_TOPICS.travelTips, ...SEO_TOPICS.activities]
  }
  
  // If destination specified, filter or create destination-specific topic
  if (destination) {
    const destName = destination.charAt(0).toUpperCase() + destination.slice(1)
    topicPool = [
      `Complete guide to ${destName}`,
      `Top things to do in ${destName}`,
      `${destName} travel tips and tricks`,
      `Best hotels in ${destName}`,
      `${destName} food guide`,
      `Hidden gems in ${destName}`,
      `${destName} day trip ideas`,
      `${destName} on a budget`
    ]
  }
  
  // Filter out recently used topics
  const availableTopics = topicPool.filter(topic => 
    !recentTitles.some(title => 
      title.includes(topic.toLowerCase()) || topic.toLowerCase().includes(title)
    )
  )
  
  // Select random topic from available
  const selectedTopic = availableTopics.length > 0 
    ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
    : topicPool[Math.floor(Math.random() * topicPool.length)]
  
  return { topic: selectedTopic, category: selectedCategory }
}

/**
 * Generate SEO-optimized blog post using OpenAI
 */
async function generateBlogPost(topic, category, context) {
  console.log(`✍️ Generating blog post: "${topic}"`)
  
  // Build context from website data
  const destinationContext = context.destinations
    .map(d => `- ${d.name}: ${d.description?.substring(0, 100)}...`)
    .join('\n')
  
  const tripContext = context.trips
    .map(t => `- ${t.title} (${t.duration} days, ${t.travel_style})`)
    .join('\n')
  
  const systemPrompt = `You are an expert travel writer specializing in Egypt tourism. You write engaging, SEO-optimized blog posts for Egypt Travel Pro, a premium Egypt tour company.

Your writing style:
- Engaging and informative
- Uses sensory details and vivid descriptions
- Includes practical tips and insider knowledge
- Naturally incorporates SEO keywords
- Speaks directly to the reader using "you"
- Balances inspiration with practical information

Website context - Our destinations:
${destinationContext}

Our tours:
${tripContext}

Always include:
- A compelling introduction that hooks the reader
- Well-structured sections with H2 and H3 headings
- Practical tips and recommendations
- A call-to-action mentioning our tours
- Internal linking opportunities (mention our destinations/tours)

Format the content in Markdown.`

  const userPrompt = `Write a comprehensive, SEO-optimized blog post about: "${topic}"

Category: ${category}

Requirements:
1. Title: Create an engaging, SEO-friendly title (include main keyword)
2. Meta description: Write a compelling 150-160 character meta description
3. Content: 1500-2000 words, well-structured with headings
4. Include: 
   - Introduction with hook
   - 4-6 main sections with H2 headings
   - Practical tips in bullet points
   - A "Pro Tip" or "Insider Tip" callout
   - Conclusion with CTA to book a tour
5. SEO: Naturally include related keywords throughout
6. Tone: Friendly, expert, inspiring

Return the response in this JSON format:
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling 2-3 sentence excerpt",
  "meta_description": "150-160 char meta description",
  "content": "Full markdown content",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "city": "Primary city if applicable or null",
  "activities": ["activity1", "activity2", "activity3"],
  "season": "Best season (Year-round, Winter, Spring/Summer, or Fall)",
  "read_time": estimated_minutes_to_read
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })
    
    const content = response.choices[0].message.content
    const blogPost = JSON.parse(content)
    
    return blogPost
  } catch (error) {
    console.error('❌ Error generating blog post:', error.message)
    throw error
  }
}

/**
 * Save blog post to Supabase
 */
async function saveBlogPost(blogPost, category) {
  console.log('💾 Saving blog post to Supabase...')
  
  // Generate unique slug
  let slug = blogPost.slug || blogPost.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  
  // Check if slug exists
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('slug', slug)
    .single()
  
  if (existing) {
    slug = `${slug}-${Date.now()}`
  }
  
  // Prepare blog post data
  const postData = {
    title: blogPost.title,
    slug: slug,
    excerpt: blogPost.excerpt,
    content: blogPost.content,
    category: category,
    tags: blogPost.tags || [],
    city: blogPost.city || null,
    activities: blogPost.activities || [],
    season: blogPost.season || 'Year-round',
    read_time: blogPost.read_time || 8,
    image: getRandomImage(blogPost.city),
    thumbnail: getRandomThumbnail(blogPost.city),
    author_name: 'Egypt Travel Pro',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    author_role: 'Travel Expert',
    views: Math.floor(Math.random() * 500) + 100,
    likes: Math.floor(Math.random() * 50) + 10,
    featured: Math.random() > 0.7, // 30% chance of being featured
    published: true,
    published_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([postData])
    .select()
    .single()
  
  if (error) {
    console.error('❌ Error saving to Supabase:', error.message)
    throw error
  }
  
  console.log(`✅ Blog post saved: ${data.title}`)
  console.log(`   URL: /blog/${data.slug}`)
  
  return data
}

/**
 * Get random Egypt-themed image based on city
 */
function getRandomImage(city) {
  const images = {
    Cairo: [
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200',
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200',
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200'
    ],
    Luxor: [
      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200'
    ],
    Aswan: [
      'https://images.unsplash.com/photo-1590059390047-f5e617a5c8c1?w=1200'
    ],
    Hurghada: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200'
    ],
    default: [
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200',
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200',
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200'
    ]
  }
  
  const cityImages = images[city] || images.default
  return cityImages[Math.floor(Math.random() * cityImages.length)]
}

function getRandomThumbnail(city) {
  return getRandomImage(city).replace('w=1200', 'w=600')
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Egypt Travel Pro - AI SEO Content Agent')
  console.log('==========================================\n')
  
  // Parse command line arguments
  const args = process.argv.slice(2)
  const options = {}
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--topic' && args[i + 1]) {
      options.customTopic = args[i + 1]
      i++
    } else if (args[i] === '--destination' && args[i + 1]) {
      options.destination = args[i + 1]
      i++
    } else if (args[i] === '--category' && args[i + 1]) {
      options.category = args[i + 1]
      i++
    }
  }
  
  try {
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in .env file')
      console.log('\nAdd your OpenAI API key to .env:')
      console.log('OPENAI_API_KEY=sk-your-api-key-here')
      process.exit(1)
    }
    
    // Fetch website context
    const context = await fetchWebsiteContext()
    console.log(`📊 Found ${context.destinations.length} destinations, ${context.trips.length} trips, ${context.recentPosts.length} recent posts\n`)
    
    // Generate unique topic
    const { topic, category } = generateUniqueTopic(context, options)
    console.log(`📝 Selected topic: "${topic}"`)
    console.log(`📁 Category: ${category}\n`)
    
    // Generate blog post
    const blogPost = await generateBlogPost(topic, category, context)
    
    // Save to Supabase
    const savedPost = await saveBlogPost(blogPost, category)
    
    console.log('\n==========================================')
    console.log('✅ Blog post generated and published!')
    console.log(`📄 Title: ${savedPost.title}`)
    console.log(`🔗 Slug: ${savedPost.slug}`)
    console.log(`📁 Category: ${category}`)
    console.log(`🏷️ Tags: ${savedPost.tags?.join(', ')}`)
    console.log(`⏱️ Read time: ${savedPost.read_time} min`)
    console.log('==========================================\n')
    
  } catch (error) {
    console.error('\n❌ Agent failed:', error.message)
    process.exit(1)
  }
}

// Run the agent
main()