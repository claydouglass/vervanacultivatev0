import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkEnvironmentalExcursion } from '@/lib/alerts';
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
    const excursion = await checkEnvironmentalExcursion(shipmentId, reading);
    if (excursion) {
      // Store the alert in Supabase
      const { error: alertError } = await supabase
        .from('alerts')
        .insert({
          shipment_id: shipmentId,
          type: excursion.type,
          level: excursion.level,
          message: excursion.message,
          reading_id: data.id
        });

      if (alertError) {
        console.error('Error storing alert:', alertError);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
