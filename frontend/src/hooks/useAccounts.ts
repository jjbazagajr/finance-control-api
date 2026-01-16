import { useState, useEffect, useCallback } from 'react';
import { accountsService } from '../services/accounts';
import type { Account, AccountType } from '../types';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await accountsService.getAll();
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const createAccount = async (data: {
    name: string;
    type: AccountType;
    initialBalance: number;
  }) => {
    const newAccount = await accountsService.create(data);
    setAccounts((prev) => [...prev, newAccount]);
    return newAccount;
  };

  const updateAccount = async (id: string, data: { name?: string; type?: AccountType }) => {
    const updatedAccount = await accountsService.update(id, data);
    setAccounts((prev) => prev.map((acc) => (acc.id === id ? updatedAccount : acc)));
    return updatedAccount;
  };

  const deleteAccount = async (id: string) => {
    await accountsService.delete(id);
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.currentBalance), 0);

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    totalBalance,
  };
}
