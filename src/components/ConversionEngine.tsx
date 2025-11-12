
import React, { useState } from 'react';
import { ConversionSuggestion } from '../types';
import { ConvertIcon } from './icons/ConvertIcon';

interface ConversionEngineProps {
  suggestions: ConversionSuggestion[];
  onConvert: (targetFormat: ConversionSuggestion) => Promise<void>;
}

export const ConversionEngine: React.FC<ConversionEngineProps> = ({ suggestions, onConvert }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>(suggestions[0]?.extension || '');
  const [isConverting, setIsConverting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleConvertClick = async () => {
    const target = suggestions.find(s => s.extension === selectedFormat);
    if (!target) return;

    setIsConverting(true);
    setIsDone(false);
    
    try {
      await onConvert(target);
      setIsDone(true);
      setTimeout(() => setIsDone(false), 4000);
    } catch (err) {
      // The main App component will catch and display the error.
      console.error("Conversion process failed:", err);
    } finally {
      setIsConverting(false);
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-4">
        <ConvertIcon className="h-6 w-6 text-cyan-300 mr-3" />
        <h3 className="text-xl font-semibold text-white">Conversion Engine</h3>
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <span className="font-medium text-gray-400">Convert to:</span>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="w-full sm:w-auto bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={isConverting}
        >
          {suggestions.map((s) => (
            <option key={s.extension} value={s.extension}>
              {s.format} ({s.extension})
            </option>
          ))}
        </select>
        <button
          onClick={handleConvertClick}
          disabled={isConverting || isDone}
          className={`w-full sm:w-auto px-6 py-2 font-semibold text-white rounded-md transition-all duration-300 flex items-center justify-center
            ${isConverting ? 'bg-gray-600 cursor-not-allowed' : ''}
            ${!isConverting && !isDone ? 'bg-cyan-600 hover:bg-cyan-500' : ''}
            ${isDone ? 'bg-green-600 cursor-default' : ''}
          `}
        >
          {isConverting && (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </>
          )}
          {isDone && 'Download Started!'}
          {!isConverting && !isDone && 'Generate & Download'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Generates automation scripts and downloads the converted file. AI conversion works best for text-based formats.
      </p>
    </div>
  );
};
