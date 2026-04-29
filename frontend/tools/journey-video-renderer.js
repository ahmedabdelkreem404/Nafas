const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 30;
const DURATION = 9;

const STAGE_TIMINGS = {
  closedStart: [0, 1.2],
  rotateOne: [1.2, 3],
  capOpen: [3, 4.1],
  spray: [4.1, 5.1],
  rotateTwo: [5.1, 7.4],
  closeEnd: [7.4, 9],
};

const statusLabel = document.getElementById('status-label');
const statusDetail = document.getElementById('status-detail');
const canvas = document.getElementById('journey-canvas');
const ctx = canvas.getContext('2d', { alpha: false });

canvas.width = WIDTH;
canvas.height = HEIGHT;

const assetPaths = {
  closed: '/public/assets/stock/originals/ahimsa-artistic-bottle.jpg',
  open: '/public/assets/stock/originals/ahimsa-brown-frosted.jpg',
  spray: '/public/assets/stock/originals/hani-spray-moment.jpg',
};

const sourceCrops = {
  closedBottle: { x: 1480, y: 230, w: 1180, h: 2210 },
  closedCap: { x: 1590, y: 220, w: 900, h: 560 },
  openBottle: { x: 980, y: 210, w: 1460, h: 1980 },
  sprayPlume: { x: 60, y: 120, w: 3050, h: 2350 },
};

const bottleLayout = {
  x: 230,
  y: 106,
  w: 330,
  h: 530,
  bodyX: 258,
  bodyY: 230,
  bodyW: 250,
  bodyH: 360,
  neckX: 355,
  neckY: 190,
  neckW: 58,
  neckH: 52,
  nozzleX: 349,
  nozzleY: 152,
  nozzleW: 72,
  nozzleH: 48,
  capX: 311,
  capY: 112,
  capW: 144,
  capH: 106,
};

const images = {};
let assetsLoaded = false;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, progress) => start + ((end - start) * progress);
const rangeProgress = (time, start, end) => clamp((time - start) / (end - start), 0, 1);
const smooth = (value) => value * value * (3 - (2 * value));
const easeOut = (value) => 1 - ((1 - value) ** 3);

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error(`Failed to load ${src}`));
  image.src = src;
});

const roundedRectPath = (context, x, y, width, height, radius) => {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
};

const buildClosedBottlePath = (context, layout) => {
  context.beginPath();
  roundedRectPath(context, layout.bodyX, layout.bodyY, layout.bodyW, layout.bodyH, 26);
  context.moveTo(layout.neckX, layout.neckY + 12);
  roundedRectPath(context, layout.neckX, layout.neckY, layout.neckW, layout.neckH, 14);
  context.moveTo(layout.capX, layout.capY + 18);
  roundedRectPath(context, layout.capX, layout.capY, layout.capW, layout.capH, 24);
};

const buildOpenBottlePath = (context, layout) => {
  context.beginPath();
  roundedRectPath(context, layout.bodyX, layout.bodyY, layout.bodyW, layout.bodyH, 26);
  context.moveTo(layout.neckX, layout.neckY + 12);
  roundedRectPath(context, layout.neckX, layout.neckY, layout.neckW, layout.neckH, 14);
  context.moveTo(layout.nozzleX, layout.nozzleY + 12);
  roundedRectPath(context, layout.nozzleX, layout.nozzleY, layout.nozzleW, layout.nozzleH, 16);
};

