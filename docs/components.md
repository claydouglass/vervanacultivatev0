# Components Documentation

## Core Components

### ShipmentDetails
The main component for displaying detailed shipment information and progress tracking.

**Features:**
- Route progress visualization
- Environmental conditions monitoring
- Timeline tracking
- Handler management

**Props:**
```typescript
interface ShipmentDetailsProps {
  shipmentId?: string;
}
```

### ShipmentTrackingMap
Interactive map component for real-time shipment location tracking.

**Features:**
- Real-time location updates
- Route visualization
- Handler location markers
- Interactive InfoWindows

**Props:**
```typescript
interface ShipmentTrackingMapProps {
  shipmentLocations?: ShipmentLocation[];
  shipmentId?: string;
}
```

### ElproTracker
Environmental monitoring component for temperature and humidity tracking.

**Features:**
- Real-time temperature monitoring
- Humidity tracking
- Target range visualization
- Historical data charts

**Props:**
```typescript
interface ElproTrackerProps {
  shipmentId?: string;
}
```

### ShipmentsTable
Table component for displaying multiple shipments and their status.

**Features:**
- Sortable columns
- Status indicators
- Quick actions
- Pagination

**Props:**
```typescript
interface ShipmentsTableProps {
  onShipmentSelect?: (shipmentId: string) => void;
}
```

## UI Components

### Progress Indicators
- `Progress` - Linear progress bar for tracking completion
- `Badge` - Status badges for various states
- `Card` - Container for grouped information

### Interactive Elements
- `Button` - Action buttons with various styles
- `Tabs` - Navigation between different views
- `InfoWindow` - Pop-up information displays on map

### Layout Components
- `Grid` - Responsive grid layout system
- `Container` - Centered content container
- `Stack` - Vertical/horizontal stacking layout

## Best Practices

1. **Component Organization**
   - Keep components focused and single-responsibility
   - Use composition over inheritance
   - Implement proper TypeScript interfaces

2. **State Management**
   - Use React hooks for local state
   - Implement proper loading states
   - Handle errors gracefully

3. **Performance**
   - Implement proper memoization
   - Use lazy loading where appropriate
   - Optimize re-renders

4. **Accessibility**
   - Include proper ARIA labels
   - Ensure keyboard navigation
   - Maintain proper contrast ratios
