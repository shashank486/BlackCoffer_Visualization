import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend
} from 'chart.js';
import useChartData from '../hooks/useChartData';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const COLORS = [
  '#6c63ff','#00d4aa','#ffd93d','#ff6b6b','#a78bfa',
  '#34d399','#fb923c','#60a5fa','#f472b6',
];

export default function PestleDistribution({ query, api }) {
  const { data, loading } = useChartData(api, '/api/charts/pestle-distribution', query);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data?.length) return <div className="loading">No data</div>;

  const chartData = {
    labels: data.map(d => d.pestle),
    datasets: [{
      data: data.map(d => d.count),
      backgroundColor: COLORS.map(c => c + 'aa'),
      borderColor: COLORS,
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#8892b0', font: { size: 11 }, padding: 8, boxWidth: 12 },
      },
      tooltip: { backgroundColor: '#1a1d27', borderColor: '#2e3250', borderWidth: 1 },
    },
    scales: {
      r: {
        ticks: { color: '#8892b0', backdropColor: 'transparent', font: { size: 10 } },
        grid: { color: '#2e3250' },
      },
    },
  };

  return (
    <>
      <div className="chart-title">PESTLE Analysis</div>
      <div className="chart-subtitle">Distribution across PESTLE categories</div>
      <PolarArea data={chartData} options={options} />
    </>
  );
}
