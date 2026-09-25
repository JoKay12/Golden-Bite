/**
 * Turns the original food photos in design/photos/ into web-ready images in public/images/menu/
 * with one consistent Golden Bite look: same shape per use, warm grade, gentle contrast and a
 * soft dark vignette so every photo sits well on the black-and-gold design.
 *
 * Run after adding or changing a photo:   npm run photos
 * Then point the dish or food family at the new file in lib/menu.ts.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "design/photos";
const OUT = "public/images/menu";

/** Output shapes. `card` is used for dish cards and food-family banners. */
const SHAPES = {
  card: { width: 800, height: 600 }, // 4:3
  hero: { width: 720, height: 848 }, // matches the arched hero frame (≈0.85)
};

/**
 * out: file name in public/images/menu/
 * crop: optional [left, top, width, height] in source pixels, applied before fitting
 * focus: where to keep when trimming to the shape (sharp position or strategy)
 */
const PHOTOS = [
  { src: "jollof-rice-chicken-plantain.jpg", out: "jollof.jpg", shape: "card", focus: "centre" },
  { src: "jollof-turkey.jpg", out: "jollof-turkey.jpg", shape: "card", focus: "centre" },
  { src: "jollof-turkey.jpg", out: "hero.jpg", shape: "hero", focus: "centre" },
  { src: "jollof-goat.jpg", out: "jollof-goat.jpg", shape: "card", focus: "centre" },
  { src: "jollof-beef.jpg", out: "assorted-jollof.jpg", shape: "card", focus: "centre" },
  { src: "jollof-fried-fish.jpg", out: "jollof-redfish.jpg", shape: "card", focus: "centre" },
  { src: "fried-rice-skillet.jpg", out: "fried-rice.jpg", shape: "card", focus: "centre" },
  { src: "fried-rice-chicken.jpg", out: "fried-rice-chicken.jpg", shape: "card", focus: "centre" },
  {
    src: "assorted-fried-rice.jpg",
    out: "assorted-fried-rice.jpg",
    shape: "card",
    focus: "centre",
  },
  {
    src: "plain-rice-chicken-flyer-crop.jpg",
    out: "plain-rice.jpg",
    shape: "card",
    focus: "centre",
  },
  { src: "banku-tilapia.jpg", out: "banku-tilapia.jpg", shape: "card", focus: "centre" },
  { src: "banku-tilapia-small.webp", out: "banku.jpg", shape: "card", focus: "centre" },
  // Source has black letterbox bars top and bottom: crop them off first.
  {
    src: "vegetable-salad-eggs.jpg",
    out: "vegetable-salad.jpg",
    shape: "card",
    crop: [30, 56, 455, 262],
    focus: "centre",
  },
  { src: "chicken-salad-eggs.webp", out: "chicken-salad.jpg", shape: "card", focus: "centre" },
  {
    src: "food-basket.jpg",
    out: "food-basket.jpg",
    shape: "card",
    crop: [0, 262, 474, 356],
    focus: "centre",
  },
];

/** Soft radial vignette, darker at the corners. */
const vignette = (w, h, strength = 0.38) =>
  Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="v" cx="50%" cy="50%" r="72%">
      <stop offset="55%" stop-color="#0c0906" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0c0906" stop-opacity="${strength}"/>
    </radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>`);

async function processPhoto({ src, out, shape, crop, focus }) {
  const target = SHAPES[shape];
  let img = sharp(path.join(SRC, src)).rotate(); // respect phone orientation
  if (crop) img = img.extract({ left: crop[0], top: crop[1], width: crop[2], height: crop[3] });

  // Upscaling small photos only adds blur, so cap it at 1.6×; the output stays the same shape.
  const meta = await sharp(path.join(SRC, src)).metadata();
  const srcW = crop?.[2] ?? meta.width;
  const srcH = crop?.[3] ?? meta.height;
  const factor = Math.min(1, (srcW * 1.6) / target.width, (srcH * 1.6) / target.height);
  const width = Math.round(target.width * factor);
  const height = Math.round(target.height * factor);

  const buffer = await img
    .resize(width, height, { fit: "cover", position: focus, kernel: "lanczos3" })
    // Golden Bite grade: a touch warmer, richer and punchier.
    .modulate({ saturation: 1.08, brightness: 1.01 })
    .recomb([
      [1.04, 0.02, 0],
      [0.01, 1.0, 0],
      [0, 0, 0.94],
    ])
    .linear(1.07, -8)
    .composite([{ input: vignette(width, height) }])
    .sharpen({ sigma: 0.6 })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer();

  await sharp(buffer).toFile(path.join(OUT, out));
  return `${out.padEnd(26)} ${width}×${height}  ← ${src}`;
}

await mkdir(OUT, { recursive: true });
for (const photo of PHOTOS) console.log(await processPhoto(photo));
