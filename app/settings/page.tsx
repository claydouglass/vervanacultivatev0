"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const users = [
  { id: 1, name: "Justin Ambar", role: "Admin", viewRights: ["All"] },
  { id: 2, name: "Derek Jamieson", role: "Manager", viewRights: ["Dashboard", "Rooms", "Staff"] },
  { id: 3, name: "Sophie Xavier", role: "Cultivator", viewRights: ["Rooms", "Processing"] },
  // Add more users as needed
];

export default function Settings() {
  return (
    <main className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>
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
    </main>
  );
}