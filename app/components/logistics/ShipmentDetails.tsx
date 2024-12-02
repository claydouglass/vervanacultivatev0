'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, MapPin, ThermometerIcon, Droplets } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ShipmentStatus } from "@/types/shipment"

interface ShipmentDetailsProps {
  shipmentId: string;
}

export function ShipmentDetails({ shipmentId }: ShipmentDetailsProps) {
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
        <Card>
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-center py-4 text-gray-500">
        Unable to load shipment details
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {status.timeline.past.map((event, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{event.location.name}</div>
                      <div className="text-sm text-gray-500">{event.event}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(event.actualTime).toLocaleString()}
                      {event.variance !== 0 && (
                        <Badge variant={event.variance > 0 ? "destructive" : "default"} className="ml-2">
                          {event.variance > 0 ? '+' : ''}{event.variance} min
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {status.timeline.upcoming.map((event, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{event.location.name}</div>
                      <div className="text-sm text-gray-500">{event.event}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Expected: {new Date(event.expectedTime).toLocaleString()}
                      <br />
                      Planned: {new Date(event.plannedTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Handler Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label>Current Handler</Label>
              <div className="mt-2">
                <div className="font-medium">{status.currentHandler.name}</div>
                <div className="text-sm text-gray-500">
                  {status.currentHandler.role} - {status.currentHandler.company}
                </div>
                <div className="text-sm text-gray-500">
                  {status.currentHandler.phone}
                </div>
              </div>
            </div>

            {status.nextHandler && (
              <div>
                <Label>Next Handler</Label>
                <div className="mt-2">
                  <div className="font-medium">{status.nextHandler.name}</div>
                  <div className="text-sm text-gray-500">
                    {status.nextHandler.role} - {status.nextHandler.company}
                  </div>
                  <div className="text-sm text-gray-500">
                    {status.nextHandler.phone}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environmental History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temperature">
            <TabsList>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
            </TabsList>
            <TabsContent value="temperature">
              <div className="space-y-4">
                <div>
                  <Label>Current Temperature</Label>
                  <div className="mt-1 text-2xl font-bold">
                    {status.environmentalConditions.temperature.current}°C
                  </div>
                </div>
                <div>
                  <Label>Acceptable Range</Label>
                  <div className="mt-1">
                    {status.environmentalConditions.temperature.min}°C - {status.environmentalConditions.temperature.max}°C
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    {status.environmentalConditions.isWithinLimits ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-500">Within acceptable range</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span className="text-red-500">Outside acceptable range</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="humidity">
              <div className="space-y-4">
                <div>
                  <Label>Current Humidity</Label>
                  <div className="mt-1 text-2xl font-bold">
                    {status.environmentalConditions.humidity.current}%
                  </div>
                </div>
                <div>
                  <Label>Acceptable Range</Label>
                  <div className="mt-1">
                    {status.environmentalConditions.humidity.min}% - {status.environmentalConditions.humidity.max}%
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    {status.environmentalConditions.isWithinLimits ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-500">Within acceptable range</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span className="text-red-500">Outside acceptable range</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
