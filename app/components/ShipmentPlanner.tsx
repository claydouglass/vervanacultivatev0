'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RouteManager from './RouteManager';
import { ShipmentPlan, RoutePoint, Location } from '@/types/shipment';

interface ShipmentPlannerProps {
  shipmentId?: string;  // Optional - if editing existing shipment
  onSave: (planData: ShipmentPlan) => void;
}

const ShipmentPlanner: React.FC<ShipmentPlannerProps> = ({ shipmentId, onSave }) => {
  const [planData, setPlanData] = useState<Partial<ShipmentPlan>>({
    id: shipmentId || crypto.randomUUID(),
    status: 'pending',
    route: [],
    actualReadings: []
  });

  const handleRouteUpdate = (routeStops: any[]) => {
    // Convert RouteManager stops to RoutePoints
    const routePoints: RoutePoint[] = routeStops.map(stop => ({
      location: {
        latitude: stop.lat || 0,
        longitude: stop.lng || 0,
        timestamp: new Date(stop.expectedArrival)
      },
      expectedTemperature: {
        min: 15, // Default values - should be configurable
        max: 25
      },
      expectedHumidity: {
        min: 30,
        max: 60
      },
      expectedArrivalTime: new Date(stop.expectedArrival)
    }));

    setPlanData(prev => ({
      ...prev,
      route: routePoints
    }));
  };

  const handleSave = () => {
    if (planData.id && planData.route && planData.route.length > 0) {
      onSave(planData as ShipmentPlan);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RouteManager
            initialRoute={[]}
            onSave={handleRouteUpdate}
          />
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Shipment Plan</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentPlanner;