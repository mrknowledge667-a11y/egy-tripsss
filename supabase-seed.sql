-- ============================================================
-- Egypt Travel Pro — Seed Data
-- Run this AFTER the migration SQL in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- DESTINATIONS (9 destinations from destinations.json)
-- Using fixed UUIDs so relationships work
-- ============================================================
INSERT INTO public.destinations (id, name, slug, country, description, short_description, image, hero_image, region, climate, best_time_to_visit, average_temperature, highlights, activities) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Cairo', 'cairo', 'Egypt',
  'The vibrant capital of Egypt, home to the iconic Pyramids of Giza, the Sphinx, and the world-renowned Egyptian Museum. A bustling metropolis where ancient history meets modern life.',
  'Egypt''s capital - pyramids, museums, and bazaars',
  'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800',
  'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920',
  'Lower Egypt', 'Desert', 'October to April', '25°C',
  ARRAY['Pyramids of Giza','Egyptian Museum','Khan el-Khalili Bazaar','Saladin Citadel','Al-Azhar Mosque'],
  ARRAY['Historical tours','Museum visits','Shopping','Food tours','Nile dinner cruises']
),
(
  '00000000-0000-0000-0000-000000000002',
  'Luxor', 'luxor', 'Egypt',
  'Known as the world''s greatest open-air museum, Luxor houses some of Egypt''s most spectacular ancient monuments including the Valley of the Kings and Karnak Temple.',
  'World''s greatest open-air museum',
  'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800',
  'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1920',
  'Upper Egypt', 'Desert', 'October to April', '28°C',
  ARRAY['Valley of the Kings','Karnak Temple','Luxor Temple','Temple of Hatshepsut','Colossi of Memnon'],
  ARRAY['Temple tours','Hot air balloon rides','Nile cruises','Sound and light shows','Felucca sailing']
),
(
  '00000000-0000-0000-0000-000000000003',
  'Aswan', 'aswan', 'Egypt',
  'A serene city on the Nile, known for its beautiful scenery, Nubian culture, and access to the magnificent Abu Simbel temples. The gateway to ancient Nubia.',
  'Gateway to Nubia and Abu Simbel',
  'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800',
  'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1920',
  'Upper Egypt', 'Desert', 'October to April', '30°C',
  ARRAY['Philae Temple','Aswan High Dam','Unfinished Obelisk','Nubian Villages','Elephantine Island'],
  ARRAY['Temple visits','Felucca sailing','Nubian village tours','Camel riding','Sunset watching']
),
(
  '00000000-0000-0000-0000-000000000004',
  'Hurghada', 'hurghada', 'Egypt',
  'A beach resort town stretching along Egypt''s Red Sea coast. Famous for scuba diving, vibrant coral reefs, and year-round sunshine.',
  'Red Sea diving and beach paradise',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=1920',
  'Red Sea Coast', 'Coastal Desert', 'Year-round', '27°C',
  ARRAY['Giftun Islands','Coral reefs','Desert safari','Marina Boulevard','Makadi Water World'],
  ARRAY['Scuba diving','Snorkeling','Glass-bottom boat','Quad biking','Kitesurfing']
),
(
  '00000000-0000-0000-0000-000000000005',
  'Sharm El Sheikh', 'sharm-el-sheikh', 'Egypt',
  'A resort city between the desert of the Sinai Peninsula and the Red Sea, known for its sheltered beaches, clear waters, and coral reefs.',
  'Premier Red Sea resort destination',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
  'Sinai Peninsula', 'Coastal Desert', 'Year-round', '26°C',
  ARRAY['Naama Bay','Ras Mohammed National Park','Tiran Island','Old Market','Nabq Bay'],
  ARRAY['Diving','Snorkeling','Boat trips','Bedouin dinners','Mount Sinai trips']
),
(
  '00000000-0000-0000-0000-000000000006',
  'Abu Simbel', 'abu-simbel', 'Egypt',
  'Home to two massive rock-cut temples built by Pharaoh Ramesses II. A UNESCO World Heritage Site and one of Egypt''s most awe-inspiring monuments.',
  'Ramesses II''s magnificent rock temples',
  'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800',
  'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1920',
  'Nubia', 'Desert', 'October to February', '32°C',
  ARRAY['Great Temple of Ramesses II','Temple of Hathor','Sound and Light Show','Sun Festival','Lake Nasser views'],
  ARRAY['Temple tours','Photography','Sound and light show','Lake Nasser cruise','Sunrise viewing']
),
(
  '00000000-0000-0000-0000-000000000007',
  'Bahariya Oasis', 'bahariya-oasis', 'Egypt',
  'A depression in the Western Desert known for its palm groves, hot springs, and as the gateway to the Black and White Deserts.',
  'Gateway to Egypt''s desert wonders',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800',
  'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1920',
  'Western Desert', 'Desert', 'October to April', '28°C',
  ARRAY['Golden Mummies Museum','Hot springs','Palm groves','English Mountain','Desert landscapes'],
  ARRAY['Desert camping','Hot spring bathing','4x4 tours','Stargazing','Fossil hunting']
),
(
  '00000000-0000-0000-0000-000000000008',
  'White Desert', 'white-desert', 'Egypt',
  'A surreal landscape of chalk rock formations carved by wind erosion into mushroom shapes and other otherworldly forms. A must-see natural wonder.',
  'Surreal chalk formations landscape',
  'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800',
  'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1920',
  'Western Desert', 'Desert', 'October to April', '25°C',
  ARRAY['Chalk formations','Crystal Mountain','Black Desert','Desert foxes','Starlit skies'],
  ARRAY['Camping','Photography','Hiking','Stargazing','Wildlife watching']
),
(
  '00000000-0000-0000-0000-000000000009',
  'Alexandria', 'alexandria', 'Egypt',
  'Egypt''s second-largest city, founded by Alexander the Great. A Mediterranean gem with rich Greco-Roman heritage, beaches, and the famous Bibliotheca Alexandrina.',
  'Mediterranean pearl with ancient heritage',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1920',
  'Mediterranean Coast', 'Mediterranean', 'March to November', '22°C',
  ARRAY['Bibliotheca Alexandrina','Citadel of Qaitbay','Catacombs of Kom el-Shoqafa','Montazah Palace','Corniche waterfront'],
  ARRAY['Museum visits','Historical tours','Beach time','Seafood dining','Waterfront walks']
);

