'use client';

import React, { useState } from 'react';
import { Select } from "@/components/ui/select";
import ProductMetrics from "../components/ProductMetrics";
import PerformanceCharts from "../components/PerformanceCharts";
import ProductRankings from "../components/ProductRankings";
import AlternativeProducts from "../components/AlternativeProducts";
import AISuggestions from "../components/AISuggestions";

const products = ['Kandy Terpz', 'Papaya Terpz', 'Mint Terpz'];
const batches = ['KT-2023-05-A', 'BD-2023-06-B', 'OGK-2023-07-A'];
const markets = ['UK', 'DE', 'AU', 'CH', 'CA'];
const goals = ['Anxiety Relief', 'Pain Management', 'Sleep Aid', 'Mood Enhancement'];

export default function ConsumerPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]);
  const [selectedBatch, setSelectedBatch] = useState<string>(batches[0]);
  const [selectedMarket, setSelectedMarket] = useState<string>(markets[0]);
  const [selectedGoal, setSelectedGoal] = useState<string>(goals[0]);

  // Mock data for rankings and competitors
  const mockRankings = [
    { date: '2023-01-01', rank: 10 },
    { date: '2023-02-01', rank: 8 },
    { date: '2023-03-01', rank: 6 },
    { date: '2023-04-01', rank: 5 },
    { date: '2023-05-01', rank: 4 },
    { date: '2023-06-01', rank: 3 },
    { date: '2023-07-01', rank: 2 },
    { date: '2023-08-01', rank: 1 },
  ];

  const mockCompetitors = [
    { name: 'Blue Dream Haze', rank: 2 },
    { name: 'OG Kush Premium', rank: 3 },
    { name: 'Papaya Terpz', rank: 5 },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Consumer</h1>

      {/* Flex Container for Dropdowns */}
      <div className="flex items-center space-x-4 mb-6"> {/* Use items-center for vertical alignment */}
        <div className="h-10">
          <Select
            options={products.map((product) => ({
              label: product,
              value: product,
            }))}
            defaultValue={selectedProduct}
            onValueChange={setSelectedProduct}
            placeholder="Select Product"
          />
        </div>
        <Select
          options={batches.map((batch) => ({
            label: batch,
            value: batch,
          }))}
          defaultValue={selectedBatch}
          onValueChange={setSelectedBatch}
          placeholder="Select Batch"
          className="h-10" /* Set consistent height */
        />
        <Select
          options={markets.map((market) => ({
            label: market,
            value: market,
          }))}
          defaultValue={selectedMarket}
          onValueChange={setSelectedMarket}
          placeholder="Select Market"
          className="h-10" /* Set consistent height */
        />
        <Select
          options={goals.map((goal) => ({
            label: goal,
            value: goal,
          }))}
          defaultValue={selectedGoal}
          onValueChange={setSelectedGoal}
          placeholder="Select Goal"
          className="h-10" /* Set consistent height */
        />
      </div>

      <div className="mb-8">
        <ProductMetrics 
          product={selectedProduct}
          batch={selectedBatch}
          market={selectedMarket}
        />
      </div>

      <div className="mb-8">
        <PerformanceCharts 
          product={selectedProduct}
          batch={selectedBatch}
          market={selectedMarket}
        />
      </div>

      <div className="mb-8">
        <ProductRankings 
          product={selectedProduct}
          market={selectedMarket}
          indication={selectedGoal}
          rankings={mockRankings} // Replace with actual data
          competitors={mockCompetitors} // Replace with actual data
        />
      </div>

      <div className="mb-8">
        <AlternativeProducts 
          product={selectedProduct}
          batch={selectedBatch}
          market={selectedMarket}
        />
      </div>

      <div className="mb-8">
        <AISuggestions 
          product={selectedProduct}
          batch={selectedBatch}
          market={selectedMarket}
          goal={selectedGoal}
        />
      </div>
    </div>
  );
}