const drawBackground = (time) => {
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#080608');
  gradient.addColorStop(0.38, '#151014');
  gradient.addColorStop(1, '#08070b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = 'blur(80px)';

  const glowDrift = Math.sin((time / DURATION) * Math.PI * 2) * 10;

  const leftGlow = ctx.createRadialGradient(360, 220, 10, 360, 220, 250);
  leftGlow.addColorStop(0, 'rgba(236,178,102,0.55)');
  leftGlow.addColorStop(0.32, 'rgba(198,133,72,0.34)');
  leftGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = leftGlow;
  ctx.fillRect(40, 30, 620, 520);

  const rightGlow = ctx.createRadialGradient(980 + glowDrift, 230, 10, 980 + glowDrift, 230, 270);
  rightGlow.addColorStop(0, 'rgba(140,110,180,0.22)');
  rightGlow.addColorStop(0.36, 'rgba(92,72,130,0.16)');
  rightGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = rightGlow;
  ctx.fillRect(700, 10, 500, 480);

  const floorMist = ctx.createRadialGradient(470, 640, 10, 470, 640, 260);
  floorMist.addColorStop(0, 'rgba(229,184,118,0.16)');
  floorMist.addColorStop(0.45, 'rgba(90,60,44,0.12)');
  floorMist.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = floorMist;
  ctx.fillRect(120, 470, 700, 240);

  ctx.restore();

  ctx.save();
  ctx.filter = 'blur(14px)';
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(410, 640, 150, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const withBottleTransform = (layout, rotationProgress, callback) => {
  const rotationAngle = rotationProgress * Math.PI * 2;
  const widthScale = 0.12 + (0.88 * Math.abs(Math.cos(rotationAngle)));
  const skew = Math.sin(rotationAngle) * 0.16;
  const centerX = layout.bodyX + (layout.bodyW / 2);
  const centerY = layout.bodyY + 180;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.transform(widthScale, 0, skew, 1, 0, 0);
  ctx.translate(-centerX, -centerY);
  callback(widthScale, rotationAngle);
  ctx.restore();
};

const drawMaskedPhoto = (image, crop, destination, buildPath) => {
  ctx.save();
  buildPath(ctx, destination);
  ctx.clip();
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.w,
    crop.h,
    destination.x,
    destination.y,
    destination.w,
    destination.h,
  );
  ctx.restore();
};

const overlayGlassHighlights = (layout, rotationAngle, alpha = 1) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = 'blur(8px)';

  const highlightX = layout.bodyX + 28 + ((Math.sin(rotationAngle) * 0.5 + 0.5) * (layout.bodyW - 56));
  const bodyHighlight = ctx.createLinearGradient(highlightX - 30, layout.bodyY, highlightX + 30, layout.bodyY + layout.bodyH);
  bodyHighlight.addColorStop(0, 'rgba(255,255,255,0)');
  bodyHighlight.addColorStop(0.5, 'rgba(255,255,255,0.52)');
  bodyHighlight.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = bodyHighlight;
  ctx.fillRect(layout.bodyX, layout.bodyY + 8, layout.bodyW, layout.bodyH - 16);

  const rimGradient = ctx.createLinearGradient(layout.bodyX, layout.bodyY, layout.bodyX + layout.bodyW, layout.bodyY);
  rimGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
  rimGradient.addColorStop(0.18, 'rgba(255,255,255,0.05)');
  rimGradient.addColorStop(0.82, 'rgba(255,255,255,0.08)');
  rimGradient.addColorStop(1, 'rgba(255,255,255,0.24)');

  ctx.strokeStyle = rimGradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  roundedRectPath(ctx, layout.bodyX + 1, layout.bodyY + 1, layout.bodyW - 2, layout.bodyH - 2, 24);
  ctx.stroke();
  ctx.restore();
};

const drawCapFromPhoto = (capOffsetY, alpha = 1) => {
  const capLayout = {
    x: bottleLayout.capX,
    y: bottleLayout.capY + capOffsetY,
    w: bottleLayout.capW,
    h: bottleLayout.capH,
  };

  drawMaskedPhoto(
    images.closed,
    sourceCrops.closedCap,
    capLayout,
    (context, box) => {
      context.beginPath();
      roundedRectPath(context, box.x, box.y, box.w, box.h, 24);
    },
  );

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  const capGlow = ctx.createLinearGradient(capLayout.x, capLayout.y, capLayout.x, capLayout.y + capLayout.h);
  capGlow.addColorStop(0, 'rgba(255,255,255,0.2)');
  capGlow.addColorStop(1, 'rgba(255,255,255,0.04)');
  ctx.fillStyle = capGlow;
  ctx.beginPath();
  roundedRectPath(ctx, capLayout.x + 1, capLayout.y + 1, capLayout.w - 2, capLayout.h - 2, 23);
  ctx.fill();
  ctx.restore();
};

const drawClosedBottle = (rotationProgress, alpha = 1) => {
  withBottleTransform(bottleLayout, rotationProgress, (_widthScale, rotationAngle) => {
    ctx.save();
    ctx.globalAlpha = alpha;

    drawMaskedPhoto(
      images.closed,
      sourceCrops.closedBottle,
      bottleLayout,
      buildClosedBottlePath,
    );

    ctx.globalAlpha = alpha * 0.6;
    overlayGlassHighlights(bottleLayout, rotationAngle, 0.9);
    ctx.restore();
  });
};

const drawOpenBottle = (rotationProgress, capLift, alpha = 1) => {
  withBottleTransform(bottleLayout, rotationProgress, (_widthScale, rotationAngle) => {
    ctx.save();
    ctx.globalAlpha = alpha;

    drawMaskedPhoto(
      images.open,
      sourceCrops.openBottle,
      {
        x: bottleLayout.x - 8,
        y: bottleLayout.y + 18,
        w: bottleLayout.w + 8,
        h: bottleLayout.h - 30,
      },
      buildOpenBottlePath,
    );

    overlayGlassHighlights(bottleLayout, rotationAngle, 0.72);
    drawCapFromPhoto(-capLift, alpha);
    ctx.restore();
  });
};

const drawSpray = (progress) => {
  if (progress <= 0 || progress >= 1) {
    return;
  }

  const plumeAlpha = Math.sin(Math.PI * progress) * 0.74;
  const curveProgress = easeOut(progress);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = plumeAlpha;
  ctx.filter = 'blur(18px)';
  const lineGradient = ctx.createLinearGradient(430, 176, 730, 184);
  lineGradient.addColorStop(0, 'rgba(255,245,228,0)');
  lineGradient.addColorStop(0.18, 'rgba(255,245,228,0.45)');
  lineGradient.addColorStop(1, 'rgba(255,245,228,0)');
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(414, 176);
  ctx.quadraticCurveTo(516, 162, 762, 190);
  ctx.stroke();

  for (let index = 0; index < 7; index += 1) {
    const seed = index / 6;
    const puffX = 446 + (seed * 304) + (curveProgress * 24);
    const puffY = 176 + (Math.sin(seed * Math.PI * 2.3) * 18) - (curveProgress * 14);
    const radius = 28 + (seed * 22) + (curveProgress * 18);
    const puffGradient = ctx.createRadialGradient(puffX, puffY, 2, puffX, puffY, radius);
    puffGradient.addColorStop(0, 'rgba(255,248,240,0.42)');
    puffGradient.addColorStop(0.52, 'rgba(238,232,226,0.16)');
    puffGradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = puffGradient;
    ctx.beginPath();
    ctx.arc(puffX, puffY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  ctx.save();
  ctx.globalAlpha = plumeAlpha * 0.75;
  for (let index = 0; index < 40; index += 1) {
    const seed = index / 39;
    const particleX = 428 + (seed * 320) + (progress * 38);
    const particleY = 176 + (Math.sin(seed * Math.PI * 3) * 26) - (progress * 18);
    const radius = 0.8 + ((1 - seed) * 2.4);
    ctx.fillStyle = `rgba(255, 243, 228, ${0.15 + ((1 - seed) * 0.34)})`;
    ctx.beginPath();
    ctx.arc(particleX, particleY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

const drawFrame = (time) => {
  const safeTime = clamp(time, 0, DURATION);
  const rotateOne = smooth(rangeProgress(safeTime, ...STAGE_TIMINGS.rotateOne));
  const openProgress = smooth(rangeProgress(safeTime, ...STAGE_TIMINGS.capOpen));
  const sprayProgress = rangeProgress(safeTime, ...STAGE_TIMINGS.spray);
  const rotateTwo = smooth(rangeProgress(safeTime, ...STAGE_TIMINGS.rotateTwo));
  const closeProgress = smooth(rangeProgress(safeTime, ...STAGE_TIMINGS.closeEnd));

  const openBlend = clamp(openProgress - closeProgress, 0, 1);
  const capLift = lerp(0, 82, openBlend);
  const bottleDrift = Math.sin((safeTime / DURATION) * Math.PI * 4) * 3;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground(safeTime);

  ctx.save();
  ctx.translate(0, bottleDrift);

  const closedRotation = rotateOne;
  const openRotation = rotateTwo;

  if (openBlend < 1) {
    drawClosedBottle(closedRotation, 1 - openBlend);
  }

  if (openBlend > 0) {
    drawOpenBottle(openRotation, capLift, openBlend);
  }

  if (sprayProgress > 0 && sprayProgress < 1) {
    drawSpray(sprayProgress);
  }

  ctx.restore();
};

const setStatus = (label, detail) => {
  statusLabel.textContent = label;
  statusDetail.textContent = detail;
};

const ensureAssetsLoaded = async () => {
  if (assetsLoaded) {
    return;
  }

  setStatus('Loading photo sources...', '—');
  images.closed = await loadImage(assetPaths.closed);
  images.open = await loadImage(assetPaths.open);
  images.spray = await loadImage(assetPaths.spray);
  assetsLoaded = true;
};

window.__journeyStageTimings = STAGE_TIMINGS;
window.__journeyVideoDuration = DURATION;
window.__ensureJourneyAssets = ensureAssetsLoaded;
window.__drawJourneyFrame = async (time) => {
  await ensureAssetsLoaded();
  const progress = clamp(time / DURATION, 0, 1);
  setStatus('Rendering frame...', `${Math.round(progress * 100)}%`);
  drawFrame(time);
};
window.__captureJourneyFrame = async (time, type = 'image/png', quality = 0.94) => {
  await window.__drawJourneyFrame(time);
  return canvas.toDataURL(type, quality);
};

window.__journeyRendererReady = true;
