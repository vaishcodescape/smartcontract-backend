#!/bin/bash

# Udavit Green Hydrogen API Startup Script

echo "🚀 Starting Udavit Green Hydrogen API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Please copy env.example to .env and configure your settings"
    echo "   cp env.example .env"
    echo "   # Then edit .env with your configuration"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if contract artifacts exist
if [ ! -f "Smart_Contracts/artifacts/contracts/UdavitGreenHydrogen.sol/UdavitGreenHydrogen.json" ]; then
    echo "⚠️  Smart contract artifacts not found!"
    echo "🔧 Please compile your smart contracts first:"
    echo "   cd Smart_Contracts"
    echo "   npx hardhat compile"
    echo "   cd .."
fi

echo "✅ Starting development server..."
npm run dev
