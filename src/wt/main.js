import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const main = async () => {
 const dataPath = path.resolve(__dirname, '../../data.json');

  const raw = await fs.readFile(dataPath, 'utf8');
  const numbers = JSON.parse(raw);

  const cpuCount = os.cpus().length;

  const chunkSize = Math.ceil(numbers.length / cpuCount);
  const chunks = [];
  for (let i = 0; i < numbers.length; i += chunkSize) {
    chunks.push(numbers.slice(i, i + chunkSize));
  }

  const workerPromises = chunks.map((chunk) => {
    return new Promise((resolve, reject) => {
      const workerPath = path.join(__dirname, 'worker.js');
      const worker = new Worker(workerPath);

      worker.postMessage(chunk);

      worker.on('message', resolve);
      worker.on('error', reject);
    });
  });

  const sortedChunks = await Promise.all(workerPromises);

  const result = kWayMerge(sortedChunks);

  console.log(result);
};

function kWayMerge(arrays) {
  const result = [];
  const indices = Array(arrays.length).fill(0);

  while (true) {
    let minValue = Infinity;
    let minArrayIndex = -1;

    for (let i = 0; i < arrays.length; i++) {
      const idx = indices[i];
      if (idx < arrays[i].length && arrays[i][idx] < minValue) {
        minValue = arrays[i][idx];
        minArrayIndex = i;
      }
    }

    if (minArrayIndex === -1) break;

    result.push(minValue);
    indices[minArrayIndex]++;
  }

  return result;

};

await main();
