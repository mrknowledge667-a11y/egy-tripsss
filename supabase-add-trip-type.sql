-- ============================================================
-- Egypt Travel Pro — Add Trip Type Field for Unified System
-- Run this in Supabase SQL Editor to add type field to existing trips table
-- ============================================================

-- Add type field to existing trips table
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'package' 
CHECK (type IN ('package', 'day_tour', 'nile_cruise', 'short_excursion'));

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_trips_type ON public.trips(type);

-- Add additional fields commonly used across all trip types
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS excluded TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS best_seller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS locations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS group_size TEXT,
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['English'],
ADD COLUMN IF NOT EXISTS start_point TEXT DEFAULT 'Cairo',
ADD COLUMN IF NOT EXISTS end_point TEXT DEFAULT 'Cairo',
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS duration_text TEXT, -- "3 Days / 2 Nights"
ADD COLUMN IF NOT EXISTS tour_type TEXT DEFAULT 'Cultural & Historical';

-- Update existing trips to have type 'package' if they came from packages table
-- (This will be handled in the data migration script)

-- ============================================================
-- SUCCESS! Run the data migration script next.
-- ============================================================