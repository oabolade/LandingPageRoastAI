/*
  # Add Storage Policies for Landing Page Screenshots

  1. Storage Policies
    - Allow public (anon) users to upload screenshots to the `landing-page-screenshots` bucket
    - Allow public read access to all screenshots (bucket is already public)
  
  This enables users to upload screenshots without authentication, which is required
  for the roast functionality to work properly.
*/

CREATE POLICY "Allow public uploads to landing-page-screenshots"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'landing-page-screenshots');

CREATE POLICY "Allow public reads from landing-page-screenshots"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'landing-page-screenshots');
