import { Transform } from 'stream';

const lineNumberer = () => {
  // Write your code here
  // Read from process.stdin
  // Use Transform Stream to prepend line numbers
  // Write to process.stdout
let counter = 1;
  let leftover = '';

  const transformer = new Transform({
    transform(chunk, enc, callback) {
      const text = leftover + chunk.toString();
      const parts = text.split('\n');

      // Последняя часть может быть незавершённой строкой
      leftover = parts.pop();

      for (const line of parts) {
        this.push(`${counter++} | ${line}\n`);
      }

      callback();
    },

    flush(callback) {
      // Если осталась строка и она НЕ пустая — выводим
      if (leftover !== '') {
        this.push(`${counter++} | ${leftover}`);
      }
      callback();
    }
  });

  process.stdin.pipe(transformer).pipe(process.stdout);

};

lineNumberer();
