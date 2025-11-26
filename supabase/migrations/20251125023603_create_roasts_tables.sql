/*
  # Create Roasts and Email Captures Tables

  1. New Tables
    - `roasts`
      - `id` (uuid, primary key) - Unique identifier for each roast
      - `created_at` (timestamptz) - When the roast was created
      - `url` (text, nullable) - The landing page URL that was analyzed (if provided)
      - `screenshot_url` (text) - Public URL of the screenshot stored in Supabase storage
      - `partial_roast` (text) - The teaser roast shown before email capture
      - `full_roast` (jsonb) - Complete detailed analysis with grades and recommendations
      - `grade` (text) - Overall grade from F to A+
      - `is_email_captured` (boolean) - Whether user has provided email for full audit
    
    - `email_captures`
      - `id` (uuid, primary key) - Unique identifier for each email capture
      - `created_at` (timestamptz) - When the email was captured
      - `email` (text) - User's email address
      - `roast_id` (uuid, foreign key) - Reference to the roast they want full audit for
      - `has_received_full_audit` (boolean) - Whether they've received the full audit
  
  2. Storage
    - Create `landing-page-screenshots` bucket for storing uploaded and captured screenshots
  
  3. Security
    - Enable RLS on both tables
    - Allow public inserts on `roasts` (users can submit landing pages)
    - Allow public inserts on `email_captures` (users can capture emails)
    - Allow public reads on `roasts` by ID (users can view their specific roast)
  
  4. Indexes
    - Add index on `roasts.created_at` for efficient querying
    - Add index on `email_captures.roast_id` for lookups
*/

CREATE TABLE IF NOT EXISTS roasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  url text,
  screenshot_url text NOT NULL,
  partial_roast text NOT NULL,
  full_roast jsonb NOT NULL,
  grade text NOT NULL,
  is_email_captured boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS email_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  roast_id uuid NOT NULL REFERENCES roasts(id) ON DELETE CASCADE,
  has_received_full_audit boolean DEFAULT false
);

ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on roasts"
  ON roasts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read on roasts"
  ON roasts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert on email_captures"
  ON email_captures
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_roasts_created_at ON roasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_captures_roast_id ON email_captures(roast_id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-page-screenshots', 'landing-page-screenshots', true)
ON CONFLICT (id) DO NOTHING;
