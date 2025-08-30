# Udavit Green Hydrogen Smart Contract Backend API

A comprehensive Express.js API backend for managing green hydrogen subsidies through smart contracts on the Ethereum blockchain.

## 🏗️ Project Structure

```
smartcontract-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Blockchain connection configuration
│   ├── middleware/
│   │   └── validation.js        # Request validation middleware
│   ├── routes/
│   │   ├── subsidy.js           # Subsidy management endpoints
│   │   └── contract.js          # Contract management endpoints
│   ├── services/
│   │   ├── subsidyService.js    # Subsidy business logic
│   │   └── contractService.js   # Contract business logic
│   ├── utils/
│   │   └── constants.js         # Common constants and messages
│   └── app.js                   # Express app configuration
├── Smart_Contracts/             # Smart contract artifacts
├── server.js                    # Server entry point
├── package.json                 # Dependencies and scripts
└── .env.example                 # Environment variables template
```

## 🚀 Features

- **Smart Contract Integration**: Full integration with Ethereum smart contracts
- **Subsidy Management**: Add, withdraw, and check subsidy balances
- **Pool Management**: Fund and monitor subsidy pools
- **Contract Administration**: Owner-only operations and contract monitoring
- **Event Tracking**: Monitor contract events and transactions
- **Multi-Network Support**: Local, Sepolia testnet, and Mainnet support
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error handling and user-friendly messages
- **Security**: Helmet.js security headers and CORS protection

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Ethereum node (local or Infura/Alchemy)
- Smart contract deployed on the target network

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartcontract-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure blockchain connection**
   - Set your private key
   - Configure network settings
   - Set contract address after deployment

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
# Network Configuration
NETWORK=localhost
PORT=3000

# Blockchain Configuration
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
PRIVATE_KEY=your_private_key_here

# Infura Configuration (for testnet/mainnet)
INFURA_PROJECT_ID=your_infura_project_id_here

# Optional: Custom RPC URL
CUSTOM_RPC_URL=http://127.0.0.1:8545
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📚 API Endpoints

### Health Check
- `GET /health` - API health status

### Subsidy Management
- `GET /api/subsidy/balance/:address` - Get subsidy balance for an address
- `POST /api/subsidy/add` - Add subsidy for a user (owner only)
- `POST /api/subsidy/withdraw` - Withdraw subsidy for connected wallet
- `GET /api/subsidy/pool-balance` - Get total subsidy pool balance
- `POST /api/subsidy/fund-pool` - Fund the subsidy pool

### Contract Management
- `GET /api/contract/info` - Get contract information
- `GET /api/contract/owner` - Get contract owner
- `GET /api/contract/is-owner/:address` - Check if address is owner
- `POST /api/contract/withdraw-remaining` - Withdraw remaining funds (owner only)
- `GET /api/contract/events` - Get contract events
- `GET /api/contract/transaction/:txHash` - Get transaction status

## 🔧 Development

### Project Structure Benefits

- **Separation of Concerns**: Routes, services, and business logic are separated
- **Maintainability**: Easy to modify and extend functionality
- **Testability**: Services can be easily unit tested
- **Scalability**: Clear structure for adding new features
- **Error Handling**: Centralized error handling and validation

### Adding New Features

1. **Create a new service** in `src/services/`
2. **Add validation middleware** in `src/middleware/validation.js`
3. **Create routes** in `src/routes/`
4. **Update app.js** to include new routes

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure production blockchain network
3. Set up proper security measures

### Docker (Optional)
```bash
# Build image
docker build -t smartcontract-backend .

# Run container
docker run -p 3000:3000 smartcontract-backend
```

## 📝 API Documentation

### Request Examples

#### Add Subsidy
```bash
curl -X POST http://localhost:3000/api/subsidy/add \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "amount": "1.5"
  }'
```

#### Get Subsidy Balance
```bash
curl http://localhost:3000/api/subsidy/balance/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
```

#### Fund Pool
```bash
curl -X POST http://localhost:3000/api/subsidy/fund-pool \
  -H "Content-Type: application/json" \
  -d '{"amount": "10.0"}'
```

## 🔒 Security Considerations

- **Private Key Management**: Never commit private keys to version control
- **Environment Variables**: Use `.env` files for sensitive configuration
- **Input Validation**: All inputs are validated before processing
- **Error Handling**: Sensitive information is not exposed in error messages
- **CORS Configuration**: Configure CORS for production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

## 🔄 Changelog

### v1.0.0
- Initial release
- Smart contract integration
- Subsidy management API
- Contract administration endpoints
- Multi-network support
- Comprehensive validation and error handling
