import ShipmentTrackingMap from '../components/ShipmentTrackingMap';

export default function TrackingPage() {
  // Example data - replace with your API call
  const sampleLocations = [
    {
      id: '1',
      location: { lat: 40.7128, lng: -74.0060 },
      arrivalTime: new Date('2024-03-20T10:00:00'),
      departureTime: new Date('2024-03-20T14:30:00'),
      shipmentId: 'SHIP001'
    },
    {
      id: '2',
      location: { lat: 51.5074, lng: -0.1278 },
      arrivalTime: new Date('2024-03-21T08:00:00'),
      departureTime: null, // Currently here
      shipmentId: 'SHIP001'
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shipment Tracking</h1>
      <ShipmentTrackingMap shipmentLocations={sampleLocations} />
    </div>
  );
} 