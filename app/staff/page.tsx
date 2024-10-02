// src/app/staff/page.tsx

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
import { Button } from "@/src/components/ui/button";

const staffTasks = [
  {
    id: 1,
    name: "Justin Ambar",
    todayTasks: ["Prune Room 101", "Check nutrient levels in Room 102"],
    upcomingTasks: ["Harvest Room 103", "Train new hires"],
  },
  {
    id: 2,
    name: "Derek Jamieson",
    todayTasks: ["Monitor drying process", "Update inventory"],
    upcomingTasks: ["Prepare for next batch", "Conduct quality checks"],
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    todayTasks: ["Trim Lemon Terpz batch", "Clean processing area"],
    upcomingTasks: ["Package Kandy Terpz", "Assist with shipping"],
  },
];

export default function Staff() {
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
          <Link href="/processing" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent">
            <ClipboardList className="w-5 h-5 mr-3" />
            Processing
          </Link>
          <Link href="/staff" className="flex items-center px-4 py-2 mt-2 text-primary bg-accent">
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
        <h2 className="text-2xl font-semibold mb-6">Staff Tasks</h2>
        {staffTasks.map((staff) => (
          <Card key={staff.id} className="mb-6">
            <CardHeader>
              <CardTitle>{staff.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Tasks for Today:</h3>
              <ul className="list-disc pl-5 mb-4">
                {staff.todayTasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              <h3 className="font-semibold mb-2">Upcoming Tasks:</h3>
              <ul className="list-disc pl-5 mb-4">
                {staff.upcomingTasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              <Button variant="outline">
                Chat about these tasks, ask questions, clarify what needs to be done, see examples, etc.&apos;
              </Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}