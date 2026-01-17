-- Run this script to enable Image Uploads if you have already set up the tables.

-- 1. Create the storage bucket 'collabx-assets'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('collabx-assets', 'collabx-assets', true) 
ON CONFLICT (id) DO NOTHING;

-- 2. Create Security Policies for Storage
-- Note: If you see existing policy errors, it means they are already set, which is fine.

-- Allow public to see the images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'collabx-assets' );

-- Allow admin to upload new images
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'collabx-assets' );

-- Allow admin to update images
CREATE POLICY "Admin Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'collabx-assets' );

-- Allow admin to delete images
CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'collabx-assets' );
