'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BatchAvailability from '../components/BatchAvailability';
import ExportLicenses from '../components/ExportLicenses';
import ShippingRoutes from '../components/ShippingRoutes';
import LiveTracker from '../components/LiveTracker';

const products = ['Kandy Terpz', 'Blue Dream Haze', 'OG Kush Premium'];
const batches = ['KT-2023-05-A', 'BD-2023-06-B', 'OGK-2023-07-A'];
const locations = ['UK', 'Germany', 'Australia', 'Switzerland', 'Canada'];
const shippingPartners = ['FedEx', 'DHL', 'UPS', 'Local Courier'];
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
        <Select onValueChange={setSelectedProduct} value={selectedProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product} value={product}>{product}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={setSelectedBatch} value={selectedBatch}>
          <SelectTrigger>
            <SelectValue placeholder="Batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={batch} value={batch}>{batch}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={setSelectedLocation} value={selectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={setSelectedShippingPartner} value={selectedShippingPartner}>
          <SelectTrigger>
            <SelectValue placeholder="Shipping Partner" />
          </SelectTrigger>
          <SelectContent>
            {shippingPartners.map((partner) => (
              <SelectItem key={partner} value={partner}>{partner}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={setSelectedBuyer} value={selectedBuyer}>
          <SelectTrigger>
            <SelectValue placeholder="Buyer" />
          </SelectTrigger>
          <SelectContent>
            {buyers.map((buyer) => (
              <SelectItem key={buyer} value={buyer}>{buyer}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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