-- ============================================================
-- EXPERIENCES (8 experiences from experiences.json)
-- ============================================================
INSERT INTO public.experiences (id, name, slug, description, icon, image) VALUES
(
  '10000000-0000-0000-0000-000000000001',
  'Historical Tours', 'historical-tours',
  'Explore ancient temples, tombs, and monuments with expert Egyptologist guides who bring history to life.',
  '🏛️', 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800'
),
(
  '10000000-0000-0000-0000-000000000002',
  'Cultural Immersion', 'cultural-immersion',
  'Experience authentic Egyptian culture through local traditions, cuisine, arts, and community connections.',
  '🎭', 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800'
),
(
  '10000000-0000-0000-0000-000000000003',
  'Water Sports', 'water-sports',
  'Dive into crystal-clear Red Sea waters for world-class diving, snorkeling, and aquatic adventures.',
  '🤿', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
),
(
  '10000000-0000-0000-0000-000000000004',
  'Beach & Relaxation', 'beach-relaxation',
  'Unwind on pristine beaches, enjoy luxurious spa treatments, and embrace the laid-back coastal lifestyle.',
  '🏖️', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
),
(
  '10000000-0000-0000-0000-000000000005',
  'River Cruises', 'river-cruises',
  'Sail the legendary Nile River aboard luxury cruise ships, experiencing Egypt''s timeless landscapes.',
  '🚢', 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800'
),
(
  '10000000-0000-0000-0000-000000000006',
  'Desert Adventures', 'desert-adventures',
  'Explore Egypt''s magnificent deserts through 4x4 expeditions, camel treks, and overnight camping under stars.',
  '🏜️', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800'
),
(
  '10000000-0000-0000-0000-000000000007',
  'Photography Tours', 'photography-tours',
  'Capture Egypt''s stunning beauty with specialized tours designed for photographers of all skill levels.',
  '📷', 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800'
),
(
  '10000000-0000-0000-0000-000000000008',
  'Culinary Experiences', 'culinary-experiences',
  'Savor authentic Egyptian cuisine through food tours, cooking classes, and dining experiences.',
  '🍽️', 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800'
);

