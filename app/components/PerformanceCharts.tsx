// components/PerformanceCharts.tsx

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line } from 'react-chartjs-2';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

interface PerformanceChartsProps {
  product: string;
  batch: string;
  market: string;
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ product, batch, market }) => {
  // Simulated data based on props
  const socialData = {
    labels: ['BD-2023-05-A', 'BD-2023-06-B', 'BD-2023-07-C', 'BD-2023-08-D'],
    datasets: [
      {
        label: 'Likes',
        data: [2500, 2000, 3000, 2200],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Comments',
        data: [450, 400, 600, 500],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Views',
        data: [10000, 8000, 12000, 9500],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const ratingData = {
    labels: ['BD-2023-05-A', 'BD-2023-06-B', 'BD-2023-07-C', 'BD-2023-08-D'],
    datasets: [
      {
        label: 'Customer Rating',
        data: [4.5, 4.2, 4.8, 4.3],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const geographicalEngagementData = {
    labels: ['UK', 'DE', 'AU', 'CH', 'CA'],
    datasets: [
      {
        label: 'Likes',
        data: [1000, 800, 600, 400, 900],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Comments',
        data: [200, 150, 100, 80, 180],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Views',
        data: [4000, 3000, 2000, 1500, 3500],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Performance Charts for {product}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Timeframe</SelectLabel>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="365d">Last year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Metric</SelectLabel>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="ratings">Ratings</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Region</SelectLabel>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="namerica">North America</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Social Engagement by Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={socialData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <Line data={ratingData} options={{ responsive: true }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Geographical Engagement Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={geographicalEngagementData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCharts;