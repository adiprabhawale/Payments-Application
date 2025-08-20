import { paymentApi } from '@/services/paymentApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('PaymentApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    test('should return success response for health check', async () => {
      const mockResponse = {
        success: true,
        data: { status: 'healthy', timestamp: '2025-01-27T10:00:00Z' }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await paymentApi.healthCheck();
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/health', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Account Information', () => {
    test('should fetch account information successfully', async () => {
      const mockAccountData = {
        accountNumber: '12345678',
        name: 'John Doe',
        currency: 'USD',
        hasInsufficientFunds: false
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAccountData }),
      });

      const result = await paymentApi.getAccountInfo('12345678');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/account/12345678', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAccountData);
    });

    test('should handle account not found error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          error: 'Account not found',
          code: 'ACCOUNT_NOT_FOUND'
        }),
      });

      const result = await paymentApi.getAccountInfo('99999999');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Account not found');
      expect(result.code).toBe('ACCOUNT_NOT_FOUND');
    });
  });

  describe('Domestic Transfer', () => {
    test('should process domestic transfer successfully', async () => {
      const transferData = {
        accountNumber: '12345678',
        amount: '100.50'
      };

      const mockResponse = {
        success: true,
        data: {
          transactionId: 'txn_123',
          status: 'completed',
          amount: 100.50,
          fee: 0.10,
          total: 100.60,
          processingTime: '< 1 minute',
          timestamp: '2025-01-27T10:00:00Z',
          recipient: {
            accountNumber: '12345678',
            name: 'John Doe'
          }
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await paymentApi.processDomesticTransfer(transferData);
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/transfer/domestic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });
      expect(result).toEqual(mockResponse);
    });

    test('should handle validation errors for domestic transfer', async () => {
      const transferData = {
        accountNumber: '',
        amount: '-10'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: {
            accountNumber: 'Account number is required',
            amount: 'Amount must be greater than zero'
          }
        }),
      });

      const result = await paymentApi.processDomesticTransfer(transferData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed');
      expect(result.details).toBeDefined();
    });
  });

  describe('International Transfer', () => {
    test('should process international transfer successfully', async () => {
      const transferData = {
        accountNumber: '12345678',
        amount: '500.00',
        iban: 'GB82WEST12345698765432',
        swiftCode: 'AAAABBCC123'
      };

      const mockResponse = {
        success: true,
        data: {
          transactionId: 'txn_456',
          status: 'pending',
          amount: 500.00,
          fee: 15.00,
          total: 515.00,
          processingTime: '1-3 business days',
          timestamp: '2025-01-27T10:00:00Z',
          recipient: {
            iban: 'GB82WEST12345698765432',
            swiftCode: 'AAAABBCC123'
          },
          estimatedArrival: '2025-01-30T10:00:00Z'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await paymentApi.processInternationalTransfer(transferData);
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/transfer/international', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });
      expect(result).toEqual(mockResponse);
    });

    test('should handle compliance blocked error', async () => {
      const transferData = {
        accountNumber: '12345678',
        amount: '50000.00',
        iban: 'GB82WEST12345698765432',
        swiftCode: 'AAAABBCC123'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          error: 'Transfer blocked by compliance checks',
          code: 'COMPLIANCE_BLOCKED'
        }),
      });

      const result = await paymentApi.processInternationalTransfer(transferData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Transfer blocked by compliance checks');
      expect(result.code).toBe('COMPLIANCE_BLOCKED');
    });
  });

  describe('Network Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await paymentApi.healthCheck();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error. Please check your connection.');
      expect(result.code).toBe('NETWORK_ERROR');
    });
  });

  describe('Transactions', () => {
    test('should fetch transactions list successfully', async () => {
      const mockTransactions = {
        success: true,
        data: {
          transactions: [
            {
              id: 'txn_123',
              type: 'domestic',
              accountNumber: '12345678',
              amount: 100.50,
              status: 'completed',
              timestamp: '2025-01-27T10:00:00Z',
              processingTime: '< 1 minute',
              fee: 0.10
            }
          ],
          total: 1,
          hasMore: false
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await paymentApi.getTransactions(10, 0);
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/transactions?limit=10&offset=0', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockTransactions);
    });

    test('should fetch single transaction successfully', async () => {
      const mockTransaction = {
        success: true,
        data: {
          id: 'txn_123',
          type: 'domestic',
          accountNumber: '12345678',
          amount: 100.50,
          status: 'completed',
          timestamp: '2025-01-27T10:00:00Z',
          processingTime: '< 1 minute',
          fee: 0.10
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransaction,
      });

      const result = await paymentApi.getTransaction('txn_123');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/transaction/txn_123', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockTransaction);
    });
  });
});