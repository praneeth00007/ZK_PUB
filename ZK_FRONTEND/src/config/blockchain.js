// Blockchain and API configuration
export const CONFIG = {
  // API Configuration (now imported from apiKeys.js)
  IMAGE_TO_TEXT_API: 'https://api.api-ninjas.com/v1/imagetotext',
  
  // Blockchain Configuration
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID || '0x1',
  CHAIN_NAME: import.meta.env.VITE_CHAIN_NAME || 'Ethereum Mainnet',
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
  BLOCK_EXPLORER: import.meta.env.VITE_BLOCK_EXPLORER || 'https://etherscan.io',
  
  // ZK Configuration
  CIRCUIT_NAME: 'age18',
  MIN_AGE_REQUIRED: 18,
  
  // Development
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  DEBUG: import.meta.env.VITE_DEBUG === 'true'
};

// Network configuration for MetaMask
export const NETWORK_CONFIG = {
  chainId: CONFIG.CHAIN_ID,
  chainName: CONFIG.CHAIN_NAME,
  rpcUrls: [CONFIG.RPC_URL],
  blockExplorerUrls: [CONFIG.BLOCK_EXPLORER]
};

export default CONFIG;
