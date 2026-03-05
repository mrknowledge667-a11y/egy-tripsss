-- ============================================================
-- Egypt Travel Pro — Authentication & User Profiles Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ============================================================
-- 1. USER PROFILES TABLE
-- Stores additional user information beyond auth.users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  country TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. BOOKINGS TABLE
-- Stores user tour bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  
  -- Trip details snapshot (in case trip gets deleted/updated)
  trip_title TEXT NOT NULL,
  trip_slug TEXT,
  trip_image TEXT,
  
  -- Booking details
  start_date DATE NOT NULL,
  end_date DATE,
  number_of_travelers INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Contact info
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  
  -- Additional info
  special_requests TEXT,
  hotel_preference TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_id TEXT,
  
  -- Admin notes
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. WISHLIST TABLE
-- Users can save favorite trips
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trip_id)
);

-- ============================================================
-- 4. REVIEWS TABLE
-- Users can review trips they've completed
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  admin_response TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name ON public.user_profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON public.bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON public.bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_trip_id ON public.wishlist(trip_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_trip_id ON public.reviews(trip_id);
CREATE INDEX IF NOT  EXISTS idx_reviews_is_approved ON public.reviews(is_approved);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reviews
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- USER PROFILES: users can read all profiles, but only update their own
CREATE POLICY "user_profiles_public_read" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "user_profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert_own" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- BOOKINGS: users can only see and manage their own bookings, admins can see all
CREATE POLICY "bookings_select_own" ON public.bookings
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%admin%'
    )
  );

CREATE POLICY "bookings_insert_own" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_update_own" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%admin%'
    )
  );

CREATE POLICY "bookings_delete_own" ON public.bookings
  FOR DELETE USING (auth.uid() = user_id);

-- WISHLIST: users can only see and manage their own wishlist
CREATE POLICY "wishlist_select_own" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "wishlist_insert_own" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlist_delete_own" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- REVIEWS: approved reviews are public, users can manage their own
CREATE POLICY "reviews_public_read_approved" ON public.reviews
  FOR SELECT USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Admin can manage all reviews
CREATE POLICY "reviews_admin_all" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%admin%'
    )
  );

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to get user's full booking details with trip info
CREATE OR REPLACE FUNCTION public.get_user_bookings(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  trip_title TEXT,
  trip_slug TEXT,
  trip_image TEXT,
  start_date DATE,
  end_date DATE,
  number_of_travelers INTEGER,
  total_price DECIMAL,
  currency TEXT,
  status TEXT,
  payment_status TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.trip_title,
    b.trip_slug,
    b.trip_image,
    b.start_date,
    b.end_date,
    b.number_of_travelers,
    b.total_price,
    b.currency,
    b.status,
    b.payment_status,
    b.created_at
  FROM public.bookings b
  WHERE b.user_id = user_uuid
  ORDER BY b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's wishlist with trip details
CREATE OR REPLACE FUNCTION public.get_user_wishlist(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  trip_id UUID,
  trip_title TEXT,
  trip_slug TEXT,
  trip_image TEXT,
  trip_price DECIMAL,
  trip_duration INTEGER,
  added_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    t.id,
    t.title,
    t.slug,
    t.image,
    t.price,
    t.duration,
    w.created_at
  FROM public.wishlist w
  INNER JOIN public.trips t ON t.id = w.trip_id
  WHERE w.user_id = user_uuid
  ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ✅ DONE! Authentication tables and policies are ready.
-- 
-- Next steps:
-- 1. Enable Email Auth in Supabase Dashboard:
--    Authentication → Providers → Email → Enable
-- 
-- 2. Configure Email Templates (optional):
--    Authentication → Email Templates → Customize
-- 
-- 3. (Optional) Enable Social Providers:
--    Authentication → Providers → Google/Facebook → Configure
-- 
-- 4. Test: Sign up at /signup, check if profile auto-creates
-- ============================================================