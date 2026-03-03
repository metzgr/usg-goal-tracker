// ──────────────────────────────────────────────
// HOW TO RUN:
//   node scripts/updateStratMLData.mjs
//
// DESCRIPTION:
//   Fetches data from the StratML USPerformance base and the StratML Data Dictionary
//   base in Airtable. Outputs one JSON per table into stratml_data/ and
//   stratml_data/data_dictionary/ respectively.
//
// ENVIRONMENT:
//   Requires AIRTABLE_PERSONAL_TOKEN, AIRTABLE_BASE_STRATML_USPERFORMANCE_ID,
//   and AIRTABLE_BASE_STRATML_DATA_DICTIONARY_ID in .env.local
// ──────────────────────────────────────────────

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import Airtable from 'airtable';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.AIRTABLE_PERSONAL_TOKEN;
const usperfBaseId = process.env.AIRTABLE_BASE_STRATML_USPERFORMANCE_ID;
const dataDictBaseId = process.env.AIRTABLE_BASE_STRATML_DATA_DICTIONARY_ID;

if (!token || !usperfBaseId || !dataDictBaseId) {
  console.error('Missing required env vars. Need AIRTABLE_PERSONAL_TOKEN, AIRTABLE_BASE_STRATML_USPERFORMANCE_ID, and AIRTABLE_BASE_STRATML_DATA_DICTIONARY_ID in .env.local');
  process.exit(1);
}

const usperfTableNames = [
  'Administration',
  'Organization',
  'Division',
  'Subdivision',
  'StrategicPlan',
  'Mission',
  'Goal',
  'Objective',
  'PerformancePlanOrReport',
  'PerformanceIndicator',
  'MeasurementInstance',
  'Category',
  'Person',
  'Media',
  'Program',
];

const dataDictTableNames = [
  'L9',
  'L8',
  'L7',
  'L6',
  'L5',
  'L4',
  'L3',
  'L2',
  'L1',
  'Attributes',
  'Source',
  'Type',
  'Type L3',
  'Type L2',
  'Type L1',
];

function fetchTable(base, tableName) {
  const records = [];
  return new Promise((resolve, reject) => {
    base(tableName)
      .select()
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

async function fetchAllTables(baseId, tableNames, outputDir) {
  const base = new Airtable({ apiKey: token }).base(baseId);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const table of tableNames) {
    try {
      const data = await fetchTable(base, table);
      const outputPath = path.join(outputDir, `${table}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`✅ ${table} → ${outputPath} (${data.length} records)`);
    } catch (err) {
      console.error(`❌ Error fetching ${table}:`, err.message);
    }
  }
}

async function main() {
  const stratmlDir = path.join(__dirname, '..', 'stratml_data');
  const dataDictDir = path.join(stratmlDir, 'data_dictionary');

  console.log('\n📦 Fetching StratML USPerformance base...\n');
  await fetchAllTables(usperfBaseId, usperfTableNames, stratmlDir);

  console.log('\n📖 Fetching StratML Data Dictionary base...\n');
  await fetchAllTables(dataDictBaseId, dataDictTableNames, dataDictDir);

  console.log('\n✅ Done!\n');
}

main();
