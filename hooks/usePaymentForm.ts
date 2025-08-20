import { useEffect } from 'react';
import { usePaymentStore } from '@/stores/paymentStore';
import { PaymentValidator } from '@/utils/validators';
import { TransferType, PaymentFormData, DomesticTransferData, InternationalTransferData, ValidationErrors } from '@/types/payment';

export const usePaymentForm = (transferType: TransferType) => {
  const {
    formData,
    errors,
    isSubmitting,
    setTransferType,
    updateField,
    setErrors,
    setSubmitting,
    resetForm,
  } = usePaymentStore();

  // Update transfer type when it changes
  useEffect(() => {
    setTransferType(transferType);
  }, [transferType, setTransferType]);

  const validateForm = (): boolean => {
    console.log('Starting validation for type:', transferType);
    console.log('Form data to validate:', JSON.stringify(formData, null, 2));

    let validationErrors: ValidationErrors = {};

    // Basic validation first
    if (!formData.amount) {
      validationErrors.amount = 'Amount is required';
    }

    if (transferType === 'domestic') {
      const domesticData = formData as DomesticTransferData;
      
      if (!domesticData.accountNumber) {
        validationErrors.accountNumber = 'Account number is required';
      }
      
      if (!domesticData.sourceAccountNumber) {
        validationErrors.accountNumber = 'Source account is required';
      }

      // Only validate further if basic fields are present
      if (Object.keys(validationErrors).length === 0) {
        validationErrors = PaymentValidator.validateDomesticTransfer(domesticData);
      }
    } else {
      const internationalData = formData as InternationalTransferData;
      
      if (!internationalData.iban) {
        validationErrors.iban = 'IBAN is required';
      }
      
      if (!internationalData.swiftCode) {
        validationErrors.swiftCode = 'SWIFT code is required';
      }
      
      if (!internationalData.sourceAccountNumber) {
        validationErrors.accountNumber = 'Source account is required';
      }

      // Only validate further if basic fields are present
      if (Object.keys(validationErrors).length === 0) {
        validationErrors = PaymentValidator.validateInternationalTransfer(internationalData);
      }
    }
    
    console.log('Validation errors:', JSON.stringify(validationErrors, null, 2));

    console.log('Validation errors:', validationErrors);
    setErrors(validationErrors);
    return !PaymentValidator.hasValidationErrors(validationErrors);
  };

  const handleSubmit = async (onSubmit: (data: PaymentFormData) => void): Promise<void> => {
    const isValid = validateForm();
    
    if (!isValid) {
      console.log('Form validation failed:', errors);
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting form data:', formData);
      await onSubmit(formData);
    } catch (error) {
      console.error('Payment submission failed:', error);
      setErrors({ amount: 'Payment submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (field: string, value: string): void => {
    updateField(field, value);
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[field as keyof typeof errors];
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleFieldChange,
    getFieldError,
    resetForm,
  };
};