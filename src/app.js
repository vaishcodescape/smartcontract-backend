const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Import routes
const subsidyRoutes = require('./routes/subsidy');
const contractRoutes = require('./routes/contract');

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Smart Contract Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/subsidy', subsidyRoutes);
app.use('/api/contract', contractRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Udavit Green Hydrogen Smart Contract API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      subsidy: '/api/subsidy',
      contract: '/api/contract'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

module.exports = app;
