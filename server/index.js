const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
const transactions = [];
const accounts = new Map([
  ['12345678', { balance: 15000, name: 'John Doe', currency: 'USD' }],
  ['87654321', { balance: 8500, name: 'Jane Smith', currency: 'USD' }],
  ['11223344', { balance: 25000, name: 'Bob Johnson', currency: 'USD' }],
]);

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const validateAccountNumber = (accountNumber) => {
  if (!accountNumber) return 'Account number is required';
  if (!/^\d+$/.test(accountNumber)) return 'Account number must contain only numbers';
  if (accountNumber.length < 8 || accountNumber.length > 20) return 'Account number must be between 8-20 digits';
  return null;
};

const validateAmount = (amount) => {
  if (!amount) return 'Amount is required';
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) return 'Amount must be a valid number';
  if (numericAmount <= 0) return 'Amount must be greater than zero';
  if (numericAmount > 100000) return 'Amount cannot exceed $100,000';
  return null;
};

const validateIban = (iban) => {
  if (!iban) return 'IBAN is required';
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (cleanIban.length > 34) return 'IBAN cannot exceed 34 characters';
  if (cleanIban.length < 15) return 'IBAN must be at least 15 characters';
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) return 'Invalid IBAN format';
  return null;
};

const validateSwiftCode = (swiftCode) => {
  if (!swiftCode) return 'SWIFT code is required';
  const cleanSwiftCode = swiftCode.replace(/\s/g, '').toUpperCase();
  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanSwiftCode)) {
    return 'Invalid SWIFT code format (e.g., AAAABBCC123)';
  }
  return null;
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    server: 'Unified Payments API v1.0'
  });
});

app.get('/api/account/:accountNumber', async (req, res) => {
  try {
    await delay(500); // Simulate network delay
    
    const { accountNumber } = req.params;
    const account = accounts.get(accountNumber);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
        code: 'ACCOUNT_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: {
        accountNumber,
        name: account.name,
        currency: account.currency,
        // Don't expose full balance for security
        hasInsufficientFunds: false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

app.post('/api/transfer/domestic', async (req, res) => {
  try {
    await delay(1500); // Simulate processing time
    
    const { accountNumber, amount } = req.body;
    
    // Validation
    const errors = {};
    const accountError = validateAccountNumber(accountNumber);
    const amountError = validateAmount(amount);
    
    if (accountError) errors.accountNumber = accountError;
    if (amountError) errors.amount = amountError;
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }
    
    // Check if recipient account exists
    if (!accounts.has(accountNumber)) {
      return res.status(404).json({
        success: false,
        error: 'Recipient account not found',
        code: 'RECIPIENT_NOT_FOUND'
      });
    }
    
    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
      return res.status(500).json({
        success: false,
        error: 'Transfer failed due to technical issues',
        code: 'TRANSFER_FAILED'
      });
    }
    
    // Create transaction record
    const transaction = {
      id: uuidv4(),
      type: 'domestic',
      accountNumber,
      amount: parseFloat(amount),
      status: 'completed',
      timestamp: new Date().toISOString(),
      processingTime: '< 1 minute',
      fee: parseFloat(amount) * 0.001, // 0.1% fee
    };
    
    transactions.push(transaction);
    
    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        status: 'completed',
        amount: transaction.amount,
        fee: transaction.fee,
        total: transaction.amount + transaction.fee,
        processingTime: transaction.processingTime,
        timestamp: transaction.timestamp,
        recipient: {
          accountNumber,
          name: accounts.get(accountNumber).name
        }
      }
    });
  } catch (error) {
    console.error('Domestic transfer error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

app.post('/api/transfer/international', async (req, res) => {
  try {
    console.log('Received international transfer request:', req.body);
    await delay(2500); // Longer processing time for international
    
    const { sourceAccountNumber, amount, iban, swiftCode } = req.body;
    
    // Validation
    const errors = {};
    const accountError = validateAccountNumber(sourceAccountNumber);
    const amountError = validateAmount(amount);
    const ibanError = validateIban(iban);
    const swiftError = validateSwiftCode(swiftCode);
    
    if (accountError) errors.sourceAccountNumber = accountError;
    if (amountError) errors.amount = amountError;
    if (ibanError) errors.iban = ibanError;
    if (swiftError) errors.swiftCode = swiftError;
    
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    // Check if source account exists
    if (!accounts.has(sourceAccountNumber)) {
      console.log('Source account not found:', sourceAccountNumber);
      return res.status(404).json({
        success: false,
        error: 'Source account not found',
        code: 'SOURCE_ACCOUNT_NOT_FOUND'
      });
    }
    
    // Simulate compliance checks
    const complianceCheck = Math.random();
    if (complianceCheck < 0.1) {
      return res.status(400).json({
        success: false,
        error: 'Transfer blocked by compliance checks',
        code: 'COMPLIANCE_BLOCKED'
      });
    }
    
    // Create transaction record
    const transaction = {
      id: uuidv4(),
      type: 'international',
      sourceAccountNumber: sourceAccountNumber,
      amount: parseFloat(amount),
      iban,
      swiftCode,
      status: 'pending',
      timestamp: new Date().toISOString(),
      processingTime: '1-3 business days',
      fee: Math.max(parseFloat(amount) * 0.015, 15), // 1.5% fee, minimum $15
    };
    
    console.log('Creating international transaction:', transaction);
    transactions.push(transaction);
    
    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        status: 'pending',
        amount: transaction.amount,
        fee: transaction.fee,
        total: transaction.amount + transaction.fee,
        processingTime: transaction.processingTime,
        timestamp: transaction.timestamp,
        recipient: {
          iban,
          swiftCode
        },
        estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
      }
    });
  } catch (error) {
    console.error('International transfer error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    await delay(300);
    
    const { limit = 10, offset = 0 } = req.query;
    const sortedTransactions = transactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        transactions: sortedTransactions,
        total: transactions.length,
        hasMore: parseInt(offset) + parseInt(limit) < transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

app.get('/api/transaction/:id', async (req, res) => {
  try {
    await delay(200);
    
    const { id } = req.params;
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
        code: 'TRANSACTION_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

app.listen(PORT, () => {
  console.log(`🏦 Unified Payments API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Domestic transfers: POST http://localhost:${PORT}/api/transfer/domestic`);
  console.log(`🌍 International transfers: POST http://localhost:${PORT}/api/transfer/international`);
});

module.exports = app;