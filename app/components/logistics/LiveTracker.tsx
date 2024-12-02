'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerIcon, Droplets, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { ShipmentStatus } from '@/types/shipment';

interface LiveTrackerProps {
  shipmentId: string;
}

export function LiveTracker({ shipmentId }: LiveTrackerProps) {
  const [status, setStatus] = useState<ShipmentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/shipments/${shipmentId}/status`);
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching shipment status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-center py-4 text-gray-500">
        Unable to load shipment status
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'text-green-500';
      case 'delayed':
        return 'text-yellow-500';
      case 'warning':
      case 'alert':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'delayed':
      case 'warning':
      case 'alert':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status.currentLocation.name}
            </div>
            <div className="text-sm text-gray-500">
              {status.currentLocation.address}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ThermometerIcon className="h-4 w-4" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              status.environmentalConditions.isWithinLimits 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {status.environmentalConditions.temperature.current}°C
            </div>
            <div className="text-sm text-gray-500">
              Target: {status.environmentalConditions.temperature.target}°C
              ({status.environmentalConditions.temperature.min}°C - 
              {status.environmentalConditions.temperature.max}°C)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              status.environmentalConditions.isWithinLimits 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {status.environmentalConditions.humidity.current}%
            </div>
            <div className="text-sm text-gray-500">
              Target: {status.environmentalConditions.humidity.target}%
              ({status.environmentalConditions.humidity.min}% - 
              {status.environmentalConditions.humidity.max}%)
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {getStatusIcon(status.status)}
            Shipment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-lg font-semibold ${getStatusColor(status.status)}`}>
            {status.message}
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(status.lastUpdate).toLocaleString()}
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium">Route Progress</div>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{status.routeProgress.completedStops} of {status.routeProgress.totalStops} stops</span>
              <span>{Math.round(status.routeProgress.timeProgress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${status.routeProgress.isAheadOfSchedule ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${status.routeProgress.timeProgress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}