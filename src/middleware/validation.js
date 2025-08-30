const { ethers } = require('ethers');

// Validate Ethereum address
const validateAddress = (address) => {
  return ethers.isAddress(address);
};

// Validate amount
const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

// Validate transaction hash
const validateTransactionHash = (txHash) => {
  return ethers.isHexString(txHash, 32);
};

// Middleware for validating subsidy requests
const validateSubsidyRequest = (req, res, next) => {
  const { userAddress, amount } = req.body;
  
  if (!userAddress || !amount) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'userAddress and amount are required'
    });
  }

  if (!validateAddress(userAddress)) {
    return res.status(400).json({
      error: 'Invalid address',
      message: 'Please provide a valid Ethereum address'
    });
  }

  if (!validateAmount(amount)) {
    return res.status(400).json({
      error: 'Invalid amount',
      message: 'Amount must be a positive number'
    });
  }

  next();
};

// Middleware for validating fund pool requests
const validateFundPoolRequest = (req, res, next) => {
  const { amount } = req.body;
  
  if (!amount) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'amount is required'
    });
  }

  if (!validateAmount(amount)) {
    return res.status(400).json({
      error: 'Invalid amount',
      message: 'Amount must be a positive number'
    });
  }

  next();
};

// Middleware for validating address parameter
const validateAddressParam = (req, res, next) => {
  const { address } = req.params;
  
  if (!validateAddress(address)) {
    return res.status(400).json({
      error: 'Invalid address',
      message: 'Please provide a valid Ethereum address'
    });
  }

  next();
};

// Middleware for validating transaction hash parameter
const validateTransactionHashParam = (req, res, next) => {
  const { txHash } = req.params;
  
  if (!validateTransactionHash(txHash)) {
    return res.status(400).json({
      error: 'Invalid transaction hash',
      message: 'Please provide a valid transaction hash'
    });
  }

  next();
};

module.exports = {
  validateAddress,
  validateAmount,
  validateTransactionHash,
  validateSubsidyRequest,
  validateFundPoolRequest,
  validateAddressParam,
  validateTransactionHashParam
};
