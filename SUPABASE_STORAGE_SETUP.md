# Supabase Storage Setup Guide

## Fixing Photo Upload Issues in Admin Panel

### 1. Create the Images Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure:
   - Bucket name: `images`
   - Public bucket: ✅ Enable (check the box)
   - File size limit: 5MB (or your preference)
   - Allowed MIME types: `image/*`
5. Click **Create bucket**

### 2. Configure Bucket Policies (RLS)

For the `images` bucket to work properly, you need to set up Row Level Security (RLS) policies.

1. In Storage, click on the `images` bucket
2. Go to **Policies** tab
3. Create the following policies:

#### Policy 1: Public Read Access
```sql
-- Allow public to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
```

#### Policy 2: Authenticated Upload/Update/Delete
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated USING (bucket_id = 'images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');
```

### 3. Check Authentication

Make sure admin users are properly authenticated:

1. Check if admin login is working
2. Verify the session token is being sent with requests
3. Check browser console for any authentication errors

### 4. Environment Variables

Verify your `.env` or `.env.local` file has correct values:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Common Issues & Solutions

#### Issue: "Storage bucket 'images' not found"
**Solution**: Create the bucket as described in step 1

#### Issue: "row-level security" error
**Solution**: Add the policies from step 2

#### Issue: "unauthorized" error
**Solution**: Ensure you're logged in as admin

#### Issue: "quota exceeded"
**Solution**: Check your Supabase plan storage limits

#### Issue: File doesn't upload but no error shown
**Solution**: 
- Check browser console for errors
- Verify file size is under 5MB
- Ensure file type is JPEG, PNG, WebP, or GIF

### 6. Testing the Fix

1. Log into the admin panel
2. Go to Packages section
3. Try uploading an image:
   - Main image upload
   - Gallery images upload
4. Check browser console for detailed logs
5. If successful, you'll see a green toast notification

### 7. Direct Bucket Access (Alternative)

If RLS policies are complex, you can temporarily make the bucket fully public for testing:

1. Go to Storage → images bucket
2. Click on **Policies**
3. Toggle "RLS enabled" to OFF (temporary only!)
4. Test uploads
5. **Important**: Re-enable RLS after fixing the issue

### 8. Debugging Tips

The updated code now provides:
- File validation (size & type)
- Detailed error messages
- Storage bucket existence check
- Better error handling for common issues

Check the browser console for detailed logs including:
- File details (name, size, type)
- Upload path
- Specific error messages
- Success confirmations