const { ethers } = require('ethers');
const { isBlockchainReady, getBlockchainInstances } = require('../config/database');

class SubsidyService {
  constructor() {}

  async getSubsidyBalance(address) {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract } = getBlockchainInstances();
    const balance = await contract.getSubsidy(address);
    
    return {
      address: address,
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString()
    };
  }

  async addSubsidy(userAddress, amount) {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract, wallet } = getBlockchainInstances();
    
    // Convert amount to Wei
    const amountWei = ethers.parseEther(amount.toString());
    
    // Check if caller is owner
    const owner = await contract.owner();
    if (wallet.address.toLowerCase() !== owner.toLowerCase()) {
      throw new Error('Only contract owner can add subsidies');
    }

    const tx = await contract.addSubsidy(userAddress, amountWei);
    await tx.wait();

    return {
      userAddress,
      amount: amount,
      amountWei: amountWei.toString(),
      transactionHash: tx.hash
    };
  }

  async withdrawSubsidy() {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract, wallet } = getBlockchainInstances();
    
    // Check current balance
    const balance = await contract.getSubsidy(wallet.address);
    if (balance.toString() === '0') {
      throw new Error('No subsidy balance to withdraw');
    }

    const tx = await contract.withdrawSubsidy();
    await tx.wait();

    return {
      amount: ethers.formatEther(balance),
      amountWei: balance.toString(),
      transactionHash: tx.hash
    };
  }

  async getPoolBalance() {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract } = getBlockchainInstances();
    const poolBalance = await contract.totalSubsidyPool();
    
    return {
      poolBalance: ethers.formatEther(poolBalance),
      poolBalanceWei: poolBalance.toString()
    };
  }

  async fundPool(amount) {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract } = getBlockchainInstances();
    
    // Convert amount to Wei
    const amountWei = ethers.parseEther(amount.toString());
    
    const tx = await contract.fundSubsidyPool({ value: amountWei });
    await tx.wait();

    return {
      amount: amount,
      amountWei: amountWei.toString(),
      transactionHash: tx.hash
    };
  }
}

module.exports = new SubsidyService();
