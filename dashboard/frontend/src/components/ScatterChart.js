import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend
} from 'chart.js';
import useChartData from '../hooks/useChartData';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// Group scatter points by sector for color coding
const SECTOR_COLORS = {
  'Energy': '#ffd93d',
  'Environment': '#34d399',
  'Government': '#6c63ff',
  'Financial services': '#00d4aa',
  'Information Technology': '#60a5fa',
  'Healthcare': '#f472b6',
  'Manufacturing': '#fb923c',
  'Retail': '#a78bfa',
  'Aerospace & defence': '#ff6b6b',
  'default': '#8892b0',
};

export default function ScatterChart({ query, api }) {
  const { data, loading } = useChartData(api, '/api/charts/scatter', query);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data?.length) return <div className="loading">No data</div>;

  // Group by sector
  const grouped = {};
  data.forEach(d => {
    const sector = d.sector || 'Unknown';
    if (!grouped[sector]) grouped[sector] = [];
    grouped[sector].push({ x: d.x, y: d.y });
  });

  const datasets = Object.entries(grouped).slice(0, 10).map(([sector, points]) => ({
    label: sector,
    data: points,
    backgroundColor: (SECTOR_COLORS[sector] || SECTOR_COLORS.default) + '99',
    pointRadius: 5,
    pointHoverRadius: 8,
  }));

  const chartData = { datasets };

  const options = {
    responsive: true,
    interaction: { mode: 'nearest' },
    plugins: {
      legend: {
        labels: { color: '#8892b0', font: { size: 11 }, boxWidth: 12, padding: 10 },
      },
      tooltip: {
        backgroundColor: '#1a1d27',
        borderColor: '#2e3250',
        borderWidth: 1,
        callbacks: {
          label: ctx => `${ctx.dataset.label}: Intensity ${ctx.parsed.x}, Likelihood ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Intensity', color: '#8892b0', font: { size: 12 } },
        ticks: { color: '#8892b0', font: { size: 11 } },
        grid: { color: '#2e3250' },
      },
      y: {
        title: { display: true, text: 'Likelihood', color: '#8892b0', font: { size: 12 } },
        ticks: { color: '#8892b0', font: { size: 11 } },
        grid: { color: '#2e3250' },
      },
    },
  };

  return (
    <>
      <div className="chart-title">Intensity vs Likelihood</div>
      <div className="chart-subtitle">Scatter plot colored by sector — bubble size reflects relevance</div>
      <Scatter data={chartData} options={options} />
    </>
  );
}
