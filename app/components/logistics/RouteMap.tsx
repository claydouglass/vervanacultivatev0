'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { RoutePoint } from '@/types/shipment';
import { Card } from '@/components/ui/card';

interface RouteMapProps {
  stops: RoutePoint[];
}

export default function RouteMap({ stops }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 45.4215, lng: -75.6972 }, // Ottawa as default center
        zoom: 5,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        streetViewControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });

      mapInstanceRef.current = map;
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#16A34A', // Green color for the route
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      });

      if (stops.length > 0) {
        updateRoute();
      }
    });

    return () => {
      // Cleanup
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindowsRef.current.forEach(window => window.close());
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    };
  }, [stops]);

  const formatTime = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const updateRoute = async () => {
    if (!mapInstanceRef.current || stops.length === 0) return;

    // Clear existing markers and info windows
    markersRef.current.forEach(marker => marker.setMap(null));
    infoWindowsRef.current.forEach(window => window.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    const directionsService = new google.maps.DirectionsService();
    const geocoder = new google.maps.Geocoder();

    try {
      // First, geocode all locations to get their coordinates
      const coordinates = await Promise.all(
        stops.map(async (stop) => {
          const result = await geocoder.geocode({ address: stop.location });
          return result.results[0]?.geometry?.location;
        })
      );

      // Filter out any failed geocoding results
      const validCoordinates = coordinates.filter(coord => coord != null);

      if (validCoordinates.length >= 2) {
        try {
          // Try driving route first
          const result = await directionsService.route({
            origin: stops[0].location,
            destination: stops[stops.length - 1].destination || stops[stops.length - 1].location,
            waypoints: stops.slice(1, -1).map(stop => ({
              location: stop.destination || stop.location,
              stopover: true
            })),
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: false
          });

          if (directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
          }
        } catch (drivingError) {
          console.log('Driving route failed, drawing flight path instead');
          // If driving route fails, draw flight path
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setMap(null);
          }

          // Draw geodesic lines between points
          for (let i = 0; i < validCoordinates.length - 1; i++) {
            const flightPath = new google.maps.Polyline({
              path: [validCoordinates[i], validCoordinates[i + 1]],
              geodesic: true,
              strokeColor: '#16A34A',
              strokeOpacity: 0.8,
              strokeWeight: 3,
              map: mapInstanceRef.current
            });
          }
        }
      }

      // Add markers for each stop
      stops.forEach(async (stop, index) => {
        if (validCoordinates[index]) {
          const marker = new google.maps.Marker({
            position: validCoordinates[index],
            map: mapInstanceRef.current,
            title: stop.location,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#16A34A',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <p class="font-medium">Stop ${index + 1}</p>
                <p>Location: ${stop.location}</p>
                ${stop.destination ? `<p>Destination: ${stop.destination}</p>` : ''}
                <p>Handler: ${stop.handler?.name || 'Not assigned'}</p>
                <p>Duration: ${formatTime(stop.durationAtStop)}</p>
                <p>Temperature: ${stop.tempMin}°C - ${stop.tempMax}°C</p>
                <p>Humidity: ${stop.humidityMin}% - ${stop.humidityMax}%</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindowsRef.current.forEach(window => window.close());
            infoWindow.open(mapInstanceRef.current, marker);
          });

          markersRef.current.push(marker);
          infoWindowsRef.current.push(infoWindow);
        }
      });

      // Fit bounds to show all markers
      const bounds = new google.maps.LatLngBounds();
      validCoordinates.forEach(coord => bounds.extend(coord));
      mapInstanceRef.current.fitBounds(bounds);

    } catch (error) {
      console.error('Map update error:', error);
    }
  };

  return (
    <div ref={mapRef} className="w-full h-[400px] rounded-lg" />
  );
}
