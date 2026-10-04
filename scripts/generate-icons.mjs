/**
 * Generates the placeholder app icons: a red square with a white "IE" monogram.
 * Run with `npm run icons`. The monogram is drawn with shapes, not text, so the result does
 * not depend on any installed font. Replace these files with real artwork before launch.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RED = '#C8102E';
const WHITE = '#FFFFFF';

/**
 * "IE" on a 512 grid. `scale` shrinks the monogram toward the centre for maskable icons,
 * which need their content inside the central 80% safe zone.
 */
function monogram(scale) {
  const unit = 512;
  const w = 330 * scale; // total width of the two letters
  const h = 250 * scale; // height
  const stroke = 56 * scale;
  const gap = 46 * scale;
  const x0 = (unit - w) / 2;
  const y0 = (unit - h) / 2;
  const iW = stroke * 1.0;
  const eX = x0 + iW + gap;
  const eW = w - iW - gap;
  const bar = (x, y, bw, bh) =>
    `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="${stroke * 0.12}" fill="${WHITE}"/>`;
  return [
    // I
    bar(x0, y0, iW, h),
    // E: spine and three arms
    bar(eX, y0, stroke, h),
    bar(eX, y0, eW, stroke),
    bar(eX, y0 + (h - stroke) / 2, eW * 0.82, stroke),
    bar(eX, y0 + h - stroke, eW, stroke),
  ].join('');
}

function svg({ radius, scale }) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
      `<rect width="512" height="512" rx="${radius}" fill="${RED}"/>${monogram(scale)}</svg>`,
  );
}

const outputs = [
  // Standard icons: rounded square.
  { file: 'public/icons/icon-192.png', size: 192, radius: 112, scale: 1 },
  { file: 'public/icons/icon-512.png', size: 512, radius: 112, scale: 1 },
  // Maskable: full bleed (the OS applies its own mask) with the monogram kept in the safe zone.
  { file: 'public/icons/maskable-512.png', size: 512, radius: 0, scale: 0.78 },
  // Apple touch icon: full bleed, no transparency (iOS rounds the corners itself).
  { file: 'app/apple-icon.png', size: 180, radius: 0, scale: 0.9 },
  // Browser tab icon.
  { file: 'app/icon.png', size: 512, radius: 112, scale: 1 },
];

for (const { file, size, radius, scale } of outputs) {
  const path = resolve(root, file);
  mkdirSync(dirname(path), { recursive: true });
  await sharp(svg({ radius, scale })).resize(size, size).png().toFile(path);
  console.log('wrote', file);
}
