
import React from 'react';
import { ScanResult, AnalysisResult } from '../types';
import { SecurityIcon } from './icons/SecurityIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { PrintIcon } from './icons/PrintIcon';


interface SecurityReportProps {
    file: File;
    scanResult: ScanResult;
    analysisResult: AnalysisResult;
}

export const SecurityReport: React.FC<SecurityReportProps> = ({ file, scanResult, analysisResult }) => {
    
    const isClean = scanResult.status === 'clean';

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const fileType = analysisResult.type === 'file' ? analysisResult.fileType : analysisResult.format;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-gray-800/70 p-6 rounded-lg security-report-printable">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center mb-3">
                        <SecurityIcon className="h-6 w-6 text-cyan-300" />
                        <h3 className="text-lg font-semibold text-cyan-300 ml-2">Security Report</h3>
                    </div>
                </div>
                <button onClick={handlePrint} className="no-print flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <PrintIcon className="h-4 w-4 mr-1" />
                    Print Report
                </button>
            </div>
            
            <div className={`p-4 rounded-md mb-4 ${isClean ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                <div className="flex items-center">
                    {isClean ? <CheckCircleIcon className="h-8 w-8 text-green-400 mr-3" /> : <AlertTriangleIcon className="h-8 w-8 text-red-400 mr-3" />}
                    <div>
                        <p className={`text-xl font-bold ${isClean ? 'text-green-300' : 'text-red-300'}`}>
                            {isClean ? 'File is Clean' : 'Threat Found!'}
                        </p>
                        <p className={`text-sm ${isClean ? 'text-green-400/80' : 'text-red-400/80'}`}>
                            {isClean ? 'No threats were detected.' : `Threat identified: ${scanResult.threatName}`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-300 space-y-2">
                <div className="flex justify-between border-b border-gray-700/50 py-1">
                    <span className="font-medium text-gray-400">File Name:</span>
                    <span className="font-mono text-right truncate pl-2" title={file.name}>{file.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700/50 py-1">
                    <span className="font-medium text-gray-400">File Size:</span>
                    <span className="font-mono">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700/50 py-1">
                    <span className="font-medium text-gray-400">File Type:</span>
                    <span className="font-mono text-right">{fileType}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700/50 py-1">
                    <span className="font-medium text-gray-400">Scan Time:</span>
                    <span className="font-mono">{new Date(scanResult.scannedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1">
                    <span className="font-medium text-gray-400">Scan Engine:</span>
                    <span className="font-mono">{scanResult.engineVersion}</span>
                </div>
            </div>
        </div>
    );
};
