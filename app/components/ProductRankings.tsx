// components/ProductRankings.tsx

'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import { Select, Option } from "@/components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

// Define specific types for better type safety
interface Ranking {
  date: string; // e.g., '2023-01-01'
  rank: number;
}

interface Competitor {
  name: string;
  rank: number;
}

interface ProductRankingsProps {
  product: string;
  market: string;
  indication: string;
  rankings: Ranking[];
  competitors: Competitor[];
}

const ProductRankings: React.FC<ProductRankingsProps> = ({ product, market, indication, rankings, competitors }) => {
  const [timeScale, setTimeScale] = useState<string>('1M');

  // Callback to generate analysis text based on current ranking data
  const generateMainChartAnalysis = useCallback(() => {
    if (!rankings || rankings.length === 0) {
      return "No ranking data available.";
    }
    const currentRank = rankings[rankings.length - 1].rank;
    const startRank = rankings[0].rank;
    const rankChange = startRank - currentRank;
    const topCompetitor = competitors && competitors.length > 0
      ? competitors.reduce((prev, current) => (current.rank < prev.rank) ? current : prev)
      : null;

    return `${product} has ${rankChange > 0 ? 'improved' : 'dropped'} from rank ${startRank} to rank ${currentRank} for ${indication} in the ${market} market.

${topCompetitor ? `Top competitor: ${topCompetitor.name} (Rank ${topCompetitor.rank})` : 'No competitor data available.'}

Key factors influencing this trend may include recent product improvements, marketing efforts, or shifts in consumer preferences.`;
  }, [rankings, competitors, product, market, indication]);

  // Memoized chart data to avoid unnecessary recalculations
  const mainChartData = useMemo(() => {
    if (!rankings || rankings.length === 0) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: rankings.map(r => r.date),
      datasets: [
        {
          label: 'Rank',
          data: rankings.map(r => r.rank),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false,
        }
      ]
    };
  }, [rankings]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Product Rankings for {product} in {market}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-6">
          <Select
            options={[
              { label: '1 Week', value: '1W' },
              { label: '1 Month', value: '1M' },
              { label: '3 Months', value: '3M' },
              { label: '6 Months', value: '6M' },
              { label: '1 Year', value: '1Y' },
            ]}
            defaultValue={timeScale}
            onValueChange={setTimeScale}
            placeholder="Select Time Period"
          />
        </div>
        
        {rankings && rankings.length > 0 ? (
          <div className="h-64">
            <Line data={mainChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { reverse: true, beginAtZero: false, ticks: { stepSize: 1 } } } }} />
          </div>
        ) : (
          <p>No ranking data available.</p>
        )}
        
        <p className="mt-6">{generateMainChartAnalysis()}</p>
      </CardContent>
    </Card>
  );
};

export default ProductRankings;