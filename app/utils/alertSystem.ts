import { EnvironmentalReading } from '@/types/shipment';

export async function checkEnvironmentalExcursion(reading: EnvironmentalReading) {
  try {
    const response = await fetch('/api/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reading),
    });

    if (!response.ok) {
      throw new Error('Failed to process alert');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking environmental excursion:', error);
    return null;
  }
}