-- FULL FIX FOR PACKAGES TABLE
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing table completely (WARNING: deletes all data)
DROP TABLE IF EXISTS packages CASCADE;

-- Step 2: Create fresh table with all columns
CREATE TABLE packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    
    duration TEXT,
    duration_days INTEGER DEFAULT 1,
    duration_filter TEXT DEFAULT '3-5',
    
    style TEXT DEFAULT 'budget',
    tour_type TEXT DEFAULT 'Cultural & Historical',
    
    price NUMERIC DEFAULT 0,
    original_price NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    image TEXT,
    gallery TEXT[] DEFAULT '{}',
    
    highlights TEXT[] DEFAULT '{}',
    included TEXT[] DEFAULT '{}',
    excluded TEXT[] DEFAULT '{}',
    itinerary JSONB DEFAULT '[]',
    
    rating NUMERIC DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    best_seller BOOLEAN DEFAULT FALSE,
    
    locations TEXT[] DEFAULT '{}',
    group_size TEXT,
    languages TEXT[] DEFAULT ARRAY['English'],
    start_point TEXT DEFAULT 'Cairo Airport',
    end_point TEXT DEFAULT 'Cairo Airport',
    
    is_published BOOLEAN DEFAULT TRUE
);

-- Step 3: Disable RLS (allows all operations)
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

-- Step 4: Grant full access
GRANT ALL ON packages TO anon;
GRANT ALL ON packages TO authenticated;
GRANT ALL ON packages TO service_role;

-- Step 5: Create indexes
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_style ON packages(style);
CREATE INDEX idx_packages_is_published ON packages(is_published);


-- =====================================================
-- TRIPS TABLE (for AdminTrips)
-- =====================================================

DROP TABLE IF EXISTS trips CASCADE;

CREATE TABLE trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    
    duration INTEGER DEFAULT 1,
    price NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    image TEXT,
    hero_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    
    travel_style TEXT DEFAULT 'Culture',
    rating NUMERIC DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    
    highlights TEXT[] DEFAULT '{}',
    included TEXT[] DEFAULT '{}',
    
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE
);

ALTER TABLE trips DISABLE ROW LEVEL SECURITY;
GRANT ALL ON trips TO anon;
GRANT ALL ON trips TO authenticated;
GRANT ALL ON trips TO service_role;

CREATE INDEX idx_trips_slug ON trips(slug);
CREATE INDEX idx_trips_travel_style ON trips(travel_style);


-- Done! Now go to /admin/packages and click "Import All from Static"
