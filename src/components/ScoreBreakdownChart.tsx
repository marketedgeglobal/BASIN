import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { FlatRow } from '../types';
import basinData from '../data/basin.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  row: FlatRow;
}

const CRITERION_LABELS: Record<string, string> = {
  economic: 'Economic',
  proPoor: 'Pro-Poor',
  greenGrowth: 'Green Growth',
  systemic: 'Systemic',
  pwd: 'PWD',
  wee: 'WEE',
  quickWin: 'Quick Win',
};

export default function ScoreBreakdownChart({ row }: Props) {
  const maxMap: Record<string, number> = {};
  basinData.meta.maxPoints.forEach((mp) => {
    maxMap[mp.key] = mp.max;
  });

  const keys = Object.keys(row.weighted) as (keyof typeof row.weighted)[];
  const labels = keys.map((k) => CRITERION_LABELS[k] || k);
  const values = keys.map((k) => row.weighted[k]);
  const maxValues = keys.map((k) => maxMap[k] ?? 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Score',
        data: values,
        backgroundColor: 'rgba(37, 99, 235, 0.75)',
        borderRadius: 4,
      },
      {
        label: 'Max Points',
        data: maxValues,
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: `${row.valueChain} — ${row.province}, ${row.country}`,
      },
      tooltip: {
        callbacks: {
          afterLabel: (context: { datasetIndex: number; dataIndex: number }) => {
            if (context.datasetIndex === 0) {
              const key = keys[context.dataIndex];
              return `Max: ${maxMap[key] ?? '?'}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, max: 30 },
    },
  };

  return (
    <div className="w-full" aria-label="Score breakdown bar chart">
      <Bar data={data} options={options} />
    </div>
  );
}
