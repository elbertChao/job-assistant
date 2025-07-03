/*
  # Fix auth trigger with proper security definer

  This migration fixes the "Database error saving new user" issue by:
  1. Dropping existing trigger and function
  2. Recreating with proper security definer pattern
  3. Using the recommended Supabase approach for auth triggers

  Based on Supabase documentation for User Management triggers.
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Create the function with proper security definer
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger using the recommended pattern
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();