import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const compressDir = async () => {
  // Write your code here
  // Read all files from workspace/toCompress/
  // Compress entire directory structure into archive.br
  // Save to workspace/compressed/
  // Use Streams API
const base = process.cwd();
  const srcDir = path.join(base, 'workspace', 'toCompress');
  const outDir = path.join(base, 'workspace', 'compressed');
  const outFile = path.join(outDir, 'archive.br');

  // Проверяем наличие toCompress
  if (!fs.existsSync(srcDir)) {
    throw new Error('FS operation failed');
  }

  // Создаём compressed/ если нет
  await fs.promises.mkdir(outDir, { recursive: true });

  // Создаём поток записи в archive.br
  const output = fs.createWriteStream(outFile);
  const brotli = zlib.createBrotliCompress();

  // Пайпим сжатие → файл
  brotli.pipe(output);

  // Рекурсивный обход директории
  const walk = async (dir, prefix = '') => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath, relPath);
      } else {
        // Пишем в архив путь файла
        brotli.write(`FILE:${relPath}\n`);

        // Пишем содержимое файла
        await new Promise((resolve, reject) => {
          const rs = fs.createReadStream(fullPath);
          rs.on('error', reject);
          rs.on('end', resolve);
          rs.pipe(brotli, { end: false });
        });

        // Разделитель между файлами
        brotli.write('\nEND_FILE\n');
      }
    }
  };

  await walk(srcDir);

  // Завершаем поток
  brotli.end();

  
};

await compressDir();
