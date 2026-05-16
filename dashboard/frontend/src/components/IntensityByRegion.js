import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import useChartData from '../hooks/useChartData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = [
  '#6c63ff','#00d4aa','#ffd93d','#ff6b6b','#a78bfa',
  '#34d399','#fb923c','#60a5fa','#f472b6','#4ade80',
  '#facc15','#38bdf8','#c084fc','#f87171','#2dd4bf',
];

export default function IntensityByRegion({ query, api }) {
  const { data, loading } = useChartData(api, '/api/charts/intensity-by-region', query);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data?.length) return <div className="loading">No data</div>;

  const chartData = {
    labels: data.map(d => d.region),
    datasets: [{
      label: 'Avg Intensity',
      data: data.map(d => d.avg_intensity),
      backgroundColor: data.map((_, i) => COLORS[i % COLORS.length] + 'cc'),
      borderColor: data.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1a1d27', borderColor: '#2e3250', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#8892b0', font: { size: 11 } }, grid: { color: '#2e3250' } },
      y: { ticks: { color: '#8892b0', font: { size: 10 } }, grid: { display: false } },
    },
  };

  return (
    <>
      <div className="chart-title">Intensity by Region</div>
      <div className="chart-subtitle">Average intensity score per region</div>
      <Bar data={chartData} options={options} />
    </>
  );
}
