import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import useChartData from '../hooks/useChartData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function LikelihoodByTopic({ query, api }) {
  const { data, loading } = useChartData(api, '/api/charts/likelihood-by-topic', query);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data?.length) return <div className="loading">No data</div>;

  const chartData = {
    labels: data.map(d => d.topic),
    datasets: [{
      label: 'Avg Likelihood',
      data: data.map(d => d.avg_likelihood),
      backgroundColor: 'rgba(0,212,170,0.7)',
      borderColor: '#00d4aa',
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
      x: { ticks: { color: '#8892b0', font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
      y: { ticks: { color: '#8892b0', font: { size: 11 } }, grid: { color: '#2e3250' } },
    },
  };

  return (
    <>
      <div className="chart-title">Likelihood by Topic</div>
      <div className="chart-subtitle">Top 15 topics by average likelihood</div>
      <Bar data={chartData} options={options} />
    </>
  );
}
