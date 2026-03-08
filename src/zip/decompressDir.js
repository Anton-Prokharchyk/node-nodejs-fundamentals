import fs from 'fs';
import path from 'path';
import readline from 'readline';
import zlib from 'zlib';


const decompressDir = async () => {
  // Write your code here
  // Read archive.br from workspace/compressed/
  // Decompress and extract to workspace/decompressed/
  // Use Streams API

   const base = process.cwd();
  const compressedDir = path.join(base, 'workspace', 'compressed');
  const archivePath = path.join(compressedDir, 'archive.br');
  const outDir = path.join(base, 'workspace', 'decompressed');

  // Проверяем наличие compressed/
  if (!fs.existsSync(compressedDir) || !fs.existsSync(archivePath)) {
    throw new Error('FS operation failed');
  }

  // Создаём decompressed/
  await fs.promises.mkdir(outDir, { recursive: true });

  // Создаём поток чтения и распаковки
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
      // Закрываем предыдущий файл, если был
      if (writeStream) {
        writeStream.end();
      }

      const relPath = line.slice(5);
      const fullPath = path.join(outDir, relPath);

      // Создаём директорию под файл
      await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });

      // Открываем поток записи
      writeStream = fs.createWriteStream(fullPath);
      currentFile = fullPath;
    } else if (line === 'END_FILE') {
      if (writeStream) {
        writeStream.end();
        writeStream = null;
        currentFile = null;
      }
    } else {
      // Обычная строка содержимого файла
      if (writeStream) {
        writeStream.write(line + '\n');
      }
    }
  }

  // На случай, если файл не был закрыт
  if (writeStream) {
    writeStream.end();
  }

};

await decompressDir();
