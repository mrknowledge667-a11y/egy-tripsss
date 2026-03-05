import { useParams, Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroSection, TripCard } from '../components'
import { supabase } from '../lib/supabase'
// Fallback data
import destinationsDataFallback from '../data/destinations.json'
import tripsDataFallback from '../data/trips.json'

gsap.registerPlugin(ScrollTrigger)

/**
 * Detailed descriptions for each destination keyed by slug.
 * These provide rich, SEO-friendly Egypt travel content.
 */
const destinationContent = {
  cairo: {
    tagline: 'Where Pharaohs Meet the Modern World',
    longDescription:
      'Cairo is the beating heart of Egypt — a sprawling megacity of over 20 million people where 5,000 years of history collide with vibrant modern culture. Standing at the edge of the Sahara, it is home to the last surviving Wonder of the Ancient World: the Great Pyramids of Giza. But Cairo is far more than pyramids. Wander the labyrinthine lanes of Khan el-Khalili bazaar, marvel at the treasures of Tutankhamun in the Egyptian Museum, and gaze upon the medieval grandeur of the Saladin Citadel. At sunset, sip mint tea on a felucca drifting down the Nile while the call to prayer echoes across the skyline — an experience you will never forget.',
    sections: [
      {
        title: 'The Pyramids of Giza',
        text: 'The only surviving Wonder of the Ancient World, the three pyramids of Khufu, Khafre, and Menkaure have stood for over 4,500 years. The Great Pyramid alone contains an estimated 2.3 million limestone blocks. Nearby, the Great Sphinx — a limestone statue with the body of a lion and a human head — guards the plateau. Our expert Egyptologists bring these monuments to life with stories most tourists never hear.',
        icon: '🏛️',
      },
      {
        title: 'The Egyptian Museum',
        text: "Home to over 120,000 artifacts spanning 5,000 years of history, including Tutankhamun's gold death mask, royal mummies, and the world's largest collection of Pharaonic antiquities. The new Grand Egyptian Museum (GEM) near the Pyramids is set to become the world's largest archaeological museum.",
        icon: '🏺',
      },
      {
        title: 'Islamic & Coptic Cairo',
        text: 'Explore centuries-old mosques, churches, and synagogues in one of the world\'s oldest Islamic cities. The Hanging Church, Amr Ibn al-As Mosque, and Ben Ezra Synagogue showcase Cairo\'s incredible religious diversity. The Citadel of Saladin offers panoramic views of the entire city.',
        icon: '🕌',
      },
      {
        title: 'Khan el-Khalili Bazaar',
        text: 'Dating back to 1382, this legendary souk is a sensory overload of spices, perfumes, gold jewelry, handcrafted lanterns, and papyrus art. Haggling is expected and part of the fun. Stop at El Fishawy café — Cairo\'s oldest coffeehouse, serving Turkish coffee since 1773.',
        icon: '🛍️',
      },
    ],
    travelTip: 'Book a sunset Nile dinner cruise for the most magical Cairo experience. The city lights reflecting on the water with the Pyramids silhouetted in the distance is unforgettable.',
  },
  luxor: {
    tagline: "The World's Greatest Open-Air Museum",
    longDescription:
      'Ancient Thebes — modern-day Luxor — was the capital of Egypt during the New Kingdom (1550–1070 BC) and is arguably the most significant archaeological site on Earth. Split by the Nile into the East Bank (city of the living) and West Bank (city of the dead), Luxor contains more ancient monuments than most countries. From the colossal Karnak Temple to the hidden tombs of the Valley of the Kings, every corner reveals another chapter of Egypt\'s extraordinary past.',
    sections: [
      {
        title: 'Karnak Temple Complex',
        text: 'The largest ancient religious site in the world, Karnak was built over 2,000 years by successive pharaohs. The Great Hypostyle Hall — with its 134 massive columns arranged in 16 rows — is one of the most impressive structures ever built. At night, the Sound & Light Show transforms the temple into a spellbinding spectacle.',
        icon: '🏛️',
      },
      {
        title: 'Valley of the Kings',
        text: 'Hidden in the Theban Hills, this valley contains 63 royal tombs including that of Tutankhamun, Ramesses II, and Seti I. The vibrant wall paintings inside these 3,000-year-old tombs look as if they were painted yesterday. Each tomb tells the story of the pharaoh\'s journey to the afterlife.',
        icon: '👑',
      },
      {
        title: 'Temple of Hatshepsut',
        text: 'Built into the cliffs at Deir el-Bahari, this stunning mortuary temple honors Egypt\'s most famous female pharaoh. Its three terraced levels connected by ramps create one of ancient Egypt\'s most striking architectural achievements.',
        icon: '🏔️',
      },
      {
        title: 'Hot Air Balloon at Sunrise',
        text: 'Float silently over the West Bank at dawn, watching the sun paint the Theban Hills gold as the temples, tombs, and farmland spread below you. This is consistently rated the #1 experience in all of Egypt by our travelers.',
        icon: '🎈',
      },
    ],
    travelTip: 'Visit Luxor Temple at sunset when the golden light illuminates the massive columns and the Avenue of Sphinxes — recently restored and now connecting Karnak to Luxor Temple over 2.7 km.',
  },
  aswan: {
    tagline: 'Gateway to Ancient Nubia',
    longDescription:
      'Aswan is Egypt at its most relaxed and beautiful. Sitting on the first cataract of the Nile, this sun-drenched city is framed by golden sand dunes, granite boulders, and the deep blue river. It\'s the gateway to Nubian culture — one of the world\'s oldest civilizations — and the launching point for Abu Simbel excursions. Time moves slower here; feluccas glide past Elephantine Island, colorful Nubian villages dot the riverbanks, and the sunsets are legendary.',
    sections: [
      {
        title: 'Philae Temple (Temple of Isis)',
        text: 'Relocated stone by stone to Agilkia Island after the Aswan Dam flooding, Philae is one of Egypt\'s most beautiful temples. Dedicated to the goddess Isis, its columns and reliefs tell ancient love stories. The evening Sound & Light Show on the water is magical.',
        icon: '🏛️',
      },
      {
        title: 'Nubian Villages',
        text: 'Cross the Nile to visit vibrantly painted Nubian villages where residents welcome you with hibiscus tea and warm hospitality. Learn about Nubian traditions, music, and cuisine that have survived for millennia. Many homes keep friendly crocodiles as good-luck charms!',
        icon: '🏘️',
      },
      {
        title: 'Felucca Sailing',
        text: 'There\'s no better way to experience the Nile than aboard a traditional felucca sailboat. Glide past Elephantine Island, Kitchener\'s Island (home to a beautiful botanical garden), and the Aga Khan Mausoleum as the sun dips below the western desert.',
        icon: '⛵',
      },
      {
        title: 'Aswan High Dam',
        text: 'One of the 20th century\'s greatest engineering achievements, the High Dam created Lake Nasser — one of the world\'s largest artificial lakes. Visit the dam to understand how it transformed Egypt\'s agriculture and saved ancient monuments from flooding.',
        icon: '🌊',
      },
    ],
    travelTip: 'Stay at the Old Cataract Hotel where Agatha Christie wrote "Death on the Nile" — its terrace offers arguably the most beautiful Nile view in all of Egypt.',
  },
  hurghada: {
    tagline: 'Red Sea Paradise',
    longDescription:
      'Hurghada has transformed from a quiet fishing village into Egypt\'s premier beach resort destination. Stretching 40 km along the Red Sea coast, it offers world-class diving and snorkeling in some of the planet\'s most pristine coral reefs. The warm, crystal-clear waters are home to over 1,000 species of fish and 200 species of coral. Beyond the beach, the Eastern Desert offers thrilling quad biking, Bedouin cultural experiences, and stargazing under impossibly clear skies.',
    sections: [
      {
        title: 'Giftun Islands',
        text: 'This protected national park features some of the Red Sea\'s most stunning beaches and coral reefs. Snorkel among parrotfish, clownfish, and sea turtles in crystal-clear turquoise waters. The islands are accessible only by boat, ensuring pristine conditions.',
        icon: '🏝️',
      },
      {
        title: 'World-Class Diving',
        text: 'Hurghada is a gateway to legendary dive sites including the SS Thistlegorm wreck (a WWII cargo ship), Abu Nuhas reef (the "Ship Graveyard"), and the Brothers Islands. Whether you\'re a beginner or advanced diver, the Red Sea delivers extraordinary underwater experiences.',
        icon: '🤿',
      },
      {
        title: 'Desert Adventures',
        text: 'The Eastern Desert surrounding Hurghada offers quad biking over sand dunes, camel rides to Bedouin camps, and some of the best stargazing in the Northern Hemisphere thanks to zero light pollution. Our sunset desert safaris include a traditional Bedouin dinner.',
        icon: '🏜️',
      },
      {
        title: 'Marina & Nightlife',
        text: 'The New Marina promenade is Hurghada\'s social hub, lined with restaurants, cafés, and shops. Enjoy fresh Red Sea seafood while watching luxury yachts bob in the harbor. The area comes alive at night with live music and a vibrant atmosphere.',
        icon: '🌅',
      },
    ],
    travelTip: 'The best diving visibility is from April to November. For whale shark sightings, visit between May and July when these gentle giants migrate through the area.',
  },
  'sharm-el-sheikh': {
    tagline: 'Where Desert Meets the Deep Blue',
    longDescription:
      'Perched on the southern tip of the Sinai Peninsula, Sharm El Sheikh is a world-renowned resort destination where dramatic desert mountains meet the sparkling Red Sea. It\'s home to Ras Mohammed National Park — one of the top 10 dive sites on Earth — and serves as the base for Mount Sinai excursions. The combination of luxury resorts, incredible marine life, and biblical history makes Sharm a truly unique destination.',
    sections: [
      {
        title: 'Ras Mohammed National Park',
        text: 'This UNESCO-protected marine park at the very tip of the Sinai Peninsula features sheer underwater cliffs dropping into the deep blue, teeming with sharks, rays, barracuda, and thousands of colorful reef fish. The Shark and Yolanda reefs are consistently ranked among the world\'s best dive sites.',
        icon: '🦈',
      },
      {
        title: 'Naama Bay',
        text: 'The vibrant heart of Sharm, Naama Bay offers a beautiful crescent beach, bustling promenade, and excellent snorkeling right off the shore. The pedestrian strip is lined with restaurants, shisha lounges, and entertainment venues.',
        icon: '🏖️',
      },
      {
        title: 'Mount Sinai Excursion',
        text: 'A 2-hour drive from Sharm, Mount Sinai (Jebel Musa) is where Moses is believed to have received the Ten Commandments. The pre-dawn climb to watch sunrise from the 2,285m summit is a profound spiritual experience. At the base, St. Catherine\'s Monastery — one of the world\'s oldest — houses priceless religious artifacts.',
        icon: '⛰️',
      },
      {
        title: 'Tiran Island',
        text: 'A boat trip to Tiran Island takes you through the Strait of Tiran, passing four famous coral reefs (Gordon, Thomas, Woodhouse, and Jackson). The snorkeling here is extraordinary, with coral towers rising from the deep and large pelagic fish patrolling the waters.',
        icon: '🐠',
      },
    ],
    travelTip: 'Book the overnight Mount Sinai trip to watch both sunset and sunrise from the mountain — the colors painting the desert landscape are absolutely spectacular.',
  },
  'abu-simbel': {
    tagline: "Ramesses II's Eternal Monument",
    longDescription:
      'Abu Simbel is arguably Egypt\'s most awe-inspiring archaeological site. Carved directly into a mountainside by Pharaoh Ramesses II around 1264 BC, the two massive rock temples were a statement of power and devotion. In the 1960s, the entire complex was cut into blocks and relocated 65 meters higher to save it from the rising waters of Lake Nasser — one of the greatest feats of archaeological engineering in history. Twice a year, on February 22 and October 22, the rising sun penetrates the inner sanctuary to illuminate the statues of the gods.',
    sections: [
      {
        title: 'The Great Temple',
        text: 'Four colossal 20-meter statues of Ramesses II guard the entrance to this magnificent temple. Inside, eight Osiride pillars line the hypostyle hall, and vivid wall carvings depict the Battle of Kadesh — Ramesses\' greatest military victory. The precision of the sun alignment twice yearly demonstrates the ancient Egyptians\' extraordinary astronomical knowledge.',
        icon: '🗿',
      },
      {
        title: 'Temple of Hathor (Nefertari)',
        text: 'Adjacent to the Great Temple, this smaller but equally beautiful temple was dedicated by Ramesses to his beloved wife Nefertari and the goddess Hathor. It is one of very few Egyptian temples dedicated to a queen, and its six standing statues (four of Ramesses, two of Nefertari) are remarkably well-preserved.',
        icon: '👸',
      },
      {
        title: 'The UNESCO Rescue',
        text: 'In the 1960s, an international UNESCO campaign cut the temples into over 2,000 blocks (each weighing 20-30 tons) and reassembled them on higher ground. The artificial hill and dome built to support them are invisible from outside — a masterpiece of modern engineering preserving an ancient masterpiece.',
        icon: '🌍',
      },
      {
        title: 'Sun Festival',
        text: 'On February 22 (Ramesses\' birthday) and October 22 (his coronation), sunlight penetrates 60 meters into the inner sanctum to illuminate three of the four seated gods — leaving Ptah, god of the underworld, forever in shadow. Thousands gather for this spectacular astronomical event.',
        icon: '☀️',
      },
    ],
    travelTip: 'Visit at dawn when the rising sun turns the façade golden and the tour buses haven\'t arrived yet. The Sound & Light Show in the evening is also spectacular, narrating the temple\'s history against the starlit sky.',
  },
  'bahariya-oasis': {
    tagline: 'Gateway to the Desert Wonders',
    longDescription:
      'Bahariya Oasis is a lush depression in the Western Desert, about 370 km southwest of Cairo. Surrounded by black hills and palm groves, it has been inhabited since at least the Middle Kingdom (2055–1650 BC) and served as a vital stop on ancient caravan routes. Today, it\'s the launching point for adventures into the Black Desert, White Desert, and Crystal Mountain — some of Egypt\'s most surreal and photogenic landscapes.',
    sections: [
      {
        title: 'Valley of the Golden Mummies',
        text: 'Discovered in 1996 when a donkey stumbled into a hole, this necropolis contains an estimated 10,000 Greco-Roman mummies, many adorned with golden masks and intricate chest plates. The museum displays the finest examples of these remarkably well-preserved 2,000-year-old mummies.',
        icon: '💀',
      },
      {
        title: 'Hot & Cold Springs',
        text: 'Bahariya is famous for its natural springs. Bir el-Ghaba (Forest Spring) offers warm sulfur waters surrounded by palm trees — perfect for a soak after a desert drive. Bir el-Mattar (Rain Spring) provides cooler waters and is popular with locals and travelers alike.',
        icon: '♨️',
      },
      {
        title: 'English Mountain',
        text: 'Named for the WWI-era British outpost at its summit, this flat-topped mountain offers 360° panoramic views of the entire oasis, surrounding desert, and the black basalt hills. Sunrise and sunset from here are extraordinary.',
        icon: '🏔️',
      },
      {
        title: 'Desert Staging Point',
        text: 'Bahariya is where your 4x4 desert adventure begins. From here, experienced desert guides lead you through the Black Desert (volcanic black pebble-covered hills), past Crystal Mountain (a ridge of quartz crystals), and into the otherworldly White Desert.',
        icon: '🚙',
      },
    ],
    travelTip: 'Spend a night in a traditional Bedouin camp on the outskirts of the oasis. The zero light pollution means you\'ll see the Milky Way with your naked eyes — a life-changing stargazing experience.',
  },
  'white-desert': {
    tagline: 'An Alien Landscape on Earth',
    longDescription:
      'The White Desert (Sahara el-Beyda) is one of the most surreal landscapes on the planet. Millions of years of wind erosion have sculpted chalk and limestone formations into bizarre mushroom shapes, pillars, and forms that look like they belong on another world. Located near the Farafra Depression in Egypt\'s Western Desert, this protected national park transforms dramatically throughout the day — brilliant white under the midday sun, golden at sunset, and ghostly silver under moonlight.',
    sections: [
      {
        title: 'Chalk Formations',
        text: 'The iconic chalk formations — nicknamed "mushrooms," "chickens," "ice cream cones," and "sphinxes" by locals — were carved over millions of years by sandstorms. Some tower 5-6 meters high. Walking among them at sunset when they glow amber and pink is one of Egypt\'s most unforgettable experiences.',
        icon: '🍄',
      },
      {
        title: 'Desert Camping',
        text: 'Spending the night in the White Desert is the highlight. Your Bedouin guide will set up camp between the formations, cook a traditional dinner over a campfire, and share desert stories. Fall asleep under a canopy of stars so dense it feels like you could reach up and touch them.',
        icon: '⛺',
      },
      {
        title: 'Crystal Mountain',
        text: 'On the road between Bahariya and the White Desert, Crystal Mountain is a low ridge studded with quartz crystals that sparkle in the sunlight. It\'s a popular photo stop and a geological wonder showing the area\'s ancient seabed origins.',
        icon: '💎',
      },
      {
        title: 'The Black Desert',
        text: 'Before reaching the White Desert, you pass through the Black Desert — volcanic hills covered in black iron-rich pebbles that create a striking contrast with the golden sand. Climbing one of these hills rewards you with panoramic desert views stretching to the horizon.',
        icon: '🌑',
      },
    ],
    travelTip: 'Visit during a full moon for an extraordinary experience — the chalk formations glow silver-white and cast dramatic shadows across the desert floor. The contrast is simply magical.',
  },
  alexandria: {
    tagline: 'The Pearl of the Mediterranean',
    longDescription:
      'Founded by Alexander the Great in 331 BC, Alexandria was once the intellectual capital of the ancient world — home to the legendary Library of Alexandria and the Pharos Lighthouse (one of the Seven Wonders). Today, Egypt\'s second-largest city retains its cosmopolitan Mediterranean character with a stunning waterfront corniche, Greco-Roman ruins, Belle Époque architecture, and some of the country\'s best seafood. It offers a completely different side of Egypt — breezy, European-influenced, and deeply literary.',
    sections: [
      {
        title: 'Bibliotheca Alexandrina',
        text: 'The modern revival of the ancient Library of Alexandria is a stunning architectural marvel — a massive tilted disc rising from the Mediterranean shore. Inside, it houses millions of books, several museums, art galleries, and a planetarium. The exterior wall is inscribed with characters from every known alphabet.',
        icon: '📚',
      },
      {
        title: 'Citadel of Qaitbay',
        text: 'Built in 1477 on the exact site where the ancient Pharos Lighthouse once stood, this 15th-century Mamluk fortress offers panoramic views of the Mediterranean and the city. Some stones from the original lighthouse were used in its construction, connecting ancient and medieval Egypt.',
        icon: '🏰',
      },
      {
        title: 'Catacombs of Kom el-Shoqafa',
        text: 'This extraordinary underground necropolis from the 2nd century AD uniquely blends Egyptian, Greek, and Roman artistic traditions. Descend a spiral staircase to discover ornate tomb chambers where pharaonic motifs meet classical sculptures — a perfect symbol of Alexandria\'s multicultural identity.',
        icon: '⚱️',
      },
      {
        title: 'The Corniche & Seafood',
        text: 'Alexandria\'s 15-km waterfront corniche is perfect for evening strolls with sea breezes and Mediterranean sunsets. The city is famous for its seafood — don\'t miss grilled seabass at a traditional fish restaurant in the Anfushi district, or try the legendary Alexandrian liver sandwich at Mohamed Ahmed.',
        icon: '🐟',
      },
    ],
    travelTip: 'Visit the Montazah Palace gardens in the late afternoon — the combination of royal gardens, sandy beaches, and Mediterranean views at sunset is pure magic. The palace was the summer residence of Egypt\'s last king.',
  },
}

