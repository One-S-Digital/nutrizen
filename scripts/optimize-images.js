const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Images to optimize (critical path first)
const imagesToOptimize = [
  'immunity-power-pack-hero.png',
  'metabol-hero.png',
  'vitacore.png',
  'zinc.png',
  'cellunex.png',
  'adaptogen.png',
  'glutathione.png',
  'magnesium.png',
  'iron.png',
  'metabol.png',
  'para.png',
  'vitamin.png',
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  for (const filename of imagesToOptimize) {
    const inputPath = path.join(publicDir, filename);
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${filename} (not found)`);
      continue;
    }

    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;

    try {
      // Get original size
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;

      // Optimize PNG to temp file, then replace
      const pngTempOutput = path.join(publicDir, `${name}-opt.png`);
      await sharp(inputPath)
        .png({ quality: 80, progressive: true })
        .toFile(pngTempOutput);

      fs.renameSync(pngTempOutput, inputPath);

      // Convert to WebP
      const webpOutput = path.join(publicDir, `${name}.webp`);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(webpOutput);

      const pngStats = fs.statSync(inputPath);
      const webpStats = fs.statSync(webpOutput);

      const pngReduction = ((1 - pngStats.size / originalSize) * 100).toFixed(1);
      const webpReduction = ((1 - webpStats.size / originalSize) * 100).toFixed(1);

      console.log(`✅ ${filename}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(0)}KB`);
      console.log(`   PNG: ${(pngStats.size / 1024).toFixed(0)}KB (-${pngReduction}%)`);
      console.log(`   WebP: ${(webpStats.size / 1024).toFixed(0)}KB (-${webpReduction}%) 🚀`);
      console.log();
    } catch (err) {
      console.error(`❌ Error processing ${filename}:`, err.message);
    }
  }

  console.log('✨ Image optimization complete!');
}

optimizeImages().catch(console.error);
