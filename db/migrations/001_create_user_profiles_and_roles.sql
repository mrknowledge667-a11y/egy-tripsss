-- 001 user profiles and roles (idempotent)

DO $do$
BEGIN
  CREATE TYPE public.user_role_enum AS ENUM ('user', 'admin', 'staff');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$do$;

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE
);

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS role public.user_role_enum NOT NULL DEFAULT 'user'::public.user_role_enum;

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles (role);