import fs from 'fs/promises';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'src/data');
const filesToUpdate = ['goal.json', 'metric.json', 'plan.json'];

async function addViewsToJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(data);

    if (Array.isArray(json)) {
      const updatedJson = json.map(item => ({
        ...item,
        views: Math.floor(Math.random() * 10000) + 1, // Random views between 1 and 10000
      }));

      await fs.writeFile(filePath, JSON.stringify(updatedJson, null, 2));
      console.log(`Successfully added views to ${path.basename(filePath)}`);
    } else {
      console.log(`${path.basename(filePath)} is not a JSON array, skipping.`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function main() {
  for (const fileName of filesToUpdate) {
    const filePath = path.join(dataDir, fileName);
    await addViewsToJSON(filePath);
  }
}

main();
