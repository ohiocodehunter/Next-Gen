/*
  # Enhanced schema for transport booking system

  1. Updates to Users Table
    - Add name, phone, profile_image fields
    - Add driver-specific fields
    - Add user preferences

  2. New Tables
    - vehicles (for driver vehicle details)
    - driver_reviews
    - user_preferences

  3. Security
    - Enhanced RLS policies
    - Role-based access control
*/

-- Extend users table with additional fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_driver boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS driver_license text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_id uuid;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES users(id),
  type text NOT NULL,
  model text NOT NULL,
  registration_number text NOT NULL,
  capacity integer NOT NULL,
  ac_available boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create driver_reviews table
CREATE TABLE IF NOT EXISTS driver_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES users(id),
  user_id uuid REFERENCES users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES users(id),
  preferred_payment_method text,
  preferred_vehicle_type text,
  notification_enabled boolean DEFAULT true,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint to users table
ALTER TABLE users 
  ADD CONSTRAINT fk_vehicle 
  FOREIGN KEY (vehicle_id) 
  REFERENCES vehicles(id);

-- Enable RLS on new tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for vehicles
CREATE POLICY "Drivers can manage their vehicles"
  ON vehicles
  FOR ALL
  TO authenticated
  USING (driver_id = auth.uid());

CREATE POLICY "Anyone can view vehicle details"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for driver reviews
CREATE POLICY "Users can create reviews"
  ON driver_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read all reviews"
  ON driver_reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user preferences
CREATE POLICY "Users can manage their preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());