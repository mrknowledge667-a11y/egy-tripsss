-- 002 payments, bookings, transfer_bookings (idempotent, non-destructive)

DO $b$
BEGIN
  CREATE TYPE public.payment_status_enum AS ENUM (
    'pending', 'completed', 'failed', 'expired', 'refunded', 'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$b$;

DO $b$
BEGIN
  CREATE TYPE public.payment_provider_enum AS ENUM (
    'stripe', 'paymob', 'paypal', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$b$;

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paymob_order_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS amount_sar NUMERIC(12, 2);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS amount_local NUMERIC(12, 2);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS amount_egp NUMERIC(12, 2);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_provider TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS merchant_order_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_sub_type TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paymob_transaction_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS car_name TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS car_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS route_from TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS route_to TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS distance_km INTEGER DEFAULT 0;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS transfer_date TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS transfer_time TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS passengers INTEGER DEFAULT 1;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL;

DO $b$
BEGIN
  ALTER TABLE public.payments ALTER COLUMN currency SET DEFAULT 'SAR';
EXCEPTION
  WHEN undefined_column THEN NULL;
END
$b$;

DO $b$
BEGIN
  ALTER TABLE public.payments ADD CONSTRAINT payments_paypal_order_id_key UNIQUE (paypal_order_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$b$;

DO $b$
BEGIN
  ALTER TABLE public.payments ADD CONSTRAINT payments_paymob_order_id_key UNIQUE (paymob_order_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$b$;

DO $b$
BEGIN
  ALTER TABLE public.payments ADD CONSTRAINT payments_stripe_session_id_key UNIQUE (stripe_session_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$b$;

CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments (created_at DESC);

DO $b$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'bookings'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_price_sar NUMERIC(12, 2);
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS amount_local NUMERIC(12, 2);
    EXECUTE $e$ ALTER TABLE public.bookings ALTER COLUMN currency SET DEFAULT 'SAR' $e$;
  END IF;
END
$b$;

CREATE TABLE IF NOT EXISTS public.transfer_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_date TEXT,
  pickup_time TEXT,
  route_from TEXT,
  route_to TEXT,
  route_label TEXT,
  transfer_type TEXT,
  distance_km NUMERIC(12, 2) DEFAULT 0,
  vehicle_id TEXT,
  vehicle_name TEXT,
  vehicle_price_usd NUMERIC(12, 2),
  currency TEXT DEFAULT 'SAR',
  vehicle_price_sar NUMERIC(12, 2),
  amount_sar NUMERIC(12, 2),
  amount_local NUMERIC(12, 2),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  flight_number TEXT,
  special_requests TEXT,
  passengers INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'SAR';
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS vehicle_price_sar NUMERIC(12, 2);
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS amount_sar NUMERIC(12, 2);
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS amount_local NUMERIC(12, 2);

ALTER TABLE public.transfer_bookings ALTER COLUMN currency SET DEFAULT 'SAR';

CREATE INDEX IF NOT EXISTS idx_transfer_bookings_email ON public.transfer_bookings (email);
CREATE INDEX IF NOT EXISTS idx_transfer_bookings_status ON public.transfer_bookings (status);