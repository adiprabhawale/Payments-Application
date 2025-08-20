import { DomesticTransferData, InternationalTransferData } from '@/types/payment';

const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: Record<string, string>;
}

export interface TransferResponse {
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  fee: number;
  total: number;
  processingTime: string;
  timestamp: string;
  recipient: {
    accountNumber?: string;
    name?: string;
    iban?: string;
    swiftCode?: string;
  };
  estimatedArrival?: string;
}

export interface AccountInfo {
  accountNumber: string;
  name: string;
  currency: string;
  hasInsufficientFunds: boolean;
}

export interface Transaction {
  id: string;
  type: 'domestic' | 'international';
  accountNumber: string;
  amount: number;
  status: string;
  timestamp: string;
  processingTime: string;
  fee: number;
  iban?: string;
  swiftCode?: string;
}

class PaymentApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          code: data.code,
          details: data.details,
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    }
  }

  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('/health');
  }

  async getAccountInfo(accountNumber: string): Promise<ApiResponse<AccountInfo>> {
    return this.makeRequest(`/account/${accountNumber}`);
  }

  async processDomesticTransfer(
    transferData: DomesticTransferData
  ): Promise<ApiResponse<TransferResponse>> {
    return this.makeRequest('/transfer/domestic', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  }

  async processInternationalTransfer(
    transferData: InternationalTransferData
  ): Promise<ApiResponse<TransferResponse>> {
    return this.makeRequest('/transfer/international', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  }

  async getTransactions(
    limit: number = 10,
    offset: number = 0
  ): Promise<ApiResponse<{ transactions: Transaction[]; total: number; hasMore: boolean }>> {
    return this.makeRequest(`/transactions?limit=${limit}&offset=${offset}`);
  }

  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return this.makeRequest(`/transaction/${id}`);
  }
}

export const paymentApi = new PaymentApiService();