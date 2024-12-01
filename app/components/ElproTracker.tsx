'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Measurement {
  timestamp: string;
  temperature: number;
  humidity: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface SensorData {
  sensors: Measurement[][];
}

export default function ElproTracker({ batch }: { batch: string }) {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/logistics/elpro?batch=${batch}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [batch]);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  // Prepare temperature chart data
  const tempChartData = {
    labels: data.sensors[0].map(m => new Date(m.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.sensors[0].map(m => m.temperature),
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
      {
        label: 'Min Temp',
        data: data.sensors[0].map(() => 15),
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
      },
      {
        label: 'Max Temp',
        data: data.sensors[0].map(() => 25),
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
      },
    ],
  };

  // Prepare humidity chart data
  const humidityChartData = {
    labels: data.sensors[0].map(m => new Date(m.timestamp).toLocaleString()),
    datasets: [{
      label: 'Humidity (%)',
      data: data.sensors[0].map(m => m.humidity),
      borderColor: 'rgb(153, 102, 255)',
      fill: false,
    }],
  };

  // Prepare map data
  const path = data.sensors[0].map(m => m.location);
  const center = path[Math.floor(path.length / 2)];

  return (
    <div className="space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature Chart */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Temperature History</h3>
          <Line 
            data={tempChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Temperature (°C)' }
              }
            }}
          />
        </div>

        {/* Humidity Chart */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Humidity History</h3>
          <Line 
            data={humidityChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Humidity (%)' }
              }
            }}
          />
        </div>
      </div>

      {/* Map */}
      <div className="h-[400px] bg-white rounded-lg shadow">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={4}
          >
            <Polyline
              path={path}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
              }}
            />
            {path.map((position, index) => (
              <Marker
                key={index}
                position={position}
                label={(index + 1).toString()}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
} 