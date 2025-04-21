/*
  # Initial schema setup for transport booking system

  1. New Tables
    - users (base table)
    - routes (for travel routes)
    - bookings (for reservations)
  
  2. Security
    - Enable RLS
    - Add policies with safety checks
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create routes table if it doesn't exist
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_city text NOT NULL,
  to_city text NOT NULL,
  vehicle_type text NOT NULL,
  price numeric NOT NULL,
  departure_time time NOT NULL,
  duration interval NOT NULL,
  available_seats integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  route_id uuid REFERENCES routes(id),
  booking_date date NOT NULL,
  seat_count integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
    -- Users policies
    DROP POLICY IF EXISTS "Users can read own data" ON users;
    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

    -- Routes policies
    DROP POLICY IF EXISTS "Anyone can read routes" ON routes;
    DROP POLICY IF EXISTS "Admins can manage routes" ON routes;
    
    CREATE POLICY "Anyone can read routes"
      ON routes
      FOR SELECT
      TO authenticated
      USING (true);

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

    -- Bookings policies
    DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
    DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
    DROP POLICY IF EXISTS "Admins can manage all bookings" ON bookings;
    
    CREATE POLICY "Users can read own bookings"
      ON bookings
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());

    CREATE POLICY "Users can create bookings"
      ON bookings
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Admins can manage all bookings"
      ON bookings
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role = 'admin'
        )
      );
END $$;