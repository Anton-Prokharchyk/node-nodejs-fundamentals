const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%
  const args = process.argv.slice(2);

  // --- CLI parsing ---
  const getArg = (name, def) => {
    const idx = args.indexOf(name);
    if (idx !== -1 && args[idx + 1]) return args[idx + 1];
    return def;
  };

  const duration = Number(getArg('--duration', 5000));
  const interval = Number(getArg('--interval', 100));
  const length = Number(getArg('--length', 30));
  const colorArg = getArg('--color', null);

  // Validate color
  let color = null;
  if (colorArg && /^#[0-9A-Fa-f]{6}$/.test(colorArg)) {
    const r = parseInt(colorArg.slice(1, 3), 16);
    const g = parseInt(colorArg.slice(3, 5), 16);
    const b = parseInt(colorArg.slice(5, 7), 16);
    color = `\x1b[38;2;${r};${g};${b}m`;
  }

  const reset = "\x1b[0m";

  let elapsed = 0;

  const timer = setInterval(() => {
    elapsed += interval;
    let percent = Math.min(100, (elapsed / duration) * 100);
    const filled = Math.round((percent / 100) * length);

    const filledBar = "█".repeat(filled);
    const emptyBar = " ".repeat(length - filled);

    const coloredFilled = color ? color + filledBar + reset : filledBar;

    const bar = `[${coloredFilled}${emptyBar}] ${percent.toFixed(0)}%`;

    process.stdout.write("\r" + bar);

    if (percent >= 100) {
      clearInterval(timer);
      console.log("\nDone!");
    }
  }, interval);

};

progress();
