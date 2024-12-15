'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoutePlanner } from '../components/logistics/RoutePlanner';
import { LiveTracker } from '../components/logistics/LiveTracker';
import { ShipmentsTable } from '../components/logistics/ShipmentsTable';
import { ManualDataEntry } from '../components/logistics/ManualDataEntry';
import { RouteComparison } from '../components/logistics/RouteComparison';
import { checkEnvironmentalExcursion } from "@/app/utils/alertSystem";
import { ShipmentLocation, EnvironmentalReading, RoutePoint, ShipmentStatus, Shipment } from '@/types/shipment';

export default function LogisticsPage() {
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipmentStatuses, setShipmentStatuses] = useState<Record<string, ShipmentStatus>>({});

  useEffect(() => {
    const interval = setInterval(async () => {
      if (selectedShipment) {
        await refreshShipmentStatus(selectedShipment);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedShipment]);

  const refreshShipmentStatus = async (shipmentId: string) => {
    try {
      const response = await fetch(`/api/shipments/${shipmentId}/status`);
      const status = await response.json();
      setShipmentStatuses(prev => ({
        ...prev,
        [shipmentId]: status
      }));

      if (status.environmentalConditions?.lastReading) {
        await checkEnvironmentalExcursion(status.environmentalConditions.lastReading);
      }
    } catch (error) {
      console.error('Error refreshing shipment status:', error);
    }
  };

  const handleSaveRoute = async (route: RoutePoint[]) => {
    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ route }),
      });

      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }

      const newShipment = await response.json();
      setShipments([...shipments, newShipment]);
      setSelectedShipment(newShipment.id);
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logistics Dashboard</h1>
        <Button 
          onClick={() => window.location.href = '/route-planning'}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Plan New Route
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {selectedShipment && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Update Data</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manual Data Entry</DialogTitle>
                </DialogHeader>
                <ManualDataEntry
                  onLocationUpdate={handleLocationUpdate}
                  onEnvironmentalUpdate={handleEnvironmentalUpdate}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="completed">Completed Shipments</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Active Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <ShipmentsTable
                  shipments={shipments.filter(s => s.status !== 'completed')}
                  onSelectShipment={setSelectedShipment}
                  selectedShipmentId={selectedShipment}
                />
              </CardContent>
            </Card>
            {selectedShipment && (
              <Card>
                <CardHeader>
                  <CardTitle>Live Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <LiveTracker shipmentId={selectedShipment} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentsTable
                shipments={shipments.filter(s => s.status === 'completed')}
                onSelectShipment={setSelectedShipment}
                selectedShipmentId={selectedShipment}
              />
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Route Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <RouteComparison shipments={shipments.filter(s => s.status === 'completed')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}