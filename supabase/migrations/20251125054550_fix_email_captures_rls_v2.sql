/*
  # Fix Email Captures RLS Policy V2

  1. Changes
    - Drop and recreate the email_captures INSERT policy with explicit PUBLIC role
    - This ensures anonymous users can insert email captures
  
  2. Security
    - Allow all authenticated and anonymous users to insert email captures
    - This is safe because the roast_id must reference an existing roast
*/

DROP POLICY IF EXISTS "Allow public insert on email_captures" ON email_captures;

CREATE POLICY "Allow public insert on email_captures"
  ON email_captures
  FOR INSERT
  TO public
  WITH CHECK (true);
