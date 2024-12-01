'use client';

import React, { useState } from 'react';
import { Select } from "@/components/ui/select";
import BatchAvailability from '../components/BatchAvailability';
import ExportLicenses from '../components/ExportLicenses';
import ShippingRoutes from '../components/ShippingRoutes';
import LiveTracker from '../components/LiveTracker';
import ElproTracker from '../components/ElproTracker';
import ElproTest from '../components/ElproTest';
import ShipmentTrackingMap from '../components/ShipmentTrackingMap';

const products = ['Kandy Terpz', 'Papaya Terpz', 'Mint Terpz'];
const batches = ['KT-2023-05-A', 'PT-2023-06-B', 'MT-2023-07-A'];
const locations = ['UK', 'Germany', 'Australia', 'Switzerland', 'Canada'];
const shippingPartners = ['Rhenus', 'Bolore', 'DHL', 'UPS', 'Local Courier'];
const buyers = ['Dispensary A', 'Wholesaler B', 'Distributor C'];

const LogisticsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [selectedShippingPartner, setSelectedShippingPartner] = useState(shippingPartners[0]);
  const [selectedBuyer, setSelectedBuyer] = useState(buyers[0]);

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
      <h1 className="text-2xl font-bold mb-4">Logistics Dashboard</h1>
      
      {/* Tracking Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Shipments</h2>
        <ShipmentTrackingMap shipmentLocations={sampleLocations} />
      </section>

      {/* Other logistics sections can go here */}
    </div>
  );
};

export default LogisticsPage;