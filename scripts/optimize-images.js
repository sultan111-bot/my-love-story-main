#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname dalam ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = './photos-raw';
const OUTPUT_DIR = './public/photos';

// ANSI Colors untuk terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(type, message) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✅${colors.reset}`,
    error: `${colors.red}❌${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    progress: `${colors.cyan}→${colors.reset}`,
  };
  
  console.log(`[${timestamp}] ${prefix[type]} ${message}`);
}

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2);
}

async function optimizeImages() {
  try {
    log('info', `${colors.bright}Starting image optimization...${colors.reset}\n`);

    // Validasi INPUT_DIR
    if (!fs.existsSync(INPUT_DIR)) {
      log('error', `Directory tidak ditemukan: ${INPUT_DIR}`);
      log('info', 'Silakan buat folder "photos-raw" dan masukkan foto di dalamnya');
      process.exit(1);
    }

    // Buat OUTPUT_DIR jika belum ada
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      log('success', `Created output directory: ${OUTPUT_DIR}`);
    }

    // Baca semua file gambar
    const files = fs.readdirSync(INPUT_DIR)
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort();

    if (files.length === 0) {
      log('warning', `No images found in ${INPUT_DIR}`);
      log('info', 'Supported formats: jpg, jpeg, png, webp, gif');
      process.exit(1);
    }

    log('progress', `Found ${files.length} image(s) to process\n`);

    const photos = [];
    let successCount = 0;

    // Process setiap foto
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const inputPath = path.join(INPUT_DIR, file);
      const id = String(i + 1).padStart(3, '0');
      const photoDir = path.join(OUTPUT_DIR, id);

      // Skip jika bukan file
      if (!fs.statSync(inputPath).isFile()) continue;

      try {
        // Buat folder untuk foto ini
        if (!fs.existsSync(photoDir)) {
          fs.mkdirSync(photoDir, { recursive: true });
        }

        log('progress', `[${i + 1}/${files.length}] Processing: ${file}`);

        // ===== GET IMAGE METADATA =====
        const metadata = await sharp(inputPath).metadata();
        const aspectRatio = metadata.width / metadata.height;

        // ===== 1. CREATE THUMBNAIL (320px) =====
        log('progress', `        ├─ Creating thumbnail (320px, 60% quality)...`);
        const thumbPath = path.join(photoDir, 'thumb.webp');
        const thumbResult = await sharp(inputPath)
          .resize(320, Math.round(320 / aspectRatio), { fit: 'cover', position: 'center' })
          .webp({ quality: 60, effort: 4 })
          .toFile(thumbPath);
        const thumbSize = thumbResult.size;

        // ===== 2. CREATE MEDIUM (800px) =====
        log('progress', `        ├─ Creating medium (800px, 75% quality)...`);
        const mediumPath = path.join(photoDir, 'medium.webp');
        const mediumResult = await sharp(inputPath)
          .resize(800, Math.round(800 / aspectRatio), { fit: 'cover', position: 'center' })
          .webp({ quality: 75, effort: 4 })
          .toFile(mediumPath);
        const mediumSize = mediumResult.size;

        // ===== 3. CREATE FULL (1400px) =====
        log('progress', `        └─ Creating full (1400px, 85% quality)...`);
        const fullPath = path.join(photoDir, 'full.webp');
        const fullResult = await sharp(inputPath)
          .resize(1400, Math.round(1400 / aspectRatio), { fit: 'cover', position: 'center' })
          .webp({ quality: 85, effort: 4 })
          .toFile(fullPath);
        const fullSize = fullResult.size;

        // ===== CREATE DATA OBJECT =====
        photos.push({
          id: parseInt(id),
          title: `Foto ${id}`,
          paths: {
            thumb: `/photos/${id}/thumb.webp`,
            medium: `/photos/${id}/medium.webp`,
            full: `/photos/${id}/full.webp`,
          },
          sizes: {
            thumb: formatSize(thumbSize),
            medium: formatSize(mediumSize),
            full: formatSize(fullSize),
          },
          dimensions: {
            width: metadata.width,
            height: metadata.height,
            aspectRatio: parseFloat(aspectRatio.toFixed(3)),
          },
          quality: 'high',
          processed: true,
        });

        successCount++;
        log('success', `Done! ${colors.dim}(thumb: ${formatSize(thumbSize)}KB, medium: ${formatSize(mediumSize)}KB, full: ${formatSize(fullSize)}KB)${colors.reset}`);

      } catch (error) {
        log('error', `Failed to process ${file}: ${error.message}`);
      }
    }

    // ===== WRITE MANIFEST FILE =====
    log('progress', '\nGenerating manifest file...');
    
    const manifest = {
      metadata: {
        total: photos.length,
        generated: new Date().toISOString(),
        version: '1.0.0',
      },
      photos,
    };

    const manifestPath = './src/data/photos.json';
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    // ===== CALCULATE STATISTICS =====
    const totalThumb = photos.reduce((sum, p) => sum + parseFloat(p.sizes.thumb), 0);
    const totalMedium = photos.reduce((sum, p) => sum + parseFloat(p.sizes.medium), 0);
    const totalFull = photos.reduce((sum, p) => sum + parseFloat(p.sizes.full), 0);

    // ===== PRINT SUMMARY =====
    console.log('\n' + '='.repeat(70));
    console.log(`${colors.bright}${colors.green}✨ OPTIMIZATION COMPLETE!${colors.reset}`);
    console.log('='.repeat(70));
    console.log(`\n📊 ${colors.bright}STATISTICS:${colors.reset}`);
    console.log(`   • Total images processed: ${colors.green}${successCount}/${files.length}${colors.reset}`);
    console.log(`   • Failed: ${files.length - successCount}`);
    console.log(`   • Output directory: ${OUTPUT_DIR}`);
    console.log(`\n💾 ${colors.bright}FILE SIZES:${colors.reset}`);
    console.log(`   • All thumbnails: ${colors.cyan}${totalThumb.toFixed(2)}MB${colors.reset} (320px, fast loading)`);
    console.log(`   • All medium: ${colors.cyan}${totalMedium.toFixed(2)}MB${colors.reset} (800px, preview)`);
    console.log(`   • All full quality: ${colors.cyan}${totalFull.toFixed(2)}MB${colors.reset} (1400px, high quality)`);
    console.log(`   • ${colors.green}TOTAL: ${(totalThumb + totalMedium + totalFull).toFixed(2)}MB${colors.reset}`);
    console.log(`\n📄 ${colors.bright}FILES CREATED:${colors.reset}`);
    console.log(`   • Manifest: ${manifestPath}`);
    console.log(`   • Images: ${OUTPUT_DIR}/001/ → ${OUTPUT_DIR}/${String(successCount).padStart(3, '0')}/`);
    console.log('\n✅ Ready to use in your React app!\n');

  } catch (error) {
    log('error', `Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

optimizeImages();