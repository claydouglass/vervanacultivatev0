'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductMetrics from '../components/ProductMetrics';
import SocialMetrics from '../components/SocialMetrics';
import PerformanceCharts from '../components/PerformanceCharts';
import ProductRankings from '../components/ProductRankings';

const products = ['Kandy Terpz', 'Blue Dream Haze', 'OG Kush Premium'];
const batches = ['KT-2023-05-A', 'BD-2023-06-B', 'OGK-2023-07-A'];
const markets = ['UK', 'DE', 'AU', 'CH', 'CA'];
const goals = ['Anxiety Relief', 'Pain Management', 'Sleep Aid', 'Relaxation', 'Focus', 'Creativity', 'Appetite', 'Nausea Relief', 'Stress Relief', 'Mood Elevation'];

// Update this mock rankings data to be less volatile
const mockRankings = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2023, 4, i + 1).toISOString().split('T')[0], // May 1 to May 30
  rank: 5 + Math.floor(Math.random() * 3) - 1, // Random rank between 4 and 6
  totalProducts: 20,
}));

// Update mock competitor data to use real names and be less volatile
const mockCompetitors = [
  'Chill Vibes', 'Green Serenity', 'Zen Leaf', 'Harmony Haze', 'Blissful Buds',
  'Tranquil Tokes', 'Euphoria Elixir', 'Calm Cultivar', 'Soothing Strains', 'Relaxation Remedy'
].map((name, index) => ({
  name,
  rankings: Array.from({ length: 30 }, (_, j) => ({
    date: new Date(2023, 4, j + 1).toISOString().split('T')[0],
    rank: 3 + index + Math.floor(Math.random() * 3) - 1, // Rank based on index, with small random fluctuation
    totalProducts: 20,
  })),
}));

// Update mock sub-rankings data
const mockSubRankings = [
  { category: 'Taste', rank: 10, totalProducts: 20 },
  { category: 'Aroma', rank: 12, totalProducts: 20 },
  { category: 'Effect', rank: 8, totalProducts: 20 },
  { category: 'Potency', rank: 9, totalProducts: 20 },
];

export default function ConsumerPage() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedBatch, setSelectedBatch] = useState(batches[0]);
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);
  const [summary, setSummary] = useState<string[]>([]);
  const [podcastLink, setPodcastLink] = useState('');

  useEffect(() => {
    fetchLatestData();
  }, [selectedProduct, selectedBatch, selectedMarket]);

  const fetchLatestData = () => {
    // This would be replaced with an actual API call
    setSummary([
      `${selectedProduct} engagement increased by 15% in ${selectedMarket}`,
      `Customer satisfaction for ${selectedProduct} improved by 8% after recent cultivation changes`,
      `New packaging for ${selectedProduct} resulted in 20% more shares on social media`
    ]);
    setPodcastLink("https://example.com/podcast/latest-consumer-insights");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Consumer Insights</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Select onValueChange={setSelectedProduct} value={selectedProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Product" />
          </SelectTrigger>
          <SelectContent>
            {products.map(product => (
              <SelectItem key={product} value={product}>{product}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedBatch} value={selectedBatch}>
          <SelectTrigger>
            <SelectValue placeholder="Batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map(batch => (
              <SelectItem key={batch} value={batch}>{batch}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedMarket} value={selectedMarket}>
          <SelectTrigger>
            <SelectValue placeholder="Market" />
          </SelectTrigger>
          <SelectContent>
            {markets.map(market => (
              <SelectItem key={market} value={market}>{market}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedGoal} value={selectedGoal}>
          <SelectTrigger>
            <SelectValue placeholder="Consumer Goals" />
          </SelectTrigger>
          <SelectContent>
            {goals.map(goal => (
              <SelectItem key={goal} value={goal}>{goal}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Latest Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 mb-4">
            {summary.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <Button onClick={() => window.open(podcastLink, '_blank')} className="mt-4">
            Listen to Latest Podcast
          </Button>
        </CardContent>
      </Card>

      <ProductRankings 
        product={selectedProduct}
        market={selectedMarket}
        indication={selectedGoal}
        rankings={mockRankings}
        competitors={mockCompetitors}
      />
      
      <SocialMetrics 
        product={selectedProduct}
        batch={selectedBatch}
        market={selectedMarket}
      />
      
      <PerformanceCharts 
        product={selectedProduct}
        batch={selectedBatch}
        market={selectedMarket}
      />
      
      <ProductMetrics 
        product={selectedProduct}
        batch={selectedBatch}
        market={selectedMarket}
      />
    </div>
  );
}