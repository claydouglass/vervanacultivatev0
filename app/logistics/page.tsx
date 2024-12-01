'use client';

import React, { useState } from 'react';
import { Select } from "@/components/ui/select";
import BatchAvailability from '../components/BatchAvailability';
import ExportLicenses from '../components/ExportLicenses';
import ShippingRoutes from '../components/ShippingRoutes';
import LiveTracker from '../components/LiveTracker';
import ElproTracker from '../components/ElproTracker';
import ElproTest from '../components/ElproTest';

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
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Logistics Tracking</h1>
      <ElproTracker batch="KT-2023-05-A" />
    </div>
  );
};

export default LogisticsPage;