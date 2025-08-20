import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import PaymentForm from '@/components/PaymentForm';
import PaymentSuccess from '@/components/PaymentSuccess';
import { usePaymentApi } from '@/hooks/usePaymentApi';
import { TransferType } from '@/types/payment';
import { TransferResponse } from '@/services/paymentApi';

interface PaymentScreenProps {
  transferType: TransferType;
}

export default function PaymentScreen({ transferType }: PaymentScreenProps) {
  const [successData, setSuccessData] = React.useState<TransferResponse | null>(null);
  const { isLoading, error, submitPayment, clearError } = usePaymentApi();

  const title = transferType === 'domestic' ? 'Domestic Transfer' : 'International Transfer';
  const subtitle = transferType === 'domestic' 
    ? 'Send money within the country' 
    : 'Send money worldwide';

  const handlePaymentSubmit = async (data: any) => {
    clearError();
    
    try {
      console.log('Submitting payment:', { transferType, data });
      const result = await submitPayment(transferType, data);
      console.log('Payment result:', result);
      
      if (result && result.transactionId) {
        console.log('Payment successful, setting success data:', result);
        setSuccessData(result);
        return;
      }
      
      // If we get here, something went wrong
      const errorMessage = error || 'Payment could not be completed. Please try again.';
      console.error('Payment failed:', { error, result });
      Alert.alert(
        'Payment Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Payment submission failed:', err);
      Alert.alert(
        'Payment Failed',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleGoBack = () => {
    setSuccessData(null);
    clearError();
  };

  const handleNewTransfer = () => {
    setSuccessData(null);
    clearError();
  };

  // Show success screen if payment was successful
  if (successData) {
    return (
      <SafeAreaView style={styles.container}>
        <PaymentSuccess
          transferData={successData}
          onGoBack={handleGoBack}
          onNewTransfer={handleNewTransfer}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.formContainer}>
        <PaymentForm
          transferType={transferType}
          onSubmit={handlePaymentSubmit}
          isSubmitting={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
});