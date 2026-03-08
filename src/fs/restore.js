import fs from 'fs';

import path from 'path';

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored

  const snapshotPath = path.join(process.cwd(), 'snapshot.json');
  
  // 1. Проверяем, что snapshot.json существует
  if (!fs.existsSync(snapshotPath)) {
    throw new Error('FS operation failed');
  }
  
  // 2. Читаем snapshot.json
  let snapshot;
  try {
    const data = await fs.promises.readFile(snapshotPath, 'utf8');
    snapshot = JSON.parse(data);
  } catch {
    throw new Error('FS operation failed');
  }
  
  const { entries } = snapshot;
  
  // 3. Папка назначения
  const restoredRoot = path.join(process.cwd(), 'workspace_restored');
  
  // 4. Проверяем, что workspace_restored НЕ существует
  if (fs.existsSync(restoredRoot)) {
    console.log('asd')
    throw new Error('FS operation failed');
  }

  // 5. Создаём workspace_restored
  await fs.promises.mkdir(restoredRoot);

  // 6. Восстанавливаем структуру
  for (const entry of entries) {
    const targetPath = path.join(restoredRoot, entry.path);

    if (entry.type === 'directory') {
      await fs.promises.mkdir(targetPath, { recursive: true });
    } else if (entry.type === 'file') {
      // Создаём директорию, если её нет
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });

      // Декодируем base64
      const buffer = Buffer.from(entry.content, 'base64');

      // Записываем файл
      await fs.promises.writeFile(targetPath, buffer);
    }
  }

  console.log('Workspace restored successfully');


};

await restore();