/**
 * DestinationDetails Page
 * Rich, content-heavy page for individual destination views
 * Fetches data from Supabase with JSON fallback
 */
const DestinationDetails = () => {
  const { slug } = useParams()
  const sectionRef = useRef(null)
  const [destination, setDestination] = useState(null)
  const [relatedTrips, setRelatedTrips] = useState([])
  const [loading, setLoading] = useState(true)

  const content = destinationContent[slug]

  // Fetch destination and related trips from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch destination by slug
        const { data: destData, error: destError } = await supabase
          .from('destinations')
          .select('*')
          .eq('slug', slug)
          .single()

        if (destError) {
          if (destError.code === 'PGRST116') {
            // Not found in Supabase, try fallback
            const fallbackDest = destinationsDataFallback.find((d) => d.slug === slug)
            if (fallbackDest) {
              setDestination(fallbackDest)
              const trips = tripsDataFallback.filter((trip) => trip.destinations?.includes(fallbackDest.id))
              setRelatedTrips(trips)
            }
            setLoading(false)
            return
          }
          throw destError
        }

        setDestination(destData)

        // Fetch related trips via junction table
        const { data: tripDestinations } = await supabase
          .from('trip_destinations')
          .select('trip_id')
          .eq('destination_id', destData.id)

        if (tripDestinations && tripDestinations.length > 0) {
          const tripIds = tripDestinations.map((td) => td.trip_id)
          const { data: trips } = await supabase
            .from('trips')
            .select('*')
            .in('id', tripIds)

          setRelatedTrips(trips || [])
        }
      } catch (error) {
        console.error('Error fetching destination:', error)
        // Try fallback data
        const fallbackDest = destinationsDataFallback.find((d) => d.slug === slug)
        if (fallbackDest) {
          setDestination(fallbackDest)
          const trips = tripsDataFallback.filter((trip) => trip.destinations?.includes(fallbackDest.id))
          setRelatedTrips(trips)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  // GSAP scroll animations
  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.content-card')
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [slug])

  // Loading state
  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50 pt-20 min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading destination...</p>
        </div>
      </main>
    )
  }

  // 404 — destination not found
  if (!destination) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center px-4">
          <div className="text-7xl mb-6">🗺️</div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Destination Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            We couldn't find that destination. Explore our available destinations below.
          </p>
          <Link to="/destinations" className="btn btn-primary">
            View All Destinations
          </Link>
        </div>
      </main>
    )
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <HeroSection
        title={destination.name}
        subtitle={content?.tagline || destination.shortDescription}
        backgroundImage={destination.heroImage}
      />

      {/* Quick Facts Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Region</p>
              <p className="text-sm font-semibold text-gray-900">{destination.region}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Climate</p>
              <p className="text-sm font-semibold text-gray-900">{destination.climate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Best Time</p>
              <p className="text-sm font-semibold text-gray-900">{destination.bestTimeToVisit}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Temp</p>
              <p className="text-sm font-semibold text-gray-900">{destination.averageTemperature}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tours Available</p>
              <p className="text-sm font-semibold text-primary-500">{relatedTrips.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                About {destination.name}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {content?.longDescription || destination.description}
              </p>
            </motion.div>

            {/* Highlights & Activities side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">⭐</span> Top Highlights
                </h3>
                <ul className="space-y-3">
                  {destination.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">🎯</span> Things to Do
                </h3>
                <ul className="space-y-3">
                  {destination.activities.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      {a}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Rich Content Sections */}
      {content?.sections && (
        <section ref={sectionRef} className="section bg-white">
          <div className="container-custom">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                What to Experience in {destination.name}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Deep-dive into the must-see attractions and hidden gems
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {content.sections.map((sec, i) => (
                <div
                  key={sec.title}
                  className="content-card bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{sec.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{sec.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{sec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Travel Tip */}
      {content?.travelTip && (
        <section className="py-12 bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="container-custom">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center text-white"
            >
              <span className="text-4xl mb-4 inline-block">💡</span>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Insider Travel Tip</h3>
              <p className="text-white/90 text-lg leading-relaxed">{content.travelTip}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Tours */}
      {relatedTrips.length > 0 && (
        <section className="section bg-gray-50">
          <div className="container-custom">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tours Featuring {destination.name}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our curated trips that include {destination.name} as a destination
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedTrips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Explore {destination.name}?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Let our travel experts craft the perfect {destination.name} itinerary tailored to your interests, budget, and schedule.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/plan-trip" className="btn btn-primary btn-lg">
                Plan Your Trip
              </Link>
              <Link to="/contact" className="btn btn-outline-primary btn-lg">
                Talk to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default DestinationDetails