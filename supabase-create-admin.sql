-- ============================================================
-- Egypt Travel Pro — Create Admin User
-- Run this in Supabase SQL Editor AFTER migration + seed
-- ============================================================
-- 
-- ⚠️ CHANGE the email and password below before running!
--
-- This creates a confirmed user that can log into /admin/login
-- ============================================================

-- Method: Insert directly into auth.users
-- Change 'admin@egypttravelpro.com' and 'Admin123456!' to your desired credentials

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@egypttravelpro.com',                    -- ← CHANGE THIS EMAIL
  crypt('Admin123456!', gen_salt('bf')),          -- ← CHANGE THIS PASSWORD
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Also create the identity record (required for login to work)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'admin@egypttravelpro.com'),
  jsonb_build_object('sub', (SELECT id::text FROM auth.users WHERE email = 'admin@egypttravelpro.com'), 'email', 'admin@egypttravelpro.com'),
  'email',
  (SELECT id::text FROM auth.users WHERE email = 'admin@egypttravelpro.com'),
  now(),
  now(),
  now()
);

-- ============================================================
-- ✅ Done! You can now log in at /admin/login with:
--    Email:    admin@egypttravelpro.com
--    Password: Admin123456!
-- ============================================================