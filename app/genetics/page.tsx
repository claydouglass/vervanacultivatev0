'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Genetic = {
  id: string;
  name: string;
  status: 'In Production' | 'In Testing';
  thc: number;
  cbd: number;
  terpenes: { [key: string]: number };
  yield: {
    gramsPerSquareFoot: number;
    gramsPerLight: number;
  };
  qualityScore: number;
  laborHours: number;
  productionCost: {
    low: number;
    average: number;
    high: number;
  };
};

const mockGenetics: Genetic[] = [
  {
    id: '1',
    name: 'Blue Dream',
    status: 'In Production',
    thc: 18,
    cbd: 0.1,
    terpenes: {
      myrcene: 0.5,
      pinene: 0.3,
      caryophyllene: 0.2,
      limonene: 0.1,
      linalool: 0.05,
    },
    yield: {
      gramsPerSquareFoot: 55,
      gramsPerLight: 650,
    },
    qualityScore: 8.5,
    laborHours: 120,
    productionCost: {
      low: 0.8,
      average: 1.2,
      high: 1.5,
    },
  },
  {
    id: '2',
    name: 'OG Kush',
    status: 'In Testing',
    thc: 22,
    cbd: 0.05,
    terpenes: {
      myrcene: 0.3,
      limonene: 0.4,
      caryophyllene: 0.2,
      linalool: 0.1,
      humulene: 0.05,
    },
    yield: {
      gramsPerSquareFoot: 48,
      gramsPerLight: 580,
    },
    qualityScore: 9,
    laborHours: 130,
    productionCost: {
      low: 1.0,
      average: 1.4,
      high: 1.8,
    },
  },
];

export default function GeneticsPage() {
  const [selectedGenetic, setSelectedGenetic] = useState(mockGenetics[0].id);

  const currentGenetic = mockGenetics.find((g) => g.id === selectedGenetic);

  const renderTerpeneProfile = (terpenes: { [key: string]: number }) => (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Terpene Profile:</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(terpenes).map(([terpene, value]) => (
          <div key={terpene} className="flex justify-between">
            <span className="capitalize">{terpene}:</span>
            <span>{(value * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Genetics</h1>

      <Select
        options={mockGenetics.map((genetic) => ({
          label: genetic.name,
          value: genetic.id,
        }))}
        defaultValue={selectedGenetic}
        onValueChange={setSelectedGenetic}
        placeholder="Select Genetic"
      />

      {currentGenetic && (
        <Tabs defaultValue="performance" className="w-full">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  Yield per Square Foot: {currentGenetic.yield.gramsPerSquareFoot} g/ft²
                </p>
                <p className="mb-2">
                  Yield per Light: {currentGenetic.yield.gramsPerLight} g/light
                </p>
                <p className="mb-2">Labor Hours: {currentGenetic.laborHours} hours</p>
                <p className="mb-2">
                  Production Cost Range: ${currentGenetic.productionCost.low.toFixed(2)} - $
                  {currentGenetic.productionCost.high.toFixed(2)} per gram
                </p>
                <p className="mb-2">
                  Average Production Cost: ${currentGenetic.productionCost.average.toFixed(2)} per
                  gram
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Cannabinoid Profile:</h3>
                <p className="mb-2">THC: {currentGenetic.thc}%</p>
                <p className="mb-2">CBD: {currentGenetic.cbd}%</p>
                {renderTerpeneProfile(currentGenetic.terpenes)}
                <h3 className="font-semibold mt-4 mb-2">Production Efficiency:</h3>
                <p className="mb-2">
                  Yield Efficiency:{' '}
                  {(currentGenetic.yield.gramsPerSquareFoot / currentGenetic.laborHours).toFixed(2)}{' '}
                  g/ft²/hour
                </p>
                <p className="mb-2">Cost Efficiency Range:</p>
                <ul className="list-disc pl-5 mb-2">
                  <li>
                    Low: $
                    {(
                      currentGenetic.productionCost.low / currentGenetic.yield.gramsPerLight
                    ).toFixed(2)}{' '}
                    per gram per light
                  </li>
                  <li>
                    Average: $
                    {(
                      currentGenetic.productionCost.average / currentGenetic.yield.gramsPerLight
                    ).toFixed(2)}{' '}
                    per gram per light
                  </li>
                  <li>
                    High: $
                    {(
                      currentGenetic.productionCost.high / currentGenetic.yield.gramsPerLight
                    ).toFixed(2)}{' '}
                    per gram per light
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Based on the current data, consider the following:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    Optimize lighting cycles to potentially increase yield per light
                  </li>
                  <li>
                    Explore cultivation techniques to enhance terpene production, particularly{' '}
                    {Object.keys(currentGenetic.terpenes)[0]} and{' '}
                    {Object.keys(currentGenetic.terpenes)[1]}
                  </li>
                  <li>
                    Investigate ways to reduce labor hours without compromising quality
                  </li>
                  <li>
                    Consider crossbreeding to enhance{' '}
                    {currentGenetic.thc > currentGenetic.cbd ? 'CBD' : 'THC'} content
                  </li>
                  <li>
                    Analyze market demand for this strain's terpene profile and adjust production
                    accordingly
                  </li>
                  <li>
                    Focus on reducing production costs, aiming to consistently achieve the lower end
                    of the cost range
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}