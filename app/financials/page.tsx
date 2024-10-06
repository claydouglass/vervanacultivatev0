"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select } from "@/components/ui/select";

const batchData = {
  "Kandy Terpz (Room 101)": [
    { category: "Labor", cost: 0.60 },
    { category: "Facility", cost: 0.30 },
    { category: "Energy", cost: 0.25 },
    { category: "Nutrients", cost: 0.15 },
    { category: "Clones/Seeds", cost: 0.10 },
    { category: "Other Inputs", cost: 0.10 },
  ],
  "Papaya Terpz (Room 102)": [
    { category: "Labor", cost: 0.55 },
    { category: "Facility", cost: 0.28 },
    { category: "Energy", cost: 0.22 },
    { category: "Nutrients", cost: 0.13 },
    { category: "Clones/Seeds", cost: 0.08 },
    { category: "Other Inputs", cost: 0.04 },
  ],
  "Mint Terpz (Room 103)": [
    { category: "Labor", cost: 0.57 },
    { category: "Facility", cost: 0.29 },
    { category: "Energy", cost: 0.24 },
    { category: "Nutrients", cost: 0.14 },
    { category: "Clones/Seeds", cost: 0.07 },
    { category: "Other Inputs", cost: 0.04 },
  ],
} as const;

type BatchName = keyof typeof batchData;

const previousBatchData = {
  "Kandy Terpz (Room 101)": { min: 1.40, max: 1.55 },
  "Papaya Terpz (Room 102)": { min: 1.25, max: 1.35 },
  "Mint Terpz (Room 103)": { min: 1.30, max: 1.40 },
} as const;

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Financials() {
  const [selectedBatch, setSelectedBatch] = useState<BatchName>("Kandy Terpz (Room 101)");
  const currentBatchData = batchData[selectedBatch];
  const totalCost = currentBatchData.reduce((sum, item) => sum + item.cost, 0);

  const chartData = [
    {
      name: selectedBatch,
      ...Object.fromEntries(currentBatchData.map(item => [item.category, item.cost]))
    }
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Financials</h2>
      <div className="mb-6">
        <Select
          options={Object.keys(batchData) as BatchName[]}
          defaultValue={selectedBatch}
          onValueChange={(value) => setSelectedBatch(value as BatchName)}
          placeholder="Select batch"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{selectedBatch} Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Category</TableHead>
                  <TableHead className="w-1/3 text-right">Cost ($)</TableHead>
                  <TableHead className="w-1/3 text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBatchData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-right">{item.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{((item.cost / totalCost) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{totalCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{selectedBatch} Cost Visualization</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {currentBatchData.map((item, index) => (
                  <Bar key={item.category} dataKey={item.category} stackId="a" fill={COLORS[index % COLORS.length]} />
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Batch Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead className="text-right">Current Cost</TableHead>
                <TableHead className="text-right">Previous Cost Range</TableHead>
                <TableHead className="text-right">Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(Object.keys(batchData) as BatchName[]).map((batchName) => {
                const currentCost = batchData[batchName].reduce((sum, item) => sum + item.cost, 0);
                const { min, max } = previousBatchData[batchName];
                const avgPreviousCost = (min + max) / 2;
                const difference = ((currentCost - avgPreviousCost) / avgPreviousCost * 100).toFixed(1);
                return (
                  <TableRow key={batchName}>
                    <TableCell className="font-medium">{batchName}</TableCell>
                    <TableCell className="text-right">${currentCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${min.toFixed(2)} - ${max.toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${Number(difference) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {difference}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}