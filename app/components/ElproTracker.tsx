'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ElproTrackerProps {
  product: string;
  batch: string;
  location: string;
}

interface LoggerData {
  timestamp: string;
  temperature: number;
  humidity: number;
  location: {
    lat: number;
    lng: number;
  };
}

export default function ElproTracker({ product, batch, location }: ElproTrackerProps) {
  const [loggerData, setLoggerData] = useState<LoggerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchElproData() {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/logistics/elpro?batch=${batch}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setLoggerData(data);
      } catch (err) {
        setError('Failed to fetch logger data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (batch) {
      fetchElproData();
    }
  }, [batch]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">Loading Elpro data...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Error: {error}</div>
      </Card>
    );
  }

  const latestReading = loggerData[loggerData.length - 1];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Environmental Monitoring</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm text-gray-500">Current Temperature</h3>
          <p className="text-2xl font-bold">{latestReading?.temperature}°C</p>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm text-gray-500">Current Humidity</h3>
          <p className="text-2xl font-bold">{latestReading?.humidity}%</p>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm text-gray-500">Last Updated</h3>
          <p className="text-2xl font-bold">
            {latestReading?.timestamp ? new Date(latestReading.timestamp).toLocaleTimeString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={loggerData}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} 
            />
            <YAxis yAxisId="temp" orientation="left" />
            <YAxis yAxisId="humidity" orientation="right" />
            <Tooltip />
            <Line 
              yAxisId="temp"
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              name="Temperature (°C)" 
            />
            <Line 
              yAxisId="humidity"
              type="monotone" 
              dataKey="humidity" 
              stroke="#3b82f6" 
              name="Humidity (%)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 