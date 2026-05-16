import React from 'react';
import './KPICards.css';

const cards = [
  { key: 'total', label: 'Total Records', icon: '📋', color: '#6c63ff', suffix: '' },
  { key: 'avg_intensity', label: 'Avg Intensity', icon: '⚡', color: '#00d4aa', suffix: '' },
  { key: 'avg_likelihood', label: 'Avg Likelihood', icon: '🎲', color: '#ffd93d', suffix: '' },
  { key: 'avg_relevance', label: 'Avg Relevance', icon: '🎯', color: '#ff6b6b', suffix: '' },
  { key: 'unique_countries', label: 'Countries', icon: '🌍', color: '#a78bfa', suffix: '' },
  { key: 'unique_topics', label: 'Topics', icon: '🏷️', color: '#34d399', suffix: '' },
  { key: 'unique_sectors', label: 'Sectors', icon: '🏭', color: '#fb923c', suffix: '' },
];

export default function KPICards({ stats }) {
  return (
    <div className="kpi-grid">
      {cards.map(c => (
        <div className="kpi-card" key={c.key} style={{ '--accent-color': c.color }}>
          <div className="kpi-icon">{c.icon}</div>
          <div className="kpi-body">
            <div className="kpi-value">{stats[c.key]}{c.suffix}</div>
            <div className="kpi-label">{c.label}</div>
          </div>
          <div className="kpi-glow" />
        </div>
      ))}
    </div>
  );
}
