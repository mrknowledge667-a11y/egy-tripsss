-- ============================================================
-- Egypt Travel Pro — Supabase Database Migration
-- Run this entire file in your Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. DESTINATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT DEFAULT 'Egypt',
  description TEXT,
  short_description TEXT,
  image TEXT,
  hero_image TEXT,
  region TEXT,
  climate TEXT,
  best_time_to_visit TEXT,
  average_temperature TEXT,
  highlights TEXT[] DEFAULT '{}',
  activities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. TRIPS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  duration INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  image TEXT,
  hero_image TEXT,
  travel_style TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  highlights TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. TRIP ITINERARY (days for each trip)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trip_itinerary (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. TRIP ↔ DESTINATION (many-to-many junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trip_destinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  UNIQUE(trip_id, destination_id)
);

-- ============================================================
-- 5. EXPERIENCES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. TRIP ↔ EXPERIENCE (many-to-many junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trip_experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  UNIQUE(trip_id, experience_id)
);

-- ============================================================
-- 7. BLOG POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  author TEXT DEFAULT 'Egypt Travel Pro',
  author_avatar TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  read_time TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. GALLERY IMAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  category TEXT DEFAULT 'general',
  location TEXT,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. CONTACT SUBMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  trip_type TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. SITE SETTINGS TABLE (key-value config)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON public.destinations(region);
CREATE INDEX IF NOT EXISTS idx_trips_slug ON public.trips(slug);
CREATE INDEX IF NOT EXISTS idx_trips_travel_style ON public.trips(travel_style);
CREATE INDEX IF NOT EXISTS idx_trips_is_published ON public.trips(is_published);
CREATE INDEX IF NOT EXISTS idx_trips_is_featured ON public.trips(is_featured);
CREATE INDEX IF NOT EXISTS idx_trip_itinerary_trip_id ON public.trip_itinerary(trip_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON public.contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER set_updated_at_destinations
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_trips
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_blog_posts
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_site_settings
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public: can READ published content
-- Authenticated (admin): can do everything
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- DESTINATIONS: public read, admin write
CREATE POLICY "destinations_public_read" ON public.destinations
  FOR SELECT USING (true);
CREATE POLICY "destinations_admin_insert" ON public.destinations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "destinations_admin_update" ON public.destinations
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "destinations_admin_delete" ON public.destinations
  FOR DELETE USING (auth.role() = 'authenticated');

-- TRIPS: public read published, admin all
CREATE POLICY "trips_public_read" ON public.trips
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "trips_admin_insert" ON public.trips
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "trips_admin_update" ON public.trips
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "trips_admin_delete" ON public.trips
  FOR DELETE USING (auth.role() = 'authenticated');

-- TRIP ITINERARY: public read, admin write
CREATE POLICY "trip_itinerary_public_read" ON public.trip_itinerary
  FOR SELECT USING (true);
CREATE POLICY "trip_itinerary_admin_insert" ON public.trip_itinerary
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "trip_itinerary_admin_update" ON public.trip_itinerary
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "trip_itinerary_admin_delete" ON public.trip_itinerary
  FOR DELETE USING (auth.role() = 'authenticated');

-- TRIP DESTINATIONS: public read, admin write
CREATE POLICY "trip_destinations_public_read" ON public.trip_destinations
  FOR SELECT USING (true);
CREATE POLICY "trip_destinations_admin_insert" ON public.trip_destinations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "trip_destinations_admin_delete" ON public.trip_destinations
  FOR DELETE USING (auth.role() = 'authenticated');

-- EXPERIENCES: public read, admin write
CREATE POLICY "experiences_public_read" ON public.experiences
  FOR SELECT USING (true);
CREATE POLICY "experiences_admin_insert" ON public.experiences
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "experiences_admin_update" ON public.experiences
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "experiences_admin_delete" ON public.experiences
  FOR DELETE USING (auth.role() = 'authenticated');

-- TRIP EXPERIENCES: public read, admin write
CREATE POLICY "trip_experiences_public_read" ON public.trip_experiences
  FOR SELECT USING (true);
CREATE POLICY "trip_experiences_admin_insert" ON public.trip_experiences
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "trip_experiences_admin_delete" ON public.trip_experiences
  FOR DELETE USING (auth.role() = 'authenticated');

-- BLOG POSTS: public read published, admin all
CREATE POLICY "blog_posts_public_read" ON public.blog_posts
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "blog_posts_admin_insert" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "blog_posts_admin_update" ON public.blog_posts
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "blog_posts_admin_delete" ON public.blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- GALLERY IMAGES: public read, admin write
CREATE POLICY "gallery_images_public_read" ON public.gallery_images
  FOR SELECT USING (true);
CREATE POLICY "gallery_images_admin_insert" ON public.gallery_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "gallery_images_admin_update" ON public.gallery_images
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "gallery_images_admin_delete" ON public.gallery_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- CONTACTS: only admin can read/write (contact form uses service role or RPC)
CREATE POLICY "contacts_admin_read" ON public.contacts
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "contacts_public_insert" ON public.contacts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts_admin_update" ON public.contacts
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "contacts_admin_delete" ON public.contacts
  FOR DELETE USING (auth.role() = 'authenticated');

-- SITE SETTINGS: public read, admin write
CREATE POLICY "site_settings_public_read" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "site_settings_admin_insert" ON public.site_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "site_settings_admin_update" ON public.site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET for gallery images
-- Run this separately if it fails (storage policies are different)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760, -- 10MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated upload/delete
CREATE POLICY "gallery_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "gallery_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "gallery_auth_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "gallery_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- ============================================================
-- DONE! Tables, indexes, triggers, RLS, and storage are ready.
-- Next step: Run the seed script to populate data.
-- ============================================================