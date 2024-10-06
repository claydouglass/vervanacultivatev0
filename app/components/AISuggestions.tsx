// components/AISuggestions.tsx

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AISuggestionsProps {
  product: string;
  batch: string;
  market: string;
  goal: string;
}

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
            'Increase CO2 levels to 1200-1500 ppm during peak flowering to enhance bud density',
            'Adjust nutrient ratios to 3-1-2 (N-P-K) during late flowering to enhance terpene production',
          ],
          processingSuggestions: [
            'Extend the drying process to 14-16 days at 60% humidity and 60°F to preserve more terpenes',
            'Implement a 4-week cure with Boveda packs to maintain 62% humidity levels',
            'Perform a cold water wash for 24 hours before drying to potentially enhance flavor profile',
            'Implement a two-stage trimming process: rough trim after drying, final trim before packaging',
            'Use a UV-C light treatment during the last week of curing to reduce potential microbial contamination',
          ],
        },
      },
    ],
  },
  // Add more products here
];

const AISuggestions: React.FC<AISuggestionsProps> = ({ product, batch, market, goal }) => {
  // Find the product and batch to get specific suggestions
  const selectedProduct = mockProductData.find(p => p.name === product);
  const selectedBatch = selectedProduct?.batches.find(b => b.name === batch);

  if (!selectedBatch) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Product Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No suggestions available for the selected batch.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Product Improvement Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-6 border rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Product: {product}</h3>
          <h4 className="text-lg font-medium mb-2">Batch: {batch}</h4>
          <h5 className="font-medium mb-2">Market: {market}</h5>
          <h5 className="font-medium mb-2">Goal: {goal}</h5>
          <div className="mt-4">
            <h5 className="font-medium mb-2">Cultivation Suggestions:</h5>
            <ul className="list-disc pl-5">
              {selectedBatch.suggestions.cultivationSuggestions.map((suggestion, index) => (
                <li key={index} className="mb-2">{suggestion}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h5 className="font-medium mb-2">Processing Suggestions:</h5>
            <ul className="list-disc pl-5">
              {selectedBatch.suggestions.processingSuggestions.map((suggestion, index) => (
                <li key={index} className="mb-2">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISuggestions;