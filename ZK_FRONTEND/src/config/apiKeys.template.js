// API Keys Configuration Template
// Copy this file to apiKeys.js and fill in your actual API keys
// IMPORTANT: Never commit apiKeys.js to version control

export const API_KEYS = {
  // API Ninjas - Image to Text OCR
  // Get your key from: https://api-ninjas.com/
  API_NINJAS: 'your_api_ninjas_key_here',
  
  // OpenAI API (if needed for advanced text processing)
  // Get your key from: https://platform.openai.com/
  OPENAI: 'your_openai_key_here',
  
  // Google Vision API (alternative OCR service)
  // Get your key from: https://cloud.google.com/vision
  GOOGLE_VISION: 'your_google_vision_key_here',
  
  // AWS Rekognition (alternative OCR service)
  // Get your key from: https://aws.amazon.com/rekognition/
  AWS_REKOGNITION: 'your_aws_rekognition_key_here',
  
  // Blockchain RPC endpoints
  INFURA: import.meta.env.VITE_INFURA_KEY || 'your_infura_key_here',
  ALCHEMY: import.meta.env.VITE_ALCHEMY_KEY || 'your_alchemy_key_here',
};

// API Endpoints
export const API_ENDPOINTS = {
  API_NINJAS_IMAGE_TO_TEXT: 'https://api.api-ninjas.com/v1/imagetotext',
  OPENAI_CHAT: 'https://api.openai.com/v1/chat/completions',
  GOOGLE_VISION: 'https://vision.googleapis.com/v1/images:annotate',
  AWS_REKOGNITION: 'https://rekognition.us-east-1.amazonaws.com/',
};

// Configuration validation
export const validateApiKeys = () => {
  const missing = [];
  
  if (!API_KEYS.API_NINJAS || API_KEYS.API_NINJAS === 'your_api_ninjas_key_here') {
    missing.push('API_NINJAS');
  }
  
  if (missing.length > 0) {
    console.warn('Missing API keys:', missing);
    return false;
  }
  
  return true;
};

export default API_KEYS;
