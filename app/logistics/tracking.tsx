import ShipmentTrackingMap from '../components/logistics/ShipmentTrackingMap';

export default function TrackingPage() {
  // Example data - replace with your API call
  const sampleLocations = [
    {
      id: '1',
      location: { lat: 40.7128, lng: -74.0060 },
      arrivalTime: new Date('2024-03-20T10:00:00'),
      departureTime: new Date('2024-03-20T14:30:00'),
      shipmentId: 'SHIP001',
      handlerId: 'HANDLER001',
      handlerType: 'customs_broker' as const,
      handler: {
        name: 'NYC Customs',
        contacts: [{
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@nyccustoms.com',
          phone: '+1-555-0126',
          role: 'Customs Manager',
          is_primary: true
        }]
      }
    },
    {
      id: '2',
      location: { lat: 51.5074, lng: -0.1278 },
      arrivalTime: new Date('2024-03-21T08:00:00'),
      departureTime: null, // Currently here
      shipmentId: 'SHIP001',
      handlerId: 'HANDLER002',
      handlerType: 'distributor' as const,
      handler: {
        name: 'London Distribution',
        contacts: [{
          id: '2',
          name: 'James Smith',
          email: 'james@londondist.com',
          phone: '+44-20-555-0127',
          role: 'Distribution Manager',
          is_primary: true
        }]
      }
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shipment Tracking</h1>
      <ShipmentTrackingMap shipmentLocations={sampleLocations} />
    </div>
  );
} 