-- ============================================================
-- TRIPS (6 trips from trips.json)
-- ============================================================
INSERT INTO public.trips (id, title, slug, description, short_description, duration, price, currency, image, hero_image, travel_style, rating, reviews, highlights, included, is_featured, is_published) VALUES
(
  '20000000-0000-0000-0000-000000000001',
  'Ancient Egypt Explorer', 'ancient-egypt-explorer',
  'Discover the wonders of ancient Egypt, from the majestic pyramids of Giza to the temples of Luxor and the treasures of the Valley of the Kings.',
  'Explore pyramids, temples, and ancient treasures',
  7, 1499, 'USD',
  'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800',
  'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1920',
  'Culture', 4.9, 128,
  ARRAY['Visit the Great Pyramids of Giza','Explore the Egyptian Museum','Cruise the Nile River','Discover Luxor Temple','Visit the Valley of the Kings'],
  ARRAY['6 nights accommodation','Daily breakfast','Expert Egyptologist guide','All entrance fees','Airport transfers','Domestic flights'],
  true, true
),
(
  '20000000-0000-0000-0000-000000000002',
  'Red Sea Adventure', 'red-sea-adventure',
  'Experience the crystal-clear waters of the Red Sea with world-class diving, snorkeling, and beach relaxation in Hurghada and Sharm El Sheikh.',
  'Diving, snorkeling, and beach paradise',
  5, 899, 'USD',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=1920',
  'Adventure', 4.8, 95,
  ARRAY['Snorkel in coral reefs','Scuba diving excursions','Glass-bottom boat tour','Desert quad biking','Beachfront relaxation'],
  ARRAY['4 nights beachfront hotel','All meals','Snorkeling equipment','2 diving excursions','Desert safari trip','Airport transfers'],
  true, true
),
(
  '20000000-0000-0000-0000-000000000003',
  'Nile Cruise Journey', 'nile-cruise-journey',
  'Sail the legendary Nile River from Luxor to Aswan, visiting ancient temples, tombs, and experiencing authentic Egyptian culture along the way.',
  'Luxury cruise through ancient history',
  8, 1899, 'USD',
  'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800',
  'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1920',
  'Relax', 4.95, 156,
  ARRAY['5-star Nile cruise ship','Visit Kom Ombo Temple','Explore Edfu Temple','Aswan High Dam','Abu Simbel excursion'],
  ARRAY['7 nights on luxury cruise','Full board meals','All temple visits','Expert Egyptologist','Entertainment onboard','Abu Simbel tour'],
  true, true
),
(
  '20000000-0000-0000-0000-000000000004',
  'Desert Safari Experience', 'desert-safari-experience',
  'Venture into the magical Western Desert, exploring the White Desert, Black Desert, and the oases of Bahariya and Siwa.',
  'Explore Egypt''s stunning desert landscapes',
  4, 699, 'USD',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800',
  'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1920',
  'Adventure', 4.7, 67,
  ARRAY['Camp under the stars','White Desert formations','Black Desert mountains','Hot springs','Bedouin experience'],
  ARRAY['3 nights camping','All meals','4x4 desert vehicle','Expert desert guide','Camping equipment','Cairo transfers'],
  false, true
),
(
  '20000000-0000-0000-0000-000000000005',
  'Alexandria & Mediterranean', 'alexandria-mediterranean',
  'Discover the legendary city of Alexandria, founded by Alexander the Great, with its rich Greco-Roman heritage and Mediterranean charm.',
  'Mediterranean history and coastal beauty',
  3, 449, 'USD',
  'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1920',
  'Culture', 4.6, 45,
  ARRAY['Bibliotheca Alexandrina','Catacombs of Kom el-Shoqafa','Citadel of Qaitbay','Montazah Palace Gardens','Mediterranean seafood'],
  ARRAY['2 nights hotel','Daily breakfast','Private guide','All entrance fees','Cairo-Alexandria transfers'],
  false, true
),
(
  '20000000-0000-0000-0000-000000000006',
  'Complete Egypt Discovery', 'complete-egypt-discovery',
  'The ultimate Egypt experience combining Cairo, Luxor, Aswan, Abu Simbel, and the Red Sea in one comprehensive journey.',
  'The ultimate Egyptian adventure',
  14, 3299, 'USD',
  'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800',
  'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920',
  'Culture', 4.95, 89,
  ARRAY['All major Egyptian sites','Nile cruise included','Red Sea relaxation','Abu Simbel visit','Expert Egyptologist throughout'],
  ARRAY['13 nights accommodation','All meals','Domestic flights','Nile cruise','Expert guide','All entrance fees'],
  true, true
);

