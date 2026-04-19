import React, { useState } from 'react';
import { FolderStats } from '../services/api';
import { Folder, Plus, X } from 'lucide-react';

interface FolderSelectorProps {
  folders: FolderStats[];
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
  currentFolder: string;
  onCurrentFolderChange: (folder: string) => void;
}

const FolderSelector: React.FC<FolderSelectorProps> = ({
  folders,
  selectedFolder,
  onSelectFolder,
  currentFolder,
  onCurrentFolderChange
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCurrentFolderChange(newFolderName.trim());
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Folder className="w-5 h-5" />
        Folders
      </h3>

      {/* Current Upload Folder */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Upload to folder:</label>
        <div className="flex gap-2">
          {!isCreating ? (
            <>
              <select
                value={currentFolder}
                onChange={(e) => onCurrentFolderChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                {folders
                  .filter(f => f.name !== 'default')
                  .map(folder => (
                    <option key={folder.name} value={folder.name}>
                      {folder.name} ({folder.count})
                    </option>
                  ))}
              </select>
              <button
                onClick={() => setIsCreating(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors"
                title="Create new folder"
              >
                <Plus className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <button
                onClick={handleCreateFolder}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                         transition-colors"
                disabled={!newFolderName.trim()}
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewFolderName('');
                }}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                         transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter by Folder */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Filter images:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectFolder('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedFolder === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Folders ({folders.reduce((sum, f) => sum + f.count, 0)})
          </button>
          {folders.map(folder => (
            <button
              key={folder.name}
              onClick={() => onSelectFolder(folder.name)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedFolder === folder.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {folder.name} ({folder.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderSelector;
