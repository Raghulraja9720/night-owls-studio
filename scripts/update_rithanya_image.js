import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const inputPath = 'c:/Users/Prithvi raj/.gemini/antigravity-ide/brain/e46078f0-be32-4f74-aa11-0fa207557acd/.user_uploaded/media_1789384102357.jpg';

const targetDirs = [
  './public/assets/images',
  './assets/images'
];

async function generate() {
  console.log('Generating perfected Rithanya avatar images...');

  // Extend top by 50px using edge replication for natural headroom
  const extended = await sharp(inputPath)
    .extend({
      top: 50,
      bottom: 0,
      left: 0,
      right: 0,
      extendWith: 'copy'
    })
    .toBuffer();

  // Extract square 640x640 centered horizontally (64px from left, 0 from top)
  const masterBuffer = await sharp(extended)
    .extract({ left: 64, top: 0, width: 640, height: 640 })
    .toBuffer();

  // Create JPG master (640x640)
  const jpgBuffer = await sharp(masterBuffer)
    .jpeg({ quality: 92, progressive: true })
    .toBuffer();

  // Create WebP full (640x640)
  const webpBuffer = await sharp(masterBuffer)
    .webp({ quality: 90, effort: 6 })
    .toBuffer();

  // Create WebP 264x264
  const webp264Buffer = await sharp(masterBuffer)
    .resize(264, 264)
    .webp({ quality: 88, effort: 6 })
    .toBuffer();

  // Create WebP 140x140
  const webp140Buffer = await sharp(masterBuffer)
    .resize(140, 140)
    .webp({ quality: 88, effort: 6 })
    .toBuffer();

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, 'rithanya.jpg'), jpgBuffer);
    fs.writeFileSync(path.join(dir, 'rithanya.webp'), webpBuffer);
    fs.writeFileSync(path.join(dir, 'rithanya-264.webp'), webp264Buffer);
    fs.writeFileSync(path.join(dir, 'rithanya-140.webp'), webp140Buffer);

    console.log(`Updated images in ${dir}:`);
    console.log(`  - rithanya.jpg (${(jpgBuffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - rithanya.webp (${(webpBuffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - rithanya-264.webp (${(webp264Buffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - rithanya-140.webp (${(webp140Buffer.length / 1024).toFixed(1)} KB)`);
  }

  console.log('Finished updating Rithanya images successfully!');
}

generate().catch(console.error);
