'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ShipmentLocation, EnvironmentalReading, RoutePoint } from '@/types/shipment';

interface ShipmentPerformanceProps {
  shipmentId: string;
  plannedRoute: RoutePoint[];
  actualLocations: ShipmentLocation[];
  environmentalReadings: EnvironmentalReading[];
}

export function ShipmentPerformance({
  shipmentId,
  plannedRoute,
  actualLocations,
  environmentalReadings,
}: ShipmentPerformanceProps) {
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'humidity'>('temperature');

  // Process environmental data for charting
  const chartData = environmentalReadings.map(reading => {
    const plannedPoint = plannedRoute.find(point => 
      Math.abs(new Date(point.location.timestamp).getTime() - new Date(reading.timestamp).getTime()) < 3600000 // within 1 hour
    );

    return {
      time: format(new Date(reading.timestamp), 'MMM dd HH:mm'),
      actual: selectedMetric === 'temperature' ? reading.temperature : reading.humidity,
      planned: selectedMetric === 'temperature' 
        ? plannedPoint?.expectedTemperature?.max 
        : plannedPoint?.expectedHumidity?.max,
      deviation: selectedMetric === 'temperature'
        ? reading.temperature - (plannedPoint?.expectedTemperature?.max || 0)
        : reading.humidity - (plannedPoint?.expectedHumidity?.max || 0)
    };
  });

  // Calculate performance metrics
  const deviations = chartData.map(d => Math.abs(d.deviation || 0));
  const averageDeviation = deviations.length 
    ? deviations.reduce((a, b) => a + b, 0) / deviations.length 
    : 0;
  const maxDeviation = Math.max(...deviations);

  // Calculate performance score (0-100)
  const getPerformanceScore = () => {
    if (deviations.length === 0) return 100;
    const maxAllowedDeviation = selectedMetric === 'temperature' ? 5 : 20; // 5°C or 20% humidity
    const score = 100 - (averageDeviation / maxAllowedDeviation * 100);
    return Math.max(0, Math.min(100, score));
  };

  const performanceScore = getPerformanceScore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Performance Score</h3>
          <Badge variant={performanceScore > 80 ? "success" : performanceScore > 60 ? "warning" : "destructive"}>
            {performanceScore.toFixed(1)}%
          </Badge>
        </div>
        <Tabs value={selectedMetric} onValueChange={(v: 'temperature' | 'humidity') => setSelectedMetric(v)}>
          <TabsList>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedMetric === 'temperature' ? 'Temperature (°C)' : 'Humidity (%)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#2563eb" 
                  name="Actual" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="planned" 
                  stroke="#9ca3af" 
                  name="Planned" 
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Average Deviation</div>
              <div className="text-2xl font-bold">
                {averageDeviation.toFixed(1)}{selectedMetric === 'temperature' ? '°C' : '%'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Max Deviation</div>
              <div className="text-2xl font-bold">
                {maxDeviation.toFixed(1)}{selectedMetric === 'temperature' ? '°C' : '%'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
