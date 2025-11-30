import { groth16 } from 'snarkjs';
import { API_KEYS, API_ENDPOINTS } from '../../config/apiKeys.js';

/**
 * Extract text from an image using API Ninjas
 * @param {File} imageFile - The image file to process
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(API_ENDPOINTS.API_NINJAS_IMAGE_TO_TEXT, {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEYS.API_NINJAS,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from the response
    if (data && data.length > 0) {
      return data.map(item => item.text).join(' ');
    }
    
    throw new Error('No text found in image');
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

/**
 * Parse birth year from extracted text
 * @param {string} text - Extracted text from ID document
 * @returns {number} - Birth year
 */
export function parseBirthYearFromText(text) {
  // Common patterns for birth year in ID documents
  const patterns = [
    /birth[:\s]*(\d{4})/i,
    /born[:\s]*(\d{4})/i,
    /date[:\s]*of[:\s]*birth[:\s]*(\d{4})/i,
    /(\d{4})[:\s]*birth/i,
    /(\d{4})[:\s]*born/i,
    // Look for 4-digit years between 1900-2010 (reasonable birth year range)
    /\b(19[5-9]\d|20[0-1]\d)\b/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const year = parseInt(match[1] || match[0]);
      if (year >= 1950 && year <= 2010) {
        return year;
      }
    }
  }

  throw new Error('Could not find valid birth year in the document');
}

/**
 * Generate age verification proof
 * @param {Object} inputs - Input parameters
 * @param {number} inputs.birthYear - User's birth year
 * @param {number} inputs.minAge - Minimum age required (default: 18)
 * @param {number} inputs.currentYear - Current year (default: current year)
 * @param {string} inputs.publicHash - Public hash (e.g., wallet address)
 * @returns {Promise<Object>} - Proof and public signals
 */
export async function generateAgeProof(inputs) {
  try {
    const {
      birthYear,
      minAge = 18,
      currentYear = new Date().getFullYear(),
      publicHash = '0x1234567890abcdef' // Default hash, should be user's wallet address
    } = inputs;

    // Validate inputs
    if (!birthYear || birthYear < 1950 || birthYear > 2010) {
      throw new Error('Invalid birth year');
    }

    if (minAge < 0 || minAge > 100) {
      throw new Error('Invalid minimum age');
    }

    // Generate random salt for privacy
    const salt = Math.floor(Math.random() * 2**32);

    // Prepare circuit inputs
    const circuitInputs = {
      birthYear: birthYear,
      salt: salt,
      minAge: minAge,
      currentYear: currentYear,
      publicHash: publicHash
    };

    // Load the circuit artifacts
    const wasmPath = '/zk/age18/age18.wasm';
    const zkeyPath = '/zk/age18/age18_final.zkey';

    // Generate proof
    const { proof, publicSignals } = await groth16.fullProve(
      circuitInputs,
      wasmPath,
      zkeyPath
    );

    return {
      proof,
      publicSignals,
      circuitInputs
    };
  } catch (error) {
    console.error('Error generating proof:', error);
    throw new Error(`Proof generation failed: ${error.message}`);
  }
}

/**
 * Verify age proof locally
 * @param {Object} proof - The ZK proof
 * @param {Array} publicSignals - Public signals
 * @returns {Promise<boolean>} - Verification result
 */
export async function verifyAgeProof(proof, publicSignals) {
  try {
    const vkeyPath = '/zk/age18/verification_key.json';
    
    const res = await groth16.verify(
      vkeyPath,
      publicSignals,
      proof
    );

    return res;
  } catch (error) {
    console.error('Error verifying proof:', error);
    return false;
  }
}

/**
 * Format proof for Solidity contract
 * @param {Object} proof - The ZK proof
 * @returns {Object} - Formatted proof for blockchain
 */
export function formatProofForSolidity(proof) {
  return {
    a: [proof.pi_a[0], proof.pi_a[1]],
    b: [
      [proof.pi_b[0][1], proof.pi_b[0][0]], // Note: b components are swapped
      [proof.pi_b[1][1], proof.pi_b[1][0]]
    ],
    c: [proof.pi_c[0], proof.pi_c[1]]
  };
}

/**
 * Complete workflow: Extract text from image and generate proof
 * @param {File} imageFile - The image file containing ID document
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Complete proof data
 */
export async function generateProofFromImage(imageFile, options = {}) {
  try {
    // Step 1: Extract text from image
    console.log('Extracting text from image...');
    const extractedText = await extractTextFromImage(imageFile);
    console.log('Extracted text:', extractedText);

    // Step 2: Parse birth year from text
    console.log('Parsing birth year...');
    const birthYear = parseBirthYearFromText(extractedText);
    console.log('Parsed birth year:', birthYear);

    // Step 3: Generate ZK proof
    console.log('Generating ZK proof...');
    const proofData = await generateAgeProof({
      birthYear,
      ...options
    });

    // Step 4: Verify proof locally
    console.log('Verifying proof locally...');
    const isValid = await verifyAgeProof(proofData.proof, proofData.publicSignals);
    
    if (!isValid) {
      throw new Error('Local verification failed');
    }

    // Step 5: Format for blockchain
    const formattedProof = formatProofForSolidity(proofData.proof);

    return {
      extractedText,
      birthYear,
      proof: proofData.proof,
      publicSignals: proofData.publicSignals,
      formattedProof,
      isValid,
      circuitInputs: proofData.circuitInputs
    };
  } catch (error) {
    console.error('Error in complete workflow:', error);
    throw error;
  }
}

/**
 * Download proof as JSON file
 * @param {Object} proofData - Complete proof data
 * @param {string} filename - Filename for download
 */
export function downloadProofAsJSON(proofData, filename = 'age_proof.json') {
  const dataStr = JSON.stringify(proofData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
}
