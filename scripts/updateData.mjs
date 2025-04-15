import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import Airtable from 'airtable';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get env vars
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableNames = [
  'organization',
  'strategicPlan',
  'goal',
  'objective',
  'metric',
  'metricMeasurement',
  'project',
  'milestone',
  'milestoneMeasurement',
  'image',
  'tag',
  'fpiProgram'
]; // Update with your table names

if (!apiKey || !baseId) {
  console.error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in environment.');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

async function fetchTable(tableName) {
  const records = [];
  return new Promise((resolve, reject) => {
    base(tableName)
      .select({ view: 'Production' }) // Or your custom view
      .eachPage(
        (recordsPage, fetchNextPage) => {
          recordsPage.forEach((record) => {
            records.push({ id: record.id, ...record.fields });
          });
          fetchNextPage();
        },
        (err) => {
          if (err) return reject(err);
          resolve(records);
        }
      );
  });
}

async function updateAllTables() {
  const outputDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  for (const table of tableNames) {
    try {
      const data = await fetchTable(table);
      const outputPath = path.join(outputDir, `${table}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`✅ Exported ${table} to ${outputPath}`);
    } catch (err) {
      console.error(`❌ Error fetching ${table}:`, err);
    }
  }
}

updateAllTables();