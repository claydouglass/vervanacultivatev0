-- Create partner_preferences table
create table if not exists partner_preferences (
  id uuid default uuid_generate_v4() primary key,
  partner_id uuid references business_partners(id) on delete cascade,
  contact_id uuid references partner_contacts(id) on delete cascade,
  shipment_id uuid references shipments(id) on delete cascade,
  notifications_config jsonb not null default '{}'::jsonb,
  access_level text not null default 'read',
  last_access timestamp with time zone,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table partner_preferences enable row level security;

create policy "Users can view their own preferences"
  on partner_preferences for select
  using (
    auth.uid() in (
      select user_id 
      from partner_contacts 
      where id = contact_id
    )
  );

create policy "Only authenticated users can create preferences"
  on partner_preferences for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can update their own preferences"
  on partner_preferences for update
  using (
    auth.uid() in (
      select user_id 
      from partner_contacts 
      where id = contact_id
    )
  );

-- Add indexes
create index partner_preferences_partner_id_idx on partner_preferences(partner_id);
create index partner_preferences_contact_id_idx on partner_preferences(contact_id);
create index partner_preferences_shipment_id_idx on partner_preferences(shipment_id);
create index partner_preferences_expires_at_idx on partner_preferences(expires_at);

-- Add function to clean up expired preferences
create or replace function cleanup_expired_preferences()
returns trigger as $$
begin
  delete from partner_preferences
  where expires_at < now();
  return new;
end;
$$ language plpgsql;

-- Add trigger to clean up expired preferences
create trigger cleanup_expired_preferences_trigger
  after insert or update
  on partner_preferences
  execute procedure cleanup_expired_preferences();
