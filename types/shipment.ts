export interface Location {
  name: string;
  address: string;
  timestamp: Date;
}

export interface EnvironmentalReading {
  temperature: number;  // in Celsius
  humidity: number;    // percentage
  location: Location;
  timestamp: Date;
}

export interface EnvironmentalRange {
  min: number;
  max: number;
}

export interface Handler {
  id: string;
  name: string;
  company: string;
  address: string;
  email: string;
  phone: string;
  role: 'supplier' | 'distributor' | 'warehouse' | 'customer';
}

export interface RoutePoint {
  location: Location;
  handler: Handler;
  expectedTemperature: EnvironmentalRange;
  expectedHumidity: EnvironmentalRange;
  expectedArrivalTime: Date;
  expectedDepartureTime: Date;
  timeAtLocation: number; // minutes at location
  transitTimeToNext?: number; // minutes to next location, undefined for last stop
  durationAtStop: number; // added field
}

export interface ShipmentPlan {
  id: string;
  route: RoutePoint[];
  actualReadings: EnvironmentalReading[];
  status: 'pending' | 'in_transit' | 'completed' | 'alert';
}

export interface ShipmentLocation extends Location {
  id: string;
  arrivalTime: Date;
  departureTime: Date | null; // null if still at location
  shipmentId: string;
  handlerId: string;
  handlerType: 'customs_broker' | 'logistics' | 'importer' | 'refiner' | 'distributor' | 'retailer';
  handler: {
    name: string;
    contacts: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      role?: string;
      is_primary: boolean;
    }[];
  };
}

export interface RouteTemplate {
  id: string;
  name: string;
  description?: string;
  route: RoutePoint[];
  handlers: {
    handlerId: string;
    handlerType: 'customs_broker' | 'logistics' | 'importer' | 'refiner' | 'distributor' | 'retailer';
    stopIndex: number;
    name: string;
    address: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  routeTemplateId: string;
  status: 'pending' | 'in_transit' | 'completed' | 'alert';
  actualReadings: EnvironmentalReading[];
  startTime: Date;
  estimatedEndTime: Date;
  actualEndTime?: Date;
}

export type AlertLevel = 'info' | 'warning' | 'critical';
export type AlertType = 'temperature' | 'humidity' | 'delay' | 'deviation' | 'system';

export interface ShipmentStatus {
  status: 'on_track' | 'delayed' | 'warning' | 'alert';
  message: string;
  lastUpdate: Date;
  currentLocation: Location;
  environmentalConditions: {
    temperature: EnvironmentalRange & { current: number };
    humidity: EnvironmentalRange & { current: number };
    lastReading: Date;
    isWithinLimits: boolean;
  };
  routeProgress: {
    completedStops: number;
    totalStops: number;
    timeProgress: number;
    distanceProgress: number;
    isAheadOfSchedule: boolean;
  };
  currentHandler: Handler;
  nextHandler?: Handler;
  timeline: {
    past: Array<{
      location: Location;
      event: string;
      plannedTime: Date;
      actualTime: Date;
      variance: number; // minutes difference from plan
    }>;
    upcoming: Array<{
      location: Location;
      expectedTime: Date;
      plannedTime: Date;
      event: string;
    }>;
  };
}