-- ============================================================
-- TRIP ITINERARY
-- ============================================================

-- Trip 1: Ancient Egypt Explorer (7 days)
INSERT INTO public.trip_itinerary (trip_id, day_number, title, description, activities) VALUES
('20000000-0000-0000-0000-000000000001', 1, 'Arrival in Cairo', 'Welcome to Egypt! Upon arrival at Cairo International Airport, you''ll be met by our representative and transferred to your hotel.', ARRAY['Airport pickup','Hotel check-in','Welcome dinner']),
('20000000-0000-0000-0000-000000000001', 2, 'Pyramids of Giza & Sphinx', 'Visit the iconic Pyramids of Giza and the Great Sphinx. Explore the ancient wonders with an expert Egyptologist.', ARRAY['Great Pyramid of Khufu','Pyramid of Khafre','Pyramid of Menkaure','The Great Sphinx']),
('20000000-0000-0000-0000-000000000001', 3, 'Egyptian Museum & Old Cairo', 'Explore the Egyptian Museum housing thousands of artifacts including the treasures of Tutankhamun.', ARRAY['Egyptian Museum','Saladin Citadel','Khan el-Khalili Bazaar']),
('20000000-0000-0000-0000-000000000001', 4, 'Fly to Luxor', 'Fly to Luxor, the ancient city of Thebes. Visit Karnak Temple and Luxor Temple by evening.', ARRAY['Flight to Luxor','Karnak Temple','Luxor Temple at sunset']),
('20000000-0000-0000-0000-000000000001', 5, 'Valley of the Kings', 'Cross to the West Bank to explore the Valley of the Kings. Visit the Temple of Hatshepsut and the Colossi of Memnon.', ARRAY['Valley of the Kings','Temple of Hatshepsut','Colossi of Memnon']),
('20000000-0000-0000-0000-000000000001', 6, 'Nile Cruise Experience', 'Enjoy a relaxing felucca sail on the Nile River. Visit Banana Island and enjoy a traditional Egyptian lunch.', ARRAY['Felucca sailing','Banana Island visit','Traditional lunch']),
('20000000-0000-0000-0000-000000000001', 7, 'Departure', 'Transfer to Luxor Airport for your departure flight.', ARRAY['Hotel checkout','Airport transfer','Departure']);

-- Trip 2: Red Sea Adventure (5 days)
INSERT INTO public.trip_itinerary (trip_id, day_number, title, description, activities) VALUES
('20000000-0000-0000-0000-000000000002', 1, 'Arrival in Hurghada', 'Arrive at Hurghada International Airport and transfer to your beachfront resort.', ARRAY['Airport transfer','Resort check-in','Beach time']),
('20000000-0000-0000-0000-000000000002', 2, 'Snorkeling Paradise', 'Full-day snorkeling trip to Giftun Islands. Explore vibrant coral reefs.', ARRAY['Boat trip to Giftun Islands','Snorkeling sessions','Beach BBQ lunch']),
('20000000-0000-0000-0000-000000000002', 3, 'Scuba Diving Experience', 'Explore underwater wonders at famous dive sites.', ARRAY['Morning dive','Afternoon dive','Evening beach dinner']),
('20000000-0000-0000-0000-000000000002', 4, 'Desert Adventure', 'Experience the Eastern Desert with a thrilling quad biking adventure.', ARRAY['Quad biking','Bedouin village visit','Stargazing dinner']),
('20000000-0000-0000-0000-000000000002', 5, 'Departure', 'Enjoy a final morning swim before transferring to the airport.', ARRAY['Morning swim','Hotel checkout','Airport transfer']);

