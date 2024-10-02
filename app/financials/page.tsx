// src/app/financials/page.tsx

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

const financialData = {
  costPerGram: [
    { category: "Labor", cost: 0.60 },
    { category: "Facility", cost: 0.30 },
    { category: "Energy", cost: 0.25 },
    { category: "Nutrients", cost: 0.15 },
    { category: "Clones/Seeds", cost: 0.10 },
    { category: "Other Inputs", cost: 0.10 },
  ]
};

export default function Financials() {
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
          <Link href="/financials" className="flex items-center px-4 py-2 mt-2 text-primary bg-accent">
            <DollarSign className="w-5 h-5 mr-3" />
            Financials
          </Link>
          <Link href="/processing" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent">
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
        <h2 className="text-2xl font-semibold mb-6">Financials</h2>
        <Card>
          <CardHeader>
            <CardTitle>Cost Per Gram Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Cost ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.costPerGram.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.cost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Add more financial sections as needed */}
      </main>
    </div>
  );
}