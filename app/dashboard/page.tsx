// app/dashboard/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area.js";
import { Button } from "@/components/ui/button";
import { BarChart, Leaf, DollarSign, ClipboardList, Users, Settings, Calendar } from "lucide-react";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "../../components/ui/progress.js";
import Image from 'next/image';
import { Checkbox } from "../../components/ui/checkbox.js";

// Headline Metrics Data
const headlineMetrics = {
  overallQuality: 8.7,
  monthlyYield: 95, // kg (sum of all room yields)
  activeBatches: 5,
  upcomingHarvests: 2,
};

// Rooms Data
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
    quality: 9.1,
    yield: 35,
    image: "https://github.com/claydouglass/vervanacultivatev0/raw/main/Day%2040.jpg",
    color: '#4CAF50', // Updated to match primary color
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
    stage: "Flowering",
    day: 50,
    temperature: 23.8,
    humidity: 65,
    ppfd: 750,
    co2: 1000,
    vpd: 1.1,
    quality: 8.9,
    yield: 32,
    image: "https://github.com/claydouglass/vervanacultivatev0/raw/main/Day%2050.jpg",
    color: '#FFA500', // Orange accent
    flowerAnalysis: "Papaya Terpz plants are in late flowering stage, showing dense bud formation and rich terpene profiles. The trichomes are mostly cloudy with some amber starting to appear, indicating peak potency is approaching.",
    aiSuggestions: [
      "Begin flushing nutrients to improve the final flavor profile.",
      "Reduce temperature slightly to enhance purple coloration in the buds.",
      "Monitor for any signs of botrytis, especially in dense cola centers."
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
    quality: 8.5,
    yield: 28,
    image: "https://github.com/claydouglass/vervanacultivatev0/raw/main/Day%2010.jpg",
    color: '#98FF98', // Light green
    flowerAnalysis: "Mint Terpz is experiencing healthy vegetative growth, with robust leaf development and strong root systems. The plants show no signs of nutrient deficiencies or pest issues.",
    aiSuggestions: [
      "Maintain current nutrient levels to support continued vegetative growth.",
      "Begin planning for training to encourage lateral growth and prepare for the flowering phase.",
      "Monitor environmental conditions closely to ensure optimal VPD for maximum growth efficiency."
    ]
  }
  // Add more rooms as needed...
];

// Overview Summary
const summary = `
Currently, we have 5 active batches across 3 cultivation rooms, the drying room and the curing room. Kandy Terpz in Room 101 is showing excellent trichome development and is nearing harvest readiness. Papaya Terpz in Room 102 is in late flowering with dense bud formation. Mint Terpz in Room 103 is in healthy vegetative growth with no signs of deficiencies or pest issues.
`;

// Initial Staff Tasks Data
const initialStaffTasks = [
  { 
    name: 'Derek Jamieson', 
    tasks: [
      { text: 'Prune Room 101', done: false },
      { text: 'Check nutrient levels in Room 102', done: false },
      { text: 'Monitor drying process', done: false },
      { text: 'Update inventory', done: false }
    ]
  },
  { 
    name: 'Justin Ambar', 
    tasks: [
      { text: 'Prepare Room 103 for flowering transition', done: false },
      { text: 'Conduct pest inspection', done: false }
    ]
  }
];

// Initial Recommendations Data
const initialRecommendations = {
  "Room 101": [
    { text: 'Increase PPFD to 1150 μmol/m²/s to maximize trichome production', done: false },
    { text: 'Gradually reduce humidity to 50% over the next 5 days', done: false },
  ],
  "Room 102": [
    { text: 'Begin flushing nutrients to improve final flavor profile', done: false },
    { text: 'Reduce temperature slightly to enhance purple coloration in the buds', done: false },
  ],
  "Room 103": [
    { text: 'Begin planning for training to encourage lateral growth', done: false },
    { text: 'Increase nitrogen levels by 10% to support rapid vegetative growth', done: false },
  ],
  "Drying Room": [
    { text: 'Maintain humidity at 60% and temperature at 20°C', done: false },
    { text: 'Ensure proper air circulation to prevent mold growth', done: false },
  ],
  "Curing Room": [
    { text: 'Monitor humidity levels daily, aiming for 62%', done: false },
    { text: 'Rotate jars every 12 hours for the first week', done: false },
  ],
};

