import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PaymentSuccess from '@/components/PaymentSuccess';
import { TransferResponse } from '@/services/paymentApi';

describe('PaymentSuccess Component', () => {
  const mockTransferData: TransferResponse = {
    transactionId: 'txn_123456789',
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
  };

  const mockOnGoBack = jest.fn();
  const mockOnNewTransfer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render success message and transaction details', () => {
    const { getByText } = render(
      <PaymentSuccess
        transferData={mockTransferData}
        onGoBack={mockOnGoBack}
        onNewTransfer={mockOnNewTransfer}
      />
    );

    expect(getByText('Transfer Successful!')).toBeTruthy();
    expect(getByText('Your payment has been processed')).toBeTruthy();
    expect(getByText('$100.50')).toBeTruthy();
    expect(getByText('$0.10')).toBeTruthy();
    expect(getByText('$100.60')).toBeTruthy();
  });

  test('should display truncated transaction ID', () => {
    const { getByText } = render(
      <PaymentSuccess
        transferData={mockTransferData}
        onGoBack={mockOnGoBack}
        onNewTransfer={mockOnNewTransfer}
      />
    );

    expect(getByText('txn_1234...')).toBeTruthy();
  });

  test('should show completed status badge', () => {
    const { getByText } = render(
      <PaymentSuccess
        transferData={mockTransferData}
        onGoBack={mockOnGoBack}
        onNewTransfer={mockOnNewTransfer}
      />
    );

    expect(getByText('Completed')).toBeTruthy();
  });

  test('should show pending status for international transfers', () => {
    const pendingTransferData: TransferResponse = {
      ...mockTransferData,
      status: 'pending',
      processingTime: '1-3 business days',
      estimatedArrival: '2025-01-30T10:00:00Z'
    };

    const { getByText } = render(
      <PaymentSuccess
        transferData={pendingTransferData}
        onGoBack={mockOnGoBack}
        onNewTransfer={mockOnNewTransfer}
      />
    );

    expect(getByText('Your payment has been submitted')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('1-3 business days')).toBeTruthy();
  });

  test('should call onGoBack when Go Back button is pressed', () => {
    const { getByText } = render(
      <PaymentSuccess
        transferData={mockTransferData}
        onGoBack={mockOnGoBack}
        onNewTransfer={mockOnNewTransfer}
      />
    );

    fireEvent.press(getByText('Go Back'));
    expect(mockOnGoBack).toHaveBeenCalledTimes(1);
  });

  test('should call onNewTransfer when New Transfer button is pressed', () => {
    const { getByText } = render(
      <PaymentSuccess
        transferData={mockTransferData}
        onGoBack={mockOnGoBack}
        onNewTransfer={mockOnNewTransfer}
      />
    );

    fireEvent.press(getByText('New Transfer'));
    expect(mockOnNewTransfer).toHaveBeenCalledTimes(1);
  });

  test('should display estimated arrival for international transfers', () => {
    const internationalTransferData: TransferResponse = {
      ...mockTransferData,
      status: 'pending',
      estimatedArrival: '2025-01-30T10:00:00Z',
      recipient: {
        iban: 'GB82WEST12345698765432',
        swiftCode: 'AAAABBCC123'
      }
    };

    const { getByText } = render(
      <PaymentSuccess
        transferData={internationalTransferData}
        onGoBack={mockOnGoBack}
        onNewTransfer={mockOnNewTransfer}
      />
    );

    expect(getByText(/January 30, 2025/)).toBeTruthy();
  });
});