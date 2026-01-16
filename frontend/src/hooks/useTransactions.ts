import { useState, useEffect, useCallback } from 'react';
import { transactionsService } from '../services/transactions';
import type { Transaction, TransactionType, TransactionFilters } from '../types';

export function useTransactions(initialFilters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await transactionsService.getAll(filters);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (data: {
    accountId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    description?: string;
    date: string;
  }) => {
    const newTransaction = await transactionsService.create(data);
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = async (
    id: string,
    data: {
      accountId?: string;
      categoryId?: string;
      type?: TransactionType;
      amount?: number;
      description?: string;
      date?: string;
    }
  ) => {
    const updatedTransaction = await transactionsService.update(id, data);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updatedTransaction : t)));
    return updatedTransaction;
  };

  const deleteTransaction = async (id: string) => {
    await transactionsService.delete(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  return {
    transactions,
    filters,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateFilters,
  };
}
