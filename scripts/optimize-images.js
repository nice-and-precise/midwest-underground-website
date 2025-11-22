#!/usr/bin/env node
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Image optimization configuration
const optimizations = [
  // Logo files - optimize to 400px width for 2x retina display
  {
    input: 'images/logo_horizontal_official.png',
    output: 'images/logo_horizontal_official_optimized.png',
    width: 800,
    quality: 85,
    format: 'png'
  },
  {
    input: 'public/images/logo_horizontal_official.png',
    output: 'public/images/logo_horizontal_official_optimized.png',
    width: 800,
    quality: 85,
    format: 'png'
  },
  {
    input: 'images/logo_icon_transparent.png',
    output: 'images/logo_icon_transparent_optimized.png',
    width: 256,
    quality: 85,
    format: 'png'
  },
  {
    input: 'public/images/logo_icon_transparent.png',
    output: 'public/images/logo_icon_transparent_optimized.png',
    width: 256,
    quality: 85,
    format: 'png'
  },
  {
    input: 'images/mu_icon.png',
    output: 'images/mu_icon_optimized.png',
    width: 256,
    quality: 85,
    format: 'png'
  },
  {
    input: 'public/images/mu_icon.png',
    output: 'public/images/mu_icon_optimized.png',
    width: 256,
    quality: 85,
    format: 'png'
  },
  {
    input: 'images/mu_icon_official.png',
    output: 'images/mu_icon_official_optimized.png',
    width: 256,
    quality: 85,
    format: 'png'
  },
  {
    input: 'public/images/mu_icon_official.png',
    output: 'public/images/mu_icon_official_optimized.png',
    width: 256,
    quality: 85,
    format: 'png'
  },
  {
    input: 'images/logo_horizontal_transparent.png',
    output: 'images/logo_horizontal_transparent_optimized.png',
    width: 800,
    quality: 85,
    format: 'png'
  },
  {
    input: 'public/images/logo_horizontal_transparent.png',
    output: 'public/images/logo_horizontal_transparent_optimized.png',
    width: 800,
    quality: 85,
    format: 'png'
  },
  {
    input: 'images/logo_primary.png',
    output: 'images/logo_primary_optimized.png',
    width: 800,
    quality: 85,
    format: 'png'
  },
  {
    input: 'public/images/logo_primary.png',
    output: 'public/images/logo_primary_optimized.png',
    width: 800,
    quality: 85,
    format: 'png'
  },
  // Service images
  {
    input: 'images/flmagnumart1sm.jpg',
    output: 'images/flmagnumart1sm_optimized.jpg',
    width: 1200,
    quality: 80,
    format: 'jpeg'
  },
  {
    input: 'public/images/flmagnumart1sm.jpg',
    output: 'public/images/flmagnumart1sm_optimized.jpg',
    width: 1200,
    quality: 80,
    format: 'jpeg'
  },
  // Brand logos
  {
    input: 'public/brand/logo-horizontal.png',
    output: 'public/brand/logo-horizontal_optimized.png',
    width: 800,
    quality: 85,
    format: 'png'
  },
  {
    input: 'public/brand/logo-horizontal-1024w.png',
    output: 'public/brand/logo-horizontal-1024w_optimized.png',
    width: 1024,
    quality: 85,
    format: 'png'
  }
];

async function optimizeImage(config) {
  const inputPath = path.resolve(config.input);
  const outputPath = path.resolve(config.output);

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.input} - file not found`);
    return null;
  }

  try {
    const inputStats = fs.statSync(inputPath);
    const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

    let pipeline = sharp(inputPath);

    // Resize if width specified
    if (config.width) {
      pipeline = pipeline.resize(config.width, null, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Apply format-specific optimization
    if (config.format === 'png') {
      pipeline = pipeline.png({
        quality: config.quality,
        compressionLevel: 9,
        adaptiveFiltering: true
      });
    } else if (config.format === 'jpeg') {
      pipeline = pipeline.jpeg({
        quality: config.quality,
        mozjpeg: true
      });
    } else if (config.format === 'webp') {
      pipeline = pipeline.webp({
        quality: config.quality,
        effort: 6
      });
    }

    // Save optimized image
    await pipeline.toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✅ ${config.input}`);
    console.log(`   ${inputSizeMB}MB → ${outputSizeMB}MB (${savings}% smaller)`);

    return {
      input: config.input,
      output: config.output,
      inputSize: inputStats.size,
      outputSize: outputStats.size,
      savings: savings
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${config.input}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  const results = [];

  for (const config of optimizations) {
    const result = await optimizeImage(config);
    if (result) {
      results.push(result);
    }
  }

  console.log('\n📊 OPTIMIZATION SUMMARY:');
  console.log('========================\n');

  const totalInputSize = results.reduce((sum, r) => sum + r.inputSize, 0);
  const totalOutputSize = results.reduce((sum, r) => sum + r.outputSize, 0);
  const totalSavings = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);

  console.log(`Files optimized: ${results.length}`);
  console.log(`Total input size: ${(totalInputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total output size: ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${totalSavings}%`);
  console.log(`Space saved: ${((totalInputSize - totalOutputSize) / 1024 / 1024).toFixed(2)} MB`);

  console.log('\n✅ Optimization complete!');
  console.log('\n⚠️  NEXT STEP: Replace original files with optimized versions');
  console.log('Run: node scripts/replace-optimized-images.js');
}

main().catch(console.error);
