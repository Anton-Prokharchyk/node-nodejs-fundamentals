import { Transform } from 'stream';

const lineNumberer = () => {
let counter = 1;
  let leftover = '';

  const transformer = new Transform({
    transform(chunk, enc, callback) {
      const text = leftover + chunk.toString();
      const parts = text.split('\n');

      leftover = parts.pop();

      for (const line of parts) {
        this.push(`${counter++} | ${line}\n`);
      }

      callback();
    },

    flush(callback) {
      if (leftover !== '') {
        this.push(`${counter++} | ${leftover}`);
      }
      callback();
    }
  });

  process.stdin.pipe(transformer).pipe(process.stdout);

};

lineNumberer();
