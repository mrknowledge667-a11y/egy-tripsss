-- ============================================================
-- Egypt Travel Pro — Data Migration Script
-- Migrates packages → trips and imports static data
-- Run AFTER supabase-add-trip-type.sql
-- ============================================================

-- ============================================================
-- STEP 1: Migrate existing packages to trips table
-- ============================================================

-- Insert packages into trips table (only if they don't already exist)
INSERT INTO public.trips (
    type,
    title,
    slug,
    description,
    short_description,
    duration,
    price,
    original_price,
    currency,
    image,
    travel_style,
    rating,
    reviews,
    highlights,
    included,
    excluded,
    itinerary,
    best_seller,
    locations,
    group_size,
    languages,
    start_point,
    end_point,
    duration_text,
    tour_type,
    is_featured,
    is_published
)
SELECT 
    'package' as type,
    title,
    slug,
    COALESCE(long_description, description) as description,
    description as short_description,
    COALESCE(duration_days, 1) as duration,
    price,
    original_price,
    currency,
    image,
    style as travel_style,
    rating,
    reviews,
    highlights,
    included,
    excluded,
    itinerary,
    best_seller,
    locations,
    group_size,
    languages,
    start_point,
    end_point,
    duration as duration_text,
    tour_type,
    false as is_featured,  -- Reset featured status
    is_published
FROM public.packages 
WHERE NOT EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.slug = packages.slug
);

-- ============================================================
-- STEP 2: Update bookings to reference trips instead of packages
-- ============================================================

-- Note: If your bookings table currently references packages.id,
-- you'll need to update the foreign key. This assumes bookings
-- already reference trips table (as seen in supabase-bookings-only.sql)

-- ============================================================
-- STEP 3: Sample data import for Day Tours
-- These would be imported via Node.js script from static files
-- This is just the SQL structure for reference
-- ============================================================

/*
-- Example Day Tour import (run this pattern from Node.js with actual data)
INSERT INTO public.trips (
    type, title, slug, description, duration, price, currency, 
    image, rating, reviews, highlights, included, excluded,
    best_seller, is_published
) VALUES (
    'day_tour',
    'Giza Pyramids and Sphinx Day Tour',
    'giza-pyramids-sphinx-day-tour',
    'Explore the last remaining Wonder of the Ancient World...',
    1,
    65.00,
    'USD',
    'https://example.com/giza-pyramids.jpg',
    4.8,
    156,
    ARRAY['Great Pyramid of Giza', 'Sphinx', 'Valley Temple'],
    ARRAY['Hotel pickup/drop-off', 'Professional guide', 'Entry fees'],
    ARRAY['Personal expenses', 'Gratuities', 'Lunch'],
    true,
    true
) ON CONFLICT (slug) DO NOTHING;
*/

-- ============================================================
-- STEP 4: Create helper function for importing static data
-- ============================================================

-- Function to import trip data safely with conflict resolution
CREATE OR REPLACE FUNCTION import_trip_data(
    p_type TEXT,
    p_title TEXT,
    p_slug TEXT,
    p_description TEXT,
    p_duration INTEGER DEFAULT 1,
    p_price DECIMAL DEFAULT 0,
    p_currency TEXT DEFAULT 'USD',
    p_image TEXT DEFAULT NULL,
    p_rating DECIMAL DEFAULT 4.5,
    p_reviews INTEGER DEFAULT 0,
    p_highlights TEXT[] DEFAULT '{}',
    p_included TEXT[] DEFAULT '{}',
    p_excluded TEXT[] DEFAULT '{}',
    p_best_seller BOOLEAN DEFAULT false
) RETURNS UUID AS $$
DECLARE
    trip_id UUID;
BEGIN
    INSERT INTO public.trips (
        type, title, slug, description, duration, price, currency,
        image, rating, reviews, highlights, included, excluded,
        best_seller, is_published, travel_style
    ) VALUES (
        p_type, p_title, p_slug, p_description, p_duration, p_price, p_currency,
        p_image, p_rating, p_reviews, p_highlights, p_included, p_excluded,
        p_best_seller, true, 
        CASE 
            WHEN p_type = 'day_tour' THEN 'Cultural & Historical'
            WHEN p_type = 'nile_cruise' THEN 'Luxury'
            WHEN p_type = 'short_excursion' THEN 'Adventure'
            ELSE 'Budget'
        END
    ) ON CONFLICT (slug) DO UPDATE SET
        type = EXCLUDED.type,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        duration = EXCLUDED.duration,
        price = EXCLUDED.price,
        updated_at = NOW()
    RETURNING id INTO trip_id;
    
    RETURN trip_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SUCCESS! Next steps:
-- 1. Run Node.js script to import static data using import_trip_data()
-- 2. Update AdminTrips component to handle type field
-- 3. Test the unified system
-- ============================================================

-- Grant usage on the function
GRANT EXECUTE ON FUNCTION import_trip_data TO authenticated, anon;