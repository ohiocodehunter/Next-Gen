/*
  # Add call masking system tables

  1. New Tables
    - virtual_numbers (for managing virtual phone numbers)
    - call_logs (for tracking calls and messages)
    - security_alerts (for tracking suspicious activities)

  2. Security
    - Enable RLS
    - Add policies for secure access
*/

-- Create virtual_numbers table
CREATE TABLE virtual_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  virtual_number text NOT NULL,
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create call_logs table
CREATE TABLE call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  virtual_number_id uuid REFERENCES virtual_numbers(id) NOT NULL,
  caller_type text NOT NULL CHECK (caller_type IN ('driver', 'customer')),
  caller_number text NOT NULL,
  duration interval,
  status text NOT NULL CHECK (status IN ('initiated', 'connected', 'completed', 'failed')),
  recording_url text,
  created_at timestamptz DEFAULT now()
);

-- Create security_alerts table
CREATE TABLE security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  alert_type text NOT NULL,
  details text,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Enable RLS
ALTER TABLE virtual_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_virtual_numbers_booking ON virtual_numbers(booking_id);
CREATE INDEX idx_virtual_numbers_number ON virtual_numbers(virtual_number);
CREATE INDEX idx_call_logs_virtual_number ON call_logs(virtual_number_id);
CREATE INDEX idx_security_alerts_booking ON security_alerts(booking_id);

-- Create policies for virtual_numbers
CREATE POLICY "Users can view their virtual numbers"
  ON virtual_numbers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = virtual_numbers.booking_id
      AND (
        bookings.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM routes
          JOIN vehicles ON routes.vehicle_id = vehicles.id
          WHERE routes.id = bookings.route_id
          AND vehicles.driver_id = auth.uid()
        )
      )
    )
  );

-- Create policies for call_logs
CREATE POLICY "Users can view their call logs"
  ON call_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM virtual_numbers
      JOIN bookings ON virtual_numbers.booking_id = bookings.id
      WHERE virtual_numbers.id = call_logs.virtual_number_id
      AND (
        bookings.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM routes
          JOIN vehicles ON routes.vehicle_id = vehicles.id
          WHERE routes.id = bookings.route_id
          AND vehicles.driver_id = auth.uid()
        )
      )
    )
  );

-- Create policies for security_alerts
CREATE POLICY "Admins can view security alerts"
  ON security_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view their security alerts"
  ON security_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = security_alerts.booking_id
      AND (
        bookings.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM routes
          JOIN vehicles ON routes.vehicle_id = vehicles.id
          WHERE routes.id = bookings.route_id
          AND vehicles.driver_id = auth.uid()
        )
      )
    )
  );