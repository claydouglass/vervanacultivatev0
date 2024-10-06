'use client';

import React, { useState } from 'react';
import { Select } from "@/components/ui/select";
import BatchAvailability from '../components/BatchAvailability';
import ExportLicenses from '../components/ExportLicenses';
import ShippingRoutes from '../components/ShippingRoutes';
import LiveTracker from '../components/LiveTracker';

const products = ['Kandy Terpz', 'Papaya Terpz', 'Mint Terpz'];
const batches = ['KT-2023-05-A', 'PT-2023-06-B', 'MT-2023-07-A'];
const locations = ['UK', 'Germany', 'Australia', 'Switzerland', 'Canada'];
const shippingPartners = ['Rhenus', 'DHL', 'UPS', 'Local Courier'];
const buyers = ['Dispensary A', 'Wholesaler B', 'Distributor C'];

const LogisticsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [selectedShippingPartner, setSelectedShippingPartner] = useState(shippingPartners[0]);
  const [selectedBuyer, setSelectedBuyer] = useState(buyers[0]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Logistics Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Select
          options={products.map(product => ({ label: product, value: product }))}
          defaultValue={selectedProduct}
          onValueChange={setSelectedProduct}
          placeholder="Product"
        />

        <Select
          options={batches.map(batch => ({ label: batch, value: batch }))}
          defaultValue={selectedBatch}
          onValueChange={setSelectedBatch}
          placeholder="Batch"
        />

        <Select
          options={locations.map(location => ({ label: location, value: location }))}
          defaultValue={selectedLocation}
          onValueChange={setSelectedLocation}
          placeholder="Location"
        />

        <Select
          options={shippingPartners.map(partner => ({ label: partner, value: partner }))}
          defaultValue={selectedShippingPartner}
          onValueChange={setSelectedShippingPartner}
          placeholder="Shipping Partner"
        />

        <Select
          options={buyers.map(buyer => ({ label: buyer, value: buyer }))}
          defaultValue={selectedBuyer}
          onValueChange={setSelectedBuyer}
          placeholder="Buyer"
        />
      </div>

      <BatchAvailability product={selectedProduct} batch={selectedBatch} />
      <ExportLicenses product={selectedProduct} batch={selectedBatch} location={selectedLocation} />
      <ShippingRoutes 
        product={selectedProduct} 
        batch={selectedBatch} 
        location={selectedLocation}
        shippingPartner={selectedShippingPartner}
        buyer={selectedBuyer}
      />
      <LiveTracker product={selectedProduct} batch={selectedBatch} shippingPartner={selectedShippingPartner} />
    </div>
  );
};

export default LogisticsPage;