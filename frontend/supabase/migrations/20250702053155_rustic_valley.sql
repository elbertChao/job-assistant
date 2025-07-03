/*
  # Fix profile creation RLS issue

  1. Updates
    - Modify handle_new_user function to bypass RLS during profile creation
    - Ensure the function runs with elevated privileges

  2. Security
    - Function runs as SECURITY DEFINER with elevated privileges
    - Temporarily disables RLS only for the profile insertion
*/

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Temporarily disable RLS for this function execution
  PERFORM set_config('row_security', 'off', true);
  
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  
  -- Re-enable RLS
  PERFORM set_config('row_security', 'on', true);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists (recreate if needed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();