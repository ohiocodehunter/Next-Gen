/*
  # Add detailed route and fare information

  1. Updates to Routes Table
    - Add detailed route information
    - Add fare calculation fields
    - Add vehicle relationship

  2. Changes
    - Add highway_route column
    - Add stops array
    - Add base_rate and tax_rate
    - Add vehicle relationship
*/

-- Add new columns to routes table
ALTER TABLE routes 
ADD COLUMN IF NOT EXISTS highway_route text,
ADD COLUMN IF NOT EXISTS stops text[],
ADD COLUMN IF NOT EXISTS base_rate numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_rate numeric NOT NULL DEFAULT 0.12,
ADD COLUMN IF NOT EXISTS estimated_distance numeric NOT NULL DEFAULT 0;

-- Add vehicle relationship if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'routes' 
    AND column_name = 'vehicle_id'
  ) THEN
    ALTER TABLE routes ADD COLUMN vehicle_id uuid REFERENCES vehicles(id);
  END IF;
END $$;