import fs from 'fs';
import path from 'path';
import readline from 'readline';
import zlib from 'zlib';


const decompressDir = async () => {

   const base = process.cwd();
  const compressedDir = path.join(base, 'workspace', 'compressed');
  const archivePath = path.join(compressedDir, 'archive.br');
  const outDir = path.join(base, 'workspace', 'decompressed');

  if (!fs.existsSync(compressedDir) || !fs.existsSync(archivePath)) {
    throw new Error('FS operation failed');
  }

  await fs.promises.mkdir(outDir, { recursive: true });

  const readStream = fs.createReadStream(archivePath);
  const brotli = zlib.createBrotliDecompress();

  const rl = readline.createInterface({
    input: readStream.pipe(brotli),
    crlfDelay: Infinity
  });

  let currentFile = null;
  let writeStream = null;

  for await (const line of rl) {
    if (line.startsWith('FILE:')) {
      if (writeStream) {
        writeStream.end();
      }

      const relPath = line.slice(5);
      const fullPath = path.join(outDir, relPath);

      await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });

      writeStream = fs.createWriteStream(fullPath);
      currentFile = fullPath;
    } else if (line === 'END_FILE') {
      if (writeStream) {
        writeStream.end();
        writeStream = null;
        currentFile = null;
      }
    } else {
      if (writeStream) {
        writeStream.write(line + '\n');
      }
    }
  }

  if (writeStream) {
    writeStream.end();
  }

};

await decompressDir();
