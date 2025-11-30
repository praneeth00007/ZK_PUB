import React, { useState, useEffect } from 'react';
import { blockchainService } from '../services/blockchain';
import { idDocumentService } from '../services/idDocumentService';
import { generateProofFromImage } from '../zk/circuits/proofGenerator';

export default function RegisterWithZK() {
  const [step, setStep] = useState(1); // 1: Connect Wallet, 2: Upload ID, 3: Generate Proof, 4: Verify on Blockchain, 5: Complete
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [proofData, setProofData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);

  // Check if user is already verified on page load
  useEffect(() => {
    checkExistingVerification();
  }, []);

  const checkExistingVerification = async () => {
    try {
      const result = await blockchainService.checkUserVerification();
      if (result.success && result.isVerified) {
        setVerificationStatus(result.verificationData);
        setStep(5); // User already verified
      }
    } catch (error) {
      // User not connected or not verified, continue with normal flow
      console.log('No existing verification found');
    }
  };

  const handleConnectWallet = async () => {
    setIsProcessing(true);
    setError('');
    setStatus('Connecting to wallet...');

    try {
      const result = await blockchainService.connectWallet();
      
      if (result.success) {
        setWalletConnected(true);
        setWalletAddress(result.address);
        setStatus('Wallet connected successfully!');
        setStep(2);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(`Failed to connect wallet: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setStatus('File selected. Ready to generate proof.');
    }
  };

  const handleGenerateProof = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsProcessing(true);
    setError('');
    setStatus('Processing your ID document through backend...');

    try {
      // Use backend service for complete workflow
      const result = await idDocumentService.completeWorkflow(walletAddress, selectedFile);
      
      if (result.success) {
        setProofData(result.data);
        setStatus('ID document processed and ZK proof generated successfully!');
        setStep(4);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(`Failed to process document: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOnBlockchain = async () => {
    if (!proofData) {
      setError('No proof data available');
      return;
    }

    setIsProcessing(true);
    setError('');
    setStatus('Verifying proof on blockchain...');

    try {
      const result = await blockchainService.verifyAgeOnBlockchain(proofData);
      
      if (result.success) {
        setStatus('Proof verified on blockchain successfully!');
        setStep(5);
        
        // Get updated verification status
        const verificationResult = await blockchainService.checkUserVerification();
        if (verificationResult.success) {
          setVerificationStatus(verificationResult.verificationData);
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(`Failed to verify on blockchain: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setWalletConnected(false);
    setWalletAddress('');
    setSelectedFile(null);
    setProofData(null);
    setVerificationStatus(null);
    setError('');
    setStatus('');
    blockchainService.disconnect();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600">
                First, connect your MetaMask wallet to begin the age verification process.
              </p>
            </div>
            
            <button
              onClick={handleConnectWallet}
              disabled={isProcessing}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isProcessing ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Upload ID Document
              </h2>
              <p className="text-gray-600 mb-4">
                Upload an image of your ID document (driver's license, passport, etc.)
              </p>
              <p className="text-sm text-gray-500">
                Connected wallet: <span className="font-mono">{walletAddress}</span>
              </p>
            </div>

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

            <div className="flex gap-4">
              <button
                onClick={handleGenerateProof}
                disabled={!selectedFile || isProcessing}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Generate ZK Proof'}
              </button>
              
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verify on Blockchain
              </h2>
              <p className="text-gray-600">
                Your ZK proof has been generated. Now let's verify it on the blockchain.
              </p>
            </div>

            {proofData && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Proof Generated Successfully!</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Birth Year:</strong> {proofData.birthYear}</p>
                  <p><strong>Age:</strong> {new Date().getFullYear() - proofData.birthYear}</p>
                  <p><strong>Valid:</strong> {proofData.isValid ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleVerifyOnBlockchain}
                disabled={isProcessing}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Verifying...' : 'Verify on Blockchain'}
              </button>
              
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Age Verification Complete!
              </h2>
              <p className="text-gray-600">
                You have successfully verified your age using zero-knowledge proofs.
              </p>
            </div>

            {verificationStatus && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Verification Details:</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Wallet Address:</strong> <span className="font-mono">{walletAddress}</span></p>
                  <p><strong>Verified:</strong> {verificationStatus.isVerified ? 'Yes' : 'No'}</p>
                  <p><strong>Minimum Age:</strong> {verificationStatus.minAge}</p>
                  <p><strong>Verification Year:</strong> {verificationStatus.currentYear}</p>
                  <p><strong>Timestamp:</strong> {new Date(parseInt(verificationStatus.timestamp) * 1000).toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={handleStartOver}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium ml-4"
              >
                Start Over
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 5 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Connect</span>
          <span>Upload ID</span>
          <span>Generate</span>
          <span>Verify</span>
          <span>Complete</span>
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

      {/* Step Content */}
      {renderStep()}
    </div>
  );
}
