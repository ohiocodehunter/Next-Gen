/*
  # Fix routes and vehicles relationship

  1. Changes
    - Add vehicle_id column to routes table
    - Add foreign key constraint to link routes with vehicles
    - Update existing policies to reflect the new relationship

  2. Security
    - Maintain existing RLS policies
*/

-- Add vehicle_id column to routes table
ALTER TABLE routes 
ADD COLUMN IF NOT EXISTS vehicle_id uuid REFERENCES vehicles(id);

-- Create index for better join performance
CREATE INDEX IF NOT EXISTS idx_routes_vehicle_id ON routes(vehicle_id);

-- Update the routes select policy to include vehicle relationship
DROP POLICY IF EXISTS "Anyone can read routes" ON routes;
CREATE POLICY "Anyone can read routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (true);

-- Update the admin policy
DROP POLICY IF EXISTS "Admins can manage routes" ON routes;
CREATE POLICY "Admins can manage routes"
  ON routes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );