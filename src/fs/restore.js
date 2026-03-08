import fs from 'fs';

import path from 'path';

const restore = async () => {

  const snapshotPath = path.join(process.cwd(), 'snapshot.json');
  
  if (!fs.existsSync(snapshotPath)) {
    throw new Error('FS operation failed');
  }
  
  let snapshot;
  try {
    const data = await fs.promises.readFile(snapshotPath, 'utf8');
    snapshot = JSON.parse(data);
  } catch {
    throw new Error('FS operation failed');
  }
  
  const { entries } = snapshot;
  
  const restoredRoot = path.join(process.cwd(), 'workspace_restored');
  
  if (fs.existsSync(restoredRoot)) {
    console.log('asd')
    throw new Error('FS operation failed');
  }

  await fs.promises.mkdir(restoredRoot);

  for (const entry of entries) {
    const targetPath = path.join(restoredRoot, entry.path);

    if (entry.type === 'directory') {
      await fs.promises.mkdir(targetPath, { recursive: true });
    } else if (entry.type === 'file') {
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });

      const buffer = Buffer.from(entry.content, 'base64');

      await fs.promises.writeFile(targetPath, buffer);
    }
  }

  console.log('Workspace restored successfully');


};

await restore();
