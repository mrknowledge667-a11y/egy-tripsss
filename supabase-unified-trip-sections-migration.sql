-- ============================================================
-- Egypt Travel Pro — Unified Trips Section/Category/Subcategory
-- Adds strict category/subcategory integrity and one RPC move op.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Canonical categories table (section-level)
CREATE TABLE IF NOT EXISTS public.trip_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  section_key TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Canonical subcategories table (must belong to a category)
CREATE TABLE IF NOT EXISTS public.trip_subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.trip_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug),
  UNIQUE(category_id, name)
);

CREATE INDEX IF NOT EXISTS idx_trip_subcategories_category ON public.trip_subcategories(category_id, sort_order, id);

-- 3) Trips gain explicit category/subcategory references
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS category_id UUID,
  ADD COLUMN IF NOT EXISTS subcategory_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_category_id_fk'
      AND conrelid = 'public.trips'::regclass
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_category_id_fk
      FOREIGN KEY (category_id)
      REFERENCES public.trip_categories(id)
      ON DELETE RESTRICT;
  END IF;
END
$$;

-- Needed for composite FK validation (subcategory must belong to trip.category_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trip_subcategories_category_id_id_uq'
      AND conrelid = 'public.trip_subcategories'::regclass
  ) THEN
    ALTER TABLE public.trip_subcategories
      ADD CONSTRAINT trip_subcategories_category_id_id_uq
      UNIQUE (category_id, id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_subcategory_belongs_to_category_fk'
      AND conrelid = 'public.trips'::regclass
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_subcategory_belongs_to_category_fk
      FOREIGN KEY (category_id, subcategory_id)
      REFERENCES public.trip_subcategories(category_id, id)
      ON DELETE RESTRICT
      DEFERRABLE INITIALLY IMMEDIATE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trips_subcategory_requires_category_ck'
      AND conrelid = 'public.trips'::regclass
  ) THEN
    ALTER TABLE public.trips
      ADD CONSTRAINT trips_subcategory_requires_category_ck
      CHECK (subcategory_id IS NULL OR category_id IS NOT NULL);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_trips_category_id ON public.trips(category_id);
CREATE INDEX IF NOT EXISTS idx_trips_subcategory_id ON public.trips(subcategory_id);

-- 4) Destination-list ordering support
ALTER TABLE public.trip_destinations
  ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Backfill contiguous ordering per destination (stable by existing id)
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY destination_id ORDER BY COALESCE(sort_order, 2147483647), id) - 1 AS rn
  FROM public.trip_destinations
)
UPDATE public.trip_destinations td
SET sort_order = ranked.rn
FROM ranked
WHERE td.id = ranked.id;

UPDATE public.trip_destinations
SET sort_order = 0
WHERE sort_order IS NULL;

ALTER TABLE public.trip_destinations
  ALTER COLUMN sort_order SET DEFAULT 0,
  ALTER COLUMN sort_order SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_trip_destinations_destination_sort
  ON public.trip_destinations(destination_id, sort_order, trip_id);

-- 5) Keep updated_at managed for new tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_updated_at_trip_categories'
  ) THEN
    CREATE TRIGGER set_updated_at_trip_categories
      BEFORE UPDATE ON public.trip_categories
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_updated_at_trip_subcategories'
  ) THEN
    CREATE TRIGGER set_updated_at_trip_subcategories
      BEFORE UPDATE ON public.trip_subcategories
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END
$$;

-- 6) Seed categories from current travel_style values (idempotent)
INSERT INTO public.trip_categories (name, section_key, slug, sort_order)
SELECT DISTINCT
  TRIM(travel_style) AS name,
  TRIM(travel_style) AS section_key,
  LOWER(REGEXP_REPLACE(TRIM(travel_style), '[^a-zA-Z0-9]+', '-', 'g')) AS slug,
  ROW_NUMBER() OVER (ORDER BY TRIM(travel_style)) - 1 AS sort_order
FROM public.trips
WHERE TRIM(COALESCE(travel_style, '')) <> ''
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.trip_categories (name, section_key, slug, sort_order)
VALUES ('Uncategorized', 'Uncategorized', 'uncategorized', 9999)
ON CONFLICT (section_key) DO NOTHING;

UPDATE public.trips t
SET category_id = c.id
FROM public.trip_categories c
WHERE c.section_key = TRIM(COALESCE(t.travel_style, ''))
  AND t.category_id IS NULL;

UPDATE public.trips t
SET category_id = c.id
FROM public.trip_categories c
WHERE c.section_key = 'Uncategorized'
  AND t.category_id IS NULL;

