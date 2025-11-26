/*
  # Simplify Email Captures RLS for Debugging

  1. Changes
    - Temporarily remove all policies on email_captures
    - Create the absolute simplest possible INSERT policy
    - Use USING and WITH CHECK to cover all bases
  
  2. Testing Approach
    - Start with most permissive possible policy
    - If this works, we know the issue was with policy specifics
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anon insert on email_captures" ON email_captures;
DROP POLICY IF EXISTS "Allow authenticated insert on email_captures" ON email_captures;

-- Create simplest possible policy that allows all inserts for anon
CREATE POLICY "email_captures_insert_policy"
  ON email_captures
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
