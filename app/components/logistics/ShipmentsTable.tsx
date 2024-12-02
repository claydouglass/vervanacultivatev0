'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const ShipmentsTable = () => {
  const router = useRouter();
  
  // Mock data - replace with API call
  const shipments = [
    {
      id: "SHIP001",
      origin: "San Francisco, CA",
      destination: "New York, NY",
      status: "in_transit",
      departureDate: "2024-01-01",
      arrivalDate: "2024-01-03",
      currentTemp: 21.5,
      currentHumidity: 45,
      routeCompliance: "on_track",
      nextStop: "Chicago Distribution Center",
      handler: "John Smith",
      handlerPhone: "+1 (555) 123-4567"
    },
    {
      id: "SHIP002",
      origin: "Los Angeles, CA",
      destination: "Chicago, IL",
      status: "delayed",
      departureDate: "2024-01-02",
      arrivalDate: "2024-01-05",
      currentTemp: 22.1,
      currentHumidity: 48,
      routeCompliance: "delayed",
      nextStop: "Phoenix Warehouse",
      handler: "Jane Doe",
      handlerPhone: "+1 (555) 987-6543"
    },
    {
      id: "SHIP003",
      origin: "Seattle, WA",
      destination: "Miami, FL",
      status: "on_track",
      departureDate: "2024-01-03",
      arrivalDate: "2024-01-06",
      currentTemp: 20.8,
      currentHumidity: 42,
      routeCompliance: "on_track",
      nextStop: "Dallas Hub",
      handler: "Mike Johnson",
      handlerPhone: "+1 (555) 456-7890"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <Badge className="bg-green-500">On Track</Badge>;
      case 'delayed':
        return <Badge variant="destructive">Delayed</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-500">In Transit</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case 'on_track':
        return <Badge className="bg-green-500">On Plan</Badge>;
      case 'delayed':
        return <Badge variant="destructive">Off Plan</Badge>;
      default:
        return <Badge variant="secondary">{compliance}</Badge>;
    }
  };

  const handleViewDetails = (shipmentId: string) => {
    router.push(`/logistics/shipments/${shipmentId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Stop</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Humidity</TableHead>
            <TableHead>Route Plan</TableHead>
            <TableHead>Handler</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell className="font-medium">{shipment.id}</TableCell>
              <TableCell>
                {shipment.origin} → {shipment.destination}
              </TableCell>
              <TableCell>{getStatusBadge(shipment.status)}</TableCell>
              <TableCell>{shipment.nextStop}</TableCell>
              <TableCell>{shipment.currentTemp}°C</TableCell>
              <TableCell>{shipment.currentHumidity}%</TableCell>
              <TableCell>{getComplianceBadge(shipment.routeCompliance)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{shipment.handler}</span>
                  <span className="text-sm text-gray-500">{shipment.handlerPhone}</span>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(shipment.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
