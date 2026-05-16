const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://localhost:27017/insightsdashboard';

// Schema
const insightSchema = new mongoose.Schema({
  end_year: Number, start_year: Number,
  intensity: Number, likelihood: Number, relevance: Number,
  sector: String, topic: String, region: String,
  country: String, city: String, pestle: String,
  source: String, insight: String, title: String,
  url: String, impact: String, added: String, published: String,
}, { collection: 'insights' });

const Insight = mongoose.model('Insight', insightSchema);

// Build MongoDB filter object from query params
function buildFilter(query) {
  const filter = {};
  if (query.end_year)  filter.end_year  = Number(query.end_year);
  if (query.topic)     filter.topic     = query.topic;
  if (query.sector)    filter.sector    = query.sector;
  if (query.region)    filter.region    = query.region;
  if (query.pestle)    filter.pestle    = query.pestle;
  if (query.source)    filter.source    = query.source;
  if (query.country)   filter.country   = query.country;
  if (query.city)      filter.city      = query.city;
  return filter;
}

// GET /api/filters
app.get('/api/filters', async (req, res) => {
  try {
    const [end_years, topics, sectors, regions, pestles, sources, countries, cities] = await Promise.all([
      Insight.distinct('end_year', { end_year: { $ne: null, $gt: 0 } }),
      Insight.distinct('topic',    { topic:    { $nin: [null, ''] } }),
      Insight.distinct('sector',   { sector:   { $nin: [null, ''] } }),
      Insight.distinct('region',   { region:   { $nin: [null, ''] } }),
      Insight.distinct('pestle',   { pestle:   { $nin: [null, ''] } }),
      Insight.distinct('source',   { source:   { $nin: [null, ''] } }),
      Insight.distinct('country',  { country:  { $nin: [null, ''] } }),
      Insight.distinct('city',     { city:     { $nin: [null, ''] } }),
    ]);
    res.json({
      end_years: end_years.sort((a, b) => a - b),
      topics:    topics.sort(),
      sectors:   sectors.sort(),
      regions:   regions.sort(),
      pestles:   pestles.sort(),
      sources:   sources.sort(),
      countries: countries.sort(),
      cities:    cities.sort(),
      swot: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/stats
app.get('/api/stats', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const [agg, uniqueCountries, uniqueTopics, uniqueSectors] = await Promise.all([
      Insight.aggregate([
        { $match: filter },
        { $group: {
          _id: null,
          total:         { $sum: 1 },
          avg_intensity: { $avg: '$intensity' },
          avg_likelihood:{ $avg: '$likelihood' },
          avg_relevance: { $avg: '$relevance' },
        }},
      ]),
      Insight.distinct('country', { ...filter, country: { $nin: [null, ''] } }),
      Insight.distinct('topic',   { ...filter, topic:   { $nin: [null, ''] } }),
      Insight.distinct('sector',  { ...filter, sector:  { $nin: [null, ''] } }),
    ]);
    const s = agg[0] || {};
    res.json({
      total:            s.total || 0,
      avg_intensity:    +(s.avg_intensity  || 0).toFixed(2),
      avg_likelihood:   +(s.avg_likelihood || 0).toFixed(2),
      avg_relevance:    +(s.avg_relevance  || 0).toFixed(2),
      unique_countries: uniqueCountries.length,
      unique_topics:    uniqueTopics.length,
      unique_sectors:   uniqueSectors.length,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/intensity-by-region
app.get('/api/charts/intensity-by-region', async (req, res) => {
  try {
    const filter = { ...buildFilter(req.query), region: { $nin: [null, ''] } };
    const data = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: '$region', avg_intensity: { $avg: '$intensity' }, count: { $sum: 1 } } },
      { $project: { region: '$_id', avg_intensity: { $round: ['$avg_intensity', 2] }, count: 1, _id: 0 } },
      { $sort: { avg_intensity: -1 } },
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/likelihood-by-topic
app.get('/api/charts/likelihood-by-topic', async (req, res) => {
  try {
    const filter = { ...buildFilter(req.query), topic: { $nin: [null, ''] } };
    const data = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: '$topic', avg_likelihood: { $avg: '$likelihood' }, count: { $sum: 1 } } },
      { $project: { topic: '$_id', avg_likelihood: { $round: ['$avg_likelihood', 2] }, count: 1, _id: 0 } },
      { $sort: { avg_likelihood: -1 } },
      { $limit: 15 },
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/relevance-by-country
app.get('/api/charts/relevance-by-country', async (req, res) => {
  try {
    const filter = { ...buildFilter(req.query), country: { $nin: [null, ''] } };
    const data = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: '$country', avg_relevance: { $avg: '$relevance' }, count: { $sum: 1 } } },
      { $project: { country: '$_id', avg_relevance: { $round: ['$avg_relevance', 2] }, count: 1, _id: 0 } },
      { $sort: { avg_relevance: -1 } },
      { $limit: 15 },
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/topics-distribution
app.get('/api/charts/topics-distribution', async (req, res) => {
  try {
    const filter = { ...buildFilter(req.query), topic: { $nin: [null, ''] } };
    const data = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $project: { topic: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 12 },
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/sector-distribution
app.get('/api/charts/sector-distribution', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const data = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: { $ifNull: ['$sector', 'Unknown'] }, count: { $sum: 1 } } },
      { $project: { sector: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/intensity-over-years
app.get('/api/charts/intensity-over-years', async (req, res) => {
  try {
    const filter = { ...buildFilter(req.query), end_year: { $nin: [null, 0] } };
    // if end_year filter was set, keep it; otherwise use the $nin guard
    if (req.query.end_year) filter.end_year = Number(req.query.end_year);
    const data = await Insight.aggregate([
      { $match: filter },
      { $group: {
        _id: '$end_year',
        avg_intensity:  { $avg: '$intensity' },
        avg_likelihood: { $avg: '$likelihood' },
        avg_relevance:  { $avg: '$relevance' },
        count: { $sum: 1 },
      }},
      { $project: {
        year: '$_id',
        avg_intensity:  { $round: ['$avg_intensity',  2] },
        avg_likelihood: { $round: ['$avg_likelihood', 2] },
        avg_relevance:  { $round: ['$avg_relevance',  2] },
        count: 1, _id: 0,
      }},
      { $sort: { year: 1 } },
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/pestle-distribution
app.get('/api/charts/pestle-distribution', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const data = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: { $ifNull: ['$pestle', 'Unknown'] }, count: { $sum: 1 } } },
      { $project: { pestle: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/region-distribution
app.get('/api/charts/region-distribution', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const data = await Insight.aggregate([
      { $match: filter },
      { $group: { _id: { $ifNull: ['$region', 'Unknown'] }, count: { $sum: 1 } } },
      { $project: { region: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/charts/scatter
app.get('/api/charts/scatter', async (req, res) => {
  try {
    const filter = { ...buildFilter(req.query), intensity: { $gt: 0 }, likelihood: { $gt: 0 } };
    const data = await Insight.find(filter, 'intensity likelihood relevance topic sector country -_id').lean();
    res.json(data.map(d => ({
      x: d.intensity, y: d.likelihood,
      r: d.relevance || 1,
      topic: d.topic, sector: d.sector, country: d.country,
    })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Connect then start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });
