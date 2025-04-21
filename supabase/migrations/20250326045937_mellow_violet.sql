/*
  # Add driver license storage management

  1. Changes
    - Create table to track driver license files
    - Add policies for secure access control
    - Set up file reference tracking

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create table to track driver license files
CREATE TABLE IF NOT EXISTS driver_license_files (
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

-- Create policies for driver license files
CREATE POLICY "Users can upload their own license files"
  ON driver_license_files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own license files"
  ON driver_license_files
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all license files"
  ON driver_license_files
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_driver_license_files_user_id ON driver_license_files(user_id);
CREATE INDEX idx_driver_license_files_uploaded_at ON driver_license_files(uploaded_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_driver_license_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_driver_license_files_timestamp
  BEFORE UPDATE ON driver_license_files
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_license_files_updated_at();