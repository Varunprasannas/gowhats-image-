import React, { useState } from 'react';
import { ImageData } from '../services/api';
import { Copy, Trash2, Edit2, Check, X, ExternalLink, Download } from 'lucide-react';

interface ImageGalleryProps {
  images: ImageData[];
  onDelete: (id: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onUpdate: (id: string, data: { originalName?: string; folder?: string }) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete, onDeleteMultiple, onUpdate }) => {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const toggleSelection = (id: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedImages(new Set(images.map(img => img._id)));
  };

  const deselectAll = () => {
    setSelectedImages(new Set());
  };

  const deleteSelected = () => {
    if (selectedImages.size > 0) {
      if (window.confirm(`Delete ${selectedImages.size} selected images?`)) {
        onDeleteMultiple(Array.from(selectedImages));
        setSelectedImages(new Set());
      }
    }
  };

  const startEdit = (image: ImageData) => {
    setEditingId(image._id);
    setEditName(image.originalName);
  };

  const saveEdit = (id: string) => {
    onUpdate(id, { originalName: editName });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No images uploaded yet</p>
        <p className="text-sm mt-2">Upload your first image to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedImages.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-blue-900 font-medium">
            {selectedImages.size} image{selectedImages.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={deselectAll}
              className="px-3 py-1.5 text-sm bg-white border border-blue-300 rounded-lg 
                       hover:bg-blue-50 transition-colors"
            >
              Deselect All
            </button>
            <button
              onClick={deleteSelected}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Select All Button */}
      {images.length > 0 && selectedImages.size === 0 && (
        <div className="flex justify-end">
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Select All ({images.length})
          </button>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image._id}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all
              ${selectedImages.has(image._id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedImages.has(image._id)}
                onChange={() => toggleSelection(image._id)}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>

            {/* Image Preview */}
            <div className="relative aspect-video bg-gray-100">
              <img
                src={image.publicUrl}
                alt={image.originalName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Info */}
            <div className="p-4 space-y-3">
              {/* Name (Editable) */}
              {editingId === image._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(image._id)}
                    className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 truncate flex-1" title={image.originalName}>
                    {image.originalName}
                  </p>
                  <button
                    onClick={() => startEdit(image)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>{image.width} × {image.height}</span>
                <span>•</span>
                <span>{formatFileSize(image.compressedSize || image.fileSize)}</span>
                <span>•</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {image.folder}
                </span>
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={image.publicUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => copyToClipboard(image.publicUrl, image._id)}
                  className={`px-3 py-2 rounded transition-colors ${
                    copiedId === image._id
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  title="Copy URL"
                >
                  {copiedId === image._id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={image.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                           bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </a>
                <a
                  href={image.publicUrl}
                  download={image.originalName}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                           bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this image?')) {
                      onDelete(image._id);
                    }
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 
                           transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Compression Info */}
              {image.compressedSize && image.fileSize > image.compressedSize && (
                <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                  Saved {formatFileSize(image.fileSize - image.compressedSize)} ({Math.round((1 - image.compressedSize / image.fileSize) * 100)}%)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
