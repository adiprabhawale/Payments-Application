import { renderHook, act } from '@testing-library/react-native';
import { usePaymentApi } from '@/hooks/usePaymentApi';
import { paymentApi } from '@/services/paymentApi';

// Mock the payment API service
jest.mock('@/services/paymentApi', () => ({
  paymentApi: {
    processDomesticTransfer: jest.fn(),
    processInternationalTransfer: jest.fn(),
  },
}));

describe('usePaymentApi Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => usePaymentApi());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.submitPayment).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  test('should handle successful domestic transfer', async () => {
    const mockResponse = {
      success: true,
      data: {
        transactionId: 'txn_123',
        status: 'completed',
        amount: 100,
        fee: 0.10,
        total: 100.10,
        processingTime: '< 1 minute',
        timestamp: '2025-01-27T10:00:00Z',
        recipient: {
          accountNumber: '12345678',
          name: 'John Doe'
        }
      }
    };

    (paymentApi.processDomesticTransfer as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePaymentApi());
    
    let transferResult;
    await act(async () => {
      transferResult = await result.current.submitPayment('domestic', {
        accountNumber: '12345678',
        amount: '100'
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(transferResult).toEqual(mockResponse.data);
  });

  test('should handle failed domestic transfer', async () => {
    const mockResponse = {
      success: false,
      error: 'Insufficient funds',
      code: 'INSUFFICIENT_FUNDS'
    };

    (paymentApi.processDomesticTransfer as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePaymentApi());
    
    let transferResult;
    await act(async () => {
      transferResult = await result.current.submitPayment('domestic', {
        accountNumber: '12345678',
        amount: '100000'
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Insufficient funds');
    expect(transferResult).toBe(null);
  });

  test('should handle successful international transfer', async () => {
    const mockResponse = {
      success: true,
      data: {
        transactionId: 'txn_456',
        status: 'pending',
        amount: 500,
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

    (paymentApi.processInternationalTransfer as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePaymentApi());
    
    let transferResult;
    await act(async () => {
      transferResult = await result.current.submitPayment('international', {
        accountNumber: '12345678',
        amount: '500',
        iban: 'GB82WEST12345698765432',
        swiftCode: 'AAAABBCC123'
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(transferResult).toEqual(mockResponse.data);
  });

  test('should set loading state during API call', async () => {
    let resolvePromise;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (paymentApi.processDomesticTransfer as jest.Mock).mockReturnValueOnce(mockPromise);

    const { result } = renderHook(() => usePaymentApi());
    
    // Start the API call
    act(() => {
      result.current.submitPayment('domestic', {
        accountNumber: '12345678',
        amount: '100'
      });
    });

    // Check loading state
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolvePromise({ success: true, data: {} });
    });

    expect(result.current.isLoading).toBe(false);
  });

  test('should clear error when clearError is called', async () => {
    const mockResponse = {
      success: false,
      error: 'Test error',
      code: 'TEST_ERROR'
    };

    (paymentApi.processDomesticTransfer as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePaymentApi());
    
    // Trigger an error
    await act(async () => {
      await result.current.submitPayment('domestic', {
        accountNumber: '12345678',
        amount: '100'
      });
    });

    expect(result.current.error).toBe('Test error');

    // Clear the error
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  test('should handle network errors', async () => {
    (paymentApi.processDomesticTransfer as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => usePaymentApi());
    
    let transferResult;
    await act(async () => {
      transferResult = await result.current.submitPayment('domestic', {
        accountNumber: '12345678',
        amount: '100'
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('An unexpected error occurred. Please try again.');
    expect(transferResult).toBe(null);
  });
});