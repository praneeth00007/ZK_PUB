un dev# ZK Age Verification Setup Guide

This guide will help you set up the zero-knowledge age verification system for the ZK-Pub project.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **API Ninjas Key** for image-to-text extraction
4. **Circom** and **snarkjs** for ZK circuit compilation

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Circom and snarkjs globally

```bash
npm install -g circom snarkjs
```

### 3. API Keys Configuration

The system uses a centralized API keys configuration file for security:

```bash
# Setup API keys configuration
npm run zk:setup-keys
```

This will create `src/config/apiKeys.js` from the template. Edit this file and add your actual API keys:

```javascript
export const API_KEYS = {
  // API Ninjas - Image to Text OCR (Required)
  API_NINJAS: 'Yq2RTy89hZ1ucsqvCqQotA==gn0wjsRcpLX8G834',
  
  // Other optional API keys
  OPENAI: 'your_openai_key_here',
  GOOGLE_VISION: 'your_google_vision_key_here',
};
```

**Important**: The `apiKeys.js` file is automatically excluded from version control for security.

### 4. Environment Configuration

Create a `.env` file in the root directory for blockchain configuration:

```env
# Blockchain Configuration
REACT_APP_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
REACT_APP_CHAIN_ID=0x1
REACT_APP_CHAIN_NAME=Ethereum Mainnet
REACT_APP_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
REACT_APP_BLOCK_EXPLORER=https://etherscan.io

# Development
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

## ZK Circuit Setup

### 1. Compile the Circuit

```bash
npm run zk:compile
```

This will:
- Compile the `age18.circom` circuit
- Generate R1CS, WASM, and symbol files
- Perform trusted setup ceremony
- Generate proving and verification keys
- Export Solidity verifier contract

### 2. Verify Setup

```bash
npm run zk:verify
```

## Project Structure

```
ZK_FRONTEND/
├── src/
│   ├── zk/
│   │   ├── circuits/
│   │   │   └── proofGenerator.js      # ZK proof generation utilities
│   │   └── scripts/
│   │       └── compileCircuit.js      # Circuit compilation script
│   ├── components/
│   │   ├── AgeVerification.jsx        # Standalone age verification component
│   │   └── RegisterWithZK.jsx         # Complete registration flow with ZK
│   ├── services/
│   │   └── blockchain.js              # Blockchain integration service
│   └── config/
│       └── blockchain.js              # Configuration constants
├── contracts/
│   ├── Verifier.sol                   # Auto-generated ZK verifier
│   └── AgeVerifier.sol                # Age verification system contract
├── public/zk/age18/                   # ZK circuit artifacts
│   ├── age18.wasm                     # Compiled circuit
│   ├── age18_final.zkey               # Final proving key
│   └── verification_key.json          # Verification key
└── zkk/
    └── age18.circom                   # ZK circuit definition
```

## Usage

### 1. Age Verification Flow

1. **Connect Wallet**: User connects MetaMask wallet
2. **Upload ID**: User uploads image of ID document
3. **Extract Text**: System extracts text using API Ninjas OCR
4. **Parse Birth Year**: System parses birth year from extracted text
5. **Generate Proof**: ZK proof is generated proving age ≥ 18
6. **Verify on Blockchain**: Proof is verified on smart contract
7. **Registration Complete**: User can now register and buy tickets

### 2. API Integration

The system integrates with:
- **API Ninjas**: For image-to-text extraction
- **MetaMask**: For wallet connection
- **Smart Contract**: For proof verification on blockchain

### 3. Components

#### AgeVerification.jsx
Standalone component for age verification with ZK proofs.

#### RegisterWithZK.jsx
Complete registration flow that includes:
- Wallet connection
- ID document upload
- ZK proof generation
- Blockchain verification
- Registration completion

## Smart Contract Deployment

### 1. Deploy Verifier Contract

```bash
# Deploy the auto-generated Verifier contract
npx hardhat run scripts/deployVerifier.js --network <network>
```

### 2. Deploy Age Verification System

```bash
# Deploy the main AgeVerificationSystem contract
npx hardhat run scripts/deployAgeVerification.js --network <network>
```

### 3. Update Configuration

Update the contract address in your environment variables and configuration files.

## Testing

### 1. Local Testing

```bash
npm run dev
```

Navigate to `/age-verification` to test the ZK proof generation.

### 2. Circuit Testing

```bash
npm run zk:verify
```

### 3. Blockchain Testing

1. Connect MetaMask to testnet
2. Deploy contracts to testnet
3. Test complete flow on testnet

## Security Considerations

1. **API Key Security**: Keep your API Ninjas key secure
2. **Private Keys**: Never expose private keys in frontend code
3. **Circuit Security**: The current circuit uses simplified hash functions - use proper Poseidon in production
4. **Trusted Setup**: The current setup uses a simple ceremony - use proper trusted setup for production

## Troubleshooting

### Common Issues

1. **Circuit Compilation Fails**
   - Ensure circom and snarkjs are installed globally
   - Check circuit syntax in `age18.circom`

2. **API Key Issues**
   - Verify API Ninjas key is correct
   - Check API quota and limits

3. **MetaMask Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Check network configuration

4. **Proof Generation Fails**
   - Verify circuit artifacts are in correct location
   - Check input validation in proof generator

### Debug Mode

Enable debug mode by setting `REACT_APP_DEBUG=true` in your environment variables.

## Production Deployment

1. **Use Production API Keys**
2. **Deploy to Mainnet**
3. **Use Proper Trusted Setup**
4. **Implement Proper Access Control**
5. **Add Rate Limiting**
6. **Implement Proper Error Handling**

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review circuit compilation logs
3. Verify API and blockchain configurations
4. Test with sample data first
