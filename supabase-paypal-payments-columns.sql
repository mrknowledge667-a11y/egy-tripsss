-- ============================================================
-- Egypt Travel Pro - PayPal Payments Columns
-- Create payments table if missing, then add PayPal tracking columns (safe/idempotent)
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  paymob_order_id TEXT,
  paymob_transaction_id TEXT,
  paypal_order_id TEXT,
  paypal_capture_id TEXT,
  amount_usd NUMERIC(12,2) DEFAULT 0,
  amount_egp NUMERIC(12,2),
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  customer_email TEXT,
  payment_provider TEXT,
  payment_method TEXT,
  payment_sub_type TEXT,
  car_name TEXT,
  car_id TEXT,
  route_from TEXT,
  route_to TEXT,
  distance_km NUMERIC(12,2),
  transfer_date DATE,
  transfer_time TEXT,
  passengers INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_capture_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_provider TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_payments_stripe_session_id ON public.payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_paymob_order_id ON public.payments(paymob_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_paypal_order_id ON public.payments(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_provider ON public.payments(payment_provider);

COMMIT;
