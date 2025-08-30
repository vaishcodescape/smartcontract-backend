const { ethers } = require('ethers');
const { isBlockchainReady, getBlockchainInstances, CONTRACT_ADDRESS } = require('../config/database');

class ContractService {
  constructor() {}

  async getContractInfo() {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract, provider } = getBlockchainInstances();
    
    const owner = await contract.owner();
    const totalSubsidyPool = await contract.totalSubsidyPool();
    const contractBalance = await provider.getBalance(CONTRACT_ADDRESS);

    return {
      contractAddress: CONTRACT_ADDRESS,
      owner: owner,
      totalSubsidyPool: ethers.formatEther(totalSubsidyPool),
      totalSubsidyPoolWei: totalSubsidyPool.toString(),
      contractBalance: ethers.formatEther(contractBalance),
      contractBalanceWei: contractBalance.toString(),
      network: process.env.NETWORK || 'localhost'
    };
  }

  async getContractOwner() {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract } = getBlockchainInstances();
    const owner = await contract.owner();
    
    return { owner };
  }

  async checkOwnerStatus(address) {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract } = getBlockchainInstances();
    const owner = await contract.owner();
    const isOwner = address.toLowerCase() === owner.toLowerCase();
    
    return {
      address: address,
      isOwner: isOwner,
      owner: owner
    };
  }

  async withdrawRemainingFunds() {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract, provider, wallet } = getBlockchainInstances();
    
    // Check if caller is owner
    const owner = await contract.owner();
    if (wallet.address.toLowerCase() !== owner.toLowerCase()) {
      throw new Error('Only contract owner can withdraw remaining funds');
    }

    // Check contract balance
    const contractBalance = await provider.getBalance(CONTRACT_ADDRESS);
    if (contractBalance.toString() === '0') {
      throw new Error('Contract has no remaining funds');
    }

    const tx = await contract.withdrawRemaining();
    await tx.wait();

    return {
      amount: ethers.formatEther(contractBalance),
      amountWei: contractBalance.toString(),
      transactionHash: tx.hash
    };
  }

  async getContractEvents(fromBlock = 'latest', toBlock = 'latest', limit = 10) {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { contract } = getBlockchainInstances();

    // Get recent events
    const subsidyAddedEvents = await contract.queryFilter(
      contract.filters.SubsidyAdded(),
      fromBlock,
      toBlock
    );

    const subsidyWithdrawnEvents = await contract.queryFilter(
      contract.filters.SubsidyWithdrawn(),
      fromBlock,
      toBlock
    );

    const subsidyPoolFundedEvents = await contract.queryFilter(
      contract.filters.SubsidyPoolFunded(),
      fromBlock,
      toBlock
    );

    // Combine and sort events by block number
    const allEvents = [
      ...subsidyAddedEvents.map(event => ({
        type: 'SubsidyAdded',
        user: event.args.user,
        amount: ethers.formatEther(event.args.amount),
        amountWei: event.args.amount.toString(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        timestamp: null // Would need to fetch block timestamp separately
      })),
      ...subsidyWithdrawnEvents.map(event => ({
        type: 'SubsidyWithdrawn',
        user: event.args.user,
        amount: ethers.formatEther(event.args.amount),
        amountWei: event.args.amount.toString(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        timestamp: null
      })),
      ...subsidyPoolFundedEvents.map(event => ({
        type: 'SubsidyPoolFunded',
        from: event.args.from,
        amount: ethers.formatEther(event.args.amount),
        amountWei: event.args.amount.toString(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        timestamp: null
      }))
    ].sort((a, b) => b.blockNumber - a.blockNumber).slice(0, parseInt(limit));

    return {
      events: allEvents,
      totalEvents: allEvents.length
    };
  }

  async getTransactionStatus(txHash) {
    if (!isBlockchainReady()) {
      throw new Error('Blockchain connection not available');
    }

    const { provider } = getBlockchainInstances();
    
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      throw new Error('Transaction hash not found on the blockchain');
    }

    const block = await provider.getBlock(receipt.blockNumber);
    
    return {
      transactionHash: txHash,
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
      status: receipt.status === 1 ? 'success' : 'failed',
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: ethers.formatUnits(receipt.effectiveGasPrice, 'gwei'),
      timestamp: block ? block.timestamp : null,
      from: receipt.from,
      to: receipt.to,
      contractAddress: receipt.contractAddress
    };
  }
}

module.exports = new ContractService();
