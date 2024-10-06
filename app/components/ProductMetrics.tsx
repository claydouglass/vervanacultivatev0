'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type SocialMetrics = {
  likes: number;
  comments: number;
  views: number;
  shares: number;
  rating: number;
  wishlist: number;
};

type Geography = {
  country: string;
  socialMetrics: SocialMetrics;
};

type Product = {
  id: string;
  name: string;
  lineage: string;
  thcContent: number;
  cbdContent: number;
  totalTerpenes: number;
  terpeneProfile: { [key: string]: number };
  currentBatch: {
    batchNumber: string;
    harvestDate: string;
    room: string;
    socialMetrics: SocialMetrics;
  };
  cultivationDecisions: string[];
  processingDecisions: string[];
  logisticsDecisions: string[];
  geographies: Geography[];
};

export default function ProductMetrics() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'Kandy Terpz',
          lineage: 'OG Kush x Durban Poison',
          thcContent: 22.5,
          cbdContent: 0.1,
          totalTerpenes: 2.8,
          terpeneProfile: { limonene: 0.8, myrcene: 0.5, caryophyllene: 0.3, pinene: 0.2, linalool: 0.1 },
          currentBatch: {
            batchNumber: 'KT-2023-05-A',
            harvestDate: '2023-05-10',
            room: 'Room 101',
            socialMetrics: { likes: 3000, comments: 550, views: 12000, shares: 800, rating: 4.7, wishlist: 450 },
          },
          cultivationDecisions: ['LED lighting', 'Coco coir medium', 'High-stress training'],
          processingDecisions: ['Slow dry for 16 days', 'Hand-trimmed', '5-week cure'],
          logisticsDecisions: ['Glass jar packaging', 'Refrigerated transport'],
          geographies: [
            { country: 'UK', socialMetrics: { likes: 1200, comments: 220, views: 5000, shares: 300, rating: 4.8, wishlist: 180 } },
            { country: 'DE', socialMetrics: { likes: 900, comments: 170, views: 3500, shares: 250, rating: 4.6, wishlist: 140 } },
            { country: 'AU', socialMetrics: { likes: 700, comments: 120, views: 2500, shares: 200, rating: 4.7, wishlist: 110 } },
            { country: 'CH', socialMetrics: { likes: 500, comments: 90, views: 1800, shares: 150, rating: 4.5, wishlist: 80 } },
            { country: 'CA', socialMetrics: { likes: 1000, comments: 200, views: 4000, shares: 280, rating: 4.8, wishlist: 160 } },
          ],
        },
        // ... (add similar data for other products)
      ]);
    }, 1000);
  }, []);

  const batchData = {
    labels: ['KT-2023-05-A', 'BD-2023-06-B', 'GSC-2023-07-C', 'AK-2023-08-D'],
    datasets: [
      {
        label: 'Likes',
        data: [3000, 2500, 3500, 2800],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Comments',
        data: [550, 480, 620, 530],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Views',
        data: [12000, 10000, 13000, 11000],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
      {
        label: 'Wishlist',
        data: [450, 400, 500, 420],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="space-y-8">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Lineage:</span> {product.lineage}</p>
                  <p><span className="font-medium">THC:</span> {product.thcContent}% | <span className="font-medium">CBD:</span> {product.cbdContent}%</p>
                  <p><span className="font-medium">Total Terpenes:</span> {product.totalTerpenes}%</p>
                  <p><span className="font-medium">Current Batch:</span> {product.currentBatch.batchNumber}</p>
                  <p><span className="font-medium">Harvest Date:</span> {product.currentBatch.harvestDate}</p>
                  <p><span className="font-medium">Room:</span> {product.currentBatch.room}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Terpene Profile</h3>
                <div className="space-y-2">
                  {Object.entries(product.terpeneProfile).map(([terpene, value]) => (
                    <div key={terpene} className="flex justify-between">
                      <span className="capitalize">{terpene}:</span>
                      <span>{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Social Engagement</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-2 bg-blue-100 rounded">
                  <p className="text-2xl font-bold">{product.currentBatch.socialMetrics.likes}</p>
                  <p className="text-sm">Likes</p>
                </div>
                <div className="text-center p-2 bg-green-100 rounded">
                  <p className="text-2xl font-bold">{product.currentBatch.socialMetrics.comments}</p>
                  <p className="text-sm">Comments</p>
                </div>
                <div className="text-center p-2 bg-yellow-100 rounded">
                  <p className="text-2xl font-bold">{product.currentBatch.socialMetrics.views}</p>
                  <p className="text-sm">Views</p>
                </div>
                <div className="text-center p-2 bg-purple-100 rounded">
                  <p className="text-2xl font-bold">{product.currentBatch.socialMetrics.shares}</p>
                  <p className="text-sm">Shares</p>
                </div>
                <div className="text-center p-2 bg-pink-100 rounded">
                  <p className="text-2xl font-bold">{product.currentBatch.socialMetrics.rating}</p>
                  <p className="text-sm">Rating</p>
                </div>
                <div className="text-center p-2 bg-indigo-100 rounded">
                  <p className="text-2xl font-bold">{product.currentBatch.socialMetrics.wishlist}</p>
                  <p className="text-sm">Wishlist</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Production Decisions</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Cultivation:</span> {product.cultivationDecisions.join(', ')}</p>
                <p><span className="font-medium">Processing:</span> {product.processingDecisions.join(', ')}</p>
                <p><span className="font-medium">Logistics:</span> {product.logisticsDecisions.join(', ')}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Geographical Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2">Country</th>
                      <th className="text-right p-2">Likes</th>
                      <th className="text-right p-2">Comments</th>
                      <th className="text-right p-2">Views</th>
                      <th className="text-right p-2">Shares</th>
                      <th className="text-right p-2">Rating</th>
                      <th className="text-right p-2">Wishlist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.geographies.map((geo, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{geo.country}</td>
                        <td className="text-right p-2">{geo.socialMetrics.likes}</td>
                        <td className="text-right p-2">{geo.socialMetrics.comments}</td>
                        <td className="text-right p-2">{geo.socialMetrics.views}</td>
                        <td className="text-right p-2">{geo.socialMetrics.shares}</td>
                        <td className="text-right p-2">{geo.socialMetrics.rating}</td>
                        <td className="text-right p-2">{geo.socialMetrics.wishlist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Social Engagement by Batch</h3>
              <Bar data={batchData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}