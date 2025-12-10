require('dotenv').config();
const Together = require('together-ai');
const Groq = require('groq-sdk');
const fs = require('fs').promises;
const path = require('path');

// Model configurations
const TOGETHER_MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct';
const GROQ_MODEL = 'llama-3.1-8b-instant';

/**
 * Load API keys from settings.json with fallback to .env
 * @returns {Promise<{togetherApiKey: string, groqApiKey: string}>}
 */
async function loadApiKeys() {
  const settingsPath = path.join(__dirname, '..', 'memory', 'settings.json');
  
  try {
    const settingsData = await fs.readFile(settingsPath, 'utf8');
    const settings = JSON.parse(settingsData);
    
    // Return settings keys if they exist, otherwise fallback to .env
    return {
      togetherApiKey: settings.togetherApiKey || process.env.TOGETHER_API_KEY || '',
      groqApiKey: settings.groqApiKey || process.env.GROQ_API_KEY || ''
    };
  } catch (error) {
    // If settings file doesn't exist or is invalid, use .env
    console.warn('[LLM] Using API keys from .env (settings.json not found)');
    return {
      togetherApiKey: process.env.TOGETHER_API_KEY || '',
      groqApiKey: process.env.GROQ_API_KEY || ''
    };
  }
}

/**
 * Generate text using dual-provider setup with automatic fallback
 * @param {string} prompt - The prompt to send to the LLM
 * @returns {Promise<{text: string, provider: string}>}
 */
async function generate(prompt) {
  // Load API keys dynamically
  const { togetherApiKey, groqApiKey } = await loadApiKeys();
  
  // Try Together AI first
  if (togetherApiKey) {
    try {
      console.log('Attempting to use Together AI...');
      const togetherClient = new Together({ apiKey: togetherApiKey });
      
      const response = await togetherClient.chat.completions.create({
        model: TOGETHER_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.7
      });

      const text = response.choices[0]?.message?.content || '';
      console.log('✓ Successfully used Together AI');
      return { text, provider: 'Together AI' };
    } catch (togetherError) {
      console.warn('✗ Together AI failed:', togetherError.message);
    }
  } else {
    console.warn('✗ Together AI key not configured');
  }
  
  // Fallback to Groq
  if (groqApiKey) {
    try {
      console.log('Falling back to Groq...');
      const groqClient = new Groq({ apiKey: groqApiKey });
      
      const response = await groqClient.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0.7
      });

      const text = response.choices[0]?.message?.content || '';
      console.log('✓ Successfully used Groq (fallback)');
      return { text, provider: 'Groq' };
    } catch (groqError) {
      console.error('✗ Groq also failed:', groqError.message);
      throw new Error('Both Together AI and Groq failed: ' + groqError.message);
    }
  } else {
    throw new Error('No API keys configured. Please add keys in Settings.');
  }
}

module.exports = { generate };
