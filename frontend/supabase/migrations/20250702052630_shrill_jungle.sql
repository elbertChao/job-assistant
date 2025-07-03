/*
  # Fix signup trigger RLS issue

  1. Changes
    - Modify `handle_new_user()` function to set auth context
    - This allows RLS policies to work correctly during user signup
    - The function temporarily sets `auth.uid()` to the new user's ID
*/

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Set the auth context so RLS policies work correctly
  PERFORM set_config('request.jwt.claim.sub', new.id::text, true);
  
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;