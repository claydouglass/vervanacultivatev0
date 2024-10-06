'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Batch = {
  batchNumber: string;
  harvestDate: string;
  cureTime: number;
  trimMethod: string;
  packagingType: string;
};

type Product = {
  id: string;
  name: string;
  strain: string;
  thcContent: number;
  cbdContent: number;
  terpeneProfile: { [key: string]: number };
  currentBatch: Batch;
  previousBatches: Batch[];
  customerFeedback: string[];
};

const productDetails: Product[] = [
  {
    id: '1',
    name: 'Blue Dream Haze',
    strain: 'Blue Dream',
    thcContent: 18.5,
    cbdContent: 0.5,
    terpeneProfile: { myrcene: 0.5, limonene: 0.3, caryophyllene: 0.2 },
    currentBatch: {
      batchNumber: 'BD-2023-05-A',
      harvestDate: '2023-05-15',
      cureTime: 28,
      trimMethod: 'Hand-trimmed',
      packagingType: 'Glass jar',
    },
    previousBatches: [],
    customerFeedback: [
      "Smooth smoke, great for daytime use",
      "Loved the fruity aroma",
      "Helped with my anxiety without making me too sleepy"
    ]
  },
  // Add more product details here
];

export default function DetailedBatchView() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Detailed Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        {productDetails.map((product) => (
          <div key={product.id} className="mb-6 p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Strain:</strong> {product.strain}</p>
                <p><strong>THC:</strong> {product.thcContent}%</p>
                <p><strong>CBD:</strong> {product.cbdContent}%</p>
                <p><strong>Current Batch:</strong> {product.currentBatch.batchNumber}</p>
                <p><strong>Harvest Date:</strong> {product.currentBatch.harvestDate}</p>
                <p><strong>Cure Time:</strong> {product.currentBatch.cureTime} days</p>
              </div>
              <div>
                <p><strong>Trim Method:</strong> {product.currentBatch.trimMethod}</p>
                <p><strong>Packaging:</strong> {product.currentBatch.packagingType}</p>
                <p><strong>Terpenes:</strong></p>
                <ul>
                  {Object.entries(product.terpeneProfile).map(([terpene, value]) => (
                    <li key={terpene}>{terpene}: {value}%</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Customer Feedback:</h4>
              <ul className="list-disc pl-5">
                {product.customerFeedback.map((feedback, index) => (
                  <li key={index}>{feedback}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}