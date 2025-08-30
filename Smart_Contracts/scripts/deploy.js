const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { ethers } = require("ethers"); // Import ethers for JsonRpcProvider

async function main() {
  console.log("🚀 Starting Udavit Smart Contract Deployment...\n");

  let deployer;
  let provider;

  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    [deployer] = await hre.ethers.getSigners();
    provider = hre.ethers.provider;
  } else {
    provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );
    deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  }

  console.log("📝 Deploying contracts with account:", deployer.address);

  // ✅ v6 syntax: get balance via provider
  const balance = await provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance. You might need more ETH for deployment.");
  }

  // Deploy contract
  const UdavitGreenHydrogen = await hre.ethers.getContractFactory("UdavitGreenHydrogen");
  const contract = await UdavitGreenHydrogen.connect(deployer).deploy();

  console.log("⏳ Waiting for deployment...");
  await contract.deployed();

  console.log(`✅ Contract deployed at: ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
