/*
  # Add driver license file tracking system

  1. Changes
    - Create table for tracking driver license files
    - Add RLS policies with proper security
    - Add performance optimizations
    - Fix policy for file uploads

  2. Security
    - Enable RLS
    - Add policies for authenticated users
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

-- Create updated policies for driver license files
CREATE POLICY "Enable insert access for authenticated users"
  ON driver_license_files
  FOR ALL
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