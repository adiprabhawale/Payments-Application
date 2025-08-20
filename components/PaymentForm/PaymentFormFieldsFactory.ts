import { TransferType, FormField } from '@/types/payment';

// Factory Pattern: Creates fields based on transfer type
export class PaymentFormFieldsFactory {
  private static domesticFields: FormField[] = [
    {
      id: 'amount',
      label: 'Amount ($)',
      placeholder: 'Enter amount to send',
      keyboardType: 'numeric',
      required: true,
    },
  ];

  private static internationalFields: FormField[] = [
    {
      id: 'amount',
      label: 'Amount ($)',
      placeholder: 'Enter amount to send',
      keyboardType: 'numeric',
      required: true,
    },
    {
      id: 'iban',
      label: 'IBAN',
      placeholder: 'Enter IBAN (e.g., GB82 WEST 1234 5698 7654 32)',
      maxLength: 34,
      required: true,
      keyboardType: 'default',
      autoCapitalize: 'characters',
    },
    {
      id: 'swiftCode',
      label: 'SWIFT Code',
      placeholder: 'Enter SWIFT code (e.g., AAAABBCC123)',
      maxLength: 11,
      required: true,
    },
  ];

  static createFields(transferType: TransferType): FormField[] {
    switch (transferType) {
      case 'domestic':
        return PaymentFormFieldsFactory.domesticFields;
      case 'international':
        return PaymentFormFieldsFactory.internationalFields;
      default:
        throw new Error(`Unsupported transfer type: ${transferType}`);
    }
  }
}