import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const compressDir = async () => {
const base = process.cwd();
  const srcDir = path.join(base, 'workspace', 'toCompress');
  const outDir = path.join(base, 'workspace', 'compressed');
  const outFile = path.join(outDir, 'archive.br');

  if (!fs.existsSync(srcDir)) {
    throw new Error('FS operation failed');
  }

  await fs.promises.mkdir(outDir, { recursive: true });

  const output = fs.createWriteStream(outFile);
  const brotli = zlib.createBrotliCompress();

  brotli.pipe(output);

  const walk = async (dir, prefix = '') => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath, relPath);
      } else {
        brotli.write(`FILE:${relPath}\n`);

        await new Promise((resolve, reject) => {
          const rs = fs.createReadStream(fullPath);
          rs.on('error', reject);
          rs.on('end', resolve);
          rs.pipe(brotli, { end: false });
        });

        brotli.write('\nEND_FILE\n');
      }
    }
  };

  await walk(srcDir);

  brotli.end();

  
};

await compressDir();
