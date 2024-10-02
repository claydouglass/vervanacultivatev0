// src/app/processing/page.tsx

import React from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  Leaf, 
  DollarSign, 
  ClipboardList, 
  Users, 
  Settings 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";

const processingData = [
  { 
    id: 1,
    batch: "LT-001",
    strain: "Lemon Terpz",
    currentStage: "Drying",
    daysInStage: 5,
    temperature: 18.5,
    humidity: 60,
    light: 0,
    nextStage: "Curing",
    expectedTransition: "2024-10-04"
  },
  { 
    id: 2,
    batch: "KT-002",
    strain: "Kandy Terpz",
    currentStage: "Curing",
    daysInStage: 12,
    temperature: 20,
    humidity: 62,
    light: 0,
    nextStage: "Trimming",
    expectedTransition: "2024-10-10"
  },
  { 
    id: 3,
    batch: "PT-003",
    strain: "Papaya Terpz",
    currentStage: "Trimming",
    daysInStage: 2,
    temperature: 21,
    humidity: 55,
    light: 200,
    nextStage: "Packing",
    expectedTransition: "2024-10-03"
  },
  { 
    id: 4,
    batch: "LT-004",
    strain: "Lemon Terpz",
    currentStage: "Packing",
    daysInStage: 1,
    temperature: 21,
    humidity: 50,
    light: 200,
    nextStage: "Shipping",
    expectedTransition: "2024-10-02"
  }
];

export default function Processing() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card text-card-foreground border-r border-border">
        {/* Sidebar */}
        <div className="flex items-center justify-center h-16 border-b border-border">
          <h1 className="text-xl font-semibold">Vervana Cultivate</h1>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-primary bg-accent">
            <BarChart className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/rooms" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent">
            <Leaf className="w-5 h-5 mr-3" />
            Rooms
          </Link>
          <Link href="/financials" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent">
            <DollarSign className="w-5 h-5 mr-3" />
            Financials
          </Link>
          <Link href="/processing" className="flex items-center px-4 py-2 mt-2 text-primary bg-accent">
            <ClipboardList className="w-5 h-5 mr-3" />
            Processing
          </Link>
          <Link href="/staff" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent">
            <Users className="w-5 h-5 mr-3" />
            Staff
          </Link>
          <Link href="/settings" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Processing</h2>
        <Card>
          <CardHeader>
            <CardTitle>Batch Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Strain</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Days in Stage</TableHead>
                  <TableHead>Temperature (°C)</TableHead>
                  <TableHead>Humidity (%)</TableHead>
                  <TableHead>Light (lux)</TableHead>
                  <TableHead>Next Stage</TableHead>
                  <TableHead>Expected Transition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processingData.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.batch}</TableCell>
                    <TableCell>{batch.strain}</TableCell>
                    <TableCell>{batch.currentStage}</TableCell>
                    <TableCell>{batch.daysInStage}</TableCell>
                    <TableCell>{batch.temperature}</TableCell>
                    <TableCell>{batch.humidity}</TableCell>
                    <TableCell>{batch.light}</TableCell>
                    <TableCell>{batch.nextStage}</TableCell>
                    <TableCell>{batch.expectedTransition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Add environmental control panels and charts as needed */}
      </main>
    </div>
  );
}