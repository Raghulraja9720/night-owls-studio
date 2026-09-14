import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIRS = [
  './public/assets',
  './assets'
];

async function generateAssets() {
  console.log('=== Generating High-Performance Responsive WebP Images ===\n');

  for (const baseDir of TARGET_DIRS) {
    if (!fs.existsSync(baseDir)) continue;
    console.log(`Processing directory: ${baseDir}`);

    const logoDir = path.join(baseDir, 'logo');
    const imagesDir = path.join(baseDir, 'images');

    // 1. Logo & Emblem variants
    const logoSource = path.join(logoDir, 'night owls logo.png');
    if (fs.existsSync(logoSource)) {
      console.log('  Generating Logo variants...');
      const logoBuffer = fs.readFileSync(logoSource);

      const logoConfigs = [
        { name: 'night-owls-logo-40.webp', width: 40, height: 40, quality: 90 },
        { name: 'night-owls-logo-80.webp', width: 80, height: 80, quality: 90 },
        { name: 'night-owls-logo-112.webp', width: 112, height: 112, quality: 90 },
        { name: 'night-owls-logo-224.webp', width: 224, height: 224, quality: 90 },
        { name: 'night-owls-logo-336.webp', width: 336, height: 336, quality: 90 },
        { name: 'night-owls-logo.webp', width: 600, height: 600, quality: 90 }
      ];

      for (const cfg of logoConfigs) {
        const dest = path.join(logoDir, cfg.name);
        await sharp(logoBuffer)
          .resize(cfg.width, cfg.height)
          .webp({ quality: cfg.quality, effort: 6 })
          .toFile(dest);
        const s = fs.statSync(dest).size;
        console.log(`    ✓ ${cfg.name.padEnd(28)}: ${(s / 1024).toFixed(1).padStart(6)} KB`);
      }
    }

    // 2. Portfolio Showcase variants
    const showcaseSource = path.join(imagesDir, 'sai-indirabala.png');
    if (fs.existsSync(showcaseSource)) {
      console.log('  Generating Portfolio Showcase variants...');
      const showcaseBuffer = fs.readFileSync(showcaseSource);

      const showcaseConfigs = [
        { name: 'sai-indirabala-480.webp', width: 480, quality: 86 },
        { name: 'sai-indirabala-768.webp', width: 768, quality: 86 },
        { name: 'sai-indirabala-1024.webp', width: 1024, quality: 86 },
        { name: 'sai-indirabala-1536.webp', width: 1536, quality: 86 }
      ];

      for (const cfg of showcaseConfigs) {
        const dest = path.join(imagesDir, cfg.name);
        await sharp(showcaseBuffer)
          .resize({ width: cfg.width })
          .webp({ quality: cfg.quality, effort: 6 })
          .toFile(dest);
        const s = fs.statSync(dest).size;
        console.log(`    ✓ ${cfg.name.padEnd(28)}: ${(s / 1024).toFixed(1).padStart(6)} KB`);
      }
    }

    // 3. Team Member Avatars
    const teamMembers = [
      'sivamanikandan.jpg',
      'rithanya.jpg',
      'raghulraja.jpg',
      'shivaranjani.jpg',
      'sarathy-v2.jpg'
    ];

    console.log('  Generating Team Avatar variants...');
    for (const member of teamMembers) {
      const memberSource = path.join(imagesDir, member);
      if (!fs.existsSync(memberSource)) continue;
      const memberBuffer = fs.readFileSync(memberSource);
      const baseName = member.replace(/\.(jpg|jpeg|png)$/, '');

      const avatarConfigs = [
        { name: `${baseName}-140.webp`, width: 140, quality: 86 },
        { name: `${baseName}-264.webp`, width: 264, quality: 86 },
        { name: `${baseName}.webp`, width: null, quality: 86 }
      ];

      for (const cfg of avatarConfigs) {
        const dest = path.join(imagesDir, cfg.name);
        let pipeline = sharp(memberBuffer);
        if (cfg.width) {
          pipeline = pipeline.resize({ width: cfg.width });
        }
        await pipeline
          .webp({ quality: cfg.quality, effort: 6 })
          .toFile(dest);
        const s = fs.statSync(dest).size;
        console.log(`    ✓ ${cfg.name.padEnd(28)}: ${(s / 1024).toFixed(1).padStart(6)} KB`);
      }
    }

    console.log('');
  }

  console.log('=== All Responsive Images Successfully Generated ===\n');
}

generateAssets().catch(console.error);
