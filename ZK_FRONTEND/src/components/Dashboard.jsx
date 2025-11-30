import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { idDocumentService } from '../services/idDocumentService';
import DownloadZKProof from './DownloadZKProof';

export default function Dashboard() {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    checkVerificationStatus();
  }, [user]);

  const checkVerificationStatus = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const result = await idDocumentService.isUserAgeVerified(user.email);
      setIsVerified(result.success && result.data);
      setLoading(false);
    } catch (error) {
      console.error('Error checking verification status:', error);
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setStatus('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setStatus('File selected. Ready to upload.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.email) {
      setStatus('Please select a file and ensure you are logged in');
      return;
    }

    setUploading(true);
    setStatus('Uploading and processing your ID document...');

    try {
      const result = await idDocumentService.completeWorkflow(user.email, selectedFile);
      
      if (result.success) {
        setStatus('✅ Age verification completed successfully!');
        setIsVerified(true);
        setShowUpload(false);
        setSelectedFile(null);
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to ZK Pub
          </h1>
          <p className="text-xl text-blue-200">
            {user ? `Hello, ${user.name || user.email}!` : 'Please log in to continue'}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!user ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
              <p className="text-gray-300 mb-6">You need to be logged in to access the dashboard.</p>
              <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Go to Login
              </a>
            </div>
          ) : isVerified ? (
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-8 border border-green-500/50 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-white mb-4">Age Verified!</h2>
              <p className="text-gray-300 mb-6">
                Your age has been verified using zero-knowledge proofs. You can now purchase event tickets.
              </p>
              <div className="space-y-4">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mr-4">
                  Browse Events
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  My Tickets
                </button>
              </div>
              
              {/* Download ZK Proof Section */}
              <div className="mt-8">
                <DownloadZKProof userId={user.email} />
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-white mb-4">Age Verification Required</h2>
                <p className="text-gray-300 mb-6">
                  To purchase event tickets, you need to verify that you are 18+ using our zero-knowledge proof system.
                </p>
              </div>

              {!showUpload ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowUpload(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Start Age Verification
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-4">Upload Your ID Document</h3>
                    <p className="text-gray-300 mb-6">
                      Upload an image of your driver's license, passport, or other government-issued ID.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-white font-medium">
                          {selectedFile ? selectedFile.name : 'Click to upload ID document'}
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
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>

                  {status && (
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                      <p className="text-blue-200 text-sm">{status}</p>
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      {uploading ? 'Processing...' : 'Upload & Verify'}
                    </button>
                    
                    <button
                      onClick={() => setShowUpload(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


