
import React, { useState } from 'react';

interface CodeSnippetProps {
  scripts: Record<string, string>;
}

const LanguageButton: React.FC<{ name: string; selected: boolean; onClick: () => void; }> = ({ name, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors focus:outline-none 
      ${selected 
        ? 'bg-gray-900 text-cyan-300 border-b-2 border-cyan-400' 
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      }`}
  >
    {name}
  </button>
);

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ scripts }) => {
  const languages = Object.keys(scripts);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(scripts[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg mt-8">
        <div className="p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">Automation Scripts</h3>
            <p className="text-sm text-gray-400 mt-1">Example scripts to automate this conversion from the command line.</p>
        </div>
        <div className="bg-gray-800 border-b border-gray-700 px-2 pt-2 flex space-x-1">
            {languages.map(lang => (
                <LanguageButton 
                    key={lang} 
                    name={lang.charAt(0).toUpperCase() + lang.slice(1)} 
                    selected={selectedLanguage === lang}
                    onClick={() => setSelectedLanguage(lang)}
                />
            ))}
        </div>
        <div className="relative bg-gray-900 p-4 rounded-b-xl">
            <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-md px-3 py-1 transition-colors"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                <code>
                    {scripts[selectedLanguage]}
                </code>
            </pre>
        </div>
    </div>
  );
};
