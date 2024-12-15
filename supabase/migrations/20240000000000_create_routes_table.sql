create table if not exists public.routes (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    stops jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.routes enable row level security;

-- Create policy to allow all operations for authenticated users
create policy "Enable all operations for authenticated users" on public.routes
    for all
    to authenticated
    using (true)
    with check (true);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_routes_updated_at
    before update on public.routes
    for each row
    execute function public.handle_updated_at();
