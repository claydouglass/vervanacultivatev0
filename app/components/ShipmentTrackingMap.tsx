import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { ShipmentLocation } from '@/types/shipment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Clock, Share2, Check, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ShipmentTrackingMap = ({ 
  shipmentLocations,
  shipmentId 
}: { 
  shipmentLocations: ShipmentLocation[];
  shipmentId: string;
}) => {
  const [selectedLocation, setSelectedLocation] = useState<ShipmentLocation | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  // Center map on most recent location or default to 0,0
  const center = shipmentLocations.length > 0 
    ? shipmentLocations[shipmentLocations.length - 1].location 
    : { lat: 0, lng: 0 };

  const formatDuration = (start: Date, end: Date | null) => {
    const duration = end ? end.getTime() - start.getTime() : Date.now() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getCurrentHandler = () => {
    if (shipmentLocations.length === 0) return null;
    return shipmentLocations[shipmentLocations.length - 1];
  };

  const currentHandler = getCurrentHandler();

  const generateMagicLink = async (contact: ShipmentLocation['handler']['contacts'][0]) => {
    setIsGeneratingLink(true);
    try {
      const response = await fetch('/api/partners/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: currentHandler?.handlerId,
          contactId: contact.id,
          shipmentId,
          accessLevel: 'read',
          notifications: {
            temperature: true,
            humidity: true,
            location: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate access link');
      }

      const { magicLink } = await response.json();
      
      // Copy to clipboard
      await navigator.clipboard.writeText(magicLink);
      
      toast({
        title: "Link generated and copied!",
        description: "A secure access link has been copied to your clipboard. The link will expire in 30 days.",
      });
    } catch (error) {
      console.error('Error generating magic link:', error);
      toast({
        title: "Error generating link",
        description: "There was a problem generating the access link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Handler Card */}
      {currentHandler && (
        <Card className="bg-white shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Current Handler: {currentHandler.handler.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize mb-4">
                  {currentHandler.handlerType.replace('_', ' ')}
                </p>
                
                {currentHandler.handler.contacts
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
              <div className="text-right">
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    Duration: {formatDuration(currentHandler.arrivalTime, currentHandler.departureTime)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
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
              <div className="p-2">
                <h3 className="font-medium">{selectedLocation.handler.name}</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedLocation.handlerType.replace('_', ' ')}
                </p>
                <div className="mt-2">
                  <div className="text-sm">
                    Arrival: {selectedLocation.arrivalTime.toLocaleString()}
                  </div>
                  {selectedLocation.departureTime && (
                    <div className="text-sm">
                      Departure: {selectedLocation.departureTime.toLocaleString()}
                    </div>
                  )}
                  <div className="text-sm font-medium mt-1">
                    Duration: {formatDuration(selectedLocation.arrivalTime, selectedLocation.departureTime)}
                  </div>
                </div>
                {selectedLocation.handler.contacts
                  .filter(contact => contact.is_primary)
                  .map(contact => (
                    <div key={contact.id} className="mt-2 text-sm">
                      <p className="font-medium">{contact.name}</p>
                      {contact.role && (
                        <p className="text-gray-500">{contact.role}</p>
                      )}
                      <div className="flex space-x-2 mt-1">
                        {contact.phone && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${contact.phone}`}>
                              <Phone className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${contact.email}`}>
                            <Mail className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default ShipmentTrackingMap;