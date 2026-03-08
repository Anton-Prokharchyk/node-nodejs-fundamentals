import { Transform } from 'stream';

const filter = () => {

   const patternIndex = process.argv.indexOf('--pattern');
  if (patternIndex === -1 || !process.argv[patternIndex + 1]) {
    console.error('Pattern not provided');
    process.exit(1);
  }

  const pattern = process.argv[patternIndex + 1];

  const transformer = new Transform({
    transform(chunk, enc, callback) {
      const text = chunk.toString();
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.includes(pattern)) {
          this.push(line + '\n');
        }
      }

      callback();
    }
  });

  process.stdin.pipe(transformer).pipe(process.stdout);

};

filter();
