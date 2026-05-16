import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import useChartData from '../hooks/useChartData';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#6c63ff','#00d4aa','#ffd93d','#ff6b6b','#a78bfa',
  '#34d399','#fb923c','#60a5fa','#f472b6','#4ade80',
  '#facc15','#38bdf8','#c084fc','#f87171','#2dd4bf',
];

export default function SectorDistribution({ query, api }) {
  const { data, loading } = useChartData(api, '/api/charts/sector-distribution', query);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data?.length) return <div className="loading">No data</div>;

  const chartData = {
    labels: data.map(d => d.sector),
    datasets: [{
      data: data.map(d => d.count),
      backgroundColor: COLORS.map(c => c + 'cc'),
      borderColor: COLORS,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#8892b0', font: { size: 10 }, padding: 8, boxWidth: 12 },
      },
      tooltip: { backgroundColor: '#1a1d27', borderColor: '#2e3250', borderWidth: 1 },
    },
  };

  return (
    <>
      <div className="chart-title">Sector Distribution</div>
      <div className="chart-subtitle">Records breakdown by sector</div>
      <Pie data={chartData} options={options} />
    </>
  );
}
