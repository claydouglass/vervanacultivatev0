import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Verify environment variables are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seedShipmentData() {
  // Create a shipment
  const { data: shipment, error: shipmentError } = await supabase
    .from('shipments')
    .insert({
      status: 'IN_TRANSIT',
      shipping_partner: 'DHL',
    })
    .select()
    .single();

  if (shipmentError) {
    console.error('Error creating shipment:', shipmentError);
    return;
  }

  // Add route plan
  const routePlan = [
    {
      shipment_id: shipment.id,
      sequence_order: 0,
      city: 'Ottawa',
      country: 'Canada',
      lat: 45.4215,
      lng: -75.6972,
      expected_arrival: '2024-03-15T10:00:00Z',
      expected_departure: '2024-03-15T14:00:00Z',
      transit_type: 'GROUND',
      customs_clearance: false
    },
    {
      shipment_id: shipment.id,
      sequence_order: 1,
      city: 'Toronto',
      country: 'Canada',
      lat: 43.6532,
      lng: -79.3832,
      expected_arrival: '2024-03-15T18:00:00Z',
      expected_departure: '2024-03-17T22:00:00Z',
      transit_type: 'AIR',
      customs_clearance: false
    },
    // Add more route stops...
  ];

  const { error: routeError } = await supabase
    .from('route_plans')
    .insert(routePlan);

  if (routeError) {
    console.error('Error creating route plan:', routeError);
    return;
  }

  // Add some temperature readings
  const readings = [
    {
      shipment_id: shipment.id,
      device_id: 'LIBERO-GX-123456',
      temperature: 19.0,
      humidity: 45.2,
      recorded_at: new Date().toISOString(),
      lat: 43.6532,
      lng: -79.3832
    }
  ];

  const { error: readingsError } = await supabase
    .from('temperature_readings')
    .insert(readings);

  if (readingsError) {
    console.error('Error creating temperature readings:', readingsError);
    return;
  }

  console.log('Successfully seeded shipment data!');
}

// Run the seed
seedShipmentData()
  .catch(console.error)
  .finally(() => process.exit()); 