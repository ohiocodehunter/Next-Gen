/*
  # Fix driver license files RLS policies

  1. Changes
    - Drop and recreate table with proper RLS policies
    - Add separate policies for insert and select operations
    - Fix authentication checks

  2. Security
    - Enable RLS
    - Add granular policies for authenticated users
    - Ensure proper access control
*/

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS driver_license_files CASCADE;

-- Create table to track driver license files
CREATE TABLE driver_license_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  filename text NOT NULL,
  file_url text NOT NULL,
  content_type text,
  file_size bigint,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE driver_license_files ENABLE ROW LEVEL SECURITY;

-- Create separate policies for different operations
CREATE POLICY "Enable insert for authenticated users"
  ON driver_license_files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for authenticated users"
  ON driver_license_files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users"
  ON driver_license_files
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_driver_license_files_user_id ON driver_license_files(user_id);
CREATE INDEX IF NOT EXISTS idx_driver_license_files_uploaded_at ON driver_license_files(uploaded_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_driver_license_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_driver_license_files_timestamp ON driver_license_files;
CREATE TRIGGER trigger_update_driver_license_files_timestamp
  BEFORE UPDATE ON driver_license_files
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_license_files_updated_at();