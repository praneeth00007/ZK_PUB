import { ethers } from 'ethers';

// Contract ABI for AgeVerificationSystem
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_verifier", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "commitment", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "minAge", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "currentYear", "type": "uint256"}
    ],
    "name": "UserVerified",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "canRegister",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getUserVerification",
    "outputs": [
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "uint256", "name": "commitment", "type": "uint256"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "minAge", "type": "uint256"},
      {"internalType": "uint256", "name": "currentYear", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "isUserVerified",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint8[8]", "name": "proof", "type": "uint8[8]"},
      {"internalType": "uint[2]", "name": "publicInputs", "type": "uint[2]"},
      {"internalType": "uint256", "name": "commitment", "type": "uint256"}
    ],
    "name": "verifyAge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract configuration
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
const NETWORK_CONFIG = {
  // Add your network configuration here
  chainId: import.meta.env.VITE_CHAIN_ID || '0x1', // Ethereum mainnet
  chainName: import.meta.env.VITE_CHAIN_NAME || 'Ethereum Mainnet',
  rpcUrls: [import.meta.env.VITE_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
  blockExplorerUrls: [import.meta.env.VITE_BLOCK_EXPLORER || 'https://etherscan.io']
};

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
  }

  /**
   * Connect to MetaMask or other Web3 provider
   */
  async connectWallet() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Get network and switch if needed
        const network = await this.provider.getNetwork();
        if (network.chainId.toString() !== NETWORK_CONFIG.chainId) {
          await this.switchNetwork();
        }
        
        // Initialize contract
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
        this.isConnected = true;
        
        return {
          success: true,
          address: await this.signer.getAddress(),
          network: network.name
        };
      } else {
        throw new Error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Switch to the required network
   */
  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG],
          });
        } catch (addError) {
          throw new Error('Failed to add network');
        }
      } else {
        throw new Error('Failed to switch network');
      }
    }
  }

  /**
   * Verify age proof on blockchain
   * @param {Object} proofData - The proof data from generateProofFromImage
   * @returns {Promise<Object>} - Transaction result
   */
  async verifyAgeOnBlockchain(proofData) {
    if (!this.isConnected || !this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const { formattedProof, publicSignals, circuitInputs } = proofData;
      
      // Prepare proof for contract
      const proof = [
        formattedProof.a[0],
        formattedProof.a[1],
        formattedProof.b[0][0],
        formattedProof.b[0][1],
        formattedProof.b[1][0],
        formattedProof.b[1][1],
        formattedProof.c[0],
        formattedProof.c[1]
      ];

      // Prepare public inputs
      const publicInputs = [
        publicSignals[0], // minAge
        publicSignals[1]  // currentYear
      ];

      // Get commitment from circuit inputs
      const commitment = circuitInputs.salt; // This should be the hash commitment

      // Call the contract
      const tx = await this.contract.verifyAge(proof, publicInputs, commitment);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error verifying proof on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user is verified on blockchain
   * @param {string} address - User's wallet address
   * @returns {Promise<Object>} - Verification status
   */
  async checkUserVerification(address = null) {
    if (!this.isConnected || !this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const userAddress = address || await this.signer.getAddress();
      
      const [isVerified, verificationData] = await Promise.all([
        this.contract.isUserVerified(userAddress),
        this.contract.getUserVerification(userAddress)
      ]);

      return {
        success: true,
        isVerified,
        verificationData: {
          isVerified: verificationData[0],
          commitment: verificationData[1].toString(),
          timestamp: verificationData[2].toString(),
          minAge: verificationData[3].toString(),
          currentYear: verificationData[4].toString()
        }
      };
    } catch (error) {
      console.error('Error checking user verification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user can register (age verified)
   * @param {string} address - User's wallet address
   * @returns {Promise<Object>} - Registration eligibility
   */
  async canUserRegister(address = null) {
    if (!this.isConnected || !this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const userAddress = address || await this.signer.getAddress();
      const canRegister = await this.contract.canRegister(userAddress);

      return {
        success: true,
        canRegister
      };
    } catch (error) {
      console.error('Error checking registration eligibility:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get current wallet address
   * @returns {Promise<string>} - Wallet address
   */
  async getCurrentAddress() {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.signer.getAddress();
  }

  /**
   * Get current network
   * @returns {Promise<Object>} - Network information
   */
  async getCurrentNetwork() {
    if (!this.provider) {
      throw new Error('Provider not connected');
    }
    return await this.provider.getNetwork();
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;
