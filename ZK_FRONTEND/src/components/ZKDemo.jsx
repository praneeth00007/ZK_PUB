import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ZKDemo() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ZK-Pub: Age Verification with Zero-Knowledge Proofs
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Prove you're 18+ without revealing your actual age or personal information
        </p>
      </div>

      {/* How it Works Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="font-semibold mb-2">1. Connect Wallet</h3>
            <p className="text-sm text-gray-600">Connect your MetaMask wallet to begin</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold mb-2">2. Upload ID</h3>
            <p className="text-sm text-gray-600">Upload image of your ID document</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold mb-2">3. Extract & Verify</h3>
            <p className="text-sm text-gray-600">AI extracts text and generates ZK proof</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-semibold mb-2">4. Register</h3>
            <p className="text-sm text-gray-600">Proof verified on blockchain, ready to register</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600">🔒</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Privacy-Preserving</h3>
              <p className="text-sm text-gray-600">Your actual age and personal details are never revealed</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">⛓️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Blockchain Verified</h3>
              <p className="text-sm text-gray-600">Proofs are verified on-chain for maximum security</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">AI-Powered OCR</h3>
              <p className="text-sm text-gray-600">Automatically extracts information from ID documents</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-600">⚡</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Fast & Efficient</h3>
              <p className="text-sm text-gray-600">Quick verification process with minimal user interaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register-zk"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
          >
            Start Registration with ZK
          </Link>
          
          <Link
            to="/age-verification"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg"
          >
            Try Age Verification
          </Link>
        </div>
        
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          {showDemo ? 'Hide' : 'Show'} Technical Details
        </button>
      </div>

      {/* Technical Details */}
      {showDemo && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Zero-Knowledge Circuit</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Circom-based age verification circuit</li>
                <li>• Groth16 proof system</li>
                <li>• Poseidon hash function for commitments</li>
                <li>• Private inputs: birth year, salt</li>
                <li>• Public inputs: minimum age, current year</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Blockchain Integration</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Solidity verifier contract</li>
                <li>• MetaMask wallet integration</li>
                <li>• Ethereum mainnet/testnet support</li>
                <li>• Gas-optimized proof verification</li>
                <li>• Event logging for transparency</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">AI & OCR</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• API Ninjas image-to-text service</li>
                <li>• Automatic birth year extraction</li>
                <li>• Support for multiple ID formats</li>
                <li>• Error handling and validation</li>
                <li>• Privacy-preserving text processing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Security Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cryptographic proof verification</li>
                <li>• No storage of sensitive data</li>
                <li>• Tamper-proof blockchain records</li>
                <li>• Time-limited verification validity</li>
                <li>• Revocable verification system</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Getting Started</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Make sure you have MetaMask installed and connected</li>
          <li>Have a valid ID document (driver's license, passport, etc.) ready</li>
          <li>Click "Start Registration with ZK" to begin the process</li>
          <li>Follow the step-by-step verification process</li>
          <li>Once verified, you can register and purchase tickets</li>
        </ol>
      </div>
    </div>
  );
}
