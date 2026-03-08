import { spawn } from 'child_process';

const execCommand = () => {
  // Write your code here
  // Take command from CLI argument
  // Spawn child process
  // Pipe child stdout/stderr to parent stdout/stderr
  // Pass environment variables
  // Exit with same code as child
  const commandString = process.argv[2];

  if (!commandString) {
    console.error('No command provided');
    process.exit(1);
  }

  const child = spawn(commandString, {
    shell: true,          // ← делает ls/dir/echo рабочими в Windows
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('close', (code) => {
    process.exit(code);
  });

  child.on('error', (err) => {
    console.error(err.message);
    process.exit(1);
  });


};

execCommand();
