import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { TransferType, FormField, PaymentFormData } from '@/types/payment';
import { styles } from './styles';
import AccountSelector, { Account } from './AccountSelector';

// Presentational Component (Handles UI Rendering)
interface PaymentFormUIProps {
  fields: FormField[];
  formData: PaymentFormData;
  isSubmitting: boolean;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: () => void;
  getFieldError: (field: string) => string | undefined;
  transferType: TransferType;
  accounts: Account[];
  selectedAccount: Account | null;
  onSelectAccount: (account: Account) => void;
}

export default function PaymentFormUI({
  fields,
  formData,
  isSubmitting,
  onFieldChange,
  onSubmit,
  getFieldError,
  transferType,
  accounts,
  selectedAccount,
  onSelectAccount,
}: PaymentFormUIProps) {
  const renderFormField = (field: FormField) => {
    const value = formData[field.id as keyof PaymentFormData] || '';
    const error = getFieldError(field.id);

    return (
      <View key={field.id} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={value}
          onChangeText={(text) => {
            // Convert to uppercase for IBAN and SWIFT fields
            const newText = field.id === 'iban' || field.id === 'swiftCode' 
              ? text.toUpperCase()
              : text;
            onFieldChange(field.id, newText);
          }}
          placeholder={field.placeholder}
          keyboardType={field.keyboardType || 'default'}
          maxLength={field.maxLength}
          editable={!isSubmitting}
          autoCapitalize={field.autoCapitalize || 'none'}
          autoCorrect={false}
          spellCheck={false}
          accessibilityLabel={field.label}
          testID={`${field.id}-input`}
        />
        {error && (
          <Text style={styles.errorText} testID={`${field.id}-error`}>
            {error}
          </Text>
        )}
      </View>
    );
  };

  // Disable submit if no account is selected
  const handleSubmit = () => {
    if (!selectedAccount) {
      // You could show an alert or error message here
      return;
    }
    onSubmit();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        <AccountSelector
          selectedAccount={selectedAccount}
          accounts={accounts}
          onSelect={onSelectAccount}
          disabled={isSubmitting}
        />
        {fields.map(renderFormField)}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Send Payment"
          testID="submit-button">
          <Text style={[styles.submitButtonText, isSubmitting && styles.submitButtonTextDisabled]}>
            {isSubmitting ? 'Processing...' : 'Send Payment'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {transferType === 'domestic'
              ? 'Transfers within the country are processed instantly'
              : 'International transfers may take 1-3 business days'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}