
import React, { useState, useEffect } from 'react';
import { proofreadText } from '../services/geminiService';

interface ProofreaderProps {
    file: File;
}

export const Proofreader: React.FC<ProofreaderProps> = ({ file }) => {
    const [textContent, setTextContent] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setTextContent(e.target?.result as string);
        };
        reader.readAsText(file);
    }, [file]);

    const handleProofread = async () => {
        if (!textContent) return;
        setIsLoading(true);
        setError(null);
        setResult('');
        try {
            // To avoid sending huge files, we'll truncate the text
            const snippet = textContent.slice(0, 4000);
            const proofreadResult = await proofreadText(snippet);
            setResult(proofreadResult);
        } catch (err) {
            setError('Failed to get proofreading suggestions.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Simple markdown to HTML renderer
    const renderMarkdown = (text: string) => {
        const html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            .replace(/\n/g, '<br />');
        return { __html: html };
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">AI Proofreader (for Text Files)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium text-gray-400 mb-2">Original Text (First 4000 characters)</h4>
                    <div className="bg-gray-900 rounded-md p-4 h-64 overflow-y-auto text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {textContent.slice(0, 4000) || 'Loading file content...'}
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-gray-400 mb-2">AI Suggestions</h4>
                    <div className="bg-gray-900 rounded-md p-4 h-64 overflow-y-auto text-sm text-gray-300">
                        {isLoading && <p>Getting suggestions...</p>}
                        {error && <p className="text-red-400">{error}</p>}
                        {result && <div dangerouslySetInnerHTML={renderMarkdown(result)} />}
                        {!isLoading && !result && <p className="text-gray-500">Click "Proofread" to see AI suggestions here.</p>}
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center">
                <button
                    onClick={handleProofread}
                    disabled={isLoading || !textContent}
                    className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Analyzing...' : 'Proofread Text'}
                </button>
            </div>
        </div>
    );
};
