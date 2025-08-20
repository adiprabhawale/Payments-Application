const request = require('supertest');
const app = require('../server/index');

describe('Payment API Server', () => {
  describe('Health Check', () => {
    test('GET /api/health should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.server).toBe('Unified Payments API v1.0');
    });
  });

  describe('Account Information', () => {
    test('GET /api/account/:accountNumber should return account info for valid account', async () => {
      const response = await request(app)
        .get('/api/account/12345678')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accountNumber).toBe('12345678');
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.currency).toBe('USD');
    });

    test('GET /api/account/:accountNumber should return 404 for invalid account', async () => {
      const response = await request(app)
        .get('/api/account/99999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Account not found');
      expect(response.body.code).toBe('ACCOUNT_NOT_FOUND');
    });
  });

  describe('Domestic Transfer', () => {
    test('POST /api/transfer/domestic should process valid transfer', async () => {
      const transferData = {
        accountNumber: '12345678',
        amount: '100.50'
      };

      const response = await request(app)
        .post('/api/transfer/domestic')
        .send(transferData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactionId).toBeDefined();
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.amount).toBe(100.50);
      expect(response.body.data.fee).toBeDefined();
      expect(response.body.data.total).toBeDefined();
    });

    test('POST /api/transfer/domestic should return validation errors for invalid data', async () => {
      const transferData = {
        accountNumber: '',
        amount: '-10'
      };

      const response = await request(app)
        .post('/api/transfer/domestic')
        .send(transferData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details.accountNumber).toBeDefined();
      expect(response.body.details.amount).toBeDefined();
    });

    test('POST /api/transfer/domestic should return 404 for non-existent recipient', async () => {
      const transferData = {
        accountNumber: '99999999',
        amount: '100.50'
      };

      const response = await request(app)
        .post('/api/transfer/domestic')
        .send(transferData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Recipient account not found');
      expect(response.body.code).toBe('RECIPIENT_NOT_FOUND');
    });
  });

  describe('International Transfer', () => {
    test('POST /api/transfer/international should process valid transfer', async () => {
      const transferData = {
        accountNumber: '12345678',
        amount: '500.00',
        iban: 'GB82WEST12345698765432',
        swiftCode: 'AAAABBCC123'
      };

      const response = await request(app)
        .post('/api/transfer/international')
        .send(transferData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactionId).toBeDefined();
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.amount).toBe(500);
      expect(response.body.data.fee).toBeGreaterThanOrEqual(15); // Minimum $15 fee
      expect(response.body.data.estimatedArrival).toBeDefined();
    });

    test('POST /api/transfer/international should return validation errors for invalid IBAN', async () => {
      const transferData = {
        accountNumber: '12345678',
        amount: '500.00',
        iban: 'INVALID_IBAN',
        swiftCode: 'AAAABBCC123'
      };

      const response = await request(app)
        .post('/api/transfer/international')
        .send(transferData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details.iban).toBeDefined();
    });

    test('POST /api/transfer/international should return validation errors for invalid SWIFT code', async () => {
      const transferData = {
        accountNumber: '12345678',
        amount: '500.00',
        iban: 'GB82WEST12345698765432',
        swiftCode: 'INVALID'
      };

      const response = await request(app)
        .post('/api/transfer/international')
        .send(transferData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details.swiftCode).toBeDefined();
    });
  });

  describe('Transactions', () => {
    test('GET /api/transactions should return transactions list', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toBeDefined();
      expect(response.body.data.total).toBeDefined();
      expect(response.body.data.hasMore).toBeDefined();
    });

    test('GET /api/transactions should handle pagination', async () => {
      const response = await request(app)
        .get('/api/transactions?limit=5&offset=0')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.transactions)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/api/unknown-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Endpoint not found');
      expect(response.body.code).toBe('NOT_FOUND');
    });
  });
});