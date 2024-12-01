import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const batch = searchParams.get('batch');
  
  // These would ideally come from a database or configuration
  const sensorIds = ['9520C9F8A213A_1', '9520C9F8A213A_2'];
  
  try {
    // Fetch data for all sensors
    const promises = sensorIds.map(async (sensorId) => {
      const response = await fetch(
        `${process.env.ELPRO_API_URL}/api/v1/Sensors/${sensorId}/measurements`, {
        headers: {
          'Authorization': `Bearer ${process.env.ELPRO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Elpro API error status for sensor ${sensorId}:`, response.status);
        const errorText = await response.text();
        console.error('Elpro API error response:', errorText);
        return null;
      }

      return response.json();
    });

    const results = await Promise.all(promises);
    const validResults = results.filter(result => result !== null);

    return NextResponse.json({ sensors: validResults });
  } catch (error) {
    console.error('Elpro API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Elpro data' },
      { status: 500 }
    );
  }
} 