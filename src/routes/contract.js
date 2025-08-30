const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');
const { 
  validateAddressParam, 
  validateTransactionHashParam 
} = require('../middleware/validation');

// Get contract information
router.get('/info', async (req, res) => {
  try {
    const data = await contractService.getContractInfo();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting contract info:', error);
    res.status(500).json({
      error: 'Failed to get contract information',
      message: error.message
    });
  }
});

// Get contract owner
router.get('/owner', async (req, res) => {
  try {
    const data = await contractService.getContractOwner();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting contract owner:', error);
    res.status(500).json({
      error: 'Failed to get contract owner',
      message: error.message
    });
  }
});

// Check if an address is the contract owner
router.get('/is-owner/:address', validateAddressParam, async (req, res) => {
  try {
    const { address } = req.params;
    const data = await contractService.checkOwnerStatus(address);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error checking owner status:', error);
    res.status(500).json({
      error: 'Failed to check owner status',
      message: error.message
    });
  }
});

// Withdraw remaining funds from contract (owner only)
router.post('/withdraw-remaining', async (req, res) => {
  try {
    const data = await contractService.withdrawRemainingFunds();

    res.json({
      success: true,
      message: 'Remaining funds withdrawn successfully',
      data
    });
  } catch (error) {
    console.error('Error withdrawing remaining funds:', error);
    
    if (error.message.includes('Only contract owner')) {
      return res.status(403).json({
        error: 'Access denied',
        message: error.message
      });
    }
    
    if (error.message.includes('no remaining funds')) {
      return res.status(400).json({
        error: 'No funds to withdraw',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to withdraw remaining funds',
      message: error.message
    });
  }
});

// Get contract events (recent transactions)
router.get('/events', async (req, res) => {
  try {
    const { fromBlock = 'latest', toBlock = 'latest', limit = 10 } = req.query;
    const data = await contractService.getContractEvents(fromBlock, toBlock, limit);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting contract events:', error);
    res.status(500).json({
      error: 'Failed to get contract events',
      message: error.message
    });
  }
});

// Get transaction status
router.get('/transaction/:txHash', validateTransactionHashParam, async (req, res) => {
  try {
    const { txHash } = req.params;
    const data = await contractService.getTransactionStatus(txHash);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting transaction status:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Transaction not found',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to get transaction status',
      message: error.message
    });
  }
});

module.exports = router;
