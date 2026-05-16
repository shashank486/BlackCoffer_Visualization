import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import useChartData from '../hooks/useChartData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const COLORS = [
  '#6c63ff','#00d4aa','#ffd93d','#ff6b6b','#a78bfa',
  '#34d399','#fb923c','#60a5fa','#f472b6','#4ade80',
  '#facc15','#38bdf8','#c084fc','#f87171','#2dd4bf',
];

export default function RelevanceByCountry({ query, api }) {
  const { data, loading } = useChartData(api, '/api/charts/relevance-by-country', query);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data?.length) return <div className="loading">No data</div>;

  const chartData = {
    labels: data.map(d => d.country),
    datasets: [{
      label: 'Avg Relevance',
      data: data.map(d => d.avg_relevance),
      backgroundColor: data.map((_, i) => COLORS[i % COLORS.length] + 'bb'),
      borderColor: data.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1a1d27', borderColor: '#2e3250', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#8892b0', font: { size: 10 }, maxRotation: 40 }, grid: { display: false } },
      y: { ticks: { color: '#8892b0', font: { size: 11 } }, grid: { color: '#2e3250' } },
    },
  };

  return (
    <>
      <div className="chart-title">Relevance by Country</div>
      <div className="chart-subtitle">Top 15 countries by average relevance score</div>
      <Bar data={chartData} options={options} />
    </>
  );
}
