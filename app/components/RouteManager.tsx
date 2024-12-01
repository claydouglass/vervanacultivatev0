'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.js";
import { Button } from "../../components/ui/button.js";
import { Input } from "../../components/ui/input.js";
import { Select } from "../../components/ui/select.js";
import { Trash2, Plus, Save } from 'lucide-react';

interface RouteStop {
  id: string;
  city: string;
  country: string;
  lat?: number;
  lng?: number;
  expectedArrival: string;
  expectedDeparture: string;
  transitType: 'GROUND' | 'AIR' | 'SEA';
  customsClearance: boolean;
}

interface RouteManagerProps {
  initialRoute?: RouteStop[];
  onSave: (route: RouteStop[]) => void;
  onImport?: () => void; // For API import functionality
}

export default function RouteManager({ initialRoute = [], onSave, onImport }: RouteManagerProps) {
  const [stops, setStops] = useState<RouteStop[]>(initialRoute);

  const addStop = () => {
    const newStop: RouteStop = {
      id: crypto.randomUUID(),
      city: '',
      country: '',
      expectedArrival: '',
      expectedDeparture: '',
      transitType: 'GROUND',
      customsClearance: false
    };
    setStops([...stops, newStop]);
  };

  const removeStop = (id: string) => {
    setStops(stops.filter(stop => stop.id !== id));
  };

  const updateStop = (id: string, field: keyof RouteStop, value: any) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Route Planning</CardTitle>
          <div className="space-x-2">
            {onImport && (
              <Button variant="outline" onClick={onImport}>
                Import from API
              </Button>
            )}
            <Button variant="default" onClick={() => onSave(stops)}>
              <Save className="w-4 h-4 mr-2" />
              Save Route
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stops.map((stop, index) => (
            <div key={stop.id} className="flex gap-4 items-start p-4 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                {index + 1}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
                <Input
                  placeholder="City"
                  value={stop.city}
                  onChange={(e) => updateStop(stop.id, 'city', e.target.value)}
                />
                <Input
                  placeholder="Country"
                  value={stop.country}
                  onChange={(e) => updateStop(stop.id, 'country', e.target.value)}
                />
                <Select
                  value={stop.transitType}
                  onValueChange={(value) => updateStop(stop.id, 'transitType', value)}
                >
                  <option value="GROUND">Ground</option>
                  <option value="AIR">Air</option>
                  <option value="SEA">Sea</option>
                </Select>
                <Input
                  type="datetime-local"
                  value={stop.expectedArrival}
                  onChange={(e) => updateStop(stop.id, 'expectedArrival', e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={stop.expectedDeparture}
                  onChange={(e) => updateStop(stop.id, 'expectedDeparture', e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={stop.customsClearance}
                    onChange={(e) => updateStop(stop.id, 'customsClearance', e.target.checked)}
                  />
                  <label>Customs Required</label>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeStop(stop.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={addStop}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 