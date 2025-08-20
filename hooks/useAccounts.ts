import { useState, useEffect } from 'react';
import { Account } from '@/components/PaymentForm/AccountSelector';

// These are demo accounts from the server
const demoAccounts: Account[] = [
  { accountNumber: '12345678', balance: 15000, name: 'John Doe', currency: 'USD' },
  { accountNumber: '87654321', balance: 8500, name: 'Jane Smith', currency: 'USD' },
  { accountNumber: '11223344', balance: 25000, name: 'Bob Johnson', currency: 'USD' },
];

export function useAccounts() {
  const [accounts] = useState<Account[]>(demoAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  return {
    accounts,
    selectedAccount,
    setSelectedAccount,
  };
}
