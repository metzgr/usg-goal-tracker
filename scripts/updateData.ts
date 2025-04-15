// scripts/updateData.ts
"use strict";

import Airtable from "airtable";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local
// (Ensure you have a package like dotenv if your script environment doesn't load them automatically.)
import dotenv from "dotenv";
dotenv.config();

// Configure Airtable
const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;

if (!baseId || !apiKey) {
  console.error("Missing Airtable API credentials in .env.local");
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

// Replace this with your actual table name
const tableName = "tbl4WAMwrF9aMKQOz"; // Example table ID from the URL
const outputDir = path.join(__dirname, "..", "data");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function exportTableData(table: string): Promise<any[]> {
  const records: any[] = [];
  return new Promise((resolve, reject) => {
    base(table)
      .select({ view: "Grid view" })  // Adjust the view if needed
      .eachPage(
        (pageRecords, fetchNextPage) => {
          pageRecords.forEach(record => {
            // Using Airtable's native id property.
            records.push({ id: record.id, ...record.fields });
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve(records);
        }
      );
  });
}

async function updateData() {
  try {
    // Export data from the table
    const data = await exportTableData(tableName);
    // Write data to JSON file
    const outputPath = path.join(outputDir, `${tableName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Data from table ${tableName} saved to ${outputPath}`);
  } catch (error) {
    console.error("Error exporting data:", error);
  }
}

updateData();