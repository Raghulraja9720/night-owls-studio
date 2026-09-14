import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const inputPath = 'c:/Users/Prithvi raj/.gemini/antigravity-ide/brain/e46078f0-be32-4f74-aa11-0fa207557acd/.user_uploaded/media_1789384962229.jpg';

const targetDirs = [
  './public/assets/images',
  './assets/images'
];

async function generate() {
  console.log('Generating perfected Shivaranjani avatar images...');

  // Extract square 640x640: left=75, top=20
  const masterBuffer = await sharp(inputPath)
    .extract({ left: 75, top: 20, width: 640, height: 640 })
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

    fs.writeFileSync(path.join(dir, 'shivaranjani.jpg'), jpgBuffer);
    fs.writeFileSync(path.join(dir, 'shivaranjani.webp'), webpBuffer);
    fs.writeFileSync(path.join(dir, 'shivaranjani-264.webp'), webp264Buffer);
    fs.writeFileSync(path.join(dir, 'shivaranjani-140.webp'), webp140Buffer);

    console.log(`Updated images in ${dir}:`);
    console.log(`  - shivaranjani.jpg (${(jpgBuffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - shivaranjani.webp (${(webpBuffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - shivaranjani-264.webp (${(webp264Buffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - shivaranjani-140.webp (${(webp140Buffer.length / 1024).toFixed(1)} KB)`);
  }

  console.log('Finished updating Shivaranjani images successfully!');
}

generate().catch(console.error);
