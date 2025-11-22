#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create WebP versions of key images
const conversions = [
  { input: 'images/logo_horizontal_official.png', quality: 90 },
  { input: 'public/images/logo_horizontal_official.png', quality: 90 },
  { input: 'images/logo_primary.png', quality: 90 },
  { input: 'public/images/logo_primary.png', quality: 90 },
  { input: 'images/flmagnumart1sm.jpg', quality: 85 },
  { input: 'public/images/flmagnumart1sm.jpg', quality: 85 },
  { input: 'public/brand/logo-horizontal.png', quality: 90 },
  { input: 'images/underground-directional-drill.jpg', quality: 85 },
  { input: 'public/images/underground-directional-drill.jpg', quality: 85 },
  { input: 'images/pipe-rehabilitation-charlotte-nc.jpg', quality: 85 },
  { input: 'public/images/pipe-rehabilitation-charlotte-nc.jpg', quality: 85 }
];

async function createWebP(config) {
  const inputPath = path.resolve(config.input);
  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/, '.webp');

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.input} - file not found`);
    return null;
  }

  try {
    const inputStats = fs.statSync(inputPath);
    const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

    await sharp(inputPath)
      .webp({ quality: config.quality, effort: 6 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✅ ${config.input} → ${path.basename(outputPath)}`);
    console.log(`   ${inputSizeMB}MB → ${outputSizeMB}MB (${savings}% smaller)`);

    return { input: config.input, output: outputPath, savings };
  } catch (error) {
    console.error(`❌ Error creating WebP for ${config.input}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Creating WebP versions of images...\n');

  const results = [];

  for (const config of conversions) {
    const result = await createWebP(config);
    if (result) {
      results.push(result);
    }
  }

  console.log(`\n✅ Created ${results.length} WebP versions`);
  console.log('\n📝 Next: Update HTML to use <picture> tags with WebP fallbacks');
}

main().catch(console.error);