-- 7) Unified move operation (single transaction)
CREATE OR REPLACE FUNCTION public.move_trip_section(
  p_trip_id UUID,
  p_section_key TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_subcategory_id UUID DEFAULT NULL,
  p_destination_id UUID DEFAULT NULL
)
RETURNS TABLE (
  trip_id UUID,
  category_id UUID,
  subcategory_id UUID,
  section_key TEXT,
  destination_id UUID,
  destination_sort_order INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trip RECORD;
  v_category_id UUID;
  v_section_key TEXT;
  v_subcategory_category_id UUID;
  v_destination_id UUID;
BEGIN
  SELECT *
  INTO v_trip
  FROM public.trips
  WHERE id = p_trip_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'move_trip_section: trip % not found', p_trip_id
      USING ERRCODE = 'P0001';
  END IF;

  -- Resolve target category by explicit category_id or section_key.
  IF p_category_id IS NOT NULL THEN
    SELECT c.id, c.section_key
    INTO v_category_id, v_section_key
    FROM public.trip_categories c
    WHERE c.id = p_category_id
      AND c.is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'move_trip_section: category % not found/inactive', p_category_id
        USING ERRCODE = 'P0001';
    END IF;
  ELSIF p_section_key IS NOT NULL THEN
    SELECT c.id, c.section_key
    INTO v_category_id, v_section_key
    FROM public.trip_categories c
    WHERE c.section_key = p_section_key
      AND c.is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'move_trip_section: section_key % not found/inactive', p_section_key
        USING ERRCODE = 'P0001';
    END IF;
  ELSE
    v_category_id := v_trip.category_id;

    IF v_category_id IS NULL THEN
      RAISE EXCEPTION 'move_trip_section: no target category (category_id or section_key required)'
        USING ERRCODE = 'P0001';
    END IF;

    SELECT c.section_key
    INTO v_section_key
    FROM public.trip_categories c
    WHERE c.id = v_category_id;
  END IF;

  -- Validate subcategory mapping when provided.
  IF p_subcategory_id IS NOT NULL THEN
    SELECT s.category_id
    INTO v_subcategory_category_id
    FROM public.trip_subcategories s
    WHERE s.id = p_subcategory_id
      AND s.is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'move_trip_section: subcategory % not found/inactive', p_subcategory_id
        USING ERRCODE = 'P0001';
    END IF;

    IF v_subcategory_category_id <> v_category_id THEN
      RAISE EXCEPTION 'move_trip_section: subcategory % does not belong to category %', p_subcategory_id, v_category_id
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- Resolve destination for ordering.
  v_destination_id := p_destination_id;

  IF v_destination_id IS NULL THEN
    SELECT td.destination_id
    INTO v_destination_id
    FROM public.trip_destinations td
    WHERE td.trip_id = p_trip_id
    ORDER BY td.sort_order ASC, td.id ASC
    LIMIT 1;
  END IF;

  IF v_destination_id IS NOT NULL THEN
    PERFORM 1
    FROM public.destinations d
    WHERE d.id = v_destination_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'move_trip_section: destination % not found', v_destination_id
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- Update trip section/category/subcategory atomically.
  UPDATE public.trips t
  SET category_id = v_category_id,
      subcategory_id = p_subcategory_id,
      travel_style = COALESCE(v_section_key, t.travel_style),
      updated_at = NOW()
  WHERE t.id = p_trip_id;

  -- Reorder within destination so moved trip appears first.
  IF v_destination_id IS NOT NULL THEN
    UPDATE public.trip_destinations td
    SET sort_order = td.sort_order + 1
    WHERE td.destination_id = v_destination_id
      AND td.trip_id <> p_trip_id;

    INSERT INTO public.trip_destinations (trip_id, destination_id, sort_order)
    VALUES (p_trip_id, v_destination_id, 0)
    ON CONFLICT (trip_id, destination_id)
    DO UPDATE SET sort_order = 0;
  END IF;

  RETURN QUERY
  SELECT
    p_trip_id,
    v_category_id,
    p_subcategory_id,
    v_section_key,
    v_destination_id,
    CASE WHEN v_destination_id IS NULL THEN NULL ELSE 0 END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.move_trip_section(UUID, TEXT, UUID, UUID, UUID) TO authenticated, service_role;

COMMENT ON FUNCTION public.move_trip_section(UUID, TEXT, UUID, UUID, UUID)
IS 'Moves trip to a new section/category/subcategory in one transaction and promotes it to top of destination list.';
