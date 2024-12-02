import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { RoutePoint } from '@/types/shipment';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseServiceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
if (!supabaseAnonKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Use service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Regular client for user operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface RouteData {
  name: string;
  stops: RoutePoint[];
}

// Create the table if it doesn't exist
const initializeTable = async () => {
  try {
    console.log('Checking/creating routes table...');
    
    const { error: checkError } = await supabaseAdmin
      .from('routes')
      .select('*')
      .limit(1);

    if (checkError) {
      console.log('Table does not exist, creating...');
      const { error: createError } = await supabaseAdmin.sql`
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

        drop trigger if exists handle_updated_at on public.routes;
        create trigger handle_updated_at
          before update on public.routes
          for each row
          execute function public.handle_updated_at();
      `;

      if (createError) {
        console.error('Error creating table:', createError);
      } else {
        console.log('Table created successfully');
      }
    } else {
      console.log('Table already exists');
    }
  } catch (error) {
    console.error('Error checking/creating table:', error);
  }
};

// Initialize table on first API call
initializeTable().catch(console.error);

export async function GET() {
  try {
    console.log('Fetching routes...');
    const { data: routes, error } = await supabase
      .from('routes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }

    return NextResponse.json(routes || []);
  } catch (error) {
    console.error('Error in GET /api/routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Creating new route...');
    const routeData: RouteData = await request.json();

    // Validate input
    if (!routeData.name || !routeData.stops || !Array.isArray(routeData.stops)) {
      return NextResponse.json(
        { error: 'Invalid route data' },
        { status: 400 }
      );
    }

    const { data: route, error } = await supabase
      .from('routes')
      .insert([{
        name: routeData.name,
        stops: routeData.stops,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting route:', error);
      throw error;
    }

    return NextResponse.json(route);
  } catch (error) {
    console.error('Error in POST /api/routes:', error);
    return NextResponse.json(
      { error: 'Failed to create route' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const routeData: RouteData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    if (!routeData.name || !routeData.stops || !Array.isArray(routeData.stops)) {
      return NextResponse.json(
        { error: 'Invalid route data' },
        { status: 400 }
      );
    }

    const { data: route, error } = await supabase
      .from('routes')
      .update({
        name: routeData.name,
        stops: routeData.stops,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating route:', error);
      throw error;
    }

    return NextResponse.json(route);
  } catch (error) {
    console.error('Error in PUT /api/routes:', error);
    return NextResponse.json(
      { error: 'Failed to update route' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting route:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/routes:', error);
    return NextResponse.json(
      { error: 'Failed to delete route' },
      { status: 500 }
    );
  }
}
