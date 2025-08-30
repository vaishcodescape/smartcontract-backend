// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Error Messages
const ERROR_MESSAGES = {
  BLOCKCHAIN_NOT_READY: 'Blockchain connection not available. Please check your configuration.',
  INVALID_ADDRESS: 'Please provide a valid Ethereum address',
  INVALID_AMOUNT: 'Amount must be a positive number',
  INVALID_TRANSACTION_HASH: 'Please provide a valid transaction hash',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  ACCESS_DENIED: 'Access denied',
  NO_SUBSIDY_AVAILABLE: 'No subsidy balance to withdraw',
  NO_FUNDS_TO_WITHDRAW: 'Contract has no remaining funds',
  TRANSACTION_NOT_FOUND: 'Transaction hash not found on the blockchain'
};

// API Response Messages
const API_MESSAGES = {
  SUBSIDY_ADDED: 'Subsidy added successfully',
  SUBSIDY_WITHDRAWN: 'Subsidy withdrawn successfully',
  POOL_FUNDED: 'Pool funded successfully',
  REMAINING_FUNDS_WITHDRAWN: 'Remaining funds withdrawn successfully'
};

// Default Values
const DEFAULTS = {
  PORT: 3000,
  NETWORK: 'localhost',
  RPC_URL: 'http://127.0.0.1:8545',
  EVENTS_LIMIT: 10
};

// Network Configuration
const NETWORKS = {
  LOCALHOST: 'localhost',
  SEPOLIA: 'sepolia',
  MAINNET: 'mainnet'
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  API_MESSAGES,
  DEFAULTS,
  NETWORKS
};
