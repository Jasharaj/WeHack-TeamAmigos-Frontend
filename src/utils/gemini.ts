import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyAcSVKmRdcOHM-E-ISzkoEx6dvzlSmvZjQ';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getGeminiResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Please provide a concise response in 2-3 sentences: ${prompt}` }]}],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7
      }
    });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}
