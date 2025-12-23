-- ============================================
-- Step 1: Add image_url column to threads table
-- ============================================
ALTER TABLE threads ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================
-- Step 2: Add image_url column to comments table (optional - if you want images in comments too)
-- ============================================
ALTER TABLE comments ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================
-- Step 3: Create Storage Bucket (Do this manually in Supabase Dashboard)
-- ============================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "Create bucket"
-- 3. Name: thread-images
-- 4. Make it public: Yes
-- 5. Create bucket

-- ============================================
-- Step 4: Set up RLS Policies for Storage
-- ============================================

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'thread-images');

-- Allow anyone to view images (public bucket)
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'thread-images');

-- Users can delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'thread-images' AND owner = auth.uid());

-- Users can update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'thread-images' AND owner = auth.uid());
