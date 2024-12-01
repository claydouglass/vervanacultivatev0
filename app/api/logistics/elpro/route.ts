import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const batch = searchParams.get('batch');

  try {
    const response = await fetch(`${process.env.ELPRO_API_URL}/measurements`, {
      headers: {
        'Authorization': process.env.ELPRO_API_KEY || 'EAPI-ELCLV2',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Elpro API error status:', response.status);
      const errorText = await response.text();
      console.error('Elpro API error response:', errorText);
      throw new Error('Failed to fetch from Elpro API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Elpro API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Elpro data' },
      { status: 500 }
    );
  }
} 