import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const eslintBin = join(root, 'node_modules', 'eslint', 'bin', 'eslint.js');
const includeRoots = ['src', 'tests'];
const rootFiles = ['playwright.config.ts', 'vite.config.ts', 'vitest.config.ts'];
const ignored = new Set([
  'src/components/BottleAssemblyScroll.tsx',
  'src/components/Hero3DScene.tsx',
  'src/components/PerfumeBottle3D.tsx',
  'src/components/Product3DViewer.tsx',
]);
const chunkSize = 1;

function normalize(path) {
  return path.replaceAll('\\', '/');
}

function collectFiles(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      collectFiles(absolute, files);
      continue;
    }

    if (!/\.(ts|tsx)$/.test(entry)) {
      continue;
    }

    const path = normalize(relative(root, absolute));
    if (!ignored.has(path)) {
      files.push(path);
    }
  }

  return files;
}

const files = [
  ...rootFiles,
  ...includeRoots.flatMap((directory) => collectFiles(join(root, directory))),
].filter((path) => !ignored.has(normalize(path)));

for (let index = 0; index < files.length; index += chunkSize) {
  const chunk = files.slice(index, index + chunkSize);
  const result = spawnSync(process.execPath, [eslintBin, '--no-warn-ignored', ...chunk], {
    cwd: root,
    shell: false,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
