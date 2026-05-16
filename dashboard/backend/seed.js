const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = 'mongodb://localhost:27017/insightsdashboard';

const insightSchema = new mongoose.Schema({
  end_year:   { type: Number, default: null },
  start_year: { type: Number, default: null },
  intensity:  Number,
  likelihood: Number,
  relevance:  Number,
  sector:     String,
  topic:      String,
  region:     String,
  country:    String,
  city:       String,
  pestle:     String,
  source:     String,
  insight:    String,
  title:      String,
  url:        String,
  impact:     String,
  added:      String,
  published:  String,
}, { collection: 'insights' });

const Insight = mongoose.model('Insight', insightSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'jsondata.json'), 'utf-8'));

  // Clean up empty strings to null for numeric fields
  const cleaned = raw.map(d => ({
    ...d,
    end_year:   d.end_year === '' ? null : Number(d.end_year) || null,
    start_year: d.start_year === '' ? null : Number(d.start_year) || null,
    intensity:  Number(d.intensity) || 0,
    likelihood: Number(d.likelihood) || 0,
    relevance:  Number(d.relevance) || 0,
    impact:     String(d.impact || ''),
    city:       d.city || '',
  }));

  await Insight.deleteMany({});
  await Insight.insertMany(cleaned);
  console.log(`Seeded ${cleaned.length} records into MongoDB`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => { console.error(err); process.exit(1); });
