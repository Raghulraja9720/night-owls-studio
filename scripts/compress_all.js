import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Target directories
const targetDirs = [
  './public/assets/images',
  './public/assets/logo',
  './assets/images',
  './assets/logo'
];

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const originalBuffer = fs.readFileSync(filePath);
  const originalSize = originalBuffer.length;

  let compressedBuffer;

  if (ext === '.jpg' || ext === '.jpeg') {
    // Mozjpeg with quality 84, progressive scan, optimized huffman tables
    compressedBuffer = await sharp(originalBuffer)
      .jpeg({
        quality: 84,
        mozjpeg: true,
        progressive: true,
        trellisQuantisation: true,
        overshootDeringing: true,
        optimizeScans: true
      })
      .toBuffer();
  } else if (ext === '.png') {
    // Lossless PNG optimization with maximum compression level and maximum effort
    compressedBuffer = await sharp(originalBuffer)
      .png({
        compressionLevel: 9,
        effort: 10,
        adaptiveFiltering: true
      })
      .toBuffer();
  } else {
    return { name: path.basename(filePath), originalSize, newSize: originalSize, saved: 0, pct: '0%' };
  }

  // Only replace if compressed is actually smaller
  if (compressedBuffer.length < originalSize) {
    fs.writeFileSync(filePath, compressedBuffer);
    const saved = originalSize - compressedBuffer.length;
    const pct = ((saved / originalSize) * 100).toFixed(1) + '%';
    return {
      name: path.basename(filePath),
      originalSize,
      newSize: compressedBuffer.length,
      saved,
      pct
    };
  } else {
    return {
      name: path.basename(filePath),
      originalSize,
      newSize: originalSize,
      saved: 0,
      pct: '0% (kept original)'
    };
  }
}

async function run() {
  console.log('=== Starting Image Compression ===\n');
  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    console.log(`Processing directory: ${dir}`);
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isFile() && /\.(png|jpe?g)$/i.test(file)) {
        const res = await processImage(fullPath);
        totalOriginal += res.originalSize;
        totalCompressed += res.newSize;
        console.log(
          `  ✓ ${res.name.padEnd(28)} | ${(res.originalSize / 1024).toFixed(1).padStart(7)} KB -> ${(res.newSize / 1024).toFixed(1).padStart(7)} KB | Saved: ${(res.saved / 1024).toFixed(1).padStart(7)} KB (${res.pct})`
        );
      }
    }
    console.log('');
  }

  const totalSaved = totalOriginal - totalCompressed;
  const overallPct = ((totalSaved / totalOriginal) * 100).toFixed(1);

  console.log('==================================================');
  console.log(`Total Original Size  : ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total Compressed Size: ${(totalCompressed / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total Space Saved    : ${(totalSaved / (1024 * 1024)).toFixed(2)} MB (${overallPct}% reduction)`);
  console.log('==================================================');
}

run().catch(console.error);
