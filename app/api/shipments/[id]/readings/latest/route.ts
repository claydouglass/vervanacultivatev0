import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { EnvironmentalReading } from '@/types/shipment';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shipmentId = params.id;

    // Fetch the latest reading from Supabase
    const { data, error } = await supabase
      .from('environmental_readings')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest reading:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reading' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No readings found' },
        { status: 404 }
      );
    }

    // Convert database record to EnvironmentalReading type
    const reading: EnvironmentalReading = {
      temperature: data.temperature,
      humidity: data.humidity,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(data.timestamp)
      },
      timestamp: new Date(data.timestamp)
    };

    return NextResponse.json(reading);
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
