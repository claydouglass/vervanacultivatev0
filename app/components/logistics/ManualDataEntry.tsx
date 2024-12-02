'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ShipmentLocation, EnvironmentalReading } from '@/types/shipment';

interface ManualDataEntryProps {
  onLocationUpdate: (location: ShipmentLocation) => void;
  onEnvironmentalUpdate: (reading: EnvironmentalReading) => void;
}

export function ManualDataEntry({ onLocationUpdate, onEnvironmentalUpdate }: ManualDataEntryProps) {
  const [location, setLocation] = useState<Partial<ShipmentLocation>>({
    location: { latitude: 0, longitude: 0 },
    arrivalTime: new Date(),
    handler: { name: '', role: '' }
  });

  const [reading, setReading] = useState<Partial<EnvironmentalReading>>({
    temperature: 0,
    humidity: 0,
    timestamp: new Date()
  });

  const handleLocationSubmit = () => {
    if (location.location && location.handler && location.arrivalTime) {
      onLocationUpdate(location as ShipmentLocation);
      setLocation({
        location: { latitude: 0, longitude: 0 },
        arrivalTime: new Date(),
        handler: { name: '', role: '' }
      });
    }
  };

  const handleEnvironmentalSubmit = () => {
    if (reading.temperature !== undefined && reading.humidity !== undefined) {
      onEnvironmentalUpdate(reading as EnvironmentalReading);
      setReading({
        temperature: 0,
        humidity: 0,
        timestamp: new Date()
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Data Point
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Data Point</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="location">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="location">Location Update</TabsTrigger>
            <TabsTrigger value="environmental">Environmental Reading</TabsTrigger>
          </TabsList>
          <TabsContent value="location" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={location.location?.latitude}
                  onChange={(e) => setLocation(prev => ({
                    ...prev,
                    location: { ...prev.location, latitude: parseFloat(e.target.value) }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={location.location?.longitude}
                  onChange={(e) => setLocation(prev => ({
                    ...prev,
                    location: { ...prev.location, longitude: parseFloat(e.target.value) }
                  }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Handler Name</Label>
              <Input
                value={location.handler?.name}
                onChange={(e) => setLocation(prev => ({
                  ...prev,
                  handler: { ...prev.handler, name: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Handler Role</Label>
              <Input
                value={location.handler?.role}
                onChange={(e) => setLocation(prev => ({
                  ...prev,
                  handler: { ...prev.handler, role: e.target.value }
                }))}
              />
            </div>
            <Button onClick={handleLocationSubmit} className="w-full">
              Submit Location Update
            </Button>
          </TabsContent>
          <TabsContent value="environmental" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Temperature (°C)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={reading.temperature}
                  onChange={(e) => setReading(prev => ({
                    ...prev,
                    temperature: parseFloat(e.target.value)
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Humidity (%)</Label>
                <Input
                  type="number"
                  step="1"
                  value={reading.humidity}
                  onChange={(e) => setReading(prev => ({
                    ...prev,
                    humidity: parseFloat(e.target.value)
                  }))}
                />
              </div>
            </div>
            <Button onClick={handleEnvironmentalSubmit} className="w-full">
              Submit Environmental Reading
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
