// app/room/[id]/page.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from 'next/image';

const RoomDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch room data based on the id
  // This is a placeholder. Replace with actual data fetching logic.
  const room = {
    id,
    name: `Room ${id}`,
    strain: "Example Strain",
    stage: "Flowering",
    day: 40,
    temperature: 24.3,
    humidity: 55,
    ppfd: 1100,
    co2: 1210,
    vpd: 1.5,
    flowerImage: "/placeholder.svg?height=300&width=300",
    flowerAnalysis: "Example flower analysis.",
    aiSuggestions: [
      "Example suggestion 1.",
      "Example suggestion 2.",
      "Example suggestion 3."
    ]
  };

  return (
    <div>
      <h1>Room Details</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Detail 1</TableHead>
            <TableHead>Detail 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Detail Data 1</TableCell>
            <TableCell>Detail Data 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Card>
        <CardHeader>
          <CardTitle>{room.name} - {room.strain}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold mb-2">Environmental Data</h4>
              <p className="text-sm"><span className="font-medium">Stage:</span> {room.stage} (Day {room.day})</p>
              <p className="text-sm"><span className="font-medium">Temperature:</span> {room.temperature}°C</p>
              <p className="text-sm"><span className="font-medium">Humidity:</span> {room.humidity}%</p>
              <p className="text-sm"><span className="font-medium">PPFD:</span> {room.ppfd} μmol/m²/s</p>
              <p className="text-sm"><span className="font-medium">CO2:</span> {room.co2} ppm</p>
              <p className="text-sm"><span className="font-medium">VPD:</span> {room.vpd} kPa</p>
            </div>
            <div>
              <Image
                src={room.flowerImage}
                alt={`${room.strain} flower`}
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Flower Analysis</h4>
            <p className="text-sm mb-4">{room.flowerAnalysis}</p>
            <h4 className="font-semibold mb-2">AI Suggestions</h4>
            <ul className="list-disc pl-5 space-y-1">
              {room.aiSuggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/room/${room.id}`}>View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomDetails;