
import React, { useState, useCallback, DragEvent } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
        className={`flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-gray-800' : 'border-gray-600 bg-gray-800/50'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
        <UploadIcon className="h-16 w-16 text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold text-white">Drop your file here</h2>
        <p className="text-gray-400 mt-1">or</p>
        <label htmlFor="file-upload" className="mt-4 cursor-pointer px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-cyan-500">
            Select a file
        </label>
        <input 
            id="file-upload" 
            name="file-upload" 
            type="file" 
            className="sr-only"
            onChange={handleFileChange}
        />
        <p className="text-xs text-gray-500 mt-4">Your file is processed locally and only its name is sent for analysis.</p>
    </div>
  );
};
