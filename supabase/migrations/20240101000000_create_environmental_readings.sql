-- Create environmental_readings table
CREATE TABLE IF NOT EXISTS environmental_readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    temperature DECIMAL NOT NULL,
    humidity DECIMAL NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_environmental_readings_shipment_id ON environmental_readings(shipment_id);
CREATE INDEX IF NOT EXISTS idx_environmental_readings_timestamp ON environmental_readings(timestamp DESC);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    reading_id UUID REFERENCES environmental_readings(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES auth.users(id)
);

-- Add indexes for alerts
CREATE INDEX IF NOT EXISTS idx_alerts_shipment_id ON alerts(shipment_id);
CREATE INDEX IF NOT EXISTS idx_alerts_reading_id ON alerts(reading_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

-- Add RLS policies
ALTER TABLE environmental_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read environmental readings and alerts
CREATE POLICY "Allow authenticated users to read environmental readings"
    ON environmental_readings
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read alerts"
    ON alerts
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow service role to insert/update readings and alerts
CREATE POLICY "Allow service role to manage environmental readings"
    ON environmental_readings
    FOR ALL
    TO service_role
    USING (true);

CREATE POLICY "Allow service role to manage alerts"
    ON alerts
    FOR ALL
    TO service_role
    USING (true);
