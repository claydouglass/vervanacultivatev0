"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

type AlertPreference = 'ALL' | 'CRITICAL_ONLY';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  alertPreference: AlertPreference;
}

export const staffData: StaffMember[] = [
  {
    id: 1,
    name: "Smiljan Rakovic",
    role: "Head of Supply Chain and Logistics",
    department: "Logistics",
    phone: "+41 76 434 41 39",
    email: "smiljan@thesunrisecorp.com",
    alertPreference: 'ALL'  // Gets all alerts
  },
  {
    id: 2,
    name: "Justin Ambar",
    role: "Head of Cultivation",
    department: "Cultivation",
    phone: "+1 (613) 263-9598",
    email: "justin@thesunrisecorp.com",
    alertPreference: 'ALL'  // Gets all alerts
  },
  {
    id: 3,
    name: "Marc Eversfield",
    role: "Director",
    department: "Management",
    phone: "+49 177 6517671",
    email: "marc@thesunrisecorp.com",
    alertPreference: 'CRITICAL_ONLY'  // Only gets critical alerts
  },
  {
    id: 4,
    name: "Steve Shiffman",
    role: "CEO",
    department: "Management",
    phone: "+1 (908) 279-4810",
    email: "steve@thesunrisecorp.com",
    alertPreference: 'CRITICAL_ONLY'  // Only gets critical alerts
  }
];

export default function Staff() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Staff</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Staff Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffData.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/staff/${staff.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}