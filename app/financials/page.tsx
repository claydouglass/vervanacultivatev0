"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart, Leaf, DollarSign, ClipboardList, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
};

const previousBatchData = {
  "Kandy Terpz (Room 101)": { min: 1.40, max: 1.55 },
  "Papaya Terpz (Room 102)": { min: 1.25, max: 1.35 },
  "Mint Terpz (Room 103)": { min: 1.30, max: 1.40 },
};

// Updated color palette
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Financials() {
  const [selectedBatch, setSelectedBatch] = useState("Kandy Terpz (Room 101)");
  const currentBatchData = batchData[selectedBatch];
  const totalCost = currentBatchData.reduce((sum, item) => sum + item.cost, 0);

  const chartData = [
    {
      name: selectedBatch,
      ...Object.fromEntries(currentBatchData.map(item => [item.category, item.cost]))
    }
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card text-card-foreground border-r border-border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Vervana Cultivate</h2>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <BarChart className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/rooms" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <Leaf className="w-4 h-4" />
              <span>Rooms</span>
            </Link>
            <Link href="/financials" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <DollarSign className="w-4 h-4" />
              <span>Financials</span>
            </Link>
            <Link href="/processing" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <ClipboardList className="w-4 h-4" />
              <span>Processing</span>
            </Link>
            <Link href="/staff" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <Users className="w-4 h-4" />
              <span>Staff</span>
            </Link>
            <Link href="/settings" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Financials</h2>
        <div className="mb-4">
          <Select
            options={Object.keys(batchData)}
            defaultValue={selectedBatch}
            onValueChange={setSelectedBatch}
            placeholder="Select batch"
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(batchData).map((batch) => (
                <SelectItem key={batch} value={batch}>{batch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedBatch}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Cost ($)</TableHead>
                    <TableHead>% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBatchData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.cost.toFixed(2)}</TableCell>
                      <TableCell>{((item.cost / totalCost) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell>{totalCost.toFixed(2)}</TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{selectedBatch}</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
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
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Batch Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Current Cost</TableHead>
                  <TableHead>Previous Cost Range</TableHead>
                  <TableHead>Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(batchData).map(([batchName, data]) => {
                  const currentCost = data.reduce((sum, item) => sum + item.cost, 0);
                  const { min, max } = previousBatchData[batchName];
                  const avgPreviousCost = (min + max) / 2;
                  const difference = ((currentCost - avgPreviousCost) / avgPreviousCost * 100).toFixed(1);
                  return (
                    <TableRow key={batchName}>
                      <TableCell>{batchName}</TableCell>
                      <TableCell>${currentCost.toFixed(2)}</TableCell>
                      <TableCell>${min.toFixed(2)} - ${max.toFixed(2)}</TableCell>
                      <TableCell className={Number(difference) > 0 ? 'text-red-500' : 'text-green-500'}>
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
    </div>
  );
}