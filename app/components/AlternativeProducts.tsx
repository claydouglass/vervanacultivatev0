// components/AlternativeProducts.tsx

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AlternativeProductsProps {
  product: string;
  batch: string;
  market: string;
}

type Batch = {
  batchNumber: string;
  cultivator: string;
  location: string;
  releaseDate: string;
  availability: number;
};

type Product = {
  id: string;
  name: string;
  strain: string;
  thcContent: number;
  cbdContent: number;
  currentBatch: Batch;
  previousBatches: Batch[];
};

const alternativeProducts: Product[] = [
  {
    id: '1',
    name: 'Blue Dream Haze',
    strain: 'Blue Dream',
    thcContent: 19.2,
    cbdContent: 0.4,
    currentBatch: {
      batchNumber: 'BD-2023-06-B',
      cultivator: 'Green Thumb Farms',
      location: 'Greenhouse A',
      releaseDate: '2023-06-15',
      availability: 500
    },
    previousBatches: [
      {
        batchNumber: 'BD-2023-05-A',
        cultivator: 'Green Thumb Farms',
        location: 'Greenhouse B',
        releaseDate: '2023-05-01',
        availability: 0
      }
    ]
  },
  {
    id: '2',
    name: 'OG Kush Premium',
    strain: 'OG Kush',
    thcContent: 23.1,
    cbdContent: 0.1,
    currentBatch: {
      batchNumber: 'OGK-2023-07-A',
      cultivator: 'Mountain High Cultivators',
      location: 'Indoor Facility 2',
      releaseDate: '2023-07-10',
      availability: 300
    },
    previousBatches: [
      {
        batchNumber: 'OGK-2023-06-B',
        cultivator: 'Mountain High Cultivators',
        location: 'Indoor Facility 1',
        releaseDate: '2023-06-05',
        availability: 50
      }
    ]
  },
  // Add more alternative products here
];

const AlternativeProducts: React.FC<AlternativeProductsProps> = ({ product, batch, market }) => {
  // You can use the props to filter or customize the displayed products
  // For example, exclude the currently selected product
  const filteredProducts = alternativeProducts.filter(
    (p) => p.name !== product
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Alternative Products Available</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p>
                <strong>Strain:</strong> {product.strain}
              </p>
              <p>
                <strong>THC:</strong> {product.thcContent}% |{' '}
                <strong>CBD:</strong> {product.cbdContent}%
              </p>
              <div className="mt-4">
                <h4 className="font-medium">Current Batch:</h4>
                <p>
                  <strong>Batch:</strong> {product.currentBatch.batchNumber}
                </p>
                <p>
                  <strong>Cultivator:</strong> {product.currentBatch.cultivator}
                </p>
                <p>
                  <strong>Location:</strong> {product.currentBatch.location}
                </p>
                <p>
                  <strong>Release Date:</strong> {product.currentBatch.releaseDate}
                </p>
                <p>
                  <strong>Available:</strong> {product.currentBatch.availability} units
                </p>
              </div>
              {product.previousBatches.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium">Previous Batch:</h4>
                  <p>
                    <strong>Batch:</strong>{' '}
                    {product.previousBatches[0].batchNumber}
                  </p>
                  <p>
                    <strong>Release Date:</strong>{' '}
                    {product.previousBatches[0].releaseDate}
                  </p>
                  <p>
                    <strong>Available:</strong>{' '}
                    {product.previousBatches[0].availability} units
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativeProducts;