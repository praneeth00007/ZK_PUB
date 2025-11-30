import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header with User Info */}
      {user && (
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-white">
              <span className="text-lg font-semibold">Welcome back, {user.username || user.email}!</span>
              {user.isAgeVerified && (
                <span className="ml-2 text-green-400 text-sm">✅ Age Verified</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-4">
              ZK Pub
            </h1>
            <p className="text-xl text-blue-200 mb-8">
              Zero-Knowledge Age Verification for Event Tickets
            </p>
          </div>

          {/* Main Description */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-gray-300 leading-relaxed">
              Welcome to ZK Pub - the future of age verification! Prove you're 18+ without revealing 
              your actual age or personal information using cutting-edge zero-knowledge cryptography.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">Privacy First</h3>
              <p className="text-gray-300">Your personal information stays private. Only prove you're 18+.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">Quick verification process with instant results.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Blockchain Secured</h3>
              <p className="text-gray-300">Tamper-proof verification using blockchain technology.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
                
                {!user.isAgeVerified && (
                  <Link
                    to="/register-zk-proof"
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Complete Age Verification
                  </Link>
                )}
                
                {user.isAgeVerified && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Browse Events
                  </button>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Login
                </Link>
                
                <Link
                  to="/register-zk-proof"
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Register with ZK Proof
                </Link>
                
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Basic Register
                </Link>
              </>
            )}
          </div>

          {/* How it Works */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Upload ID</h3>
                <p className="text-gray-300 text-sm">Upload your ID document image</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Processing</h3>
                <p className="text-gray-300 text-sm">AI extracts and verifies your age</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">ZK Proof</h3>
                <p className="text-gray-300 text-sm">Generate cryptographic proof</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Buy Tickets</h3>
                <p className="text-gray-300 text-sm">Purchase event tickets instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <p>&copy; 2024 ZK Pub. Built with Zero-Knowledge Proofs and Privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
