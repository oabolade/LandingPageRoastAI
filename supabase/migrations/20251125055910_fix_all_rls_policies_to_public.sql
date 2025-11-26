/*
  # Fix All RLS Policies to Use Public Role

  1. Changes
    - Update all roasts table policies from anon to public for consistency
    - This ensures email_captures foreign key checks work properly
    - Public role includes both anon and authenticated users
  
  2. Security
    - Same security level as before (all users can access)
    - Ensures foreign key constraint checks work with RLS enabled
*/

DROP POLICY IF EXISTS "Allow public insert on roasts" ON roasts;
DROP POLICY IF EXISTS "Allow public read on roasts" ON roasts;
DROP POLICY IF EXISTS "Allow public update on roasts email captured flag" ON roasts;

CREATE POLICY "Allow public insert on roasts"
  ON roasts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read on roasts"
  ON roasts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public update on roasts email captured flag"
  ON roasts
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
