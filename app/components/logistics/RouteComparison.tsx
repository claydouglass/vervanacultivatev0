'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManualDataEntry } from './ManualDataEntry';
import { LiveTracker } from './LiveTracker';
import { ShipmentLocation, RoutePoint, EnvironmentalReading } from '@/types/shipment';
import { format, differenceInMinutes } from 'date-fns';

interface RouteComparisonProps {
  plannedRoute: RoutePoint[];
  onLocationUpdate: (location: ShipmentLocation) => void;
  onEnvironmentalUpdate: (reading: EnvironmentalReading) => void;
  actualLocations: ShipmentLocation[];
}

export function RouteComparison({
  plannedRoute,
  onLocationUpdate,
  onEnvironmentalUpdate,
  actualLocations
}: RouteComparisonProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Route Progress</h2>
        <ManualDataEntry
          onLocationUpdate={onLocationUpdate}
          onEnvironmentalUpdate={onEnvironmentalUpdate}
        />
      </div>

      <LiveTracker shipmentLocations={actualLocations} />

      <Card>
        <CardHeader>
          <CardTitle>Route Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {plannedRoute.map((planned, index) => {
              const actualLocation = actualLocations.find(
                loc => loc.handler?.id === planned.handler?.id
              );

              const getStatusColor = () => {
                if (!actualLocation) return 'bg-gray-100';
                
                const timeDiff = differenceInMinutes(
                  new Date(actualLocation.arrivalTime),
                  new Date(planned.expectedArrivalTime)
                );

                if (Math.abs(timeDiff) <= 30) return 'bg-green-100';
                return timeDiff > 0 ? 'bg-yellow-100' : 'bg-red-100';
              };

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${getStatusColor()}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {planned.location.name || planned.handler?.company || `Stop ${index + 1}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {planned.location.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        Expected: {format(new Date(planned.expectedArrivalTime), 'PPp')}
                      </div>
                      {actualLocation && (
                        <div className="text-sm">
                          Actual: {format(new Date(actualLocation.arrivalTime), 'PPp')}
                        </div>
                      )}
                    </div>
                  </div>

                  {actualLocation?.environmentalConditions && (
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Temperature: </span>
                        <span className={
                          actualLocation.environmentalConditions.temperature >= planned.expectedTemperature.min &&
                          actualLocation.environmentalConditions.temperature <= planned.expectedTemperature.max
                            ? 'text-green-600'
                            : 'text-red-600'
                        }>
                          {actualLocation.environmentalConditions.temperature}°C
                        </span>
                        <span className="text-muted-foreground ml-2">
                          (Expected: {planned.expectedTemperature.min}-{planned.expectedTemperature.max}°C)
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Humidity: </span>
                        <span className={
                          actualLocation.environmentalConditions.humidity >= planned.expectedHumidity.min &&
                          actualLocation.environmentalConditions.humidity <= planned.expectedHumidity.max
                            ? 'text-green-600'
                            : 'text-red-600'
                        }>
                          {actualLocation.environmentalConditions.humidity}%
                        </span>
                        <span className="text-muted-foreground ml-2">
                          (Expected: {planned.expectedHumidity.min}-{planned.expectedHumidity.max}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
