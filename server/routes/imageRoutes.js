import express from 'express';
import upload from '../middleware/upload.js';
import Image from '../models/Image.js';
import { compressImage, getImageMetadata } from '../utils/imageProcessor.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the correct public URL based on environment
const getPublicUrl = (req, fileName) => {
  // For production/deployed, use environment variable or reconstruct from headers
  const host = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  return `${host}/uploads/${fileName}`;
};

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'default';
    const originalPath = req.file.path;
    const compressedFileName = 'compressed-' + req.file.filename;
    const compressedPath = path.join(path.dirname(originalPath), compressedFileName);

    // Compress image
    const { compressedSize, width, height } = await compressImage(
      originalPath,
      compressedPath,
      80
    );

    // Delete original, keep compressed
    await fs.unlink(originalPath);

    // Create database record
    const image = new Image({
      originalName: req.file.originalname,
      fileName: compressedFileName,
      fileSize: req.file.size,
      compressedSize: compressedSize,
      mimeType: req.file.mimetype,
      folder: folder,
      publicUrl: getPublicUrl(req, compressedFileName),
      width,
      height
    });

    await image.save();

    res.status(201).json({
      success: true,
      image: image
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

// Upload multiple images (bulk upload)
router.post('/upload-bulk', upload.array('images', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const folder = req.body.folder || 'default';
    const uploadedImages = [];
    const errors = [];

    for (const file of req.files) {
      try {
        const originalPath = file.path;
        const compressedFileName = 'compressed-' + file.filename;
        const compressedPath = path.join(path.dirname(originalPath), compressedFileName);

        // Compress image
        const { compressedSize, width, height } = await compressImage(
          originalPath,
          compressedPath,
          80
        );

        // Delete original, keep compressed
        await fs.unlink(originalPath);

        // Create database record
        const image = new Image({
          originalName: file.originalname,
          fileName: compressedFileName,
          fileSize: file.size,
          compressedSize: compressedSize,
          mimeType: file.mimetype,
          folder: folder,
          publicUrl: getPublicUrl(req, compressedFileName),
          width,
          height
        });

        await image.save();
        uploadedImages.push(image);

      } catch (error) {
        console.error(`Error processing ${file.originalname}:`, error);
        errors.push({
          fileName: file.originalname,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      uploaded: uploadedImages.length,
      failed: errors.length,
      images: uploadedImages,
      errors: errors
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Failed to upload images', details: error.message });
  }
});

// Get all images
router.get('/images', async (req, res) => {
  try {
    const { folder, limit = 100, skip = 0 } = req.query;
    
    const query = folder && folder !== 'all' ? { folder } : {};
    
    const images = await Image.find(query)
      .sort({ uploadedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Image.countDocuments(query);

    res.json({
      success: true,
      images,
      total,
      hasMore: total > parseInt(skip) + images.length
    });

  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
});

// Get all folders
router.get('/folders', async (req, res) => {
  try {
    const folders = await Image.distinct('folder');
    
    const folderStats = await Promise.all(
      folders.map(async (folder) => {
        const count = await Image.countDocuments({ folder });
        return { name: folder, count };
      })
    );

    res.json({
      success: true,
      folders: folderStats
    });

  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ error: 'Failed to fetch folders', details: error.message });
  }
});

// Get single image
router.get('/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      success: true,
      image
    });

  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to fetch image', details: error.message });
  }
});

// Update image (rename)
router.put('/images/:id', async (req, res) => {
  try {
    const { originalName, folder } = req.body;
    
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (originalName) image.originalName = originalName;
    if (folder) image.folder = folder;

    await image.save();

    res.json({
      success: true,
      image
    });

  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ error: 'Failed to update image', details: error.message });
  }
});

// Delete single image
router.delete('/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../uploads', image.fileName);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('File deletion error:', err);
    }

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

// Delete multiple images
router.post('/images/delete-bulk', async (req, res) => {
  try {
    const { imageIds } = req.body;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({ error: 'No image IDs provided' });
    }

    const images = await Image.find({ _id: { $in: imageIds } });
    
    const deletedCount = images.length;
    const errors = [];

    // Delete files from disk
    for (const image of images) {
      const filePath = path.join(__dirname, '../uploads', image.fileName);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Failed to delete file ${image.fileName}:`, err);
        errors.push({
          imageId: image._id,
          error: err.message
        });
      }
    }

    // Delete from database
    await Image.deleteMany({ _id: { $in: imageIds } });

    res.json({
      success: true,
      deleted: deletedCount,
      errors: errors
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Failed to delete images', details: error.message });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const totalImages = await Image.countDocuments();
    const totalSize = await Image.aggregate([
      {
        $group: {
          _id: null,
          totalOriginal: { $sum: '$fileSize' },
          totalCompressed: { $sum: '$compressedSize' }
        }
      }
    ]);

    const folderCount = await Image.distinct('folder');

    res.json({
      success: true,
      stats: {
        totalImages,
        totalFolders: folderCount.length,
        totalOriginalSize: totalSize[0]?.totalOriginal || 0,
        totalCompressedSize: totalSize[0]?.totalCompressed || 0,
        compressionSaved: (totalSize[0]?.totalOriginal || 0) - (totalSize[0]?.totalCompressed || 0)
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

export default router;
