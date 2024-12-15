# API Routes Documentation

## Shipment Endpoints

### GET /api/shipments
Retrieve a list of all shipments.

**Response:**
```typescript
interface ShipmentResponse {
  shipments: Array<{
    id: string;
    status: 'on_track' | 'delayed' | 'warning';
    currentLocation: {
      city: string;
      country: string;
      coordinates: {
        lat: number;
        lng: number;
      }
    };
    // ... other shipment fields
  }>;
  total: number;
  page: number;
  pageSize: number;
}
```

### GET /api/shipments/[id]
Retrieve details for a specific shipment.

**Response:**
```typescript
interface ShipmentDetailResponse {
  id: string;
  status: string;
  currentLocation: Location;
  environmentalConditions: EnvironmentalData;
  handlers: HandlerInfo;
  timeline: TimelineData;
}
```

### GET /api/shipments/[id]/readings
Retrieve environmental readings for a specific shipment.

**Response:**
```typescript
interface ReadingsResponse {
  sensors: Array<{
    timestamp: string;
    temperature: number;
    humidity: number;
    location: {
      lat: number;
      lng: number;
    };
  }>;
}
```

## Handler Endpoints

### GET /api/handlers
Retrieve a list of all handlers.

**Response:**
```typescript
interface HandlersResponse {
  handlers: Array<{
    id: string;
    name: string;
    role: string;
    contact: string;
    activeShipments: string[];
  }>;
}
```

## Environmental Monitoring Endpoints

### GET /api/environmental/limits
Retrieve environmental condition limits.

**Response:**
```typescript
interface EnvironmentalLimitsResponse {
  temperature: {
    min: number;
    max: number;
    target: number;
  };
  humidity: {
    min: number;
    max: number;
    target: number;
  };
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

Common error codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

All API endpoints require authentication using Bearer tokens:

```
Authorization: Bearer <token>
```

## Rate Limiting

- Rate limit: 100 requests per minute per IP
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
