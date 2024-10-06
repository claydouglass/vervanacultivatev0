import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import { Select as SelectPrimitive, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type RankingData = {
  date: string;
  rank: number;
  totalProducts: number;
};

type CompetitorData = {
  name: string;
  rankings: RankingData[];
};

type SubRankingData = {
  category: string;
  rank: number;
  totalProducts: number;
};

type Props = {
  product: string;
  market: string;
  indication: string;
  rankings: RankingData[];
  competitors: CompetitorData[];
};

const timeScales = ['Past 24 Hours', 'Past Week', 'Past 30 Days', 'Past 90 Days', 'Past Year', 'All Time'];
const goals = ['Anxiety Relief', 'Pain Management', 'Sleep Aid', 'Relaxation', 'Focus Enhancement', 'Creativity Boost', 'Appetite Stimulation', 'Nausea Relief', 'Stress Reduction', 'Mood Elevation'];

const ProductRankings: React.FC<Props> = ({ product, market, indication, rankings = [], competitors = [] }) => {
  const [timeScale, setTimeScale] = useState('Past 30 Days');
  const [selectedGoal, setSelectedGoal] = useState(indication);
  const [hoveredDataset, setHoveredDataset] = useState<string | null>(null);

  const generateColor = useCallback((index: number) => `hsla(${index * 36}, 70%, 50%, 0.3)`, []);

  const filterDataByTimeScale = useCallback((data: RankingData[]) => {
    // Implement filtering logic based on timeScale
    return data;
  }, []);

  const mainChartData = {
    labels: filterDataByTimeScale(rankings).map(r => r.date),
    datasets: [
      {
        label: product,
        data: filterDataByTimeScale(rankings).map(r => r.rank),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 4,
        tension: 0.1,
        pointRadius: 0,
      },
      ...competitors.slice(0, 5).map((competitor, index) => ({
        label: competitor.name,
        data: filterDataByTimeScale(competitor.rankings).map(r => r.rank),
        borderColor: generateColor(index),
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 0,
      })),
    ],
  };

  const mainChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Rank (higher is better)',
        },
        reverse: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: `${product} Rankings for ${selectedGoal} in ${market}`,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
    onHover: (event: any, elements: any[]) => {
      if (elements && elements.length) {
        setHoveredDataset(mainChartData.datasets[elements[0].datasetIndex].label);
      } else {
        setHoveredDataset(null);
      }
    },
  };

  const goalEvolutionData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: goals.map((goal, index) => ({
      label: goal,
      data: Array(6).fill(0).map(() => Math.random() * 30 + 10),
      borderColor: generateColor(index),
      backgroundColor: generateColor(index),
      tension: 0.1,
      hidden: hoveredDataset ? goal !== hoveredDataset : false,
    })),
  }), [goals, generateColor, hoveredDataset]);

  const goalEvolutionOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage of Consumers',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Consumer Goals Evolution',
      },
    },
    onHover: (event: any, elements: any[]) => {
      if (elements && elements.length) {
        setHoveredDataset(goalEvolutionData.datasets[elements[0].datasetIndex].label);
      } else {
        setHoveredDataset(null);
      }
    },
  };

  const generateMainChartAnalysis = useCallback(() => {
    const currentRank = rankings[rankings.length - 1].rank;
    const startRank = rankings[0].rank;
    const rankChange = startRank - currentRank;
    const topCompetitor = competitors.reduce((prev, current) => 
      prev.rankings[prev.rankings.length - 1].rank < current.rankings[current.rankings.length - 1].rank ? prev : current
    );

    return `
    <h4 class="text-lg font-semibold mb-2">Ranking Analysis:</h4>
    <p>${product} ${rankChange > 0 ? 'improved' : 'declined'} from rank ${startRank} to ${currentRank} for ${selectedGoal} in ${market}.</p>
    <p>Top performer: ${topCompetitor.name} (rank ${topCompetitor.rankings[topCompetitor.rankings.length - 1].rank})</p>
    <p>Key factors influencing this trend may include recent product improvements, marketing efforts, or shifts in consumer preferences.</p>
    `;
  }, [product, market, selectedGoal, rankings, competitors]);

  const generateGoalEvolutionAnalysis = useCallback(() => {
    const topGoal = goals.reduce((prev, current) => 
      goalEvolutionData.datasets.find(d => d.label === current)!.data[5] > 
      goalEvolutionData.datasets.find(d => d.label === prev)!.data[5] ? current : prev
    );
    const topGoalPercentage = goalEvolutionData.datasets.find(d => d.label === topGoal)!.data[5].toFixed(1);

    return `
    <h4 class="text-lg font-semibold mb-2">Consumer Goals Analysis:</h4>
    <p>Top consumer goal: ${topGoal} (${topGoalPercentage}% of consumers)</p>
    <p>${selectedGoal} trend: ${goalEvolutionData.datasets.find(d => d.label === selectedGoal)!.data[5] > goalEvolutionData.datasets.find(d => d.label === selectedGoal)!.data[0] ? 'Increasing' : 'Decreasing'}</p>
    <p>Consider aligning product development and marketing strategies with evolving consumer preferences.</p>
    `;
  }, [selectedGoal, goalEvolutionData]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{product} Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-6">
          <SelectPrimitive onValueChange={setTimeScale} value={timeScale}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Time Period" />
            </SelectTrigger>
            <SelectContent>
              {timeScales.map(scale => (
                <SelectItem key={scale} value={scale}>{scale}</SelectItem>
              ))}
            </SelectContent>
          </SelectPrimitive>
          <SelectPrimitive onValueChange={setSelectedGoal} value={selectedGoal}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Consumer Goal" />
            </SelectTrigger>
            <SelectContent>
              {goals.map(goal => (
                <SelectItem key={goal} value={goal}>{goal}</SelectItem>
              ))}
            </SelectContent>
          </SelectPrimitive>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Line data={mainChartData} options={mainChartOptions} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: generateMainChartAnalysis() }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: generateGoalEvolutionAnalysis() }} />
          </div>
          <div className="md:col-span-2">
            <Line data={goalEvolutionData} options={goalEvolutionOptions} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductRankings;