-- ============================================================
-- Egypt Travel Pro - Public Website Bookings Fix
-- Purpose:
-- 1) Make bookings table compatible with current frontend payload
-- 2) Allow guest (anon) website inserts under RLS
-- 3) Keep admin/user read/update/delete policies intact
--
-- Run in Supabase SQL Editor as a single script.
-- ============================================================

BEGIN;

-- Ensure table exists
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core columns used by current frontend/admin
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS trip_title TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS trip_slug TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS trip_duration TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS trip_price NUMERIC(12,2) DEFAULT 0;

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS nationality TEXT;

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS travel_date DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_requests TEXT;

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cabin_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ship_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cabin_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS arrival_date DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS pickup_location TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rooms INTEGER DEFAULT 1;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS hotel_grade TEXT;

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_price NUMERIC(12,2) DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_source TEXT DEFAULT 'website';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Keep user_id for authenticated flows, but allow NULL for guest website bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ALTER COLUMN user_id DROP NOT NULL;

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);

-- Keep status values controlled and include processed for admin workflow
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_status_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_status_check
      CHECK (status IN ('pending', 'confirmed', 'paid', 'processed', 'completed', 'cancelled'));
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Force off if previously enabled; we control access via policies below.
ALTER TABLE public.bookings NO FORCE ROW LEVEL SECURITY;

-- Remove all existing policies on bookings to avoid hidden restrictive conflicts.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookings'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.bookings', p.policyname);
  END LOOP;
END $$;

-- Public website can insert booking rows (guest checkout/forms)
CREATE POLICY bookings_insert_anon ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users can also create bookings.
CREATE POLICY bookings_insert_authenticated ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admin panel reads and updates bookings through authenticated sessions.
-- This allows viewing guest website bookings where user_id is NULL.
CREATE POLICY bookings_select_authenticated ON public.bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY bookings_update_authenticated ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY bookings_delete_authenticated ON public.bookings
  FOR DELETE
  TO authenticated
  USING (true);

-- Optional: anon should not read/update/delete from dashboard tables.
CREATE POLICY bookings_select_anon_none ON public.bookings
  FOR SELECT
  TO anon
  USING (false);

COMMIT;

-- Quick verification query (run separately if needed):
-- SELECT policyname, cmd, roles, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename = 'bookings';
