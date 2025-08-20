import { create } from 'zustand';
import { PaymentFormData, TransferType, ValidationErrors } from '@/types/payment';

interface PaymentState {
  formData: PaymentFormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  transferType: TransferType;
  
  // Actions
  setTransferType: (type: TransferType) => void;
  updateField: (field: string, value: string) => void;
  setErrors: (errors: ValidationErrors) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
}

const getInitialFormData = (transferType: TransferType): PaymentFormData => {
  const baseData = {
    sourceAccountNumber: '',
    amount: '',
  };

  if (transferType === 'domestic') {
    return {
      ...baseData,
      accountNumber: '',
    };
  }

  return {
    ...baseData,
    iban: '',
    swiftCode: '',
  };
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  formData: getInitialFormData('domestic'),
  errors: {},
  isSubmitting: false,
  transferType: 'domestic',

  setTransferType: (transferType) => {
    set({
      transferType,
      formData: getInitialFormData(transferType),
      errors: {},
    });
  },

  updateField: (field, value) => {
    set((state) => {
      const currentValue = state.formData[field as keyof PaymentFormData];
      // Don't update if value hasn't changed
      if (currentValue === value) {
        return state;
      }

      return {
        ...state,
        formData: {
          ...state.formData,
          [field]: value,
        },
        // Clear error for this field when user starts typing
        errors: {
          ...state.errors,
          [field]: undefined,
        },
      };
    });
  },

  setErrors: (errors) => {
    set({ errors });
  },

  setSubmitting: (isSubmitting) => {
    set({ isSubmitting });
  },

  resetForm: () => {
    const { transferType } = get();
    set({
      formData: getInitialFormData(transferType),
      errors: {},
      isSubmitting: false,
    });
  },
}));