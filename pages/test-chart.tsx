// pages/test-chart.tsx

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { day: 1, temperature: 23.5, humidity: 65 },
  { day: 10, temperature: 24.0, humidity: 60 },
  { day: 20, temperature: 24.2, humidity: 58 },
  { day: 30, temperature: 24.5, humidity: 56 },
  { day: 40, temperature: 24.3, humidity: 55 },
];

export default function TestChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis yAxisId="left" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" />
        <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}