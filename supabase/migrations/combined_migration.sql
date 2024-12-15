-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create base tables first
CREATE TABLE IF NOT EXISTS logistics_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_partners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shipments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create dependent tables
CREATE TABLE IF NOT EXISTS logistics_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES logistics_companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partner_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partner_id UUID REFERENCES business_partners(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS environmental_readings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    temperature DECIMAL,
    humidity DECIMAL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partner_id UUID REFERENCES business_partners(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES partner_contacts(id) ON DELETE CASCADE,
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    notifications_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    access_level TEXT NOT NULL DEFAULT 'read',
    last_access TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS environmental_readings_shipment_id_idx ON environmental_readings(shipment_id);
CREATE INDEX IF NOT EXISTS environmental_readings_timestamp_idx ON environmental_readings(timestamp);
CREATE INDEX IF NOT EXISTS alerts_shipment_id_idx ON alerts(shipment_id);
CREATE INDEX IF NOT EXISTS alerts_type_idx ON alerts(type);
CREATE INDEX IF NOT EXISTS alerts_level_idx ON alerts(level);
CREATE INDEX IF NOT EXISTS partner_preferences_partner_id_idx ON partner_preferences(partner_id);
CREATE INDEX IF NOT EXISTS partner_preferences_contact_id_idx ON partner_preferences(contact_id);
CREATE INDEX IF NOT EXISTS partner_preferences_shipment_id_idx ON partner_preferences(shipment_id);
CREATE INDEX IF NOT EXISTS partner_preferences_expires_at_idx ON partner_preferences(expires_at);

-- Enable Row Level Security
ALTER TABLE logistics_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
    ON environmental_readings FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
    ON environmental_readings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users"
    ON alerts FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON alerts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own preferences"
    ON partner_preferences FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM partner_contacts 
            WHERE id = contact_id
        )
    );

CREATE POLICY "Only authenticated users can create preferences"
    ON partner_preferences FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Create cleanup function for expired preferences
CREATE OR REPLACE FUNCTION cleanup_expired_preferences()
RETURNS trigger AS $$
BEGIN
    DELETE FROM partner_preferences
    WHERE expires_at < now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add cleanup trigger
CREATE TRIGGER cleanup_expired_preferences_trigger
    AFTER INSERT OR UPDATE
    ON partner_preferences
    EXECUTE PROCEDURE cleanup_expired_preferences();
