import React from 'react';
import './FilterPanel.css';

const FilterSelect = ({ label, value, options, onChange, icon }) => (
  <div className="filter-group">
    <label className="filter-label">
      <span className="filter-icon">{icon}</span>
      {label}
    </label>
    <select
      className="filter-select"
      value={value || ''}
      onChange={e => onChange(e.target.value || undefined)}
    >
      <option value="">All</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default function FilterPanel({ options, filters, onChange }) {
  const set = (key) => (val) => onChange(prev => ({ ...prev, [key]: val }));

  return (
    <div className="filter-panel">
      <div className="filter-section-title">Filters</div>

      <FilterSelect
        label="End Year"
        icon="📅"
        value={filters.end_year}
        options={(options.end_years || []).map(String)}
        onChange={set('end_year')}
      />
      <FilterSelect
        label="Topic"
        icon="🏷️"
        value={filters.topic}
        options={options.topics || []}
        onChange={set('topic')}
      />
      <FilterSelect
        label="Sector"
        icon="🏭"
        value={filters.sector}
        options={options.sectors || []}
        onChange={set('sector')}
      />
      <FilterSelect
        label="Region"
        icon="🌍"
        value={filters.region}
        options={options.regions || []}
        onChange={set('region')}
      />
      <FilterSelect
        label="PEST"
        icon="📊"
        value={filters.pestle}
        options={options.pestles || []}
        onChange={set('pestle')}
      />
      <FilterSelect
        label="Source"
        icon="📰"
        value={filters.source}
        options={options.sources || []}
        onChange={set('source')}
      />
      <FilterSelect
        label="SWOT"
        icon="🎯"
        value={filters.swot}
        options={options.swot || []}
        onChange={set('swot')}
      />
      <FilterSelect
        label="Country"
        icon="🏳️"
        value={filters.country}
        options={options.countries || []}
        onChange={set('country')}
      />
      <FilterSelect
        label="City"
        icon="🏙️"
        value={filters.city}
        options={options.cities || []}
        onChange={set('city')}
      />
    </div>
  );
}
