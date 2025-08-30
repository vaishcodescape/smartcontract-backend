# Udavit Green Hydrogen API Documentation

## Overview

The Udavit Green Hydrogen API provides a comprehensive interface for managing green hydrogen subsidies through smart contracts on the Ethereum blockchain.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API uses private key authentication for blockchain operations. Ensure your private key is properly configured in the `.env` file.

## Endpoints

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "message": "Smart Contract Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Subsidy Management

#### GET /api/subsidy/balance/:address
Get subsidy balance for a specific Ethereum address.

**Parameters:**
- `address` (path): Ethereum address to check

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "balance": "1.5",
    "balanceWei": "1500000000000000000"
  }
}
```

#### POST /api/subsidy/add
Add subsidy for a user (owner only).

**Request Body:**
```json
{
  "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "amount": "1.5"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subsidy added successfully",
  "data": {
    "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "amount": "1.5",
    "amountWei": "1500000000000000000",
    "transactionHash": "0x..."
  }
}
```

#### POST /api/subsidy/withdraw
Withdraw subsidy for the connected wallet.

**Response:**
```json
{
  "success": true,
  "message": "Subsidy withdrawn successfully",
  "data": {
    "amount": "1.5",
    "amountWei": "1500000000000000000",
    "transactionHash": "0x..."
  }
}
```

#### GET /api/subsidy/pool-balance
Get total subsidy pool balance.

**Response:**
```json
{
  "success": true,
  "data": {
    "poolBalance": "10.0",
    "poolBalanceWei": "10000000000000000000"
  }
}
```

#### POST /api/subsidy/fund-pool
Fund the subsidy pool.

**Request Body:**
```json
{
  "amount": "5.0"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pool funded successfully",
  "data": {
    "amount": "5.0",
    "amountWei": "5000000000000000000",
    "transactionHash": "0x..."
  }
}
```

### Contract Management

#### GET /api/contract/info
Get comprehensive contract information.

**Response:**
```json
{
  "success": true,
  "data": {
    "contractAddress": "0x...",
    "owner": "0x...",
    "totalSubsidyPool": "10.0",
    "totalSubsidyPoolWei": "10000000000000000000",
    "contractBalance": "15.0",
    "contractBalanceWei": "15000000000000000000",
    "network": "localhost"
  }
}
```

#### GET /api/contract/owner
Get contract owner address.

**Response:**
```json
{
  "success": true,
  "data": {
    "owner": "0x..."
  }
}
```

#### GET /api/contract/is-owner/:address
Check if an address is the contract owner.

**Parameters:**
- `address` (path): Ethereum address to check

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "isOwner": true,
    "owner": "0x..."
  }
}
```

#### POST /api/contract/withdraw-remaining
Withdraw remaining funds from contract (owner only).

**Response:**
```json
{
  "success": true,
  "message": "Remaining funds withdrawn successfully",
  "data": {
    "amount": "5.0",
    "amountWei": "5000000000000000000",
    "transactionHash": "0x..."
  }
}
```

#### GET /api/contract/events
Get contract events (recent transactions).

**Query Parameters:**
- `fromBlock` (optional): Starting block number (default: 'latest')
- `toBlock` (optional): Ending block number (default: 'latest')
- `limit` (optional): Maximum number of events (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "type": "SubsidyAdded",
        "user": "0x...",
        "amount": "1.5",
        "amountWei": "1500000000000000000",
        "blockNumber": 12345,
        "transactionHash": "0x...",
        "timestamp": null
      }
    ],
    "totalEvents": 1
  }
}
```

#### GET /api/contract/transaction/:txHash
Get transaction status.

**Parameters:**
- `txHash` (path): Transaction hash to check

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x...",
    "blockNumber": 12345,
    "blockHash": "0x...",
    "status": "success",
    "gasUsed": "21000",
    "effectiveGasPrice": "20.0",
    "timestamp": 1640995200,
    "from": "0x...",
    "to": "0x...",
    "contractAddress": "0x..."
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (access denied)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (blockchain not ready)

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Testing

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Get subsidy balance
curl http://localhost:3000/api/subsidy/balance/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6

# Add subsidy
curl -X POST http://localhost:3000/api/subsidy/add \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "amount": "1.5"
  }'
```

### Using Postman

1. Import the collection
2. Set the base URL to `http://localhost:3000`
3. Configure environment variables if needed
4. Test endpoints

## Notes

- All amounts are in ETH (not Wei) for user convenience
- Wei values are provided for technical users
- Blockchain operations may take time to complete
- Ensure your blockchain node is running and accessible
- Private key must be configured for write operations
