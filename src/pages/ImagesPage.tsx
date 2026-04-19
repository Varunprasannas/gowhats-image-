import { useState, useEffect } from 'react';
import { Grid3x3, List, Search, Download, Trash2, Eye, Folder } from 'lucide-react';
import { getImages, deleteImage, ImageData } from '../services/api';
import { cn } from '../utils/cn';

export default function ImagesPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await getImages();
      setImages(data);
      
      // Extract unique folders
      const uniqueFolders = Array.from(new Set(data.map(img => img.folder)));
      setFolders(uniqueFolders);
      
      filterImages(data, '', 'all');
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterImages = (imageList: ImageData[], search: string, folder: string) => {
    let filtered = imageList;

    // Filter by folder
    if (folder !== 'all') {
      filtered = filtered.filter(img => img.folder === folder);
    }

    // Filter by search term
    if (search) {
      filtered = filtered.filter(img =>
        img.originalName.toLowerCase().includes(search.toLowerCase()) ||
        img.fileName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterImages(images, value, selectedFolder);
  };

  const handleFolderFilter = (folder: string) => {
    setSelectedFolder(folder);
    filterImages(images, searchTerm, folder);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(id);
        setImages(images.filter(img => img._id !== id));
        filterImages(images.filter(img => img._id !== id), searchTerm, selectedFolder);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const toggleImageSelection = (id: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedImages(newSelected);
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Image Gallery</h1>
          <p className="text-gray-600">Manage and organize your images</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search images by name..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                title="Grid View"
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                title="List View"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Folder Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFolderFilter('all')}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
                selectedFolder === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              )}
            >
              <Folder size={16} />
              All Folders
            </button>
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => handleFolderFilter(folder)}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
                  selectedFolder === folder
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
              >
                <Folder size={16} />
                {folder}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Images</p>
            <p className="text-2xl font-bold text-blue-600">{filteredImages.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Original Size</p>
            <p className="text-2xl font-bold text-green-600">
              {formatFileSize(filteredImages.reduce((acc, img) => acc + (img.fileSize || 0), 0))}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Compressed Size</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatFileSize(filteredImages.reduce((acc, img) => acc + (img.compressedSize || 0), 0))}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading images...</p>
          </div>
        )}

        {/* Images Grid View */}
        {!loading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.length > 0 ? (
              filteredImages.map(image => (
                <div
                  key={image._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={image.publicUrl}
                      alt={image.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <a
                        href={image.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white text-gray-800 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                        title="View"
                      >
                        <Eye size={20} />
                      </a>
                      <button
                        onClick={() => handleDownload(image.publicUrl, image.fileName)}
                        className="p-2 bg-white text-gray-800 rounded-full hover:bg-green-500 hover:text-white transition-colors"
                        title="Download"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="p-2 bg-white text-gray-800 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate mb-1">
                      {image.originalName}
                    </h3>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Original: {formatFileSize(image.fileSize)}</p>
                      <p>Compressed: {formatFileSize(image.compressedSize)}</p>
                      <p className="text-green-600">
                        Saved: {formatFileSize(image.fileSize - image.compressedSize)}
                      </p>
                      {image.width && image.height && (
                        <p>{image.width} × {image.height}px</p>
                      )}
                      <p className="text-blue-600">{image.folder}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No images found</p>
              </div>
            )}
          </div>
        )}

        {/* Images List View */}
        {!loading && viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredImages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Filename</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Folder</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dimensions</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Saved</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredImages.map(image => (
                      <tr key={image._id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <img
                            src={image.publicUrl}
                            alt={image.originalName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-800 max-w-xs truncate">
                          {image.originalName}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{image.folder}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          <div className="text-xs">
                            <p>Original: {formatFileSize(image.fileSize)}</p>
                            <p>Compressed: {formatFileSize(image.compressedSize)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {image.width}×{image.height}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-green-600">
                          {formatFileSize(image.fileSize - image.compressedSize)}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <a
                              href={image.publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View"
                            >
                              <Eye size={18} />
                            </a>
                            <button
                              onClick={() => handleDownload(image.publicUrl, image.fileName)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(image._id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No images found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
