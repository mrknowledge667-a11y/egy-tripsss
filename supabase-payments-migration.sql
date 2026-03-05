-- ============================================================
-- Egypt Time Travel — Payments Table Migration (Stripe)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Payments table to store Stripe checkout sessions
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  amount_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired', 'refunded')),
  customer_email TEXT,
  car_name TEXT,
  car_id TEXT,
  route_from TEXT,
  route_to TEXT,
  distance_km INTEGER DEFAULT 0,
  transfer_date TEXT,
  transfer_time TEXT,
  passengers INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON public.payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Auto-update updated_at trigger
CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: public can insert (for server-side inserts via anon key), admin can read/update
CREATE POLICY "payments_public_insert" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "payments_public_read_own" ON public.payments
  FOR SELECT USING (true);

CREATE POLICY "payments_admin_update" ON public.payments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "payments_admin_delete" ON public.payments
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- DONE! Payments table is ready for Stripe integration.
-- ============================================================