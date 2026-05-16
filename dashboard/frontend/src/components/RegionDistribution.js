import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend
} from 'chart.js';
import useChartData from '../hooks/useChartData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RegionDistribution({ query, api }) {
  const { data, loading } = useChartData(api, '/api/charts/region-distribution', query);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data?.length) return <div className="loading">No data</div>;

  // Take top 10 regions for radar readability
  const top = data.slice(0, 10);

  const chartData = {
    labels: top.map(d => d.region),
    datasets: [{
      label: 'Record Count',
      data: top.map(d => d.count),
      backgroundColor: 'rgba(108,99,255,0.2)',
      borderColor: '#6c63ff',
      pointBackgroundColor: '#6c63ff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#6c63ff',
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#8892b0', font: { size: 12 } } },
      tooltip: { backgroundColor: '#1a1d27', borderColor: '#2e3250', borderWidth: 1 },
    },
    scales: {
      r: {
        ticks: { color: '#8892b0', backdropColor: 'transparent', font: { size: 9 } },
        grid: { color: '#2e3250' },
        pointLabels: { color: '#8892b0', font: { size: 10 } },
      },
    },
  };

  return (
    <>
      <div className="chart-title">Region Coverage</div>
      <div className="chart-subtitle">Top 10 regions by record count (radar)</div>
      <Radar data={chartData} options={options} />
    </>
  );
}
