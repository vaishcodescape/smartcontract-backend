const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');

// Contract ABI and address with better error handling
let CONTRACT_ABI, CONTRACT_ADDRESS;

try {
  const contractPath = path.join(__dirname, '../../Smart_Contracts/artifacts/contracts/UdavitGreenHydrogen.sol/UdavitGreenHydrogen.json');
  if (fs.existsSync(contractPath)) {
    CONTRACT_ABI = require(contractPath).abi;
  } else {
    console.warn('Contract ABI not found at:', contractPath);
    CONTRACT_ABI = null;
  }
} catch (error) {
  console.warn('Failed to load contract ABI:', error.message);
  CONTRACT_ABI = null;
}

CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Initialize provider and contract
let provider, contract, wallet;

// Initialize blockchain connection
const initializeBlockchain = async () => {
  try {
    // Check if required environment variables are set
    if (!process.env.PRIVATE_KEY) {
      console.warn('PRIVATE_KEY not set in environment variables');
      return;
    }

    if (!CONTRACT_ABI) {
      console.warn('Contract ABI not available');
      return;
    }

    // You can use different networks - update as needed
    const network = process.env.NETWORK || 'localhost';
    
    if (network === 'localhost') {
      provider = new ethers.JsonRpcProvider(process.env.CUSTOM_RPC_URL || 'http://127.0.0.1:8545');
    } else if (network === 'sepolia') {
      if (!process.env.INFURA_PROJECT_ID) {
        console.warn('INFURA_PROJECT_ID not set for Sepolia network');
        return;
      }
      provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
    } else if (network === 'mainnet') {
      if (!process.env.INFURA_PROJECT_ID) {
        console.warn('INFURA_PROJECT_ID not set for Mainnet network');
        return;
      }
      provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
    }

    // Initialize wallet with private key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey === 'your_private_key_here') {
      console.warn('Invalid private key in environment variables');
      return;
    }
    
    wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    
    console.log('Blockchain connection initialized successfully');
  } catch (error) {
    console.error('Failed to initialize blockchain connection:', error);
  }
};

// Helper function to check if blockchain is ready
const isBlockchainReady = () => {
  return provider && contract && wallet && CONTRACT_ABI;
};

// Get blockchain instances
const getBlockchainInstances = () => {
  return { provider, contract, wallet };
};

module.exports = {
  initializeBlockchain,
  isBlockchainReady,
  getBlockchainInstances,
  CONTRACT_ADDRESS,
  CONTRACT_ABI
};
