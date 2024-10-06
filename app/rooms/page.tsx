// app/cultivation/page.tsx

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BarChart, Leaf, DollarSign, ClipboardList, Users, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';

const rooms = [
  {
    id: 1,
    name: "Room 101",
    strain: "Kandy Terpz",
    stage: "Flowering",
    day: 40,
    temperature: 24.3,
    humidity: 55,
    ppfd: 1100,
    co2: 1210,
    vpd: 1.5,
    flowerImage: "https://github.com/claydouglass/vervanacultivatev0/raw/main/Day%2040.jpg ",
    flowerAnalysis: "The Kandy Terpz flowers are showing excellent development at day 40 of flowering. Trichome production is abundant, with approximately 70% of the trichomes displaying a milky appearance. The calyxes are swollen, and the pistils are about 60% amber, suggesting the flowers are nearing harvest readiness.",
    aiSuggestions: [
      "Consider increasing the PPFD to 1150 μmol/m²/s to maximize trichome production in the final weeks.",
      "Gradually reduce humidity to 50% over the next 5 days to prevent potential mold issues and enhance resin production.",
      "Monitor calcium and magnesium levels closely, as demand typically increases in late flowering."
    ]
  },
  {
    id: 2,
    name: "Room 102",
    strain: "Papaya Terpz",
    stage: "Vegetative",
    day: 50,
    temperature: 23.8,
    humidity: 65,
    ppfd: 750,
    co2: 1000,
    vpd: 1.1,
    flowerImage: "https://github.com/claydouglass/vervanacultivatev0/raw/main/Day%2050.jpg",
    flowerAnalysis: "Papaya Terpz plants are in late flowering stage, showing dense bud formation and rich terpene profiles. The trichomes are mostly cloudy with some amber starting to appear, indicating peak potency is approaching.",
    aiSuggestions: [
      "Increase nitrogen levels by 10% to support the rapid vegetative growth phase.",
      "Consider topping or training techniques in the next 3-5 days to promote bushier growth and multiple cola development.",
      "Gradually increase PPFD to 800 μmol/m²/s over the next week to prepare for the transition to flowering."
    ]
  },
  {
    id: 3,
    name: "Room 103",
    strain: "Mint Terpz",
    stage: "Vegetative",
    day: 10,
    temperature: 23.5,
    humidity: 60,
    ppfd: 800,
    co2: 1050,
    vpd: 1.2,
    flowerImage: "https://github.com/claydouglass/vervanacultivatev0/raw/main/Day%2010.jpg",
    flowerAnalysis: "Mint Terpz is experiencing healthy vegetative growth, with robust leaf development and strong root systems. The plants show no signs of nutrient deficiencies or pest issues.",
    aiSuggestions: [
      "Maintain current nutrient levels to support continued vegetative growth.",
      "Begin planning for training to encourage lateral growth and prepare for the flowering phase.",
      "Monitor environmental conditions closely to ensure optimal VPD for maximum growth efficiency."
    ]
  }
  // Add more rooms as needed...
];

export default function Rooms() {
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
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between p-4 bg-background border-b border-border">
          <h2 className="text-2xl font-semibold">Rooms</h2>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </header>
        <div className="p-6">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-6">
              {rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{room.name} - {room.strain}</CardTitle>
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
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}