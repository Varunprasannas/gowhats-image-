import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true,
    unique: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  compressedSize: {
    type: Number
  },
  mimeType: {
    type: String,
    required: true
  },
  folder: {
    type: String,
    default: 'default'
  },
  publicUrl: {
    type: String,
    required: true
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
imageSchema.index({ folder: 1, uploadedAt: -1 });

export default mongoose.model('Image', imageSchema);
