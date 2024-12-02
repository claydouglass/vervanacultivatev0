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

export default function ElproTracker({ shipmentId }: { shipmentId?: string }) {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/shipments/${shipmentId}/readings`);
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
  }, [shipmentId]);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Environmental Conditions',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Humidity (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const chartData = {
    labels: data.sensors[0].map(reading => 
      new Date(reading.timestamp).toLocaleString()
    ),
    datasets: [
      {
        label: 'Temperature',
        data: data.sensors[0].map(reading => reading.temperature),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Humidity',
        data: data.sensors[0].map(reading => reading.humidity),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const path = data.sensors[0].map(m => m.location);
  const center = path[Math.floor(path.length / 2)];

  return (
    <div className="space-y-8 p-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Environmental Monitoring</h2>
        <div className="h-[400px]">
          <Line options={options} data={chartData} />
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