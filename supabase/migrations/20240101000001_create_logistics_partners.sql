-- Create logistics_companies table
CREATE TABLE IF NOT EXISTS logistics_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create logistics_contacts table
CREATE TABLE IF NOT EXISTS logistics_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES logistics_companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create logistics_access table to track shared access
CREATE TABLE IF NOT EXISTS logistics_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES logistics_companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES logistics_contacts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    access_level TEXT NOT NULL DEFAULT 'read',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_logistics_contacts_company ON logistics_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_logistics_contacts_email ON logistics_contacts(email);
CREATE INDEX IF NOT EXISTS idx_logistics_access_company ON logistics_access(company_id);
CREATE INDEX IF NOT EXISTS idx_logistics_access_contact ON logistics_access(contact_id);

-- Add RLS policies
ALTER TABLE logistics_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_access ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read logistics companies"
    ON logistics_companies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read logistics contacts"
    ON logistics_contacts FOR SELECT TO authenticated USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role to manage logistics companies"
    ON logistics_companies FOR ALL TO service_role USING (true);

CREATE POLICY "Allow service role to manage logistics contacts"
    ON logistics_contacts FOR ALL TO service_role USING (true);

CREATE POLICY "Allow service role to manage logistics access"
    ON logistics_access FOR ALL TO service_role USING (true);

-- Add company_id to shipments table for tracking which logistics company is handling each shipment
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS logistics_company_id UUID REFERENCES logistics_companies(id);
