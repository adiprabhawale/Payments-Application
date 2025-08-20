import { useState } from 'react';
import { paymentApi, ApiResponse, TransferResponse } from '@/services/paymentApi';
import { DomesticTransferData, InternationalTransferData, TransferType } from '@/types/payment';

interface UsePaymentApiReturn {
  isLoading: boolean;
  error: string | null;
  submitPayment: (
    transferType: TransferType,
    data: DomesticTransferData | InternationalTransferData
  ) => Promise<TransferResponse | null>;
  clearError: () => void;
}

export const usePaymentApi = (): UsePaymentApiReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const submitPayment = async (
    transferType: TransferType,
    data: DomesticTransferData | InternationalTransferData
  ): Promise<TransferResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting payment to API:', { transferType, data });
      let response: ApiResponse<TransferResponse>;

      if (transferType === 'domestic') {
        response = await paymentApi.processDomesticTransfer(data as DomesticTransferData);
      } else {
        response = await paymentApi.processInternationalTransfer(data as InternationalTransferData);
      }

      console.log('API Response:', response);

      if (!response.success || !response.data) {
        const errorMessage = response.error || response.details?.message || 'Transfer failed';
        console.error('Payment API Error:', { error: errorMessage, details: response.details });
        setError(errorMessage);
        return null;
      }

      // Ensure we have a valid transaction ID
      if (!response.data.transactionId) {
        console.error('Invalid API response - missing transaction ID:', response.data);
        setError('Invalid response from server');
        return null;
      }

      console.log('Payment processed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Payment submission error:', error);
      setError('An unexpected error occurred. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    submitPayment,
    clearError,
  };
};