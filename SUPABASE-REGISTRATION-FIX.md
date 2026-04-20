# Supabase Registration Fix - Enable Unlimited Accounts

## 🎯 Issue
Users cannot register due to Supabase rate limits and email confirmation requirements.

## 🔧 Solution: Configure Supabase Settings

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `raoahenfotwbcmrrhdsa`

### Step 2: Disable Email Confirmation (For Testing)
1. Navigate to **Authentication** → **Settings**
2. Find **"Email Confirmation"** section
3. **Uncheck** "Enable email confirmations"
4. Click **Save**

⚠️ **Note**: This allows immediate login without email verification. Re-enable for production.

### Step 3: Increase Rate Limits
1. In **Authentication** → **Settings**
2. Scroll to **"Rate Limits"** section
3. Increase these values:
   - **Signups per hour**: `1000` (default: 30)
   - **Email sends per hour**: `1000` (default: 30)
   - **Password resets per hour**: `1000` (default: 30)
4. Click **Save**

### Step 4: Configure Site URL & Redirect URLs
1. In **Authentication** → **Settings**
2. Set **"Site URL"**: `http://localhost:5173` (for development)
3. Add **"Redirect URLs"**:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:4173/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)
4. Click **Save**

### Step 5: Enable Auto-Confirm Users (Optional)
1. Go to **Authentication** → **Settings**
2. Find **"User Signups"** section
3. Check **"Enable automatic account creation"**
4. Optionally disable **"Double confirm password changes"**
5. Click **Save**

### Step 6: Configure Email Settings
1. Navigate to **Authentication** → **Email Templates**
2. For **"Confirm signup"** template:
   - Set **Confirmation URL**: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`
3. For **"Reset password"** template:
   - Set **Reset URL**: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery`
4. Click **Save** for each template

### Step 7: Database User Management
1. Go to **Authentication** → **Users**
2. You can manually delete test users if needed
3. No user limit on Supabase free tier (up to 50,000 MAU)

## 🚀 Alternative: Skip Email Confirmation Completely

If you want unlimited registrations without any email verification:

### Option A: Supabase Dashboard
1. **Authentication** → **Settings**
2. Uncheck **"Enable email confirmations"**
3. Set **"Minimum password length"**: `6`
4. **Save**

### Option B: SQL Query (Advanced)
Run this in **SQL Editor** to auto-confirm all new users:
```sql
-- Auto-confirm new user signups
CREATE OR REPLACE FUNCTION auto_confirm_users()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_confirm_users_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auto_confirm_users();
```

## ✅ Test Registration

1. Try registering with a new email
2. Check **Authentication** → **Users** in Supabase dashboard
3. User should appear immediately

## 🔧 Code Changes Made

Updated `AuthContext.jsx` to:
- Better error handling
- Improved email redirect configuration
- Enhanced debugging information

## 📞 Quick Fix Commands

If you have Supabase CLI installed:
```bash
supabase auth update --site-url="http://localhost:5173"
supabase auth update --enable-signup=true
```

## 🆘 Still Having Issues?

1. **Check browser console** for error messages
2. **Verify environment variables** in `.env` file
3. **Check Supabase logs** in dashboard
4. **Temporary workaround**: Create users manually in Supabase dashboard

---

After making these changes, registration should work unlimited without restrictions! 🎉