-- Trip 3: Nile Cruise Journey (8 days)
INSERT INTO public.trip_itinerary (trip_id, day_number, title, description, activities) VALUES
('20000000-0000-0000-0000-000000000003', 1, 'Board in Luxor', 'Board your luxury Nile cruise ship in Luxor. Settle into your cabin.', ARRAY['Cruise boarding','Cabin orientation','Welcome dinner']),
('20000000-0000-0000-0000-000000000003', 2, 'Luxor East Bank', 'Explore the magnificent Karnak Temple complex and Luxor Temple.', ARRAY['Karnak Temple','Luxor Temple','Afternoon tea']),
('20000000-0000-0000-0000-000000000003', 3, 'Luxor West Bank', 'Visit the Valley of the Kings, Temple of Hatshepsut, and Colossi of Memnon.', ARRAY['Valley of the Kings','Hatshepsut Temple','Sailing to Esna']),
('20000000-0000-0000-0000-000000000003', 4, 'Edfu Temple', 'Visit the perfectly preserved Temple of Horus at Edfu.', ARRAY['Edfu Temple visit','Sailing','Onboard activities']),
('20000000-0000-0000-0000-000000000003', 5, 'Kom Ombo Temple', 'Explore the unique double temple of Kom Ombo.', ARRAY['Kom Ombo Temple','Crocodile Museum','Arrival in Aswan']),
('20000000-0000-0000-0000-000000000003', 6, 'Aswan Highlights', 'Visit the Aswan High Dam, Unfinished Obelisk, and Philae Temple.', ARRAY['High Dam','Unfinished Obelisk','Philae Temple']),
('20000000-0000-0000-0000-000000000003', 7, 'Abu Simbel Excursion', 'Early morning excursion to the magnificent Abu Simbel temples.', ARRAY['Abu Simbel temples','Return to Aswan','Farewell gala dinner']),
('20000000-0000-0000-0000-000000000003', 8, 'Disembarkation', 'Enjoy breakfast onboard before disembarking.', ARRAY['Breakfast','Disembarkation','Airport transfer']);

-- Trip 4: Desert Safari Experience (4 days)
INSERT INTO public.trip_itinerary (trip_id, day_number, title, description, activities) VALUES
('20000000-0000-0000-0000-000000000004', 1, 'Cairo to Bahariya Oasis', 'Depart Cairo early morning and drive to Bahariya Oasis.', ARRAY['Drive to Bahariya','Oasis exploration','Golden Mummies museum']),
('20000000-0000-0000-0000-000000000004', 2, 'Black Desert & Crystal Mountain', 'Journey through the Black Desert with its volcanic hills.', ARRAY['Black Desert tour','Crystal Mountain','White Desert arrival']),
('20000000-0000-0000-0000-000000000004', 3, 'White Desert Wonder', 'Explore the surreal chalk formations of the White Desert.', ARRAY['White Desert exploration','Sunset viewing','Desert camping']),
('20000000-0000-0000-0000-000000000004', 4, 'Return to Cairo', 'Wake up to a desert sunrise. Enjoy breakfast before returning.', ARRAY['Desert sunrise','Breakfast','Return to Cairo']);

-- Trip 5: Alexandria & Mediterranean (3 days)
INSERT INTO public.trip_itinerary (trip_id, day_number, title, description, activities) VALUES
('20000000-0000-0000-0000-000000000005', 1, 'Arrival in Alexandria', 'Travel from Cairo to Alexandria. Visit the Bibliotheca Alexandrina.', ARRAY['Transfer to Alexandria','Bibliotheca Alexandrina','Roman Amphitheatre']),
('20000000-0000-0000-0000-000000000005', 2, 'Ancient Alexandria', 'Explore the Catacombs, Pompey''s Pillar, and the Citadel of Qaitbay.', ARRAY['Catacombs','Pompey''s Pillar','Qaitbay Citadel','Seafood dinner']),
('20000000-0000-0000-0000-000000000005', 3, 'Montazah & Departure', 'Visit Montazah Palace gardens and enjoy Mediterranean beaches.', ARRAY['Montazah Gardens','Beach time','Return to Cairo']);

