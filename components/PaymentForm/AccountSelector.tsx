import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Platform } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

export interface Account {
  accountNumber: string;
  name: string;
  balance: number;
  currency: string;
}

interface AccountSelectorProps {
  selectedAccount: Account | null;
  accounts: Account[];
  onSelect: (account: Account) => void;
  disabled?: boolean;
}

export default function AccountSelector({ selectedAccount, accounts, onSelect, disabled }: AccountSelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderAccount = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={() => {
        onSelect(item);
        setIsModalVisible(false);
      }}
      testID={`account-${item.accountNumber}`}
    >
      <View>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountNumber}>Account: {item.accountNumber}</Text>
      </View>
      <Text style={styles.accountBalance}>{formatCurrency(item.balance)}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, disabled && styles.selectorDisabled]}
        onPress={() => setIsModalVisible(true)}
        disabled={disabled}
        testID="account-selector"
      >
        <View style={styles.selectorContent}>
          {selectedAccount ? (
            <View>
              <Text style={styles.selectedAccountName}>{selectedAccount.name}</Text>
              <Text style={styles.selectedAccountDetails}>
                {selectedAccount.accountNumber} • {formatCurrency(selectedAccount.balance)}
              </Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Select an account</Text>
          )}
        </View>
        <ChevronDown size={20} color="#64748b" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Account</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={accounts}
              renderItem={renderAccount}
              keyExtractor={(item) => item.accountNumber}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
        marginHorizontal: 'auto',
      }
    }),
  },
  selectorDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  selectorContent: {
    flex: 1,
  },
  selectedAccountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  selectedAccountDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    ...Platform.select({
      web: {
        justifyContent: 'center',
        alignItems: 'center',
      }
    }),
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    ...Platform.select({
      web: {
        maxWidth: 600,
        width: '90%',
        borderRadius: 20,
        maxHeight: '90%',
        marginHorizontal: 'auto',
        marginVertical: 'auto',
      }
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#2563eb',
    fontSize: 16,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#6b7280',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
});
