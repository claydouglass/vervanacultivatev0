import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkEnvironmentalExcursion } from '@/app/utils/alertSystem';
import { EnvironmentalReading } from '@/types/shipment';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reading: EnvironmentalReading = await request.json();
    const shipmentId = params.id;

    // Store the reading in Supabase
    const { data, error } = await supabase
      .from('environmental_readings')
      .insert({
        shipment_id: shipmentId,
        temperature: reading.temperature,
        humidity: reading.humidity,
        latitude: reading.location.latitude,
        longitude: reading.location.longitude,
        timestamp: reading.timestamp
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing reading:', error);
      return NextResponse.json(
        { error: 'Failed to store reading' },
        { status: 500 }
      );
    }

    // Check for environmental excursions
    await checkEnvironmentalExcursion(reading);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing reading:', error);
    return NextResponse.json(
      { error: 'Failed to process reading' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shipmentId = params.id;

    // Fetch readings from Supabase
    const { data, error } = await supabase
      .from('environmental_readings')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching readings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch readings' },
        { status: 500 }
      );
    }

    // Transform data for the chart
    const sensors = [data.map(reading => ({
      timestamp: reading.timestamp,
      temperature: reading.temperature,
      humidity: reading.humidity,
      location: {
        lat: reading.latitude,
        lng: reading.longitude
      }
    }))];

    return NextResponse.json({ sensors });
  } catch (error) {
    console.error('Error in GET /api/shipments/[id]/readings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
