-- Egypt Travel Pro - Packages Table
-- Run this in your Supabase SQL Editor to create the packages table

CREATE TABLE IF NOT EXISTS packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Basic Info
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    
    -- Duration
    duration TEXT,                    -- "3 Days / 2 Nights"
    duration_days INTEGER DEFAULT 1,
    duration_filter TEXT DEFAULT '3-5', -- "3-5", "6-8", "9+"
    
    -- Classification
    style TEXT DEFAULT 'budget',      -- budget, luxury, Honeymoon, Small Group
    tour_type TEXT DEFAULT 'Cultural & Historical',
    
    -- Pricing
    price DECIMAL(10,2) DEFAULT 0,
    original_price DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    -- Images
    image TEXT,                       -- Main card image
    gallery TEXT[] DEFAULT '{}',      -- Array of gallery image URLs
    
    -- Details (arrays stored as JSONB for flexibility)
    highlights TEXT[] DEFAULT '{}',
    included TEXT[] DEFAULT '{}',
    excluded TEXT[] DEFAULT '{}',
    itinerary JSONB DEFAULT '[]',     -- Array of {day, title, details, meals, accommodation}
    
    -- Ratings
    rating DECIMAL(2,1) DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    best_seller BOOLEAN DEFAULT FALSE,
    
    -- Location Info
    locations TEXT[] DEFAULT '{}',
    group_size TEXT,
    languages TEXT[] DEFAULT ARRAY['English'],
    start_point TEXT DEFAULT 'Cairo Airport',
    end_point TEXT DEFAULT 'Cairo Airport',
    
    -- Status
    is_published BOOLEAN DEFAULT TRUE
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at
    BEFORE UPDATE ON packages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_packages_slug ON packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_style ON packages(style);
CREATE INDEX IF NOT EXISTS idx_packages_is_published ON packages(is_published);
CREATE INDEX IF NOT EXISTS idx_packages_price ON packages(price);
CREATE INDEX IF NOT EXISTS idx_packages_best_seller ON packages(best_seller);

-- Enable Row Level Security
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published packages
CREATE POLICY "Public can view published packages" ON packages
    FOR SELECT USING (is_published = TRUE);

-- Policy: Authenticated users can do everything (for admin)
CREATE POLICY "Authenticated users have full access" ON packages
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON packages TO anon;
GRANT ALL ON packages TO authenticated;
