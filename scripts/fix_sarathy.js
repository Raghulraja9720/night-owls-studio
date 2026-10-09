import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function fixSarathy() {
  const publicDir = './public/assets/images';
  const assetsDir = './assets/images';
  const sourcePath = path.join(publicDir, 'sarathy.jpg');
  
  if (!fs.existsSync(sourcePath)) {
    console.error('Source sarathy.jpg not found');
    return;
  }
  
  // We want to bring him down and give space on top.
  // The original is 768x1104. 
  // Let's create a 768x768 square.
  // If we just extract top:0, we get the topmost part of the image.
  // Let's scale him down slightly within the 768x768 box to give even more space.
  
  const finalBuffer = await sharp(sourcePath)
    .extend({ top: 100, background: { r: 255, g: 255, b: 255 } })
    .extract({ left: 0, top: 0, width: 768, height: 768 })
    .jpeg({ quality: 90 })
    .toBuffer();

  const targetDirs = [publicDir, assetsDir];
  
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    fs.writeFileSync(path.join(dir, 'sarathy-v2.jpg'), finalBuffer);
    console.log(`Saved sarathy-v2.jpg to ${dir}`);
  }
  
  // Now trigger the responsive generation script to update the webp variants
  console.log('Done creating base image. Please run the generate_responsive_images.js script.');
}

fixSarathy().catch(console.error);
