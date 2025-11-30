import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthAPI } from '../services/api';
import { idDocumentService } from '../services/idDocumentService';
import { useAuth } from '../context/AuthContext';

export default function RegisterWithZKProof() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: ZK Proof, 3: Complete
  
  // Basic registration fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // ZK Proof fields
  const [hasZKProof, setHasZKProof] = useState(false);
  const [zkProofFile, setZkProofFile] = useState(null);
  const [zkProofHash, setZkProofHash] = useState('');
  
  // Image upload for ZK generation
  const [idImage, setIdImage] = useState(null);
  const [isGeneratingZK, setIsGeneratingZK] = useState(false);
  const [zkGenerationStatus, setZkGenerationStatus] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If user is already logged in, skip to ZK verification step
  useEffect(() => {
    if (user) {
      setName(user.username || '');
      setEmail(user.email || '');
      setStep(2); // Skip to ZK verification step
    }
  }, [user]);

  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setError('Please fill in all fields');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setIdImage(file);
      setError('');
    }
  };

  const generateZKProof = async () => {
    if (!idImage) {
      setError('Please upload an ID document first');
      return;
    }

    setIsGeneratingZK(true);
    setZkGenerationStatus('Processing your ID document...');
    setError('');

    try {
      // Use the ID document service to process the image and generate ZK proof
      const result = await idDocumentService.completeWorkflow(email, idImage);
      
      if (result.success) {
        setZkProofHash(result.data.zkProofHash);
        setHasZKProof(true);
        setZkGenerationStatus('✅ ZK proof generated successfully!');
        setStep(3);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(`Failed to generate ZK proof: ${error.message}`);
      setZkGenerationStatus('');
    } finally {
      setIsGeneratingZK(false);
    }
  };

  const handleZKProofUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const proofData = JSON.parse(e.target.result);
          // Extract hash from the proof data
          if (proofData.publicSignals && proofData.publicSignals.length > 0) {
            setZkProofHash(proofData.publicSignals[0]); // Assuming first public signal is the hash
            setHasZKProof(true);
            setStep(3);
            setError('');
          } else {
            setError('Invalid ZK proof file format');
          }
        } catch (error) {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFinalRegistration = async () => {
    if (!hasZKProof) {
      setError('ZK proof is required for registration');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (user) {
        // User is already logged in, just update their age verification status
        // This would typically be handled by a separate API endpoint
        // For now, we'll simulate updating the user's verification status
        setUser({
          ...user,
          isAgeVerified: true,
          zkProofHash: zkProofHash
        });
        navigate('/dashboard');
      } else {
        // New user registration
        await AuthAPI.register({ 
          username: name, 
          email, 
          password, 
          phone,
          zkProofHash: zkProofHash
        });
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-300">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'ZK Age Verification'}
              {step === 3 && 'Complete Registration'}
            </span>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-300">Enter your basic information to get started</p>
            </div>

            <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Continue to Age Verification
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: ZK Age Verification */}
        {step === 2 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Age Verification</h2>
              <p className="text-gray-300">Prove you are 18+ using zero-knowledge proofs</p>
            </div>

            <div className="space-y-6">
              {/* Option 1: Upload existing ZK proof */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">I already have a ZK proof</h3>
                <p className="text-gray-300 mb-4">Upload your existing ZK proof JSON file</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleZKProofUpload}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>

              {/* Option 2: Generate new ZK proof */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Generate new ZK proof</h3>
                <p className="text-gray-300 mb-4">Upload your ID document (Aadhar, Passport, etc.) to generate a ZK proof</p>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="id-upload" className="cursor-pointer">
                        <span className="text-white font-medium">
                          {idImage ? idImage.name : 'Click to upload ID document'}
                        </span>
                        <input
                          id="id-upload"
                          name="id-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>

                  {idImage && (
                    <button
                      onClick={generateZKProof}
                      disabled={isGeneratingZK}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      {isGeneratingZK ? 'Generating ZK Proof...' : 'Generate ZK Proof'}
                    </button>
                  )}

                  {zkGenerationStatus && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                      <p className="text-green-200 text-sm">{zkGenerationStatus}</p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Back
                </button>
                {hasZKProof && (
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Complete Registration */}
        {step === 3 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Register</h2>
              <p className="text-gray-300">Your ZK proof has been verified. Complete your registration.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-green-400 mr-3">🔒</div>
                  <div>
                    <p className="text-green-200 font-medium">Age Verification Complete</p>
                    <p className="text-green-300 text-sm">ZK proof hash: {zkProofHash.substring(0, 20)}...</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Registration Details:</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><span className="font-medium">Name:</span> {name}</p>
                  <p><span className="font-medium">Email:</span> {email}</p>
                  <p><span className="font-medium">Phone:</span> {phone}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalRegistration}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
