export interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface EnvironmentalReading {
  temperature: number;  // in Celsius
  humidity: number;    // percentage
  location: Location;
  timestamp: Date;
}

export interface RoutePoint {
  location: Location;
  expectedTemperature: {
    min: number;
    max: number;
  };
  expectedHumidity: {
    min: number;
    max: number;
  };
  expectedArrivalTime: Date;
}

export interface ShipmentPlan {
  id: string;
  route: RoutePoint[];
  actualReadings: EnvironmentalReading[];
  status: 'pending' | 'in_transit' | 'completed' | 'alert';
}

export interface ShipmentLocation {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
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

export type AlertLevel = 'WARNING' | 'CRITICAL';
export type AlertType = 'TEMPERATURE' | 'HUMIDITY' | 'LOCATION' | 'DELAY';
