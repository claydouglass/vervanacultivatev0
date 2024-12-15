import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: handlers, error } = await supabase
      .from('handlers')
      .select(`
        *,
        originShipments:shipments(*)
        destinationShipments:shipments(*)
      `);

    if (error) {
      console.error('Error fetching handlers:', error);
      return NextResponse.json(
        { error: 'Error fetching handlers' },
        { status: 500 }
      );
    }

    return NextResponse.json(handlers);
  } catch (error) {
    console.error('Error fetching handlers:', error);
    return NextResponse.json(
      { error: 'Error fetching handlers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { data: handler, error } = await supabase
      .from('handlers')
      .insert({
        name: data.name,
        company: data.company,
        address: data.address,
        email: data.email,
        phone: data.phone,
        role: data.role,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating handler:', error);
      return NextResponse.json(
        { error: 'Error creating handler' },
        { status: 500 }
      );
    }

    return NextResponse.json(handler);
  } catch (error) {
    console.error('Error creating handler:', error);
    return NextResponse.json(
      { error: 'Error creating handler' },
      { status: 500 }
    );
  }
}
