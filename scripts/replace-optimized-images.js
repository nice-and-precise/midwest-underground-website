#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Files to replace with optimized versions
const replacements = [
  'images/logo_horizontal_official.png',
  'public/images/logo_horizontal_official.png',
  'images/logo_icon_transparent.png',
  'public/images/logo_icon_transparent.png',
  'images/mu_icon.png',
  'public/images/mu_icon.png',
  'images/mu_icon_official.png',
  'public/images/mu_icon_official.png',
  'images/logo_horizontal_transparent.png',
  'public/images/logo_horizontal_transparent.png',
  'images/logo_primary.png',
  'public/images/logo_primary.png',
  'images/flmagnumart1sm.jpg',
  'public/images/flmagnumart1sm.jpg',
  'public/brand/logo-horizontal.png',
  'public/brand/logo-horizontal-1024w.png'
];

function replaceWithOptimized(filePath) {
  const optimizedPath = filePath.replace(/\.(png|jpg|jpeg)$/, '_optimized.$1');

  if (!fs.existsSync(optimizedPath)) {
    console.log(`⚠️  Skipping ${filePath} - optimized version not found`);
    return false;
  }

  try {
    // Backup original
    const backupPath = filePath.replace(/\.(png|jpg|jpeg)$/, '_original.$1');
    fs.copyFileSync(filePath, backupPath);

    // Replace with optimized
    fs.copyFileSync(optimizedPath, filePath);

    // Delete optimized temp file
    fs.unlinkSync(optimizedPath);

    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log(`✅ ${filePath} → ${sizeMB}MB`);
    return true;
  } catch (error) {
    console.error(`❌ Error replacing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔄 Replacing original images with optimized versions...\n');

  let replaced = 0;

  for (const filePath of replacements) {
    if (replaceWithOptimized(filePath)) {
      replaced++;
    }
  }

  console.log(`\n✅ Replaced ${replaced} files with optimized versions`);
  console.log(`\n📁 Original files backed up with _original suffix`);
  console.log('   (You can delete these backups after verifying the site works correctly)');
}

main();
