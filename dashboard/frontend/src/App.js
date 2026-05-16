import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import KPICards from './components/KPICards';
import FilterPanel from './components/FilterPanel';
import IntensityByRegion from './components/IntensityByRegion';
import LikelihoodByTopic from './components/LikelihoodByTopic';
import RelevanceByCountry from './components/RelevanceByCountry';
import TopicsDistribution from './components/TopicsDistribution';
import SectorDistribution from './components/SectorDistribution';
import IntensityOverYears from './components/IntensityOverYears';
import PestleDistribution from './components/PestleDistribution';
import ScatterChart from './components/ScatterChart';
import RegionDistribution from './components/RegionDistribution';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const buildQuery = useCallback((f) => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v) params.append(k, v); });
    return params.toString();
  }, []);

  useEffect(() => {
    fetch(`${API}/api/filters`)
      .then(r => r.json())
      .then(setFilterOptions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const q = buildQuery(filters);
    fetch(`${API}/api/stats${q ? '?' + q : ''}`)
      .then(r => r.json())
      .then(setStats)
      .catch(console.error);
  }, [filters, buildQuery]);

  const query = buildQuery(filters);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">◈</span>
            {sidebarOpen && <span className="logo-text">InsightViz</span>}
          </div>
          <button className="toggle-btn" onClick={() => setSidebarOpen(p => !p)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        {sidebarOpen && (
          <FilterPanel
            options={filterOptions}
            filters={filters}
            onChange={setFilters}
          />
        )}
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="top-bar">
          <div>
            <h1 className="page-title">Analytics Dashboard</h1>
            <p className="page-subtitle">Global Insights & Intelligence Overview</p>
          </div>
          <div className="header-right">
            {Object.values(filters).filter(Boolean).length > 0 && (
              <button className="clear-btn" onClick={() => setFilters({})}>
                ✕ Clear Filters ({Object.values(filters).filter(Boolean).length})
              </button>
            )}
          </div>
        </header>

        {stats && <KPICards stats={stats} />}

        <div className="charts-grid">
          <div className="chart-card span-2">
            <IntensityOverYears query={query} api={API} />
          </div>
          <div className="chart-card">
            <IntensityByRegion query={query} api={API} />
          </div>
          <div className="chart-card">
            <LikelihoodByTopic query={query} api={API} />
          </div>
          <div className="chart-card">
            <SectorDistribution query={query} api={API} />
          </div>
          <div className="chart-card">
            <PestleDistribution query={query} api={API} />
          </div>
          <div className="chart-card">
            <TopicsDistribution query={query} api={API} />
          </div>
          <div className="chart-card">
            <RegionDistribution query={query} api={API} />
          </div>
          <div className="chart-card span-2">
            <RelevanceByCountry query={query} api={API} />
          </div>
          <div className="chart-card span-2">
            <ScatterChart query={query} api={API} />
          </div>
        </div>
      </main>
    </div>
  );
}