-- Trip 6: Complete Egypt Discovery (14 days)
INSERT INTO public.trip_itinerary (trip_id, day_number, title, description, activities) VALUES
('20000000-0000-0000-0000-000000000006', 1, 'Welcome to Cairo', 'Arrive in Cairo and transfer to your hotel.', ARRAY['Airport pickup','Hotel check-in','Orientation walk']),
('20000000-0000-0000-0000-000000000006', 2, 'Pyramids & Sphinx', 'Full day exploring the Giza Plateau.', ARRAY['Pyramids of Giza','Great Sphinx','Solar Boat Museum']),
('20000000-0000-0000-0000-000000000006', 3, 'Cairo Museums & Old Cairo', 'Visit the Egyptian Museum and explore Islamic Cairo.', ARRAY['Egyptian Museum','Saladin Citadel','Khan el-Khalili']),
('20000000-0000-0000-0000-000000000006', 4, 'Fly to Luxor - Board Cruise', 'Fly to Luxor and board your Nile cruise.', ARRAY['Flight to Luxor','Cruise boarding','Karnak Temple']),
('20000000-0000-0000-0000-000000000006', 5, 'Luxor West Bank', 'Explore Valley of the Kings, Hatshepsut Temple.', ARRAY['Valley of the Kings','Hatshepsut Temple','Luxor Temple']),
('20000000-0000-0000-0000-000000000006', 6, 'Sailing to Edfu', 'Relax on the cruise as you sail. Visit Edfu Temple.', ARRAY['Sailing','Esna lock passage','Edfu Temple']),
('20000000-0000-0000-0000-000000000006', 7, 'Kom Ombo to Aswan', 'Visit Kom Ombo Temple and sail to Aswan.', ARRAY['Kom Ombo Temple','Sailing to Aswan','Felucca ride']),
('20000000-0000-0000-0000-000000000006', 8, 'Aswan Exploration', 'Visit High Dam, Unfinished Obelisk, and Philae Temple.', ARRAY['High Dam','Unfinished Obelisk','Philae Temple']),
('20000000-0000-0000-0000-000000000006', 9, 'Abu Simbel', 'Early morning excursion to Abu Simbel temples.', ARRAY['Abu Simbel temples','Return to Aswan','Farewell dinner']),
('20000000-0000-0000-0000-000000000006', 10, 'Fly to Hurghada', 'Disembark cruise and fly to Hurghada.', ARRAY['Cruise disembarkation','Flight to Hurghada','Resort check-in']),
('20000000-0000-0000-0000-000000000006', 11, 'Red Sea Snorkeling', 'Full-day snorkeling trip to Giftun Islands.', ARRAY['Boat trip','Snorkeling','Beach BBQ']),
('20000000-0000-0000-0000-000000000006', 12, 'Beach & Diving', 'Optional scuba diving or relaxation day.', ARRAY['Optional diving','Beach time','Spa time']),
('20000000-0000-0000-0000-000000000006', 13, 'Desert Adventure', 'Morning quad biking in the Eastern Desert.', ARRAY['Quad biking','Leisure time','Bedouin dinner']),
('20000000-0000-0000-0000-000000000006', 14, 'Departure', 'Transfer to Hurghada Airport.', ARRAY['Hotel checkout','Airport transfer','Departure']);

-- ============================================================
-- TRIP ↔ DESTINATION RELATIONSHIPS
-- ============================================================
INSERT INTO public.trip_destinations (trip_id, destination_id) VALUES
-- Trip 1: Ancient Egypt Explorer → Cairo, Luxor, Aswan
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
-- Trip 2: Red Sea Adventure → Hurghada, Sharm El Sheikh
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005'),
-- Trip 3: Nile Cruise → Luxor, Aswan, Abu Simbel
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006'),
-- Trip 4: Desert Safari → Bahariya, White Desert
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008'),
-- Trip 5: Alexandria → Alexandria
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000009'),
-- Trip 6: Complete Egypt → Cairo, Luxor, Aswan, Hurghada, Abu Simbel
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004'),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006');

-- ============================================================
-- TRIP ↔ EXPERIENCE RELATIONSHIPS
-- ============================================================
INSERT INTO public.trip_experiences (trip_id, experience_id) VALUES
-- Trip 1: Historical, Cultural, River Cruises
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005'),
-- Trip 2: Water Sports, Beach
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004'),
-- Trip 3: Historical, Cultural, River Cruises
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005'),
-- Trip 4: Water Sports, Desert Adventures
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006'),
-- Trip 5: Historical, Cultural
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002'),
-- Trip 6: Historical, Cultural, Water Sports, Beach, River Cruises
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004'),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005');

