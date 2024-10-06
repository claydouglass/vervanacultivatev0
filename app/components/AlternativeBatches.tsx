'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AlternativeBatch = {
  id: string;
  batchNumber: string;
  strain: string;
  thcContent: number;
  cbdContent: number;
  availability: number;
};

const alternativeBatches: AlternativeBatch[] = [
  {
    id: '1',
    batchNumber: 'BD-2023-06-B',
    strain: 'Blue Dream',
    thcContent: 19.2,
    cbdContent: 0.4,
    availability: 500
  },
  {
    id: '2',
    batchNumber: 'OGK-2023-07-A',
    strain: 'OG Kush',
    thcContent: 23.1,
    cbdContent: 0.1,
    availability: 300
  },
  // Add more alternative batches here
];

export default function AlternativeBatches() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Alternative Batches Available</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alternativeBatches.map((batch) => (
            <div key={batch.id} className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{batch.strain} - {batch.batchNumber}</h3>
              <p><strong>THC:</strong> {batch.thcContent}%</p>
              <p><strong>CBD:</strong> {batch.cbdContent}%</p>
              <p><strong>Available:</strong> {batch.availability} units</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}