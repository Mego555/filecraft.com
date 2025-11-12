import { GoogleGenAI, Type } from "@google/genai";
import { FileAnalysisResult, ImageAnalysisResult, AnalysisResult, ConversionResult, ScanResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("Gemini API key is missing. Please set the API_KEY environment variable in your deployment configuration. For security, do not hardcode the key directly in this file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the `data:mime/type;base64,` prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
}

export const simulateVirusScan = (file: File): Promise<ScanResult> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate a random scan result
            const isThreat = Math.random() < 0.1; // 10% chance of finding a threat
            const result: ScanResult = {
                status: isThreat ? 'threat_found' : 'clean',
                threatName: isThreat ? 'Trojan.Win32.Generic!c' : undefined,
                scannedAt: new Date().toISOString(),
                engineVersion: `v1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`
            };
            resolve(result);
        }, 1500 + Math.random() * 1000); // Simulate network and processing time
    });
};

const fileAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        fileType: { type: Type.STRING, description: "The full name of the file format, e.g., 'Portable Document Format'" },
        extension: { type: Type.STRING, description: "The common file extension, e.g., '.pdf'" },
        description: { type: Type.STRING, description: "A brief, one-paragraph description of the file format." },
        commonUses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of common use cases for this file type."
        },
        potentialRisks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of potential security risks associated with this file type (e.g., macros, embedded scripts)."
        },
        conversionSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    format: { type: Type.STRING, description: "The name of the target conversion format." },
                    extension: { type: Type.STRING, description: "The file extension for the target format." }
                },
                required: ["format", "extension"]
            },
            description: "An array of suggested file formats to convert to."
        }
    },
    required: ["fileType", "extension", "description", "commonUses", "potentialRisks", "conversionSuggestions"]
};

const imageAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        format: { type: Type.STRING, description: "The full name of the image format, e.g., 'JPEG Image'" },
        description: { type: Type.STRING, description: "A detailed, one-paragraph description of the image content, including subjects, setting, and mood." },
        tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of relevant keywords or tags for the image."
        },
        editSuggestions: {
             type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of creative or technical suggestions for improving the image (e.g., 'Increase contrast', 'Crop to focus on the subject')."
        },
        conversionSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    format: { type: Type.STRING, description: "The name of the target conversion format." },
                    extension: { type: Type.STRING, description: "The file extension for the target format." }
                },
                required: ["format", "extension"]
            },
            description: "An array of suggested image formats to convert to (e.g., PNG, WebP)."
        }
    },
    required: ["format", "description", "tags", "editSuggestions", "conversionSuggestions"]
};

async function analyzeFileByName(fileName: string, scanStatus: ScanResult['status']): Promise<FileAnalysisResult> {
    const prompt = `Act as a world-class file type expert. A user has uploaded a file named '${fileName}'. A preliminary security scan found this file to be '${scanStatus}'. Based on its name and extension, provide a detailed analysis. Return your response as a JSON object that adheres to the provided schema. Do not include any text before or after the JSON object, and do not use markdown formatting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: fileAnalysisSchema,
            temperature: 0.2
        },
    });

    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText);
        return { ...result, type: 'file' };
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for file analysis:", jsonText);
        throw new Error("Received an invalid format from the AI model.");
    }
}

async function analyzeImageContent(imageBase64: string, mimeType: string, scanStatus: ScanResult['status']): Promise<ImageAnalysisResult> {
    const prompt = `Act as a world-class photography and image analysis expert. Analyze the provided image and give a detailed breakdown. A preliminary security scan of the file found it to be '${scanStatus}'. Return your response as a JSON object adhering to the schema. Do not include any extra text or markdown.`;

    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: imageBase64,
        },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: imageAnalysisSchema,
            temperature: 0.3
        },
    });

    const jsonText = response.text.trim();
    try {
        const result = JSON.parse(jsonText);
        return { ...result, type: 'image' };
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for image analysis:", jsonText);
        throw new Error("Received an invalid format from the AI model.");
    }
}


export async function analyzeFile(file: File, scanStatus: ScanResult['status']): Promise<AnalysisResult> {
    if (file.type.startsWith('image/')) {
        const base64Data = await fileToBase64(file);
        return analyzeImageContent(base64Data, file.type, scanStatus);
    } else {
        return analyzeFileByName(file.name, scanStatus);
    }
}

export async function convertFileContent(file: File, targetFormat: string): Promise<ConversionResult> {
    if (file.type.startsWith('text/')) {
        const textContent = await file.text();
        // Truncate for safety and performance
        const snippet = textContent.slice(0, 20000); 
        const prompt = `Convert the following text content to ${targetFormat} format. Your response should ONLY be the raw, converted content of the new file. Do not include any explanations, introductory text, or markdown code blocks.
---
${snippet}
---`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return {
            content: response.text,
            isBinary: false,
            mimeType: 'text/plain;charset=utf-8', // Let browser infer from extension
        };
    } else {
        // For binary files, we can't do content-aware conversion this way.
        // We'll return the original content so the user can download it with a new extension.
        const base64Content = await fileToBase64(file);
        return {
            content: base64Content,
            isBinary: true,
            mimeType: file.type,
        };
    }
}

export async function proofreadText(textContent: string): Promise<string> {
    const prompt = `Act as an expert proofreader. Analyze the following text for spelling, grammar, and style errors. Provide your corrections and suggestions in a clear, concise format using Markdown for formatting (e.g., use bold for suggestions, strikethrough for deletions).
    
    Text to analyze:
    ---
    ${textContent}
    ---
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
}


const scriptGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        bash: { type: Type.STRING, description: "A well-commented Bash script for the conversion." },
        python: { type: Type.STRING, description: "A well-commented Python script for the conversion." },
        nodejs: { type: Type.STRING, description: "A well-commented Node.js script for the conversion." }
    },
    required: ["bash", "python", "nodejs"]
};

export async function generateScripts(sourceFormat: string, targetFormat: string): Promise<Record<string, string>> {
    const prompt = `Act as a senior DevOps engineer. A user wants to automate a file conversion from '${sourceFormat}' to '${targetFormat}'. 
    Generate simple, well-commented example scripts for this task in Bash, Python, and Node.js. 
    For the commands, use popular, realistic open-source command-line tools (e.g., 'ffmpeg' for media, 'pandoc' for documents, 'imagemagick' for images).
    Return the response as a JSON object adhering to the schema, with no extra text or markdown.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: scriptGenerationSchema,
            temperature: 0.3
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini script generation response:", jsonText);
        throw new Error("Received an invalid format from the AI model.");
    }
}