import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const qualityData = {
  labels: ['Aroma', 'Flavor', 'Potency', 'Smoothness', 'Appearance'],
  datasets: [
    {
      label: 'Quality Score',
      data: [9, 8, 7, 8, 9],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    r: {
      angleLines: {
        display: false
      },
      suggestedMin: 0,
      suggestedMax: 10
    }
  },
};

const QualityCharts: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quality Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Radar data={qualityData} options={options} />
      </CardContent>
    </Card>
  );
};

export default QualityCharts;