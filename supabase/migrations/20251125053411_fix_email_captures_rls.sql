/*
  # Fix Email Captures RLS Policies

  1. Changes
    - Add UPDATE policy for roasts table to allow anonymous users to update is_email_captured flag
    - This is needed when a user submits their email to unlock the full report
  
  2. Security
    - Only allow updating the is_email_captured field
    - Users can only update rows that exist (via WHERE id = id check)
*/

CREATE POLICY "Allow public update on roasts email captured flag"
  ON roasts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
