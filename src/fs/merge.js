import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname в ES-модуле
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// Поиск workspace вверх по дереву
// -----------------------------
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



const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt

  const workspace = findWorkspace();

  if (!workspace || !fs.existsSync(workspace)) {
    throw new Error('FS operation failed');
  }

  const partsDir = path.join(workspace, 'parts');

  // Проверяем наличие parts
  if (!fs.existsSync(partsDir) || !fs.statSync(partsDir).isDirectory()) {
    throw new Error('FS operation failed');
  }

  // CLI аргументы
  const args = process.argv.slice(2);
  const filesIndex = args.indexOf('--files');

  let filesToMerge = [];

  if (filesIndex !== -1 && args[filesIndex + 1]) {
    // Режим: --files file1,file2,...
    filesToMerge = args[filesIndex + 1].split(',').map(f => f.trim());

    // Проверяем, что все файлы существуют
    for (const file of filesToMerge) {
      const fullPath = path.join(partsDir, file);
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        throw new Error('FS operation failed');
      }
    }
  } else {
    // Режим по умолчанию: все .txt файлы в алфавитном порядке
    const items = await fs.promises.readdir(partsDir);

    filesToMerge = items
      .filter(name => name.endsWith('.txt'))
      .sort();

    if (filesToMerge.length === 0) {
      throw new Error('FS operation failed');
    }
  }

  // Читаем и конкатенируем содержимое
  let mergedContent = '';

  for (const file of filesToMerge) {
    const fullPath = path.join(partsDir, file);
    try {
      const data = await fs.promises.readFile(fullPath, 'utf8');
      mergedContent += data;
    } catch {
      throw new Error('FS operation failed');
    }
  }

  // Пишем результат в workspace/merged.txt
  const outputPath = path.join(workspace, 'merged.txt');

  try {
    await fs.promises.writeFile(outputPath, mergedContent, 'utf8');
  } catch {
    throw new Error('FS operation failed');
  }


  
};

await merge();
