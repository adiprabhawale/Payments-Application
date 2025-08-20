export type TransferType = 'domestic' | 'international';

export interface DomesticTransferData {
  sourceAccountNumber: string;
  accountNumber: string;
  amount: string;
}

export interface InternationalTransferData extends Omit<DomesticTransferData, 'accountNumber'> {
  iban: string;
  swiftCode: string;
}

export type PaymentFormData = DomesticTransferData | InternationalTransferData;

export interface ValidationErrors {
  accountNumber?: string;
  amount?: string;
  iban?: string;
  swiftCode?: string;
}

export interface PaymentFormProps {
  transferType: TransferType;
  onSubmit: (data: PaymentFormData) => void;
  isSubmitting?: boolean;
}

export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  maxLength?: number;
  required: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}