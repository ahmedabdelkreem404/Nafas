import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from '@playwright/test';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, '..');
const renderRoot = frontendRoot;
const outputDir = path.join(frontendRoot, 'public', 'assets', 'journey');
const tempDir = path.join(frontendRoot, 'tmp', 'journey-video-frames');

const FPS = 30;
const DURATION = 9;
const FRAME_COUNT = FPS * DURATION;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://127.0.0.1');
    let requestPath = decodeURIComponent(url.pathname);

    if (requestPath === '/') {
      requestPath = '/tools/journey-video-renderer.html';
    }

    const resolvedPath = path.resolve(renderRoot, `.${requestPath}`);
    if (!resolvedPath.startsWith(renderRoot)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const stat = await fs.stat(resolvedPath);
    if (!stat.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(resolvedPath).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

const runFfmpeg = (args) => new Promise((resolve, reject) => {
  const process = spawn(ffmpegPath, args, {
    cwd: frontendRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stderr = '';

  process.stdout.on('data', () => {});
  process.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  process.on('close', (code) => {
    if (code === 0) {
      resolve(undefined);
      return;
    }

    reject(new Error(stderr || `ffmpeg exited with code ${code}`));
  });
});

const dataUrlToBuffer = (dataUrl) => {
  const [, base64 = ''] = dataUrl.split(',');
  return Buffer.from(base64, 'base64');
};

const browser = await chromium.launch({
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});

try {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.rm(tempDir, { recursive: true, force: true });
  await fs.mkdir(tempDir, { recursive: true });

  const port = await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (typeof address === 'object' && address) {
        resolve(address.port);
      }
    });
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1,
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      console.error(message.text());
    }
  });

  await page.goto(`http://127.0.0.1:${port}/tools/journey-video-renderer.html`, {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForFunction(() => window.__journeyRendererReady === true, null, { timeout: 15000 });
  await page.evaluate(() => window.__ensureJourneyAssets());

  const posterDataUrl = await page.evaluate(() => window.__captureJourneyFrame(0.7, 'image/webp', 0.94));
  await fs.writeFile(path.join(outputDir, 'journey-poster.webp'), dataUrlToBuffer(posterDataUrl));

  for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
    const time = frame / FPS;
    const dataUrl = await page.evaluate((nextTime) => window.__captureJourneyFrame(nextTime, 'image/png', 1), time);
    const framePath = path.join(tempDir, `frame-${String(frame).padStart(4, '0')}.png`);
    await fs.writeFile(framePath, dataUrlToBuffer(dataUrl));

    if (frame % 30 === 0) {
      console.log(`Rendered frame ${frame + 1}/${FRAME_COUNT}`);
    }
  }

  await runFfmpeg([
    '-y',
    '-framerate',
    String(FPS),
    '-i',
    path.join(tempDir, 'frame-%04d.png'),
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '19',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    path.join(outputDir, 'journey-perfume-sequence.mp4'),
  ]);

  await runFfmpeg([
    '-y',
    '-framerate',
    String(FPS),
    '-i',
    path.join(tempDir, 'frame-%04d.png'),
    '-c:v',
    'libvpx-vp9',
    '-row-mt',
    '1',
    '-b:v',
    '0',
    '-crf',
    '32',
    '-pix_fmt',
    'yuv420p',
    path.join(outputDir, 'journey-perfume-sequence.webm'),
  ]);

  await fs.rm(tempDir, { recursive: true, force: true });
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
