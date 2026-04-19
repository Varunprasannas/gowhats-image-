import { useState, useEffect } from 'react';
import { Image as ImageIcon, RefreshCw, AlertCircle, Images } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ImageGallery from './components/ImageGallery';
import StatsCard from './components/StatsCard';
import FolderSelector from './components/FolderSelector';
import ImagesPage from './pages/ImagesPage';
import {
  uploadImages,
  getImages,
  deleteImage,
  deleteImages,
  updateImage,
  getFolders,
  getStats,
  ImageData,
  FolderStats
} from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'gallery'>('dashboard');
  const [images, setImages] = useState<ImageData[]>([]);
  const [folders, setFolders] = useState<FolderStats[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [currentFolder, setCurrentFolder] = useState('default');
  const [stats, setStats] = useState({
    totalImages: 0,
    totalFolders: 0,
    totalOriginalSize: 0,
    totalCompressedSize: 0,
    compressionSaved: 0
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load images
  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getImages(selectedFolder === 'all' ? undefined : selectedFolder);
      setImages(response.images);
    } catch (err: any) {
      console.error('Error loading images:', err);
      setError(err.response?.data?.error || 'Failed to load images. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load folders
  const loadFolders = async () => {
    try {
      const response = await getFolders();
      setFolders(response.folders);
    } catch (err) {
      console.error('Error loading folders:', err);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await getStats();
      setStats(response.stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Load all data
  const loadData = () => {
    loadImages();
    loadFolders();
    loadStats();
  };

  useEffect(() => {
    loadData();
  }, [selectedFolder]);

  // Handle upload
  const handleUpload = async (files: File[]) => {
    try {
      setIsUploading(true);
      setError(null);
      const response = await uploadImages(files, currentFolder);
      
      if (response.success) {
        setSuccessMessage(
          `Successfully uploaded ${response.uploaded} image${response.uploaded > 1 ? 's' : ''}!` +
          (response.failed > 0 ? ` ${response.failed} failed.` : '')
        );
        setTimeout(() => setSuccessMessage(null), 5000);
        loadData();
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      setSuccessMessage('Image deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      loadData();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error || 'Failed to delete image');
    }
  };

  // Handle bulk delete
  const handleDeleteMultiple = async (ids: string[]) => {
    try {
      await deleteImages(ids);
      setSuccessMessage(`${ids.length} images deleted successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      loadData();
    } catch (err: any) {
      console.error('Bulk delete error:', err);
      setError(err.response?.data?.error || 'Failed to delete images');
    }
  };

  // Handle update
  const handleUpdate = async (id: string, data: { originalName?: string; folder?: string }) => {
    try {
      await updateImage(id, data);
      setSuccessMessage('Image updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      loadData();
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || 'Failed to update image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">GoWhats Image Host</h1>
                <p className="text-sm text-gray-600">Simple & Powerful Image Hosting</p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 border-t pt-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('gallery')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'gallery'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Images size={18} />
              Gallery
            </button>
          </div>
        </div>
      </header>

      {/* Gallery Page */}
      {currentPage === 'gallery' && <ImagesPage />}

      {/* Dashboard Page */}
      {currentPage === 'dashboard' && (
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-900 font-medium">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <p className="text-red-600 text-xs mt-2">
                Make sure the backend server is running on http://localhost:5000
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-green-900 font-medium">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <StatsCard {...stats} />

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Images</h2>
          <ImageUploader onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {/* Folder Management */}
        <FolderSelector
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          currentFolder={currentFolder}
          onCurrentFolderChange={setCurrentFolder}
        />

        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Images
              {selectedFolder !== 'all' && (
                <span className="text-sm text-gray-600 ml-2">
                  (Folder: {selectedFolder})
                </span>
              )}
            </h2>
            <span className="text-sm text-gray-600">
              {images.length} image{images.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 mx-auto text-gray-400 animate-spin" />
              <p className="text-gray-600 mt-4">Loading images...</p>
            </div>
          ) : (
            <ImageGallery
              images={images}
              onDelete={handleDelete}
              onDeleteMultiple={handleDeleteMultiple}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 text-sm">
            <p>GoWhats Image Host - Upload • Compress • Share</p>
            <p className="mt-2 text-xs">
              Backend: Node.js + Express + MongoDB | Frontend: React + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
