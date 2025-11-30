import React, { useState, useRef } from 'react';
import { 
  generateProofFromImage, 
  downloadProofAsJSON,
  extractTextFromImage,
  parseBirthYearFromText 
} from '../zk/circuits/proofGenerator';

export default function AgeVerification() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [proofData, setProofData] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [parsedBirthYear, setParsedBirthYear] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setStatus('');
      setProofData(null);
      setExtractedText('');
      setParsedBirthYear(null);
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsProcessing(true);
    setStatus('Extracting text from image...');
    setError('');

    try {
      const text = await extractTextFromImage(selectedFile);
      setExtractedText(text);
      setStatus('Text extracted successfully!');
      
      // Try to parse birth year
      try {
        const birthYear = parseBirthYearFromText(text);
        setParsedBirthYear(birthYear);
        setStatus(`Text extracted and birth year found: ${birthYear}`);
      } catch (parseError) {
        setStatus('Text extracted, but could not find birth year. You can manually enter it below.');
      }
    } catch (error) {
      setError(`Failed to extract text: ${error.message}`);
      setStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateProof = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsProcessing(true);
    setStatus('Generating ZK proof...');
    setError('');

    try {
      const result = await generateProofFromImage(selectedFile, {
        minAge: 18,
        publicHash: '0x1234567890abcdef' // This should be user's wallet address
      });

      setProofData(result);
      setStatus('ZK proof generated and verified successfully!');
    } catch (error) {
      setError(`Failed to generate proof: ${error.message}`);
      setStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadProof = () => {
    if (proofData) {
      downloadProofAsJSON(proofData, 'age_verification_proof.json');
      setStatus('Proof downloaded successfully!');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setProofData(null);
    setExtractedText('');
    setParsedBirthYear(null);
    setError('');
    setStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Age Verification with ZK Proofs
        </h1>
        <p className="text-gray-600">
          Upload an image of your ID document to generate a zero-knowledge proof that you are 18+ 
          without revealing your actual birth date.
        </p>
      </div>

      {/* File Upload Section */}
      <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="mb-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {selectedFile ? selectedFile.name : 'Click to upload ID document image'}
              </span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Status Display */}
      {status && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          {status}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={handleExtractText}
          disabled={!selectedFile || isProcessing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Extract Text'}
        </button>
        
        <button
          onClick={handleGenerateProof}
          disabled={!selectedFile || isProcessing}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Generating...' : 'Generate ZK Proof'}
        </button>
        
        <button
          onClick={handleReset}
          disabled={isProcessing}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>

      {/* Extracted Text Display */}
      {extractedText && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Extracted Text:</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</p>
          {parsedBirthYear && (
            <p className="mt-2 text-sm font-medium text-green-600">
              Birth Year Found: {parsedBirthYear}
            </p>
          )}
        </div>
      )}

      {/* Proof Results */}
      {proofData && (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✅ ZK Proof Generated Successfully!
            </h3>
            <p className="text-sm text-green-700">
              Your age verification proof has been generated and verified locally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Proof Details */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Proof Details:</h4>
              <div className="text-sm space-y-1">
                <p><strong>Birth Year:</strong> {proofData.birthYear}</p>
                <p><strong>Age:</strong> {new Date().getFullYear() - proofData.birthYear}</p>
                <p><strong>Valid:</strong> {proofData.isValid ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Public Signals */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Public Signals:</h4>
              <div className="text-sm space-y-1">
                <p><strong>Min Age:</strong> {proofData.publicSignals[0]}</p>
                <p><strong>Current Year:</strong> {proofData.publicSignals[1]}</p>
                <p><strong>Public Hash:</strong> {proofData.publicSignals[2]}</p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={handleDownloadProof}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Download Proof JSON
            </button>
          </div>

          {/* Formatted Proof for Blockchain */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Formatted Proof (for Blockchain):</h4>
            <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
              {JSON.stringify(proofData.formattedProof, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">How it works:</h3>
        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
          <li>Upload an image of your ID document (driver's license, passport, etc.)</li>
          <li>Our system extracts text from the image using OCR</li>
          <li>We parse your birth year from the extracted text</li>
          <li>A zero-knowledge proof is generated proving you're 18+ without revealing your exact age</li>
          <li>Download the proof JSON file to use for registration</li>
        </ol>
      </div>
    </div>
  );
}
