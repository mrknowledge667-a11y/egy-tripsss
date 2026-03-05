# 🔐 Supabase Authentication Setup Guide

Complete guide to set up authentication for Egypt Travel Pro

---

## 📋 Prerequisites

- Supabase account and project created
- Project URL and ANON key already in `.env` file
- Access to Supabase Dashboard

---

## 🚀 Step-by-Step Setup

### Step 1: Run the Main Database Migration (if not done already)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `Egypt Travel Pro`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `supabase-migration.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Ctrl/Cmd + Enter)
8. Wait for "Success. No rows returned" message

---

### Step 2: Run the Authentication Migration

1. Still in **SQL Editor**, click **New Query**
2. Copy the contents of `supabase-auth-migration.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. Verify success - you should see tables created:
   - `user_profiles`
   - `bookings`
   - `wishlist`
   - `reviews`

---

### Step 3: Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Email** provider
3. Enable it by toggling the switch ON
4. Configure settings:
   - ✅ Enable email provider
   - ✅ Confirm email (recommended for production)
   - ⚠️ For testing, you can disable "Confirm email" temporarily

---

### Step 4: Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Email Templates**
2. Customize templates:
   - **Confirm signup**: Email sent when user signs up
   - **Magic Link**: For passwordless login
   - **Change Email Address**: When user updates email
   - **Reset Password**: For password recovery

**Example customization for Confirm Signup:**

```html
<h2>Welcome to Egypt Travel Pro! 🏜️</h2>
<p>Thank you for joining us. Click the link below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

---

### Step 5: Configure Authentication Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:5173` (for development)
3. Add **Redirect URLs**:
   - `http://localhost:5173/**`
   - `https://yourdomain.com/**` (for production)

---

### Step 6: Set Up Password Requirements (Optional)

1. Go to **Authentication** → **Policies**
2. Configure:
   - Minimum password length: `6` (or higher for production)
   - Password strength: `Fair` or `Good`
   - Enable/disable special characters requirement

---

### Step 7: Test Authentication Flow

#### A. Test Sign Up

1. Go to your local app: `http://localhost:5173`
2. Click **Sign Up** in navbar
3. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123456!`
   - Confirm Password: `Test123456!`
4. Click **Create Account**
5. Check success message

#### B. Verify User Created

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. You should see your new user listed
3. Check **Email Confirmed** status:
   - If "Confirm email" is disabled: ✅ Auto-confirmed
   - If enabled: Check your email inbox for confirmation link

#### C. Test Sign In

1. Go to `/signin` page
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `Test123456!`
3. Click **Sign In**
4. You should be redirected to home page
5. Check navbar - you should see:
   - User avatar with first letter
   - Username dropdown

#### D. Test User Menu

1. Click on your user avatar in navbar
2. Verify dropdown shows:
   - My Profile
   - My Bookings
   - Sign Out button
3. Click **Sign Out**
4. Verify you're logged out (Sign In/Sign Up buttons appear)

---

### Step 8: Verify Database Tables

Check that the trigger created a user profile automatically:

1. Go to **Table Editor** in Supabase
2. Find `user_profiles` table
3. You should see a row with:
   - `id`: matches your user ID from auth.users
   - `full_name`: extracted from signup form or email
   - `created_at`: timestamp

---

### Step 9: Enable Social Login (Optional)

#### Google OAuth

1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Get credentials from [Google Cloud Console](https://console.cloud.google.com/):
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase
5. Save

#### Facebook OAuth

1. Go to **Authentication** → **Providers** → **Facebook**
2. Enable Facebook provider
3. Get credentials from [Facebook Developers](https://developers.facebook.com/):
   - Create Facebook App
   - Add Facebook Login product
   - Add redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy App ID and App Secret to Supabase
5. Save

---

### Step 10: Set Up Row Level Security Verification

Test that RLS policies are working correctly:

#### Test User Profile Access

```sql
-- Run in SQL Editor (as authenticated user)
SELECT * FROM user_profiles WHERE id = auth.uid();
```

Should return your profile.

#### Test Bookings Access

```sql
-- Should only see your own bookings
SELECT * FROM bookings WHERE user_id = auth.uid();
```

#### Test Wishlist Access

```sql
-- Should only see your own wishlist
SELECT * FROM wishlist WHERE user_id = auth.uid();
```

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Enable email confirmation
- [ ] Set strong password requirements (min 8 characters)
- [ ] Configure custom email templates with your branding
- [ ] Set up custom SMTP (optional, for better deliverability)
- [ ] Add production domain to Redirect URLs
- [ ] Set up Social OAuth providers (if needed)
- [ ] Test all auth flows on staging environment
- [ ] Set up email rate limiting
- [ ] Configure session timeout settings
- [ ] Enable 2FA (optional, in Supabase settings)

---

## 🔧 Troubleshooting

### Issue: "User not found" after signup

**Solution:** Check if email confirmation is required. Either:
- Manually confirm user in Dashboard → Authentication → Users
- Or disable email confirmation in settings

### Issue: RLS policies blocking access

**Solution:** Check policies in SQL Editor:
```sql
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

### Issue: Profile not auto-created

**Solution:** Verify trigger is active:
```sql
SELECT * FROM information_schema.triggers 
WHERE event_object_table = 'users';
```

Re-create trigger if needed (run from `supabase-auth-migration.sql`)

### Issue: Can't sign in after signup

**Solution:** 
1. Check if user exists in Authentication → Users
2. Verify email is confirmed
3. Check browser console for errors
4. Verify `.env` file has correct Supabase credentials

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Social Login Setup](https://supabase.com/docs/guides/auth/social-login)

---

## ✅ Verification Complete

Once all steps are done, your authentication system should be fully functional with:

- ✅ User signup with email/password
- ✅ Email confirmation (if enabled)
- ✅ User signin
- ✅ Auto-created user profiles
- ✅ Row Level Security for data protection
- ✅ User menu in navbar
- ✅ Bookings and wishlist tables ready
- ✅ Reviews system ready

---

**Need help?** Check the troubleshooting section or contact support.