import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CircleCheck as CheckCircle, Copy, ArrowLeft } from 'lucide-react-native';
import { TransferResponse } from '@/services/paymentApi';

interface PaymentSuccessProps {
  transferData: TransferResponse;
  onGoBack: () => void;
  onNewTransfer: () => void;
}

export default function PaymentSuccess({ 
  transferData, 
  onGoBack, 
  onNewTransfer 
}: PaymentSuccessProps) {
  const copyTransactionId = () => {
    // In a real app, you'd use Clipboard API
    console.log('Copied transaction ID:', transferData.transactionId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.successHeader}>
        <CheckCircle size={64} color="#16a34a" />
        <Text style={styles.successTitle}>Transfer Successful!</Text>
        <Text style={styles.successSubtitle}>
          Your payment has been {transferData.status === 'completed' ? 'processed' : 'submitted'}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <View style={styles.transactionIdContainer}>
            <Text style={styles.transactionId}>
              {transferData.transactionId.slice(0, 8)}...
            </Text>
            <TouchableOpacity onPress={copyTransactionId} style={styles.copyButton}>
              <Copy size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>{formatCurrency(transferData.amount)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fee</Text>
          <Text style={styles.detailValue}>{formatCurrency(transferData.fee)}</Text>
        </View>

        <View style={[styles.detailRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(transferData.total)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <View style={[
            styles.statusBadge,
            transferData.status === 'completed' ? styles.completedBadge : styles.pendingBadge
          ]}>
            <Text style={[
              styles.statusText,
              transferData.status === 'completed' ? styles.completedText : styles.pendingText
            ]}>
              {transferData.status.charAt(0).toUpperCase() + transferData.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Processing Time</Text>
          <Text style={styles.detailValue}>{transferData.processingTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date & Time</Text>
          <Text style={styles.detailValue}>{formatDate(transferData.timestamp)}</Text>
        </View>

        {transferData.estimatedArrival && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Arrival</Text>
            <Text style={styles.detailValue}>
              {formatDate(transferData.estimatedArrival)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onGoBack}>
          <ArrowLeft size={20} color="#64748b" />
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={onNewTransfer}>
          <Text style={styles.primaryButtonText}>New Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
        marginHorizontal: 'auto',
      }
    })
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
    marginTop: 8,
    paddingTop: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  transactionIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionId: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedText: {
    color: '#16a34a',
  },
  pendingText: {
    color: '#d97706',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },
});