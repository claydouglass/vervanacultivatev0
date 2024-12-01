-- Create business_partners table (base entity for all partners)
CREATE TABLE IF NOT EXISTS business_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT[] NOT NULL, -- Array of roles: ['LOGISTICS', 'IMPORTER', 'CUSTOMS', 'REFINER', 'DISTRIBUTOR', 'RETAILER']
    website TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create partner_contacts table
CREATE TABLE IF NOT EXISTS partner_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID REFERENCES business_partners(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create batch_interactions table (track history with partners)
CREATE TABLE IF NOT EXISTS batch_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID REFERENCES business_partners(id) ON DELETE CASCADE,
    batch_id TEXT NOT NULL, -- Reference to the batch
    interaction_type TEXT NOT NULL, -- e.g., 'LOGISTICS', 'IMPORT', 'CUSTOMS', 'REFINING', 'DISTRIBUTION', 'RETAIL'
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    status TEXT NOT NULL, -- e.g., 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'
    throughput_quantity DECIMAL,
    throughput_unit TEXT,
    performance_rating INT, -- 1-5 rating
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_business_partners_type ON business_partners USING GIN(type);
CREATE INDEX IF NOT EXISTS idx_partner_contacts_partner ON partner_contacts(partner_id);
CREATE INDEX IF NOT EXISTS idx_batch_interactions_partner ON batch_interactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_batch_interactions_batch ON batch_interactions(batch_id);

-- Add RLS policies
ALTER TABLE business_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_interactions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read partners"
    ON business_partners FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read contacts"
    ON partner_contacts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read interactions"
    ON batch_interactions FOR SELECT TO authenticated USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role to manage partners"
    ON business_partners FOR ALL TO service_role USING (true);

CREATE POLICY "Allow service role to manage contacts"
    ON partner_contacts FOR ALL TO service_role USING (true);

CREATE POLICY "Allow service role to manage interactions"
    ON batch_interactions FOR ALL TO service_role USING (true);

-- Drop old tables if they exist
DROP TABLE IF EXISTS logistics_access CASCADE;
DROP TABLE IF EXISTS logistics_contacts CASCADE;
DROP TABLE IF EXISTS logistics_companies CASCADE;
