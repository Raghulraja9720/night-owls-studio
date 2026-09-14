import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const inputPath = 'c:/Users/Prithvi raj/.gemini/antigravity-ide/brain/e46078f0-be32-4f74-aa11-0fa207557acd/siva_white_bg_1789388074309.jpg';
const outDir = 'c:/Users/Prithvi raj/.gemini/antigravity-ide/brain/e46078f0-be32-4f74-aa11-0fa207557acd';

const targetDirs = [
  './public/assets/images',
  './assets/images'
];

async function generate() {
  console.log('Generating perfected Sivamanikandan avatar images with pure white background...');

  // Extract square 770x770: left=155, top=80 (Centers face on pure white background, matching team proportions)
  const masterBuffer = await sharp(inputPath)
    .extract({ left: 155, top: 80, width: 770, height: 770 })
    .resize(640, 640)
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

    fs.writeFileSync(path.join(dir, 'sivamanikandan.jpg'), jpgBuffer);
    fs.writeFileSync(path.join(dir, 'sivamanikandan.webp'), webpBuffer);
    fs.writeFileSync(path.join(dir, 'sivamanikandan-264.webp'), webp264Buffer);
    fs.writeFileSync(path.join(dir, 'sivamanikandan-140.webp'), webp140Buffer);

    console.log(`Updated images in ${dir}:`);
    console.log(`  - sivamanikandan.jpg (${(jpgBuffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - sivamanikandan.webp (${(webpBuffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - sivamanikandan-264.webp (${(webp264Buffer.length / 1024).toFixed(1)} KB)`);
    console.log(`  - sivamanikandan-140.webp (${(webp140Buffer.length / 1024).toFixed(1)} KB)`);
  }

  // Create circular avatar with gold ring and Crown badge
  const size = 264;
  const radius = size / 2;
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${radius}" cy="${radius}" r="${radius - 6}" fill="#fff"/></svg>`
  );

  const rounded = await sharp(masterBuffer)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const frameSvg = Buffer.from(`
    <svg width="${size}" height="${size}">
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="50%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <circle cx="${radius}" cy="${radius}" r="${radius - 2}" fill="none" stroke="url(#gold)" stroke-width="4"/>
      <circle cx="${radius}" cy="${radius}" r="${radius - 5}" fill="none" stroke="#ffffff" stroke-width="4"/>
    </svg>
  `);

  const previewFrame = await sharp(rounded)
    .composite([{ input: frameSvg }])
    .png()
    .toBuffer();

  // Crown badge icon
  const badgeSvg = Buffer.from(`
    <svg width="68" height="68">
      <defs>
        <linearGradient id="badgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <circle cx="34" cy="34" r="32" fill="url(#badgeGold)" stroke="#ffffff" stroke-width="5"/>
      <path d="M22 42 L25 28 L30 35 L34 26 L38 35 L43 28 L46 42 Z" fill="#ffffff"/>
    </svg>
  `);

  const previewWithBadge = await sharp(previewFrame)
    .composite([{ input: badgeSvg, left: size - 68, top: size - 68 }])
    .png()
    .toBuffer();

  await sharp(previewWithBadge).toFile(path.join(outDir, 'siva_centered_avatar_white.png'));

  // Also create side-by-side comparison of all 5 team members
  const publicDir = './public/assets/images';
  async function makeAvatar(imgPath) {
    const s = 200;
    const r = s / 2;
    const mask = Buffer.from(
      `<svg width="${s}" height="${s}"><circle cx="${r}" cy="${r}" r="${r - 6}" fill="#fff"/></svg>`
    );
    const round = await sharp(imgPath)
      .resize(s, s, { fit: 'cover' })
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toBuffer();
    const frame = Buffer.from(`
      <svg width="${s}" height="${s}">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="50%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <circle cx="${r}" cy="${r}" r="${r - 2}" fill="none" stroke="url(#g)" stroke-width="4"/>
        <circle cx="${r}" cy="${r}" r="${r - 5}" fill="none" stroke="#ffffff" stroke-width="3"/>
      </svg>
    `);
    return sharp(round).composite([{ input: frame }]).png().toBuffer();
  }

  const teamList = [
    { name: 'Sivamanikandan (White BG)', img: path.join(publicDir, 'sivamanikandan.jpg') },
    { name: 'Rithanya', img: path.join(publicDir, 'rithanya.jpg') },
    { name: 'Raghul Raja', img: path.join(publicDir, 'raghulraja.jpg') },
    { name: 'Shivaranjani', img: path.join(publicDir, 'shivaranjani.jpg') },
    { name: 'Sarathy', img: path.join(publicDir, 'sarathy-v2.jpg') },
  ];

  const teamBufs = await Promise.all(teamList.map(m => makeAvatar(m.img)));
  const cardW = 220;
  const totalW = cardW * 5;
  const totalH = 260;

  const comps = teamBufs.map((buf, i) => ({ input: buf, left: i * cardW + 10, top: 30 }));
  const textSvg = Buffer.from(`
    <svg width="${totalW}" height="${totalH}">
      <rect width="100%" height="100%" fill="#0f172a"/>
      ${teamList.map((m, i) => `
        <text x="${i * cardW + 110}" y="245" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#f1f5f9" text-anchor="middle">
          ${m.name}
        </text>
      `).join('')}
    </svg>
  `);

  await sharp(textSvg).composite(comps).toFile(path.join(outDir, 'team_all_with_white_siva.png'));

  console.log('Finished updating Sivamanikandan white bg images successfully!');
}

generate().catch(console.error);
