import React from 'react';
import { Alert } from 'react-native';
import { PaymentFormProps, DomesticTransferData, InternationalTransferData } from '@/types/payment';
import { usePaymentForm } from '@/hooks/usePaymentForm';
import { useAccounts } from '@/hooks/useAccounts';
import PaymentFormUI from './PaymentFormUI';
import { PaymentFormFieldsFactory } from './PaymentFormFieldsFactory';

// Container Component (Handles Logic)
export default function PaymentForm({ transferType, onSubmit, isSubmitting: externalSubmitting }: PaymentFormProps) {
  const {
    formData,
    isSubmitting: internalSubmitting,
    handleSubmit,
    handleFieldChange,
    getFieldError,
  } = usePaymentForm(transferType);

  const { accounts, selectedAccount, setSelectedAccount } = useAccounts();

  // Use external submitting state if provided, otherwise use internal
  const isSubmitting = externalSubmitting ?? internalSubmitting;

  // Strategy Pattern: Get fields based on transfer type
  const fields = PaymentFormFieldsFactory.createFields(transferType);

  // Update form data when account is selected
  React.useEffect(() => {
    if (selectedAccount && formData.sourceAccountNumber !== selectedAccount.accountNumber) {
      handleFieldChange('sourceAccountNumber', selectedAccount.accountNumber);
    }
  }, [selectedAccount, formData.sourceAccountNumber]);

  const onFormSubmit = () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please select an account first');
      return;
    }

    // Use existing form data and update only the account related fields
    // Update the form data first
    handleFieldChange('sourceAccountNumber', selectedAccount.accountNumber);
    if (transferType === 'domestic') {
      handleFieldChange('accountNumber', selectedAccount.accountNumber);
    }

    // Prepare the submission data
    handleSubmit(() => {
      const baseData = {
        sourceAccountNumber: selectedAccount.accountNumber,
        amount: formData.amount,
      };

      if (transferType === 'domestic') {
        onSubmit({
          ...baseData,
          accountNumber: selectedAccount.accountNumber,
        } as DomesticTransferData);
      } else {
        onSubmit({
          ...baseData,
          iban: (formData as InternationalTransferData).iban,
          swiftCode: (formData as InternationalTransferData).swiftCode,
        } as InternationalTransferData);
      }
    });
  };

  return (
    <PaymentFormUI
      fields={fields}
      formData={formData}
      isSubmitting={isSubmitting}
      onFieldChange={handleFieldChange}
      onSubmit={onFormSubmit}
      getFieldError={getFieldError}
      transferType={transferType}
      accounts={accounts}
      selectedAccount={selectedAccount}
      onSelectAccount={setSelectedAccount}
    />
  );
}