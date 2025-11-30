#!/bin/bash

# ZK-Pub Installation Script
echo "🚀 Installing ZK-Pub Age Verification System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version $(node -v) detected"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Check if circom is installed globally
if ! command -v circom &> /dev/null; then
    echo "🔧 Installing circom globally..."
    npm install -g circom
else
    echo "✅ circom is already installed"
fi

# Check if snarkjs is installed globally
if ! command -v snarkjs &> /dev/null; then
    echo "🔧 Installing snarkjs globally..."
    npm install -g snarkjs
else
    echo "✅ snarkjs is already installed"
fi

# Setup API keys configuration
echo "🔑 Setting up API keys configuration..."
npm run zk:setup-keys

# Run setup tests
echo "🧪 Running setup tests..."
npm run zk:test

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Installation completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up your environment variables (see ZK_SETUP.md)"
    echo "2. Get an API Ninjas key for image-to-text extraction"
    echo "3. Configure your blockchain network settings"
    echo "4. Run 'npm run zk:compile' to compile the ZK circuit"
    echo "5. Run 'npm run dev' to start the development server"
    echo ""
    echo "🔗 Useful links:"
    echo "- API Ninjas: https://api-ninjas.com/"
    echo "- MetaMask: https://metamask.io/"
    echo "- Documentation: ZK_SETUP.md"
else
    echo "❌ Setup tests failed. Please check the error messages above."
    exit 1
fi
