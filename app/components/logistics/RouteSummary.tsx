import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoutePoint } from "@/types/shipment";
import { Clock, Truck, MapPin, Thermometer, Droplets } from 'lucide-react';

interface RouteSummaryProps {
  stops: RoutePoint[];
  routeName: string;
}

export function RouteSummary({ stops, routeName }: RouteSummaryProps) {
  const totalTransitTime = stops.reduce((acc, stop) => acc + (stop.transitTimeHours || 0), 0);
  const totalDuration = stops.reduce((acc, stop) => acc + (stop.durationAtStop || 0), 0);
  const totalTime = totalTransitTime + totalDuration;
  const firstStop = stops[0];
  const lastStop = stops[stops.length - 1];

  // Calculate overall environmental requirements
  const envRequirements = stops.reduce((acc, stop) => {
    return {
      tempMin: Math.min(acc.tempMin, stop.tempMin),
      tempMax: Math.max(acc.tempMax, stop.tempMax),
      humidityMin: Math.min(acc.humidityMin, stop.humidityMin),
      humidityMax: Math.max(acc.humidityMax, stop.humidityMax),
    };
  }, {
    tempMin: stops[0]?.tempMin || 0,
    tempMax: stops[0]?.tempMax || 0,
    humidityMin: stops[0]?.humidityMin || 0,
    humidityMax: stops[0]?.humidityMax || 0,
  });

  const formatTime = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Route Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Name */}
        <div>
          <p className="text-sm text-muted-foreground">Route Name</p>
          <p className="font-medium">{routeName || 'Untitled Route'}</p>
        </div>

        {/* Time Breakdown */}
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-2 pl-6">
            <div>
              <p className="text-sm text-muted-foreground">Transit Time</p>
              <p className="font-medium">{formatTime(totalTransitTime)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stop Duration</p>
              <p className="font-medium">{formatTime(totalDuration)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="font-medium">{formatTime(totalTime)}</p>
            </div>
          </div>
        </div>

        {/* Route Overview */}
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Route Overview
          </h3>
          <div className="space-y-2 pl-6">
            <div>
              <p className="text-sm text-muted-foreground">Origin</p>
              <p className="font-medium">{firstStop?.location || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="font-medium">{lastStop?.destination || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stops</p>
              <p className="font-medium">{stops.length}</p>
            </div>
          </div>
        </div>

        {/* Environmental Requirements */}
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Environmental Requirements
          </h3>
          <div className="grid grid-cols-2 gap-2 pl-6">
            <div>
              <p className="text-sm text-muted-foreground">Temperature Range</p>
              <p className="font-medium">
                {envRequirements.tempMin}°C - {envRequirements.tempMax}°C
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Humidity Range</p>
              <p className="font-medium">
                {envRequirements.humidityMin}% - {envRequirements.humidityMax}%
              </p>
            </div>
          </div>
        </div>

        {/* Stop Details */}
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Stop Details
          </h3>
          <div className="space-y-4 pl-6">
            {stops.map((stop, index) => (
              <div key={stop.id} className="space-y-1">
                <p className="font-medium">Stop {index + 1}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Location: </span>
                    {stop.location}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Handler: </span>
                    {stop.handler?.name || 'Not assigned'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transit: </span>
                    {formatTime(stop.transitTimeHours)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration: </span>
                    {formatTime(stop.durationAtStop)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
