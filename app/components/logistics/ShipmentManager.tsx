'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { RouteTemplate, Shipment } from '@/types/shipment';
import { Badge } from "@/components/ui/badge";

interface ShipmentManagerProps {
  routeTemplates: RouteTemplate[];
}

export function ShipmentManager({ routeTemplates }: ShipmentManagerProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [isCreating, setIsCreating] = useState(false);

  const createShipment = () => {
    if (!selectedTemplate || !startDate) return;

    const template = routeTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Calculate estimated end time based on the last route point
    const lastPoint = template.route[template.route.length - 1];
    const estimatedEndTime = lastPoint?.expectedArrivalTime || new Date();

    const newShipment: Shipment = {
      id: Math.random().toString(36).substr(2, 9),
      routeTemplateId: selectedTemplate,
      status: 'pending',
      actualReadings: [],
      startTime: startDate,
      estimatedEndTime,
    };

    setShipments([...shipments, newShipment]);
    setIsCreating(false);
    setSelectedTemplate('');
    setStartDate(undefined);
  };

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_transit': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'alert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Shipments</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Shipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Route Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {routeTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button 
                onClick={createShipment} 
                className="w-full"
                disabled={!selectedTemplate || !startDate}
              >
                Create Shipment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipments.map((shipment) => {
          const template = routeTemplates.find(t => t.id === shipment.routeTemplateId);
          return (
            <Card key={shipment.id} className="cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template?.name || 'Unknown Route'}</CardTitle>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>Start: {format(shipment.startTime, "PPP")}</p>
                  <p>Est. End: {format(shipment.estimatedEndTime, "PPP")}</p>
                  <p>Readings: {shipment.actualReadings.length}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
