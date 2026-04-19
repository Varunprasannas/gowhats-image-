import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ImageData {
  _id: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  compressedSize?: number;
  mimeType: string;
  folder: string;
  publicUrl: string;
  width?: number;
  height?: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  success: boolean;
  image: ImageData;
}

export interface BulkUploadResponse {
  success: boolean;
  uploaded: number;
  failed: number;
  images: ImageData[];
  errors: Array<{ fileName: string; error: string }>;
}

export interface ImagesResponse {
  success: boolean;
  images: ImageData[];
  total: number;
  hasMore: boolean;
}

export interface FolderStats {
  name: string;
  count: number;
}

export interface FoldersResponse {
  success: boolean;
  folders: FolderStats[];
}

export interface StatsResponse {
  success: boolean;
  stats: {
    totalImages: number;
    totalFolders: number;
    totalOriginalSize: number;
    totalCompressedSize: number;
    compressionSaved: number;
  };
}

// Upload single image
export const uploadImage = async (file: File, folder: string = 'default'): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Upload multiple images
export const uploadImages = async (files: File[], folder: string = 'default'): Promise<BulkUploadResponse> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  formData.append('folder', folder);

  const response = await api.post<BulkUploadResponse>('/upload-bulk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Get all images
export const getImages = async (folder?: string, limit: number = 100, skip: number = 0): Promise<ImagesResponse> => {
  const params: any = { limit, skip };
  if (folder) params.folder = folder;

  const response = await api.get<ImagesResponse>('/images', { params });
  return response.data;
};

// Get single image
export const getImage = async (id: string): Promise<{ success: boolean; image: ImageData }> => {
  const response = await api.get(`/images/${id}`);
  return response.data;
};

// Update image
export const updateImage = async (id: string, data: { originalName?: string; folder?: string }): Promise<{ success: boolean; image: ImageData }> => {
  const response = await api.put(`/images/${id}`, data);
  return response.data;
};

// Delete single image
export const deleteImage = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/images/${id}`);
  return response.data;
};

// Delete multiple images
export const deleteImages = async (imageIds: string[]): Promise<{ success: boolean; deleted: number; errors: any[] }> => {
  const response = await api.post('/images/delete-bulk', { imageIds });
  return response.data;
};

// Get folders
export const getFolders = async (): Promise<FoldersResponse> => {
  const response = await api.get<FoldersResponse>('/folders');
  return response.data;
};

// Get statistics
export const getStats = async (): Promise<StatsResponse> => {
  const response = await api.get<StatsResponse>('/stats');
  return response.data;
};

export default api;
