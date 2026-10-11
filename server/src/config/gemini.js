import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

let aiClientInstance = null;

/**
 * Checks whether GEMINI_API_KEY is configured in the environment
 * @returns {boolean}
 */
export function isGeminiConfigured() {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== '' && key !== 'your_gemini_api_key_here');
}

/**
 * Returns the active model name configured in environment or default
 * @returns {string}
 */
export function getModelName() {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}

/**
 * Returns an initialized GoogleGenAI client instance
 * Throws a friendly error if GEMINI_API_KEY is not configured
 * @returns {GoogleGenAI}
 */
export function getGeminiClient() {
  if (!isGeminiConfigured()) {
    const error = new Error(
      'Gemini API key is not configured. Please set GEMINI_API_KEY in your server/.env file or environment.'
    );
    error.statusCode = 503;
    error.code = 'GEMINI_KEY_MISSING';
    throw error;
  }

  if (!aiClientInstance) {
    aiClientInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY.trim()
    });
  }

  return aiClientInstance;
}
