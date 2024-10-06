import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import { Select } from "@/components/ui/select";

// Define more specific types for better type safety
type Ranking = {
  date: string; // Assuming date is a string, could also use Date type if applicable
  rank: number;
};

type Competitor = {
  name: string;
  rank: number;
};

type Props = {
  product: string;
  market: string;
  indication: string;
  rankings: Ranking[];
  competitors: Competitor[];
};

const ProductRankings: React.FC<Props> = ({ product, market, indication, rankings, competitors }) => {
  const [timeScale, setTimeScale] = useState('1M');

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

    return `${product} ${rankChange > 0 ? 'improved' : 'dropped'} from rank ${startRank} to ${currentRank} for ${indication} in ${market}.
    
    ${topCompetitor ? `Top performer: ${topCompetitor.name} (rank ${topCompetitor.rank})` : 'No competitor data available.'}
    
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
          tension: 0.1
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
          <Line data={mainChartData} options={{ responsive: true, maintainAspectRatio: false }} className="mb-6" />
        ) : (
          <p>No ranking data available.</p>
        )}
        
        <p className="mb-6">{generateMainChartAnalysis()}</p>
      </CardContent>
    </Card>
  );
};

export default ProductRankings;