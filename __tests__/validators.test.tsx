import { PaymentValidator } from '@/utils/validators';

describe('PaymentValidator', () => {
  describe('validateAccountNumber', () => {
    test('should return error for empty account number', () => {
      const result = PaymentValidator.validateAccountNumber('');
      expect(result).toBe('Account number is required');
    });

    test('should return error for non-numeric characters', () => {
      const result = PaymentValidator.validateAccountNumber('abc123');
      expect(result).toBe('Account number must contain only numbers');
    });

    test('should return error for too short account number', () => {
      const result = PaymentValidator.validateAccountNumber('1234567');
      expect(result).toBe('Account number must be between 8-20 digits');
    });

    test('should return error for too long account number', () => {
      const result = PaymentValidator.validateAccountNumber('123456789012345678901');
      expect(result).toBe('Account number must be between 8-20 digits');
    });

    test('should return undefined for valid account number', () => {
      const result = PaymentValidator.validateAccountNumber('12345678');
      expect(result).toBeUndefined();
    });
  });

  describe('validateAmount', () => {
    test('should return error for empty amount', () => {
      const result = PaymentValidator.validateAmount('');
      expect(result).toBe('Amount is required');
    });

    test('should return error for non-numeric amount', () => {
      const result = PaymentValidator.validateAmount('abc');
      expect(result).toBe('Amount must be a valid number');
    });

    test('should return error for zero amount', () => {
      const result = PaymentValidator.validateAmount('0');
      expect(result).toBe('Amount must be greater than zero');
    });

    test('should return error for negative amount', () => {
      const result = PaymentValidator.validateAmount('-10');
      expect(result).toBe('Amount must be greater than zero');
    });

    test('should return error for amount exceeding limit', () => {
      const result = PaymentValidator.validateAmount('100001');
      expect(result).toBe('Amount cannot exceed $100,000');
    });

    test('should return undefined for valid amount', () => {
      const result = PaymentValidator.validateAmount('100.50');
      expect(result).toBeUndefined();
    });
  });

  describe('validateIban', () => {
    test('should return error for empty IBAN', () => {
      const result = PaymentValidator.validateIban('');
      expect(result).toBe('IBAN is required');
    });

    test('should return error for IBAN exceeding 34 characters', () => {
      const result = PaymentValidator.validateIban('GB82WEST123456987654321234567890123456');
      expect(result).toBe('IBAN cannot exceed 34 characters');
    });

    test('should return error for IBAN shorter than 15 characters', () => {
      const result = PaymentValidator.validateIban('GB82WEST123');
      expect(result).toBe('IBAN must be at least 15 characters');
    });

    test('should return error for invalid IBAN format', () => {
      const result = PaymentValidator.validateIban('INVALIDIBAN123456');
      expect(result).toBe('Invalid IBAN format');
    });

    test('should return undefined for valid IBAN', () => {
      const result = PaymentValidator.validateIban('GB82WEST12345698765432');
      expect(result).toBeUndefined();
    });
  });

  describe('validateSwiftCode', () => {
    test('should return error for empty SWIFT code', () => {
      const result = PaymentValidator.validateSwiftCode('');
      expect(result).toBe('SWIFT code is required');
    });

    test('should return error for invalid SWIFT code format', () => {
      const result = PaymentValidator.validateSwiftCode('INVALID');
      expect(result).toBe('Invalid SWIFT code format (e.g., AAAABBCC123)');
    });

    test('should return undefined for valid 8-character SWIFT code', () => {
      const result = PaymentValidator.validateSwiftCode('AAAABBCC');
      expect(result).toBeUndefined();
    });

    test('should return undefined for valid 11-character SWIFT code', () => {
      const result = PaymentValidator.validateSwiftCode('AAAABBCC123');
      expect(result).toBeUndefined();
    });
  });

  describe('validateDomesticTransfer', () => {
    test('should return errors for invalid domestic transfer data', () => {
      const data = { accountNumber: '', amount: '' };
      const errors = PaymentValidator.validateDomesticTransfer(data);
      
      expect(errors.accountNumber).toBe('Account number is required');
      expect(errors.amount).toBe('Amount is required');
    });

    test('should return no errors for valid domestic transfer data', () => {
      const data = { accountNumber: '12345678', amount: '100.50' };
      const errors = PaymentValidator.validateDomesticTransfer(data);
      
      expect(errors.accountNumber).toBeUndefined();
      expect(errors.amount).toBeUndefined();
    });
  });

  describe('validateInternationalTransfer', () => {
    test('should return errors for invalid international transfer data', () => {
      const data = { 
        accountNumber: '', 
        amount: '', 
        iban: '', 
        swiftCode: '' 
      };
      const errors = PaymentValidator.validateInternationalTransfer(data);
      
      expect(errors.accountNumber).toBe('Account number is required');
      expect(errors.amount).toBe('Amount is required');
      expect(errors.iban).toBe('IBAN is required');
      expect(errors.swiftCode).toBe('SWIFT code is required');
    });

    test('should return no errors for valid international transfer data', () => {
      const data = { 
        accountNumber: '12345678', 
        amount: '100.50', 
        iban: 'GB82WEST12345698765432', 
        swiftCode: 'AAAABBCC123' 
      };
      const errors = PaymentValidator.validateInternationalTransfer(data);
      
      expect(errors.accountNumber).toBeUndefined();
      expect(errors.amount).toBeUndefined();
      expect(errors.iban).toBeUndefined();
      expect(errors.swiftCode).toBeUndefined();
    });
  });

  describe('hasValidationErrors', () => {
    test('should return true when errors exist', () => {
      const errors = { accountNumber: 'Required', amount: undefined };
      const hasErrors = PaymentValidator.hasValidationErrors(errors);
      
      expect(hasErrors).toBe(true);
    });

    test('should return false when no errors exist', () => {
      const errors = { accountNumber: undefined, amount: undefined };
      const hasErrors = PaymentValidator.hasValidationErrors(errors);
      
      expect(hasErrors).toBe(false);
    });
  });
});