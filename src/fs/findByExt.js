import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findWorkspace() {
  function search(dir) {
    const candidate = path.join(dir, 'workspace');

    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return fs.realpathSync(candidate);
    }

    const parent = path.dirname(dir);

    if (parent === dir) {
      throw new Error('FS operation failed');
    }

    return search(parent);
  }

  return search(__dirname);
}

async function collectFiles(dir, ext, root, result) {
  const items = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.relative(root, fullPath).replace(/\\/g, '/');

    if (item.isDirectory()) {
      await collectFiles(fullPath, ext, root, result);
    } else if (item.isFile()) {
      if (relPath.endsWith(ext)) {
        result.push(relPath);
      }
    }
  }
}


const findByExt = async () => {

const args = process.argv.slice(2);
  const extIndex = args.indexOf('--ext');

  let ext = '.txt';

  if (extIndex !== -1 && args[extIndex + 1]) {
    const raw = args[extIndex + 1];
    ext = raw.startsWith('.') ? raw : `.${raw}`;
  }

  const workspace = findWorkspace();

  if (!workspace || !fs.existsSync(workspace)) {
    throw new Error('FS operation failed');
  }

  const result = [];
  await collectFiles(workspace, ext, workspace, result);

  result.sort();

  for (const file of result) {
    console.log(file);
  }


};

await findByExt();
