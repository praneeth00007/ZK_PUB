import React, { useState } from 'react';
import { idDocumentService } from '../services/idDocumentService';

export default function DownloadZKProof({ userId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleDownloadProof = async () => {
    if (!userId) {
      setStatus('User ID is required');
      return;
    }

    setLoading(true);
    setStatus('Generating ZK proof...');

    try {
      // Get user's document
      const documentResult = await idDocumentService.getDocumentByUserId(userId);
      
      if (!documentResult.success) {
        throw new Error('No document found for user');
      }

      const document = documentResult.data;
      
      if (!document.zkProofData) {
        throw new Error('No ZK proof available for this user');
      }

      // Create downloadable JSON file
      const proofData = {
        userId: userId,
        documentId: document.id,
        zkProofHash: document.zkProofHash,
        zkProofData: JSON.parse(document.zkProofData),
        isVerified: document.isAgeVerified,
        verificationDate: document.verificationDate,
        blockchainTxHash: document.blockchainTxHash
      };

      // Download the file
      const dataStr = JSON.stringify(proofData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `zk_proof_${userId}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(link.href);
      
      setStatus('✅ ZK proof downloaded successfully!');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Download ZK Proof</h3>
      <p className="text-gray-300 mb-4">
        Download your zero-knowledge proof as a JSON file. This file contains your 
        cryptographic proof of age verification without revealing your actual age.
      </p>
      
      {status && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-200 text-sm">{status}</p>
        </div>
      )}
      
      <button
        onClick={handleDownloadProof}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        {loading ? 'Generating...' : 'Download ZK Proof'}
      </button>
    </div>
  );
}
