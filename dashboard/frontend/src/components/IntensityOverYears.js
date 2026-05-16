import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import useChartData from '../hooks/useChartData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function IntensityOverYears({ query, api }) {
  const { data, loading } = useChartData(api, '/api/charts/intensity-over-years', query);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data?.length) return <div className="loading">No data</div>;

  const labels = data.map(d => d.year);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Avg Intensity',
        data: data.map(d => d.avg_intensity),
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108,99,255,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
      {
        label: 'Avg Likelihood',
        data: data.map(d => d.avg_likelihood),
        borderColor: '#00d4aa',
        backgroundColor: 'rgba(0,212,170,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
      {
        label: 'Avg Relevance',
        data: data.map(d => d.avg_relevance),
        borderColor: '#ffd93d',
        backgroundColor: 'rgba(255,217,61,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { color: '#8892b0', font: { size: 12 } } },
      tooltip: { backgroundColor: '#1a1d27', borderColor: '#2e3250', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#8892b0', font: { size: 11 } }, grid: { color: '#2e3250' } },
      y: { ticks: { color: '#8892b0', font: { size: 11 } }, grid: { color: '#2e3250' } },
    },
  };

  return (
    <>
      <div className="chart-title">Trends Over Years</div>
      <div className="chart-subtitle">Avg Intensity, Likelihood & Relevance by End Year</div>
      <Line data={chartData} options={options} />
    </>
  );
}
