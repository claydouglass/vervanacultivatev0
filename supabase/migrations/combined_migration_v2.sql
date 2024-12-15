-- Add user_id to partner_contacts if it doesn't exist
ALTER TABLE partner_contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON partner_preferences;
CREATE POLICY "Users can view their own preferences"
    ON partner_preferences FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM partner_contacts 
            WHERE id = partner_preferences.contact_id 
            AND (user_id = auth.uid() OR auth.role() = 'service_role')
        )
    );

-- Update cleanup trigger
DROP TRIGGER IF EXISTS cleanup_expired_preferences_trigger ON partner_preferences;
DROP FUNCTION IF EXISTS cleanup_expired_preferences();

CREATE OR REPLACE FUNCTION cleanup_expired_preferences()
RETURNS trigger AS $$
BEGIN
    DELETE FROM partner_preferences
    WHERE expires_at < now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_expired_preferences_trigger
    AFTER INSERT OR UPDATE
    ON partner_preferences
    EXECUTE PROCEDURE cleanup_expired_preferences();
