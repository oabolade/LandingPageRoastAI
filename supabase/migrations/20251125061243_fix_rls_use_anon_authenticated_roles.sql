/*
  # Fix RLS Policies to Use Explicit Anon and Authenticated Roles

  1. Problem
    - PostgreSQL "public" pseudo-role may not work correctly with Supabase's anon key
    - Need to explicitly grant to both anon and authenticated roles
  
  2. Changes
    - Drop existing public policies on both tables
    - Create new policies explicitly for anon role
    - Create new policies explicitly for authenticated role
    - This ensures both unauthenticated (anon) and authenticated users can access
  
  3. Security
    - Same security level as before (all users can access)
    - Ensures compatibility with Supabase's JWT-based authentication system
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public insert on email_captures" ON email_captures;
DROP POLICY IF EXISTS "Allow public insert on roasts" ON roasts;
DROP POLICY IF EXISTS "Allow public read on roasts" ON roasts;
DROP POLICY IF EXISTS "Allow public update on roasts email captured flag" ON roasts;

-- Roasts table policies for ANON role
CREATE POLICY "Allow anon insert on roasts"
  ON roasts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon read on roasts"
  ON roasts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon update on roasts"
  ON roasts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Roasts table policies for AUTHENTICATED role
CREATE POLICY "Allow authenticated insert on roasts"
  ON roasts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on roasts"
  ON roasts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update on roasts"
  ON roasts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Email captures policies for ANON role
CREATE POLICY "Allow anon insert on email_captures"
  ON email_captures
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Email captures policies for AUTHENTICATED role
CREATE POLICY "Allow authenticated insert on email_captures"
  ON email_captures
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
