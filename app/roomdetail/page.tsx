// app/roomdetail/page.tsx
"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const roomData = {
  id: 1,
  name: "Room 1",
  strain: "Lemon Terpz",
  stage: "Flowering",
  day: 40,
  environmentalData: [
    { day: 1, temperature: 23.5, humidity: 65, ppfd: 850, co2: 1000, vpd: 1.2 },
    { day: 10, temperature: 24.0, humidity: 60, ppfd: 950, co2: 1100, vpd: 1.3 },
    { day: 20, temperature: 24.2, humidity: 58, ppfd: 1000, co2: 1150, vpd: 1.4 },
    { day: 30, temperature: 24.5, humidity: 56, ppfd: 1050, co2: 1200, vpd: 1.45 },
    { day: 40, temperature: 24.3, humidity: 55, ppfd: 1100, co2: 1210, vpd: 1.5 },
  ],
  recipe: {
    temperature: { min: 23, max: 25 },
    humidity: { min: 50, max: 60 },
    ppfd: { min: 1000, max: 1200 },
    co2: { min: 1100, max: 1300 },
    vpd: { min: 1.3, max: 1.6 },
  },
  qualityForecast: {
    overall: 8.7,
    appearance: 9.0,
    aroma: 8.5,
    flavor: 8.8,
    effect: 8.6,
  },
  yieldForecast: 475, // grams per sq.m
  terpenesForecast: {
    total: 3.2, // percentage
    topThree: [
      { name: "Myrcene", percentage: 1.2 },
      { name: "Limonene", percentage: 0.8 },
      { name: "Caryophyllene", percentage: 0.6 },
    ],
  },
  thcForecast: { min: 22, max: 25 }, // percentage
}

export default function RoomDetail() {
  const [dayRange, setDayRange] = useState({ start: 1, end: 40 })

  const filteredData = roomData.environmentalData.filter(
    (data) => data.day >= dayRange.start && data.day <= dayRange.end
  )

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card text-card-foreground border-r border-border">
        {/* Sidebar content (same as in Dashboard) */}
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">{roomData.name} - {roomData.strain}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{roomData.qualityForecast.overall}/10</div>
              <p className="text-sm text-muted-foreground mt-2">Target: 8.5 - 9.0</p>
              <Button variant="outline" size="sm" className="mt-4">View Detailed Metrics</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Yield Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{roomData.yieldForecast} g/m²</div>
              <p className="text-sm text-muted-foreground mt-2">Target: 450 - 500 g/m²</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>THC Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600">{roomData.thcForecast.min}% - {roomData.thcForecast.max}%</div>
              <p className="text-sm text-muted-foreground mt-2">Estimated range</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Terpene Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">Total: {roomData.terpenesForecast.total}%</div>
              <h4 className="font-semibold mb-2">Top Three:</h4>
              <ul>
                {roomData.terpenesForecast.topThree.map((terpene, index) => (
                  <li key={index} className="text-sm">
                    {terpene.name}: {terpene.percentage}%
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Environmental Data vs Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Button onClick={() => setDayRange({ start: 1, end: 40 })}>All Days</Button>
              <Button onClick={() => setDayRange({ start: dayRange.end - 7, end: dayRange.end })}>Last 7 Days</Button>
              <Button onClick={() => setDayRange({ start: dayRange.end - 1, end: dayRange.end })}>Last 24 Hours</Button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                
                {/* Temperature */}
                <ReferenceArea yAxisId="left" y1={roomData.recipe.temperature.min} y2={roomData.recipe.temperature.max} fill="#8884d8" fillOpacity={0.2} />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
                
                {/* Humidity */}
                <ReferenceArea yAxisId="left" y1={roomData.recipe.humidity.min} y2={roomData.recipe.humidity.max} fill="#82ca9d" fillOpacity={0.2} />
                <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity (%)" />
                
                {/* PPFD */}
                <ReferenceArea yAxisId="right" y1={roomData.recipe.ppfd.min} y2={roomData.recipe.ppfd.max} fill="#ffc658" fillOpacity={0.2} />
                <Line yAxisId="right" type="monotone" dataKey="ppfd" stroke="#ffc658" name="PPFD (μmol/m²/s)" />
                
                {/* CO2 */}
                <ReferenceArea yAxisId="right" y1={roomData.recipe.co2.min} y2={roomData.recipe.co2.max} fill="#ff7300" fillOpacity={0.2} />
                <Line yAxisId="right" type="monotone" dataKey="co2" stroke="#ff7300" name="CO2 (ppm)" />
                
                {/* VPD */}
                <ReferenceArea yAxisId="left" y1={roomData.recipe.vpd.min} y2={roomData.recipe.vpd.max} fill="#8dd1e1" fillOpacity={0.2} />
                <Line yAxisId="left" type="monotone" dataKey="vpd" stroke="#8dd1e1" name="VPD (kPa)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Add more charts and data visualizations as needed */}
      </main>
    </div>
  )
}