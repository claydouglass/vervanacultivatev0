import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

interface ShipmentLocation {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  arrivalTime: Date;
  departureTime: Date | null; // null if still at location
  shipmentId: string;
}

const ShipmentTrackingMap = ({ shipmentLocations }: { shipmentLocations: ShipmentLocation[] }) => {
  const [selectedLocation, setSelectedLocation] = useState<ShipmentLocation | null>(null);
  
  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = {
    lat: 0,
    lng: 0
  };

  const formatDuration = (start: Date, end: Date | null) => {
    const duration = end ? end.getTime() - start.getTime() : Date.now() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={2}
        center={center}
      >
        {shipmentLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.location}
            onClick={() => setSelectedLocation(location)}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.location}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-3">
              <h3 className="font-bold">Shipment #{selectedLocation.shipmentId}</h3>
              <p>Arrival: {selectedLocation.arrivalTime.toLocaleString()}</p>
              {selectedLocation.departureTime ? (
                <>
                  <p>Departure: {selectedLocation.departureTime.toLocaleString()}</p>
                  <p>Duration: {formatDuration(selectedLocation.arrivalTime, selectedLocation.departureTime)}</p>
                </>
              ) : (
                <p>Current Duration: {formatDuration(selectedLocation.arrivalTime, null)}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default ShipmentTrackingMap; 