
import React, { useState, useEffect } from 'react';
import { FileAnalysisResult, ScanResult } from '../types';
import { FileIcon } from './icons/FileIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SecurityReport } from './SecurityReport';

interface FileAnalysisProps {
  file: File;
  result: FileAnalysisResult;
  scanResult: ScanResult;
  onRename: (newName: string) => void;
}

const InfoCard: React.FC<{title: string; children: React.ReactNode; icon?: React.ReactNode}> = ({ title, children, icon }) => (
    <div className="bg-gray-800/70 p-6 rounded-lg">
        <div className="flex items-center mb-3">
            {icon}
            <h3 className="text-lg font-semibold text-cyan-300 ml-2">{title}</h3>
        </div>
        <div className="text-gray-300 space-y-2">{children}</div>
    </div>
);

export const FileAnalysis: React.FC<FileAnalysisProps> = ({ file, result, scanResult, onRename }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableName, setEditableName] = useState(file.name);

    useEffect(() => {
        setEditableName(file.name);
    }, [file.name]);


    const handleSaveRename = () => {
        if (editableName.trim() && editableName !== file.name) {
            onRename(editableName.trim());
        }
        setIsEditing(false);
    };

    const handleCancelRename = () => {
        setEditableName(file.name);
        setIsEditing(false);
    };


    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center pb-4 border-b border-gray-700 mb-6">
                <FileIcon className="h-12 w-12 text-cyan-400 mr-4 flex-shrink-0" />
                <div className="w-full">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={editableName}
                                onChange={(e) => setEditableName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                                className="w-full bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-1 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                autoFocus
                            />
                            <button onClick={handleSaveRename} className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-500 rounded-md">Save</button>
                            <button onClick={handleCancelRename} className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded-md">Cancel</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                             <h2 className="text-2xl font-bold text-white truncate" title={file.name}>{file.name}</h2>
                             <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-white"><PencilIcon className="h-5 w-5"/></button>
                        </div>
                    )}
                    <p className="text-sm text-gray-400">{result.fileType} ({result.extension}) - {formatFileSize(file.size)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <InfoCard title="Description">
                       <p>{result.description}</p>
                    </InfoCard>
                    <InfoCard title="Common Uses">
                        <ul className="list-disc list-inside space-y-1">
                            {result.commonUses.map((use, index) => (
                                <li key={index}>{use}</li>
                            ))}
                        </ul>
                    </InfoCard>
                </div>
                <div>
                     <SecurityReport file={file} scanResult={scanResult} analysisResult={result} />
                </div>
            </div>
        </div>
    );
};
