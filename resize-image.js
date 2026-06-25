#!/usr/bin/env node

/**
 * Image Resize Script
 * Resizes images to smaller dimensions and compresses them
 * 
 * Requirements: npm install sharp
 * Usage: node resize-image.js <input-file> [output-file] [width] [height]
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: node resize-image.js <input-file> [output-file] [width] [height]');
  console.error('Example: node resize-image.js IMG_1386.jpg IMG_1386-small.jpg 800 600');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace(/(\.[^.]+)$/, '-resized$1');
const width = parseInt(args[2]) || 800;
const height = parseInt(args[3]) || 600;

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

console.log(`Resizing ${inputFile}...`);
console.log(`Target dimensions: ${width}x${height}`);

// Get original file size
const originalSize = fs.statSync(inputFile).size;
console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

// Resize and optimize the image
sharp(inputFile)
  .resize(width, height, {
    fit: 'inside',
    withoutEnlargement: true
  })
  .jpeg({ quality: 80, progressive: true })
  .toFile(outputFile, (err, info) => {
    if (err) {
      console.error('Error resizing image:', err);
      process.exit(1);
    }

    const newSize = info.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    
    console.log(`✓ Resized successfully!`);
    console.log(`New size: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Size reduction: ${reduction}%`);
    console.log(`Output file: ${outputFile}`);
  });