-- ============================================================
-- BLOG POSTS (6 posts from blogPosts.json)
-- ============================================================
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, image, author, author_avatar, category, tags, read_time, is_featured, is_published, published_at) VALUES
(
  '30000000-0000-0000-0000-000000000001',
  'Cairo – The Heart of History and Life',
  'cairo-heart-of-history-and-life',
  'Discover the bustling capital of Egypt where ancient wonders meet vibrant modern life.',
  'Cairo, the sprawling capital of Egypt, is a city that pulses with energy and history at every corner. Home to over 20 million people, it''s the largest city in Africa and the Arab world.',
  'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200',
  'Ahmed Hassan',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'City Guide',
  ARRAY['Cairo tourism','Pyramids','Egyptian Museum','Khan El Khalili','Trips to Egypt'],
  '8 min', true, true, '2026-01-15'
),
(
  '30000000-0000-0000-0000-000000000002',
  'Alexandria – The Bride of the Mediterranean',
  'alexandria-bride-of-mediterranean',
  'Experience Egypt''s coastal gem where Hellenistic history meets Mediterranean charm.',
  'Alexandria, Egypt''s second-largest city, stretches along the Mediterranean coast like a crescent moon embracing the sea.',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200',
  'Sara Mohamed',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'City Guide',
  ARRAY['Alexandria tourism','Mediterranean','Seafood','Library of Alexandria','Travel Egypt Tours'],
  '7 min', true, true, '2026-01-20'
),
(
  '30000000-0000-0000-0000-000000000003',
  'Luxor – An Open-Air Museum on the Nile',
  'luxor-open-air-museum-nile',
  'Walk through the world''s greatest open-air museum where pharaohs built their eternal monuments.',
  'Luxor, ancient Thebes, was the glittering capital of Egypt during the New Kingdom.',
  'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200',
  'Dr. Mahmoud Ali',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  'City Guide',
  ARRAY['Luxor tourism','Valley of the Kings','Karnak Temple','Hot air balloon','Vacation in Egypt'],
  '10 min', true, true, '2026-01-25'
),
(
  '30000000-0000-0000-0000-000000000004',
  'Aswan – The Magic of the South and the Calm of the Nile',
  'aswan-magic-south-calm-nile',
  'Discover Egypt''s most relaxed city where the Nile is at its most beautiful.',
  'Aswan marks Egypt''s southern frontier, where the Nile is at its most beautiful and life moves at a gentler pace.',
  'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200',
  'Fatima Nour',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  'City Guide',
  ARRAY['Aswan tourism','Nubian culture','Philae Temple','Abu Simbel','Vacation in Egypt'],
  '9 min', true, true, '2026-02-01'
),
(
  '30000000-0000-0000-0000-000000000005',
  'Sharm El-Sheikh – Adventure and Relaxation on the Red Sea',
  'sharm-el-sheikh-adventure-relaxation-red-sea',
  'Dive into crystal-clear waters, explore vibrant coral reefs, and unwind at world-class resorts.',
  'Sharm El-Sheikh, perched on the southern tip of the Sinai Peninsula, is Egypt''s premier beach resort destination.',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
  'Omar Rashid',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'City Guide',
  ARRAY['Sharm El-Sheikh tourism','Red Sea diving','Beach resorts','Ras Mohammed','Travel Egypt Tours'],
  '9 min', true, true, '2026-02-05'
),
(
  '30000000-0000-0000-0000-000000000006',
  'Best Time to Visit Egypt – A Complete Seasonal Guide',
  'best-time-visit-egypt',
  'Plan your perfect Egyptian adventure with our comprehensive guide to weather, crowds, and special events.',
  'Knowing when to visit Egypt can make or break your trip. This guide helps you choose the perfect time based on weather, crowds, prices, and special events.',
  'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200',
  'Travel Team',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  'Travel Tips',
  ARRAY['Best time to visit Egypt','Egypt weather','Travel planning','Vacation in Egypt'],
  '6 min', false, true, '2026-01-10'
);

-- ============================================================
-- DONE! All seed data has been inserted.
-- You can now use the admin panel to manage this data.
-- ============================================================