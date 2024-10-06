import React from 'react';
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

const goalData = {
  labels: ['Relaxation', 'Pain Relief', 'Sleep Aid', 'Anxiety Relief', 'Creativity'],
  datasets: [
    {
      label: 'Effectiveness',
      data: [8, 7, 6, 9, 7],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 10,
    },
  },
};

const GoalCharts: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Goal Effectiveness</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar data={goalData} options={options} />
      </CardContent>
    </Card>
  );
};

export default GoalCharts;