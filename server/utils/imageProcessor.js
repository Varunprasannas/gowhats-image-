import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export const compressImage = async (inputPath, outputPath, quality = 80) => {
  try {
    const metadata = await sharp(inputPath).metadata();
    
    // Compress and optimize image
    await sharp(inputPath)
      .resize(2048, 2048, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality, mozjpeg: true })
      .toFile(outputPath);

    const stats = await fs.stat(outputPath);
    
    return {
      compressedSize: stats.size,
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
};

export const getImageMetadata = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    };
  } catch (error) {
    console.error('Get metadata error:', error);
    throw error;
  }
};
