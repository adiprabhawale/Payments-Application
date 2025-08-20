import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import PaymentForm from '@/components/PaymentForm';

// Mock the store
jest.mock('@/stores/paymentStore', () => ({
  usePaymentStore: jest.fn(() => ({
    formData: { accountNumber: '', amount: '', iban: '', swiftCode: '' },
    errors: {},
    isSubmitting: false,
    setTransferType: jest.fn(),
    updateField: jest.fn(),
    setErrors: jest.fn(),
    setSubmitting: jest.fn(),
    resetForm: jest.fn(),
  })),
}));

describe('PaymentForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Component Rendering', () => {
    test('1.1: Should render Account Number and Amount fields when transferType is domestic', () => {
      const { getByTestId, queryByTestId } = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );

      expect(getByTestId('accountNumber-input')).toBeTruthy();
      expect(getByTestId('amount-input')).toBeTruthy();
      expect(queryByTestId('iban-input')).toBeNull();
      expect(queryByTestId('swiftCode-input')).toBeNull();
    });

    test('1.2: Should render Account Number, Amount, IBAN, and SWIFT Code fields when transferType is international', () => {
      const { getByTestId } = render(
        <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
      );

      expect(getByTestId('accountNumber-input')).toBeTruthy();
      expect(getByTestId('amount-input')).toBeTruthy();
      expect(getByTestId('iban-input')).toBeTruthy();
      expect(getByTestId('swiftCode-input')).toBeTruthy();
    });

    test('1.3: Should not render IBAN and SWIFT Code fields when transferType is domestic', () => {
      const { queryByTestId } = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );

      expect(queryByTestId('iban-input')).toBeNull();
      expect(queryByTestId('swiftCode-input')).toBeNull();
    });

    test('1.4: Should render the Send Payment button in both modes', () => {
      const domesticRender = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );
      expect(domesticRender.getByTestId('submit-button')).toBeTruthy();

      const internationalRender = render(
        <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
      );
      expect(internationalRender.getByTestId('submit-button')).toBeTruthy();
    });

    test('1.5: Should match the snapshot for domestic transfer UI', () => {
      const tree = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('1.6: Should match the snapshot for international transfer UI', () => {
      const tree = render(
        <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('2. User Input and State Management', () => {
    test('2.1: Should update state correctly when user types in Account Number field', () => {
      const mockUpdateField = jest.fn();
      const { usePaymentStore } = require('@/stores/paymentStore');
      usePaymentStore.mockReturnValue({
        formData: { accountNumber: '', amount: '' },
        errors: {},
        isSubmitting: false,
        setTransferType: jest.fn(),
        updateField: mockUpdateField,
        setErrors: jest.fn(),
        setSubmitting: jest.fn(),
        resetForm: jest.fn(),
      });

      const { getByTestId } = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );

      fireEvent.changeText(getByTestId('accountNumber-input'), '1234567890');
      expect(mockUpdateField).toHaveBeenCalledWith('accountNumber', '1234567890');
    });

    test('2.2: Should update state correctly when user types in Amount field', () => {
      const mockUpdateField = jest.fn();
      const { usePaymentStore } = require('@/stores/paymentStore');
      usePaymentStore.mockReturnValue({
        formData: { accountNumber: '', amount: '' },
        errors: {},
        isSubmitting: false,
        setTransferType: jest.fn(),
        updateField: mockUpdateField,
        setErrors: jest.fn(),
        setSubmitting: jest.fn(),
        resetForm: jest.fn(),
      });

      const { getByTestId } = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );

      fireEvent.changeText(getByTestId('amount-input'), '100.50');
      expect(mockUpdateField).toHaveBeenCalledWith('amount', '100.50');
    });

    test('2.3: Should update state correctly when user types in IBAN field', () => {
      const mockUpdateField = jest.fn();
      const { usePaymentStore } = require('@/stores/paymentStore');
      usePaymentStore.mockReturnValue({
        formData: { accountNumber: '', amount: '', iban: '', swiftCode: '' },
        errors: {},
        isSubmitting: false,
        setTransferType: jest.fn(),
        updateField: mockUpdateField,
        setErrors: jest.fn(),
        setSubmitting: jest.fn(),
        resetForm: jest.fn(),
      });

      const { getByTestId } = render(
        <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
      );

      fireEvent.changeText(getByTestId('iban-input'), 'GB82WEST12345698765432');
      expect(mockUpdateField).toHaveBeenCalledWith('iban', 'GB82WEST12345698765432');
    });

    test('2.4: Should update state correctly when user types in SWIFT Code field', () => {
      const mockUpdateField = jest.fn();
      const { usePaymentStore } = require('@/stores/paymentStore');
      usePaymentStore.mockReturnValue({
        formData: { accountNumber: '', amount: '', iban: '', swiftCode: '' },
        errors: {},
        isSubmitting: false,
        setTransferType: jest.fn(),
        updateField: mockUpdateField,
        setErrors: jest.fn(),
        setSubmitting: jest.fn(),
        resetForm: jest.fn(),
      });

      const { getByTestId } = render(
        <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
      );

      fireEvent.changeText(getByTestId('swiftCode-input'), 'AAAABBCC123');
      expect(mockUpdateField).toHaveBeenCalledWith('swiftCode', 'AAAABBCC123');
    });
  });

  describe('3. Form Validation', () => {
    describe('Domestic Transfer Validation', () => {
      test('3.1: Should show error message if Account Number is empty on submit', async () => {
        const { usePaymentStore } = require('@/stores/paymentStore');
        usePaymentStore.mockReturnValue({
          formData: { accountNumber: '', amount: '100' },
          errors: { accountNumber: 'Account number is required' },
          isSubmitting: false,
          setTransferType: jest.fn(),
          updateField: jest.fn(),
          setErrors: jest.fn(),
          setSubmitting: jest.fn(),
          resetForm: jest.fn(),
        });

        const { getByTestId } = render(
          <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
        );

        await waitFor(() => {
          expect(getByTestId('accountNumber-error')).toHaveTextContent('Account number is required');
        });
      });

      test('3.2: Should show error message if Account Number contains non-numeric characters', async () => {
        const { usePaymentStore } = require('@/stores/paymentStore');
        usePaymentStore.mockReturnValue({
          formData: { accountNumber: 'abc123', amount: '100' },
          errors: { accountNumber: 'Account number must contain only numbers' },
          isSubmitting: false,
          setTransferType: jest.fn(),
          updateField: jest.fn(),
          setErrors: jest.fn(),
          setSubmitting: jest.fn(),
          resetForm: jest.fn(),
        });

        const { getByTestId } = render(
          <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
        );

        await waitFor(() => {
          expect(getByTestId('accountNumber-error')).toHaveTextContent('Account number must contain only numbers');
        });
      });

      test('3.3: Should show error message if Amount is empty on submit', async () => {
        const { usePaymentStore } = require('@/stores/paymentStore');
        usePaymentStore.mockReturnValue({
          formData: { accountNumber: '12345678', amount: '' },
          errors: { amount: 'Amount is required' },
          isSubmitting: false,
          setTransferType: jest.fn(),
          updateField: jest.fn(),
          setErrors: jest.fn(),
          setSubmitting: jest.fn(),
          resetForm: jest.fn(),
        });

        const { getByTestId } = render(
          <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
        );

        await waitFor(() => {
          expect(getByTestId('amount-error')).toHaveTextContent('Amount is required');
        });
      });

      test('3.4: Should show error message if Amount is zero or negative', async () => {
        const { usePaymentStore } = require('@/stores/paymentStore');
        usePaymentStore.mockReturnValue({
          formData: { accountNumber: '12345678', amount: '-10' },
          errors: { amount: 'Amount must be greater than zero' },
          isSubmitting: false,
          setTransferType: jest.fn(),
          updateField: jest.fn(),
          setErrors: jest.fn(),
          setSubmitting: jest.fn(),
          resetForm: jest.fn(),
        });

        const { getByTestId } = render(
          <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
        );

        await waitFor(() => {
          expect(getByTestId('amount-error')).toHaveTextContent('Amount must be greater than zero');
        });
      });
    });

    describe('International Transfer Validation', () => {
      test('3.5: Should show error message if IBAN is empty on submit', async () => {
        const { usePaymentStore } = require('@/stores/paymentStore');
        usePaymentStore.mockReturnValue({
          formData: { accountNumber: '12345678', amount: '100', iban: '', swiftCode: 'AAAABBCC123' },
          errors: { iban: 'IBAN is required' },
          isSubmitting: false,
          setTransferType: jest.fn(),
          updateField: jest.fn(),
          setErrors: jest.fn(),
          setSubmitting: jest.fn(),
          resetForm: jest.fn(),
        });

        const { getByTestId } = render(
          <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
        );

        await waitFor(() => {
          expect(getByTestId('iban-error')).toHaveTextContent('IBAN is required');
        });
      });

      test('3.6: Should show error message if IBAN exceeds 34 characters', async () => {
        const { usePaymentStore } = require('@/stores/paymentStore');
        usePaymentStore.mockReturnValue({
          formData: { 
            accountNumber: '12345678', 
            amount: '100', 
            iban: 'GB82WEST123456987654321234567890123456', 
            swiftCode: 'AAAABBCC123' 
          },
          errors: { iban: 'IBAN cannot exceed 34 characters' },
          isSubmitting: false,
          setTransferType: jest.fn(),
          updateField: jest.fn(),
          setErrors: jest.fn(),
          setSubmitting: jest.fn(),
          resetForm: jest.fn(),
        });

        const { getByTestId } = render(
          <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
        );

        await waitFor(() => {
          expect(getByTestId('iban-error')).toHaveTextContent('IBAN cannot exceed 34 characters');
        });
      });

      test('3.7: Should show error message if SWIFT Code is empty on submit', async () => {
        const { usePaymentStore } = require('@/stores/paymentStore');
        usePaymentStore.mockReturnValue({
          formData: { accountNumber: '12345678', amount: '100', iban: 'GB82WEST12345698765432', swiftCode: '' },
          errors: { swiftCode: 'SWIFT code is required' },
          isSubmitting: false,
          setTransferType: jest.fn(),
          updateField: jest.fn(),
          setErrors: jest.fn(),
          setSubmitting: jest.fn(),
          resetForm: jest.fn(),
        });

        const { getByTestId } = render(
          <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
        );

        await waitFor(() => {
          expect(getByTestId('swiftCode-error')).toHaveTextContent('SWIFT code is required');
        });
      });

      test('3.8: Should show error message for invalid SWIFT Code format', async () => {
        const { usePaymentStore } = require('@/stores/paymentStore');
        usePaymentStore.mockReturnValue({
          formData: { accountNumber: '12345678', amount: '100', iban: 'GB82WEST12345698765432', swiftCode: 'INVALID' },
          errors: { swiftCode: 'Invalid SWIFT code format (e.g., AAAABBCC123)' },
          isSubmitting: false,
          setTransferType: jest.fn(),
          updateField: jest.fn(),
          setErrors: jest.fn(),
          setSubmitting: jest.fn(),
          resetForm: jest.fn(),
        });

        const { getByTestId } = render(
          <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
        );

        await waitFor(() => {
          expect(getByTestId('swiftCode-error')).toHaveTextContent('Invalid SWIFT code format (e.g., AAAABBCC123)');
        });
      });
    });
  });

  describe('4. Form Submission', () => {
    test('4.1: Should call onSubmit with correct domestic payload when form is valid', async () => {
      const { usePaymentStore } = require('@/stores/paymentStore');
      const mockSetSubmitting = jest.fn();
      const mockResetForm = jest.fn();
      
      usePaymentStore.mockReturnValue({
        formData: { accountNumber: '12345678', amount: '100' },
        errors: {},
        isSubmitting: false,
        setTransferType: jest.fn(),
        updateField: jest.fn(),
        setErrors: jest.fn(),
        setSubmitting: mockSetSubmitting,
        resetForm: mockResetForm,
      });

      const { getByTestId } = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );

      fireEvent.press(getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          accountNumber: '12345678',
          amount: '100',
        });
      });
    });

    test('4.2: Should not call onSubmit if domestic form is invalid', () => {
      const { usePaymentStore } = require('@/stores/paymentStore');
      usePaymentStore.mockReturnValue({
        formData: { accountNumber: '', amount: '100' },
        errors: { accountNumber: 'Account number is required' },
        isSubmitting: false,
        setTransferType: jest.fn(),
        updateField: jest.fn(),
        setErrors: jest.fn(),
        setSubmitting: jest.fn(),
        resetForm: jest.fn(),
      });

      const { getByTestId } = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );

      fireEvent.press(getByTestId('submit-button'));
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('4.3: Should call onSubmit with correct international payload when form is valid', async () => {
      const { usePaymentStore } = require('@/stores/paymentStore');
      const mockSetSubmitting = jest.fn();
      const mockResetForm = jest.fn();
      
      usePaymentStore.mockReturnValue({
        formData: { 
          accountNumber: '12345678', 
          amount: '100', 
          iban: 'GB82WEST12345698765432', 
          swiftCode: 'AAAABBCC123' 
        },
        errors: {},
        isSubmitting: false,
        setTransferType: jest.fn(),
        updateField: jest.fn(),
        setErrors: jest.fn(),
        setSubmitting: mockSetSubmitting,
        resetForm: mockResetForm,
      });

      const { getByTestId } = render(
        <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
      );

      fireEvent.press(getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          accountNumber: '12345678',
          amount: '100',
          iban: 'GB82WEST12345698765432',
          swiftCode: 'AAAABBCC123',
        });
      });
    });

    test('4.4: Should not call onSubmit if international form is invalid', () => {
      const { usePaymentStore } = require('@/stores/paymentStore');
      usePaymentStore.mockReturnValue({
        formData: { accountNumber: '12345678', amount: '100', iban: '', swiftCode: 'AAAABBCC123' },
        errors: { iban: 'IBAN is required' },
        isSubmitting: false,
        setTransferType: jest.fn(),
        updateField: jest.fn(),
        setErrors: jest.fn(),
        setSubmitting: jest.fn(),
        resetForm: jest.fn(),
      });

      const { getByTestId } = render(
        <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
      );

      fireEvent.press(getByTestId('submit-button'));
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('4.5: Should disable Submit button while submitting', () => {
      const { usePaymentStore } = require('@/stores/paymentStore');
      usePaymentStore.mockReturnValue({
        formData: { accountNumber: '12345678', amount: '100' },
        errors: {},
        isSubmitting: true,
        setTransferType: jest.fn(),
        updateField: jest.fn(),
        setErrors: jest.fn(),
        setSubmitting: jest.fn(),
        resetForm: jest.fn(),
      });

      const { getByTestId } = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );

      const submitButton = getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('5. Accessibility', () => {
    test('5.1: All input fields should have appropriate accessibilityLabel props', () => {
      const { getByLabelText } = render(
        <PaymentForm transferType="international" onSubmit={mockOnSubmit} />
      );

      expect(getByLabelText('Account Number')).toBeTruthy();
      expect(getByLabelText('Amount ($)')).toBeTruthy();
      expect(getByLabelText('IBAN')).toBeTruthy();
      expect(getByLabelText('SWIFT Code')).toBeTruthy();
    });

    test('5.2: Submit button should have appropriate accessibilityRole', () => {
      const { getByRole } = render(
        <PaymentForm transferType="domestic" onSubmit={mockOnSubmit} />
      );

      expect(getByRole('button')).toBeTruthy();
    });
  });
});