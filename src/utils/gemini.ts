import { GoogleGenerativeAI } from '@google/generative-ai';

// Configure the Gemini API with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const ROLE_PROMPTS = {
  lawyer: {
    prefix: "As a legal professional advisor, provide a detailed technical response focusing on legal precedents, statutes, and professional implications. Keep the response under 250 words: ",
    systemContext: "You are a legal professional assistant with expertise in Indian law. Focus on technical accuracy and professional context."
  },
  citizen: {
    prefix: "Explain in simple, clear language that a non-legal professional can understand. Avoid technical jargon where possible. Keep the response under 200 words: ",
    systemContext: "You are a helpful assistant making legal concepts accessible to the general public. Focus on practical, actionable advice."
  }
};

// Constants for content limits
const MAX_CONTENT_LENGTH = 30000; // ~30k characters for safety
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function getGeminiResponse(prompt: string, role: 'lawyer' | 'citizen') {
  try {
    const roleConfig = ROLE_PROMPTS[role];
    const fullPrompt = `${roleConfig.systemContext}\n\n${roleConfig.prefix}${prompt}`;

    // Initialize the model with Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: role === 'lawyer' ? 500 : 400,
      }
    });
    
    console.log('Sending prompt to Gemini:', fullPrompt);
    const result = await model.generateContent(fullPrompt);
    
    if (!result || !result.response) {
      throw new Error('Empty response from AI');
    }

    const text = result.response.text();
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid response format');
    }

    return text;
  } catch (error: any) {
    console.error('Detailed error in Gemini response:', {
      error: error,
      message: error.message,
      stack: error.stack
    });
    throw new Error(`AI Assistant Error: ${error.message || 'Unknown error occurred'}`);
  }
}

export async function analyzeDocument(file: File, role: 'lawyer' | 'citizen'): Promise<string> {
  try {
    let fileContent = '';

    if (file.type === 'text/plain') {
      fileContent = await file.text();
    } else if (file.type === 'application/pdf' || 
               file.type === 'application/msword' || 
               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      throw new Error('PDF and Word documents are not supported yet. Please convert to text format first.');
    } else {
      throw new Error('Unsupported file type');
    }

    // Check content length
    if (fileContent.length > MAX_CONTENT_LENGTH) {
      fileContent = fileContent.substring(0, MAX_CONTENT_LENGTH);
      console.log(`Document truncated from ${fileContent.length} to ${MAX_CONTENT_LENGTH} characters`);
    }

    const roleConfig = ROLE_PROMPTS[role];
    let analysisPrompt = role === 'lawyer'
      ? "Analyze this legal document, focusing on key legal points, potential issues, and relevant statutes. Provide a structured analysis: "
      : "Review this document and explain its main points and implications in simple terms: ";

    const fullPrompt = `${roleConfig.systemContext}\n\nAnalyze the following document excerpt (note that it may be truncated for length):\n\n${fileContent}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: role === 'lawyer' ? 800 : 600,
      }
    });

    const result = await model.generateContent(fullPrompt);
    if (!result || !result.response) {
      throw new Error('Empty response from AI');
    }

    return result.response.text();
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    throw new Error(`Document Analysis Error: ${error.message || 'Failed to analyze document'}`);
  }
}

// Utility function to validate file before processing
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum limit of 5MB`
    };
  }

  const validTypes = [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a .txt, .pdf, .doc, or .docx file'
    };
  }

  return { valid: true };
}