// Upcoming Deadlines Data
const upcomingDeadlines = [
  { event: 'Harvest Room 101 (Kandy Terpz)', date: '2024-10-15' },
  { event: 'Start flowering for Room 103 (Mint Terpz)', date: '2024-10-16' },
  { event: 'Begin drying process for harvested Papaya Terpz', date: '2024-10-20' },
];

// Define a more flexible type for recommendations
type Recommendation = { text: string; done: boolean };
type RecommendationsState = Record<string, Recommendation[]>;

export default function Dashboard() {
  const [staffTasks, setStaffTasks] = useState(initialStaffTasks);
  const [recommendations, setRecommendations] = useState<RecommendationsState>(initialRecommendations);

  // Handler to toggle task completion status
  const toggleTaskDone = (staffIndex: number, taskIndex: number) => {
    const newStaffTasks = [...staffTasks];
    newStaffTasks[staffIndex].tasks[taskIndex].done = !newStaffTasks[staffIndex].tasks[taskIndex].done;
    setStaffTasks(newStaffTasks);
  };

  // Handler to toggle recommendation completion status
  const toggleRecommendation = (room: string, index: number) => {
    setRecommendations(prev => ({
      ...prev,
      [room]: prev[room]?.map((rec, i) => 
        i === index ? { ...rec, done: !rec.done } : rec
      ) || []
    }));
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <header className="flex items-center justify-between p-4 bg-background border-b border-border h-16">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <Avatar>
          <AvatarImage src="/images/placeholder-user.jpg" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-6 space-y-6">
          {/* Headline Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Quality */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Quality</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{headlineMetrics.overallQuality}/10</div>
                <Progress value={headlineMetrics.overallQuality * 10} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  <Link href="/quality" className="underline">View Quality Details</Link>
                </p>
              </CardContent>
            </Card>

            {/* Monthly Yield */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Yield</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{headlineMetrics.monthlyYield} kg</div>
                <Progress value={(headlineMetrics.monthlyYield / 150) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  <Link href="/yield" className="underline">View Yield Details</Link>
                </p>
              </CardContent>
            </Card>

            {/* Active Batches */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{headlineMetrics.activeBatches}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  <Link href="/batches" className="underline">View All Batches</Link>
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Harvests */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Harvests</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{headlineMetrics.upcomingHarvests}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  <Link href="/schedule" className="underline">View Schedule</Link>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{summary}</p>
            </CardContent>
          </Card>

          {/* Quality and Yield by Batch Section */}
          <Card>
            <CardHeader>
              <CardTitle>Quality and Yield by Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="flex flex-col items-center">
                    <Image
                      src={room.image}
                      alt={`${room.strain} flower`}
                      width={200}
                      height={150}
                      className="rounded-md mb-4"
                      style={{ objectFit: 'cover' }}
                      unoptimized // Add this to bypass Next.js image optimization for external URLs
                    />
                    <div className="text-center">
                      <h3 className="font-medium text-lg" style={{ color: room.color }}>
                        {room.strain} ({room.name})
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quality: {room.quality}/10 | Yield: {room.yield} kg
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Day {room.day} of {room.stage}
                      </p>
                      <Button variant="outline" size="sm" asChild className="mt-2">
                        <Link href={`/room/${room.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff Tasks and Recommendations Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Staff Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Tasks for Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffTasks.map((staff, staffIndex) => (
                    <div key={staffIndex}>
                      <h4 className="font-semibold">{staff.name}</h4>
                      <ul className="mt-2 space-y-2">
                        {staff.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start space-x-2">
                            <Checkbox
                              id={`task-${staffIndex}-${taskIndex}`}
                              checked={task.done}
                              onCheckedChange={() => toggleTaskDone(staffIndex, taskIndex)}
                              className="mt-1"
                            />
                            <label
                              htmlFor={`task-${staffIndex}-${taskIndex}`}
                              className={`text-sm ${task.done ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.text}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href="/staff">View All Staff</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(recommendations).map(([room, recs]) => (
                    <div key={room}>
                      <h4 className="font-semibold mb-2">{room}</h4>
                      <ul className="space-y-2">
                        {recs.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Checkbox
                              id={`rec-${room}-${index}`}
                              checked={rec.done}
                              onCheckedChange={() => toggleRecommendation(room, index)}
                              className="mt-1"
                            />
                            <label
                              htmlFor={`rec-${room}-${index}`}
                              className={`text-sm ${rec.done ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {rec.text}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{deadline.event}</p>
                      <p className="text-sm text-muted-foreground">{deadline.date}</p>
                    </div>
                    <Button variant="outline" size="sm">Set Reminder</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </main>
  );
}