import { ValidationErrors, DomesticTransferData, InternationalTransferData } from '@/types/payment';

export class PaymentValidator {
  static validateAccountNumber(accountNumber?: string): string | undefined {
    if (!accountNumber || !accountNumber.trim()) {
      return 'Account number is required';
    }
    
    if (!/^\d+$/.test(accountNumber)) {
      return 'Account number must contain only numbers';
    }
    
    if (accountNumber.length < 8 || accountNumber.length > 20) {
      return 'Account number must be between 8-20 digits';
    }
    
    return undefined;
  }

  static validateAmount(amount?: string): string | undefined {
    if (!amount || !amount.trim()) {
      return 'Amount is required';
    }
    
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount)) {
      return 'Amount must be a valid number';
    }
    
    if (numericAmount <= 0) {
      return 'Amount must be greater than zero';
    }
    
    if (numericAmount > 100000) {
      return 'Amount cannot exceed $100,000';
    }
    
    return undefined;
  }

  static validateIban(iban?: string): string | undefined {
    if (!iban || !iban.trim()) {
      return 'IBAN is required';
    }
    
    // Remove spaces and convert to uppercase
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    
    if (cleanIban.length > 34) {
      return 'IBAN cannot exceed 34 characters';
    }
    
    if (cleanIban.length < 15) {
      return 'IBAN must be at least 15 characters';
    }
    
    // Basic IBAN format validation (starts with 2 letters followed by 2 digits and 5 alphanumeric characters)
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) {
      return 'Invalid IBAN format (e.g., GB82WEST12345)';
    }
    
    return undefined;
  }

  static validateSwiftCode(swiftCode?: string): string | undefined {
    if (!swiftCode || !swiftCode.trim()) {
      return 'SWIFT code is required';
    }
    
    const cleanSwiftCode = swiftCode.replace(/\s/g, '').toUpperCase();
    
    // SWIFT code format: 8 or 11 characters (AAAA-BB-CC-123 format)
    if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanSwiftCode)) {
      return 'Invalid SWIFT code format (e.g., AAAABBCC123)';
    }
    
    return undefined;
  }

  static validateDomesticTransfer(data: DomesticTransferData): ValidationErrors {
    return {
      accountNumber: this.validateAccountNumber(data.accountNumber),
      amount: this.validateAmount(data.amount),
    };
  }

  static validateInternationalTransfer(data: InternationalTransferData): ValidationErrors {
    console.log('Validating international transfer data:', JSON.stringify(data, null, 2));
    const errors: ValidationErrors = {};

    const amountError = this.validateAmount(data.amount);
    if (amountError) errors.amount = amountError;

    const ibanError = this.validateIban(data.iban);
    if (ibanError) errors.iban = ibanError;

    const swiftError = this.validateSwiftCode(data.swiftCode);
    if (swiftError) errors.swiftCode = swiftError;

    console.log('International validation errors:', JSON.stringify(errors, null, 2));
    return errors;
  }

  static hasValidationErrors(errors: ValidationErrors): boolean {
    return Object.values(errors).some(error => error !== undefined);
  }
}