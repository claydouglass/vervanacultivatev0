'use client';

import { useLoadScript, GoogleMap, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { ShipmentLocation } from '@/types/shipment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock data for testing
const mockShipmentLocations: ShipmentLocation[] = [{
  id: '1',
  location: {
    lat: 37.7749,
    lng: -122.4194
  },
  arrivalTime: new Date(),
  departureTime: null,
  shipmentId: 'SHIP001',
  handlerId: 'HANDLER001',
  handlerType: 'logistics' as const,
  handler: {
    name: 'SF Logistics Hub',
    contacts: [{
      id: '1',
      name: 'John Doe',
      email: 'john@sflogistics.com',
      phone: '+1-555-0123',
      role: 'Logistics Manager',
      is_primary: true
    }]
  }
}];

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

// Define libraries outside of component to prevent reloading
const libraries = ['marker'];

const mapOptions = {
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

const ShipmentTrackingMap = ({ 
  shipmentLocations = mockShipmentLocations,
  shipmentId = 'SHIP001'
}: { 
  shipmentLocations?: ShipmentLocation[];
  shipmentId?: string;
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries as any
  });

  const [selectedLocation, setSelectedLocation] = useState<ShipmentLocation | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    markers.forEach(marker => {
      if (marker instanceof google.maps.Marker) {
        marker.setMap(null);
      } else {
        // For AdvancedMarkerElement
        marker.map = null;
      }
    });
    setMarkers([]);
    setMap(null);
  }, [markers]);

  useEffect(() => {
    if (!map || !isLoaded || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => {
      if (marker instanceof google.maps.Marker) {
        marker.setMap(null);
      } else {
        // For AdvancedMarkerElement
        marker.map = null;
      }
    });
    setMarkers([]);

    // Add new markers
    const newMarkers = shipmentLocations.map(location => {
      if (!location?.location?.lat || !location?.location?.lng) return null;

      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.innerHTML = `
        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer transform hover:scale-110 transition-transform">
          📍
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { 
          lat: location.location.lat, 
          lng: location.location.lng 
        },
        title: location.handler?.name || 'Unknown Location',
        content: markerElement
      });

      markerElement.addEventListener('click', () => {
        setSelectedLocation(location);
      });

      return marker;
    }).filter(Boolean) as google.maps.marker.AdvancedMarkerElement[];

    setMarkers(newMarkers);
  }, [map, shipmentLocations, isLoaded, markers]);

  const generateMagicLink = async (contact: any) => {
    setIsGeneratingLink(true);
    // TODO: Implement magic link generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Magic link generated",
      description: "Link has been copied to clipboard and sent to " + contact.email
    });
    setIsGeneratingLink(false);
  };

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading maps...</div>;
  }

  const currentHandler = shipmentLocations[0]; // For demo, using first location

  return (
    <div className="space-y-4">
      {/* Current Handler Card */}
      {currentHandler?.handler && (
        <Card className="bg-white shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Current Handler: {currentHandler.handler.name || 'Unknown'}
                </h3>
                <p className="text-sm text-gray-500 capitalize mb-4">
                  {currentHandler.handlerType?.replace('_', ' ') || 'Unknown'}
                </p>
                
                {currentHandler.handler.contacts?.length > 0 && 
                  currentHandler.handler.contacts
                    .filter(contact => contact.is_primary)
                    .map(contact => (
                      <div key={contact.id} className="space-y-2">
                        <p className="font-medium">{contact.name}</p>
                        {contact.role && (
                          <p className="text-sm text-gray-500">{contact.role}</p>
                        )}
                        <div className="flex space-x-4">
                          {contact.phone && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${contact.phone}`}>
                                <Phone className="w-4 h-4 mr-2" />
                                {contact.phone}
                              </a>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${contact.email}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              {contact.email}
                            </a>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateMagicLink(contact)}
                            disabled={isGeneratingLink}
                          >
                            {isGeneratingLink ? (
                              <>
                                <span className="loading loading-spinner loading-sm mr-2"></span>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Access
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          options={mapOptions}
        >
          {selectedLocation && (
            <InfoWindow
              position={selectedLocation.location}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedLocation.handler?.name || 'Unknown Location'}</h3>
                <p className="text-sm text-gray-600">
                  Arrival: {new Date(selectedLocation.arrivalTime).toLocaleString()}
                </p>
                {selectedLocation.departureTime && (
                  <p className="text-sm text-gray-600">
                    Departure: {new Date(selectedLocation.departureTime).toLocaleString()}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default ShipmentTrackingMap;