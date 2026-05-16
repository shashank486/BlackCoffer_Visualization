# Insights Visualization Dashboard

A full-stack interactive data visualization dashboard built on the **MERN stack** (MongoDB, Express, React, Node.js). It reads 1000 global insight records from a MongoDB database and visualizes key metrics like Intensity, Likelihood, Relevance, Topics, Sectors, Regions, and Countries through interactive charts with real-time filters.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Database | MongoDB (local) |
| Backend | Node.js + Express.js |
| ODM | Mongoose |
| Frontend | React.js |
| Charts | Chart.js + react-chartjs-2 |
| Styling | Custom CSS (dark theme) |

---

## Project Structure

```
dashboard/
├── backend/
│   ├── server.js        # Express API with MongoDB aggregation queries
│   ├── seed.js          # Script to load jsondata.json into MongoDB
│   ├── jsondata.json    # Source data (1000 records)
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── KPICards.js            # Summary stat cards
    │   │   ├── FilterPanel.js         # Sidebar filters
    │   │   ├── IntensityOverYears.js  # Line chart
    │   │   ├── IntensityByRegion.js   # Horizontal bar chart
    │   │   ├── LikelihoodByTopic.js   # Bar chart
    │   │   ├── RelevanceByCountry.js  # Bar chart
    │   │   ├── TopicsDistribution.js  # Doughnut chart
    │   │   ├── SectorDistribution.js  # Pie chart
    │   │   ├── PestleDistribution.js  # Polar area chart
    │   │   ├── RegionDistribution.js  # Radar chart
    │   │   └── ScatterChart.js        # Scatter plot
    │   ├── hooks/
    │   │   └── useChartData.js        # Shared data fetching hook
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## Features

### Charts (9 total)
- **Line chart** — Avg Intensity, Likelihood & Relevance trends over years
- **Horizontal bar** — Average intensity by region
- **Bar chart** — Average likelihood by topic (top 15)
- **Bar chart** — Average relevance by country (top 15)
- **Doughnut** — Topics distribution (top 12)
- **Pie** — Sector breakdown
- **Polar Area** — PESTLE category analysis
- **Radar** — Region coverage (top 10)
- **Scatter plot** — Intensity vs Likelihood, color-coded by sector

### KPI Cards (7)
Total Records · Avg Intensity · Avg Likelihood · Avg Relevance · Countries · Topics · Sectors

### Filters (sidebar)
All charts and KPI cards update live when any filter changes.

| Filter | Description |
|---|---|
| End Year | Filter by projection end year |
| Topic | e.g. oil, gas, market, war |
| Sector | e.g. Energy, Healthcare, Government |
| Region | e.g. Northern America, Western Africa |
| PEST | Political, Economic, Social, Technological, etc. |
| Source | e.g. EIA, Reuters, WSJ |
| SWOT | Strengths, Weaknesses, Opportunities, Threats |
| Country | 56 countries available |
| City | City-level filter |

---

## Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

---

## How to Run

### Step 1 — Start MongoDB

Make sure your local MongoDB service is running:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# or run directly
mongod
```

### Step 2 — Setup & seed the backend

```bash
cd dashboard/backend
npm install
node seed.js
```

You should see:
```
Connected to MongoDB
Seeded 1000 records into MongoDB
Done.
```

### Step 3 — Start the backend server

```bash
node server.js
```

You should see:
```
Connected to MongoDB
Server running on http://localhost:5001
```

### Step 4 — Setup & start the frontend

Open a new terminal tab:

```bash
cd dashboard/frontend
npm install
npm start
```

The app will open automatically at **http://localhost:3000**

---

## API Endpoints

All endpoints accept optional query params for filtering:
`end_year`, `topic`, `sector`, `region`, `pestle`, `source`, `country`, `city`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stats` | KPI summary (totals + averages) |
| GET | `/api/filters` | All unique filter dropdown values |
| GET | `/api/charts/intensity-by-region` | Avg intensity per region |
| GET | `/api/charts/likelihood-by-topic` | Avg likelihood per topic |
| GET | `/api/charts/relevance-by-country` | Avg relevance per country |
| GET | `/api/charts/topics-distribution` | Topic record counts |
| GET | `/api/charts/sector-distribution` | Sector record counts |
| GET | `/api/charts/intensity-over-years` | Trends over end years |
| GET | `/api/charts/pestle-distribution` | PESTLE category counts |
| GET | `/api/charts/region-distribution` | Region record counts |
| GET | `/api/charts/scatter` | Intensity vs Likelihood data |

**Example filtered request:**
```
GET http://localhost:5001/api/stats?sector=Energy&region=Northern%20America
```

---

## Data Source

The dataset (`jsondata.json`) contains **1000 records** with the following key fields:

| Field | Description |
|---|---|
| `intensity` | Strength of the insight (numeric) |
| `likelihood` | Probability of occurrence (numeric) |
| `relevance` | Relevance score (numeric) |
| `end_year` | Projected end year |
| `topic` | Subject area (97 unique topics) |
| `sector` | Industry sector (18 unique sectors) |
| `region` | Geographic region (23 unique regions) |
| `country` | Country name (56 unique countries) |
| `pestle` | PESTLE category |
| `source` | Data source/publication |
| `title` | Insight title |
