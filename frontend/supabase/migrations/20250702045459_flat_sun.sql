/*
  # Create job applications table

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `company_name` (text, company name)
      - `position` (text, job position title)
      - `job_url` (text, optional job posting URL)
      - `status` (text, application status)
      - `applied_date` (date, when application was submitted)
      - `notes` (text, optional notes about the application)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `job_applications` table
    - Add policies for users to manage their own applications
*/

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name text NOT NULL,
  position text NOT NULL,
  job_url text,
  status text DEFAULT 'applied' CHECK (status IN ('applied', 'interview', 'offer', 'rejected', 'withdrawn')),
  applied_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own job applications
CREATE POLICY "Users can read own job applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own job applications
CREATE POLICY "Users can insert own job applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own job applications
CREATE POLICY "Users can update own job applications"
  ON job_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own job applications
CREATE POLICY "Users can delete own job applications"
  ON job_applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at on job application changes
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS job_applications_user_id_idx ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS job_applications_status_idx ON job_applications(status);
CREATE INDEX IF NOT EXISTS job_applications_created_at_idx ON job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS job_applications_applied_date_idx ON job_applications(applied_date DESC);