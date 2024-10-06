'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import ProductMetrics from '../components/ProductMetrics';
import PerformanceCharts from '../components/PerformanceCharts';
import ProductRankings from '../components/ProductRankings';
import AlternativeProducts from '../components/AlternativeProducts';
import AISuggestions from '../components/AISuggestions';

const products = ['Kandy Terpz', 'Blue Dream Haze', 'OG Kush Premium'];
const batches = ['KT-2023-05-A', 'BD-2023-06-B', 'OGK-2023-07-A'];
const markets = ['UK', 'DE', 'AU', 'CH', 'CA'];
const goals = ['Anxiety Relief', 'Pain Management', 'Sleep Aid', 'Mood Enhancement'];

const ConsumerPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Consumer Insights</h1>

      <div className="flex space-x-4 mb-6">
        <Select
          options={products.map(product => ({ label: product, value: product }))}
          defaultValue={selectedProduct}
          onValueChange={setSelectedProduct}
          placeholder="Select Product"
        />
        <Select
          options={batches.map(batch => ({ label: batch, value: batch }))}
          defaultValue={selectedBatch}
          onValueChange={setSelectedBatch}
          placeholder="Select Batch"
        />
        <Select
          options={markets.map(market => ({ label: market, value: market }))}
          defaultValue={selectedMarket}
          onValueChange={setSelectedMarket}
          placeholder="Select Market"
        />
        <Select
          options={goals.map(goal => ({ label: goal, value: goal }))}
          defaultValue={selectedGoal}
          onValueChange={setSelectedGoal}
          placeholder="Select Goal"
        />
      </div>

      <Tabs defaultValue="latest" className="mb-8">
        <TabsList>
          <TabsTrigger value="latest">Latest Insights</TabsTrigger>
          <TabsTrigger value="podcast">Listen to Latest Podcast</TabsTrigger>
        </TabsList>
        <TabsContent value="latest">
          {/* Latest Insights content */}
        </TabsContent>
        <TabsContent value="podcast">
          {/* Podcast content */}
        </TabsContent>
      </Tabs>

      <ProductMetrics 
        product={selectedProduct}
        batch={selectedBatch}
        market={selectedMarket}
      />
      
      <PerformanceCharts 
        product={selectedProduct}
        batch={selectedBatch}
        market={selectedMarket}
      />
      
      <ProductRankings 
        product={selectedProduct}
        market={selectedMarket}
        indication={selectedGoal}
        rankings={[]} // Replace with actual data
        competitors={[]} // Replace with actual data
      />
      
      <AlternativeProducts 
        product={selectedProduct}
        batch={selectedBatch}
        market={selectedMarket}
      />
      
      <AISuggestions 
        product={selectedProduct}
        batch={selectedBatch}
        market={selectedMarket}
        goal={selectedGoal}
      />
    </div>
  );
};

export default ConsumerPage;