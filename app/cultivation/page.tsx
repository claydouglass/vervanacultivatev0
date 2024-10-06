"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const cultivationData = [
  { id: 1, name: "Room 101", strain: "Kandy Terpz", stage: "Flowering", day: 40, temperature: 24.3, humidity: 55, ppfd: 1100, co2: 1210, vpd: 1.5 },
  { id: 2, name: "Room 102", strain: "Papaya Terpz", stage: "Flowering", day: 50, temperature: 23.8, humidity: 65, ppfd: 750, co2: 1000, vpd: 1.1 },
  { id: 3, name: "Room 103", strain: "Mint Terpz", stage: "Vegetative", day: 10, temperature: 23.5, humidity: 60, ppfd: 800, co2: 1050, vpd: 1.2 },
];

export default function Cultivation() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Cultivation</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Cultivation Rooms Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Strain</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Humidity (%)</TableHead>
                <TableHead>PPFD</TableHead>
                <TableHead>CO2 (ppm)</TableHead>
                <TableHead>VPD</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cultivationData.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.strain}</TableCell>
                  <TableCell>{room.stage}</TableCell>
                  <TableCell>{room.day}</TableCell>
                  <TableCell>{room.temperature}</TableCell>
                  <TableCell>{room.humidity}</TableCell>
                  <TableCell>{room.ppfd}</TableCell>
                  <TableCell>{room.co2}</TableCell>
                  <TableCell>{room.vpd}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cultivation/${room.id}`}>View Details</Link>
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