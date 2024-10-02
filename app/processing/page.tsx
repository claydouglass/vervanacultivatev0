"use client";

import React from 'react';
import Link from 'next/link';
import { BarChart, Leaf, DollarSign, ClipboardList, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const processingData = [
  { id: 1, batch: "Kandy Terpz", room: "Room 101", harvestDate: "2023-03-15", dryWeight: 25.5, status: "Drying" },
  { id: 2, batch: "Papaya Terpz", room: "Room 102", harvestDate: "2023-03-10", dryWeight: 22.3, status: "Curing" },
  { id: 3, batch: "Mint Terpz", room: "Room 103", harvestDate: "2023-03-05", dryWeight: 24.1, status: "Packaging" },
  { id: 4, batch: "Lemon Haze", room: "Room 104", harvestDate: "2023-03-01", dryWeight: 23.7, status: "Ready for Sale" },
  { id: 5, batch: "Blue Dream", room: "Room 105", harvestDate: "2023-02-25", dryWeight: 26.2, status: "Sold" },
];

export default function Processing() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Vervana Cultivate</h2>
          <nav className="space-y-4">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <BarChart className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/rooms" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <Leaf className="w-5 h-5" />
              <span>Rooms</span>
            </Link>
            <Link href="/financials" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <DollarSign className="w-5 h-5" />
              <span>Financials</span>
            </Link>
            <Link href="/processing" className="flex items-center space-x-2 text-blue-600 font-semibold">
              <ClipboardList className="w-5 h-5" />
              <span>Processing</span>
            </Link>
            <Link href="/staff" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <Users className="w-5 h-5" />
              <span>Staff</span>
            </Link>
            <Link href="/settings" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Processing</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Batch Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-semibold">Batch</TableHead>
                  <TableHead className="font-semibold">Room</TableHead>
                  <TableHead className="font-semibold">Harvest Date</TableHead>
                  <TableHead className="font-semibold text-right">Dry Weight (kg)</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processingData.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{batch.batch}</TableCell>
                    <TableCell>{batch.room}</TableCell>
                    <TableCell>{batch.harvestDate}</TableCell>
                    <TableCell className="text-right">{batch.dryWeight.toFixed(1)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Drying':
      return 'bg-yellow-100 text-yellow-800';
    case 'Curing':
      return 'bg-blue-100 text-blue-800';
    case 'Packaging':
      return 'bg-purple-100 text-purple-800';
    case 'Ready for Sale':
      return 'bg-green-100 text-green-800';
    case 'Sold':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}