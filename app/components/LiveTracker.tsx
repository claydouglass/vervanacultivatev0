'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ThermometerIcon, Droplets } from 'lucide-react';
import { EnvironmentalReading } from '@/types/shipment';

type Props = {
  shipmentId: string;
  product: string;
  batch: string;
  shippingPartner: string;
};

const LiveTracker: React.FC<Props> = ({ shipmentId, product, batch, shippingPartner }) => {
  const [reading, setReading] = useState<EnvironmentalReading | null>(null);
  const [manualInput, setManualInput] = useState({
    temperature: '',
    humidity: '',
    latitude: '',
    longitude: ''
  });

  // Fetch latest reading periodically
  useEffect(() => {
    const fetchLatestReading = async () => {
      try {
        const response = await fetch(`/api/shipments/${shipmentId}/readings/latest`);
        if (response.ok) {
          const data = await response.json();
          setReading(data);
        }
      } catch (error) {
        console.error('Error fetching latest reading:', error);
      }
    };

    fetchLatestReading();
    const interval = setInterval(fetchLatestReading, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [shipmentId]);

  const handleManualUpdate = async () => {
    const newReading: EnvironmentalReading = {
      temperature: parseFloat(manualInput.temperature),
      humidity: parseFloat(manualInput.humidity),
      location: {
        latitude: parseFloat(manualInput.latitude),
        longitude: parseFloat(manualInput.longitude),
        timestamp: new Date()
      },
      timestamp: new Date()
    };

    try {
      const response = await fetch(`/api/shipments/${shipmentId}/readings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReading)
      });

      if (response.ok) {
        setReading(newReading);
        setManualInput({ temperature: '', humidity: '', latitude: '', longitude: '' });
      }
    } catch (error) {
      console.error('Error updating reading:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipment Info</h3>
              <p>Product: {product}</p>
              <p>Batch: {batch}</p>
              <p>Shipping Partner: {shippingPartner}</p>
            </div>
            
            {reading && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Conditions</h3>
                <div className="flex items-center space-x-2">
                  <ThermometerIcon className="w-5 h-5" />
                  <span>{reading.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5" />
                  <span>{reading.humidity}%</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {new Date(reading.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Manual Update</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Temperature (°C)"
                value={manualInput.temperature}
                onChange={(e) => setManualInput(prev => ({ ...prev, temperature: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Humidity (%)"
                value={manualInput.humidity}
                onChange={(e) => setManualInput(prev => ({ ...prev, humidity: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Latitude"
                value={manualInput.latitude}
                onChange={(e) => setManualInput(prev => ({ ...prev, latitude: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Longitude"
                value={manualInput.longitude}
                onChange={(e) => setManualInput(prev => ({ ...prev, longitude: e.target.value }))}
              />
            </div>
            <Button 
              onClick={handleManualUpdate}
              className="mt-4"
            >
              Update Reading
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTracker;