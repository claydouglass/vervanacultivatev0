import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useHandlers } from '@/app/hooks/useHandlers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Handler, RoutePoint } from '@/types/shipment';
import { RouteSummary } from './RouteSummary';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted animate-pulse flex items-center justify-center">
      Loading map...
    </div>
  ),
});

interface RoutePlannerProps {
  onSave?: (route: { name: string; stops: RoutePoint[] }) => void;
  initialRoute?: {
    id: string;
    name: string;
    stops: RoutePoint[];
  };
}

export function RoutePlanner({ onSave, initialRoute }: RoutePlannerProps) {
  const [routeName, setRouteName] = useState(initialRoute?.name || '');
  const [stops, setStops] = useState<RoutePoint[]>(initialRoute?.stops || [
    {
      id: crypto.randomUUID(),
      location: '',
      destination: '',
      transitTimeHours: 0,
      durationAtStop: 0,
      tempMin: 20,
      tempMax: 25,
      humidityMin: 40,
      humidityMax: 60,
      expectedDepartureTime: new Date(),
      expectedArrivalTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      handler: undefined,
    },
  ]);
  const { handlers } = useHandlers();

  const addStop = () => {
    const lastStop = stops[stops.length - 1];
    const estimatedTransitTime = lastStop?.transitTimeHours || 2; // Default 2 hours transit
    const estimatedStopDuration = 1; // Default 1 hour at stop

    // Calculate times based on the last stop
    const expectedDepartureTime = new Date(lastStop?.expectedArrivalTime.getTime() + estimatedStopDuration * 60 * 60 * 1000);
    const expectedArrivalTime = new Date(expectedDepartureTime.getTime() + estimatedTransitTime * 60 * 60 * 1000);

    setStops([...stops, {
      id: crypto.randomUUID(),
      location: lastStop?.destination || '',
      destination: '',
      transitTimeHours: estimatedTransitTime,
      durationAtStop: estimatedStopDuration,
      tempMin: lastStop?.tempMin ?? 20,
      tempMax: lastStop?.tempMax ?? 25,
      humidityMin: lastStop?.humidityMin ?? 40,
      humidityMax: lastStop?.humidityMax ?? 60,
      expectedDepartureTime,
      expectedArrivalTime,
      handler: undefined,
    }]);
  };

  const updateStop = (index: number, updates: Partial<RoutePoint>) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], ...updates };

    // If arrival or departure time changed, update subsequent stops
    if ('expectedArrivalTime' in updates || 'expectedDepartureTime' in updates) {
      // Update all subsequent stops
      for (let i = index + 1; i < stops.length; i++) {
        const prevStop = newStops[i - 1];
        const currentStop = newStops[i];
        
        // Calculate new times
        const expectedDepartureTime = new Date(prevStop.expectedArrivalTime.getTime() + prevStop.durationAtStop * 60 * 60 * 1000);
        const expectedArrivalTime = new Date(expectedDepartureTime.getTime() + currentStop.transitTimeHours * 60 * 60 * 1000);
        
        newStops[i] = {
          ...currentStop,
          expectedDepartureTime,
          expectedArrivalTime
        };
      }
    }

    // If location changed, update next stop's destination
    if ('destination' in updates && index < stops.length - 1) {
      newStops[index + 1] = { 
        ...newStops[index + 1], 
        location: updates.destination || '' 
      };
    }

    setStops(newStops);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        name: routeName,
        stops: stops,
      });
    }
  };

  return (
    <div className="flex gap-4">
      {/* Left side - Route Planning (60%) */}
      <div className="flex-[0.6] space-y-4">
        <div className="space-y-2">
          <Label>Route Name</Label>
          <Input
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Enter route name"
          />
        </div>

        <div className="space-y-4">
          {stops.map((stop, index) => (
            <Card key={stop.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Stop {index + 1}</h3>
                  {stops.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStop(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={stop.location}
                        onChange={(e) => updateStop(index, { location: e.target.value })}
                        placeholder="Enter location"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <Input
                        value={stop.destination}
                        onChange={(e) => updateStop(index, { destination: e.target.value })}
                        placeholder="Enter destination"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Handler</Label>
                    <Select
                      value={stop.handler?.id}
                      onValueChange={(value) => {
                        const handler = handlers.find(h => h.id === value);
                        updateStop(index, { handler });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select handler" />
                      </SelectTrigger>
                      <SelectContent>
                        {handlers.map((handler) => (
                          <SelectItem key={handler.id} value={handler.id}>
                            {handler.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Transit Time (hours)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={stop.transitTimeHours}
                        onChange={(e) => updateStop(index, { transitTimeHours: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration at Stop (hours)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={stop.durationAtStop}
                        onChange={(e) => updateStop(index, { durationAtStop: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expected Departure Time</Label>
                      <Input
                        type="datetime-local"
                        value={stop.expectedDepartureTime.toISOString().slice(0, 16)}
                        onChange={(e) => updateStop(index, { expectedDepartureTime: new Date(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Arrival Time</Label>
                      <Input
                        type="datetime-local"
                        value={stop.expectedArrivalTime.toISOString().slice(0, 16)}
                        onChange={(e) => updateStop(index, { expectedArrivalTime: new Date(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Temperature Range (°C)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={stop.tempMin}
                          onChange={(e) => updateStop(index, { tempMin: parseFloat(e.target.value) })}
                          placeholder="Min"
                        />
                        <Input
                          type="number"
                          value={stop.tempMax}
                          onChange={(e) => updateStop(index, { tempMax: parseFloat(e.target.value) })}
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Humidity Range (%)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={stop.humidityMin}
                          onChange={(e) => updateStop(index, { humidityMin: parseFloat(e.target.value) })}
                          placeholder="Min"
                        />
                        <Input
                          type="number"
                          value={stop.humidityMax}
                          onChange={(e) => updateStop(index, { humidityMax: parseFloat(e.target.value) })}
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={addStop} variant="outline">Add Stop</Button>
          <Button 
            onClick={handleSave}
            disabled={!routeName || stops.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save Route
          </Button>
        </div>
      </div>

      {/* Right side - Map and Summary (40%) */}
      <div className="flex-[0.4] space-y-4">
        <RouteMap stops={stops} />
        <RouteSummary stops={stops} routeName={routeName} />
      </div>
    </div>
  );
}
