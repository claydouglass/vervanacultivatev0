'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Suggestion = {
  cultivationSuggestions: string[];
  processingSuggestions: string[];
};

type ProductData = {
  id: string;
  name: string;
  batches: {
    id: string;
    name: string;
    suggestions: Suggestion;
  }[];
  geographies: string[];
};

const mockProductData: ProductData[] = [
  {
    id: '1',
    name: 'Kandy Terpz',
    batches: [
      {
        id: 'KT-2023-05-A',
        name: 'KT-2023-05-A',
        suggestions: {
          cultivationSuggestions: [
            'Increase light intensity by 10% during weeks 3-6 of flowering to boost THC content',
            'Maintain VPD between 1.0-1.2 kPa during vegetative stage to optimize growth rate',
            'Implement a more aggressive defoliation strategy in week 3 of flowering to improve light penetration',
          ],
          processingSuggestions: [
            'Extend the drying process to 14-16 days at 60% humidity and 60°F to preserve more terpenes',
            'Implement a 4-week cure with Boveda packs to maintain 62% humidity levels',
            'Harvest when 20-30% of trichomes are amber for a more balanced effect profile',
          ],
        },
      },
      // Add more batches here
    ],
    geographies: ['UK', 'DE', 'AU', 'CH', 'CA'],
  },
  // Add more products here
];

export default function Recommendations() {
  const [selectedProduct, setSelectedProduct] = useState<string>(mockProductData[0].id);
  const [selectedBatch, setSelectedBatch] = useState<string>(mockProductData[0].batches[0].id);
  const [selectedGeography, setSelectedGeography] = useState<string>(mockProductData[0].geographies[0]);
  const [showComparison, setShowComparison] = useState(false);

  const currentProduct = mockProductData.find(p => p.id === selectedProduct);
  const currentBatch = currentProduct?.batches.find(b => b.id === selectedBatch);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Select onValueChange={setSelectedProduct} value={selectedProduct}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {mockProductData.map(product => (
                <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedBatch} value={selectedBatch}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {currentProduct?.batches.map(batch => (
                <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedGeography} value={selectedGeography}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select geography" />
            </SelectTrigger>
            <SelectContent>
              {currentProduct?.geographies.map(geo => (
                <SelectItem key={geo} value={geo}>{geo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowComparison(!showComparison)}>
            {showComparison ? 'Hide Comparison' : 'Show Comparison'}
          </Button>
        </div>

        {currentBatch && (
          <div className="mb-8 p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Product: {currentProduct?.name} (Current Batch: {currentBatch.name})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="text-lg font-medium mb-2">Cultivation Suggestions:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {currentBatch.suggestions.cultivationSuggestions.map((s, index) => (
                    <li key={index} className="mb-1">{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-2">Processing Suggestions:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {currentBatch.suggestions.processingSuggestions.map((s, index) => (
                    <li key={index} className="mb-1">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {showComparison && (
          <div className="mb-8 p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Comparison</h3>
            <p>Comparison data for previous batches and competitors would go here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}