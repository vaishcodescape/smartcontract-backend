const express = require('express');
const router = express.Router();
const subsidyService = require('../services/subsidyService');
const { 
  validateSubsidyRequest, 
  validateFundPoolRequest, 
  validateAddressParam 
} = require('../middleware/validation');

// Get subsidy balance for a user
router.get('/balance/:address', validateAddressParam, async (req, res) => {
  try {
    const { address } = req.params;
    const data = await subsidyService.getSubsidyBalance(address);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting subsidy balance:', error);
    res.status(500).json({
      error: 'Failed to get subsidy balance',
      message: error.message
    });
  }
});

// Add subsidy for a user (owner only)
router.post('/add', validateSubsidyRequest, async (req, res) => {
  try {
    const { userAddress, amount } = req.body;
    const data = await subsidyService.addSubsidy(userAddress, amount);

    res.json({
      success: true,
      message: 'Subsidy added successfully',
      data
    });
  } catch (error) {
    console.error('Error adding subsidy:', error);
    
    if (error.message.includes('Only contract owner')) {
      return res.status(403).json({
        error: 'Access denied',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to add subsidy',
      message: error.message
    });
  }
});

// Withdraw subsidy for the connected wallet
router.post('/withdraw', async (req, res) => {
  try {
    const data = await subsidyService.withdrawSubsidy();

    res.json({
      success: true,
      message: 'Subsidy withdrawn successfully',
      data
    });
  } catch (error) {
    console.error('Error withdrawing subsidy:', error);
    
    if (error.message.includes('No subsidy balance')) {
      return res.status(400).json({
        error: 'No subsidy available',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to withdraw subsidy',
      message: error.message
    });
  }
});

// Get total subsidy pool balance
router.get('/pool-balance', async (req, res) => {
  try {
    const data = await subsidyService.getPoolBalance();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error getting pool balance:', error);
    res.status(500).json({
      error: 'Failed to get pool balance',
      message: error.message
    });
  }
});

// Fund the subsidy pool
router.post('/fund-pool', validateFundPoolRequest, async (req, res) => {
  try {
    const { amount } = req.body;
    const data = await subsidyService.fundPool(amount);

    res.json({
      success: true,
      message: 'Pool funded successfully',
      data
    });
  } catch (error) {
    console.error('Error funding pool:', error);
    res.status(500).json({
      error: 'Failed to fund pool',
      message: error.message
    });
  }
});

module.exports = router;
