import React from 'react';
import { Image, Folder, HardDrive, Zap } from 'lucide-react';

interface StatsCardProps {
  totalImages: number;
  totalFolders: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  compressionSaved: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  totalImages,
  totalFolders,
  totalOriginalSize,
  totalCompressedSize,
  compressionSaved
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const compressionPercentage = totalOriginalSize > 0 
    ? Math.round((compressionSaved / totalOriginalSize) * 100) 
    : 0;

  const stats = [
    {
      icon: Image,
      label: 'Total Images',
      value: totalImages.toLocaleString(),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Folder,
      label: 'Folders',
      value: totalFolders.toLocaleString(),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: formatFileSize(totalCompressedSize),
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Zap,
      label: 'Space Saved',
      value: `${formatFileSize(compressionSaved)} (${compressionPercentage}%)`,
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
