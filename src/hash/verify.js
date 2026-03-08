import fs from 'fs';
import path from 'path';
import crypto from 'crypto';


const verify = async () => {
  // Write your code here
  // Read checksums.json
  // Calculate SHA256 hash using Streams API
  // Print result: filename — OK/FAIL
const baseDir = process.cwd();
  const checksumsPath = path.join(baseDir, 'checksums.json');

  // checksums.json должен существовать
  if (!fs.existsSync(checksumsPath)) {
    throw new Error('FS operation failed');
  }

  let checksums;
  try {
    const raw = await fs.promises.readFile(checksumsPath, 'utf8');
    checksums = JSON.parse(raw);
  } catch {
    throw new Error('FS operation failed');
  }

  const hashFile = (filePath) =>
    new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('error', reject);
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });

  for (const [filename, expectedHash] of Object.entries(checksums)) {
    const filePath = path.join(baseDir, filename);

    try {
      const actualHash = await hashFile(filePath);
      if (actualHash === expectedHash) {
        console.log(`${filename} — OK`);
      } else {
        console.log(`${filename} — FAIL`);
      }
    } catch {
      console.log(`${filename} — FAIL`);
    }
  }

};

await verify();
