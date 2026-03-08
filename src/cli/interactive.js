import readline from 'readline';

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  // Показать начальный prompt
  rl.prompt();

  rl.on('line', (input) => {
    const cmd = input.trim();

    switch (cmd) {
      case 'uptime':
        console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
        break;

      case 'cwd':
        console.log(process.cwd());
        break;

      case 'date':
        console.log(new Date().toISOString());
        break;

      case 'exit':
        console.log('Goodbye!');
        process.exit(0);

      default:
        console.log('Unknown command');
    }

    rl.prompt();
  });

  // Ctrl+C
  rl.on('SIGINT', () => {
    console.log('Goodbye!');
    process.exit(0);
  });

  // Конец ввода (Ctrl+D)
  rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });

};

interactive();
