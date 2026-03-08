import fs from 'fs';
import path from 'path';

const split = async () => {

  const idx = process.argv.indexOf('--lines');
  const maxLines = idx !== -1 ? Number(process.argv[idx + 1]) : 10;

  const sourcePath = path.join(process.cwd(), 'source.txt');

  const readStream = fs.createReadStream(sourcePath, { encoding: 'utf8' });

  let buffer = '';
  let lineCount = 0;
  let chunkIndex = 1;
  let writeStream = fs.createWriteStream(`chunk_${chunkIndex}.txt`);

  readStream.on('data', chunk => {
    buffer += chunk;
    let lines = buffer.split('\n');

    buffer = lines.pop();

    for (const line of lines) {
      writeStream.write(line + '\n');
      lineCount++;

      if (lineCount >= maxLines) {
        writeStream.end();
        chunkIndex++;
        writeStream = fs.createWriteStream(`chunk_${chunkIndex}.txt`);
        lineCount = 0;
      }
    }
  });

  readStream.on('end', () => {
    if (buffer.length > 0) {
      writeStream.write(buffer + '\n');
    }
    writeStream.end();
  });

  readStream.on('error', () => {
    console.error('Error reading source.txt');
  });

};

await split();
