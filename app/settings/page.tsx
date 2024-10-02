// src/app/settings/page.tsx

import React from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  Leaf, 
  DollarSign, 
  ClipboardList, 
  Users, 
  Settings as SettingsIcon // Renamed to avoid conflict
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";

const users = [
  { id: 1, name: "John Doe", role: "Admin", viewRights: ["All"] },
  { id: 2, name: "Jane Smith", role: "Manager", viewRights: ["Dashboard", "Rooms", "Staff"] },
  { id: 3, name: "Bob Johnson", role: "Cultivator", viewRights: ["Rooms", "Processing"] },
  // Add more users as needed
];

export default function Settings() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card text-card-foreground border-r border-border">
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
            <SettingsIcon className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between p-4 bg-background border-b border-border">
          <h2 className="text-2xl font-semibold">Settings</h2>
        </header>
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>User Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>View Rights</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.viewRights.join(", ")}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4">Add New User</Button>
            </CardContent>
          </Card>
          {/* Add more settings sections as needed */}
        </div>
      </main>
    </div>
  );
}