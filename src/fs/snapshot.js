import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const snapshot = async () => {

  const parentDir = path.resolve(__dirname, '..');

    const entries = [];
    


    function search(dir) {
        const candidate = path.join(dir, 'workspace');

        if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
            return fs.realpathSync(candidate);
        }

        if (path.basename(dir) === 'node-nodejs-fundamentals' ) {
            throw new Error('FS operation failed');
        }

        const parent = path.dirname(dir);

        if (parent === dir) {
            throw new Error('FS operation failed');
        }

        return search(parent);
    }

    const workspacePath = search(__dirname);

    if(workspacePath) {

    }

    async function walk(currentPath) {
        const items = await fs.promises.readdir(currentPath, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(currentPath, item.name);
            const relPath = path.relative(workspacePath, fullPath).replace(/\\/g, '/');

            if (item.isDirectory()) {
                entries.push({
                    path: relPath,
                    type: 'directory'
                });

                await walk(fullPath);
            } else if (item.isFile()) {
                const stat = await fs.promises.stat(fullPath);
                const buffer = await fs.promises.readFile(fullPath);

                entries.push({
                    path: relPath,
                    type: 'file',
                    size: stat.size,
                    content: buffer.toString('base64')
                });
            }
        }
    }

    await walk(workspacePath);

    const snapshotObject = {
        rootPath: workspacePath,
        entries
    };

const snapshotFilePath = path.join(path.dirname(workspacePath), 'snapshot.json');

  await fs.promises.writeFile(
    snapshotFilePath,
    JSON.stringify(snapshotObject, null, 2),
    'utf8'
  );

};

await snapshot();
