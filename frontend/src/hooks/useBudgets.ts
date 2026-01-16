import { useState, useEffect, useCallback } from 'react';
import { budgetsService } from '../services/budgets';
import type { Budget } from '../types';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await budgetsService.getAll();
      setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const createBudget = async (data: {
    categoryId: string;
    amount: number;
    month: number;
    year: number;
  }) => {
    const newBudget = await budgetsService.create(data);
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = async (id: string, data: { amount?: number }) => {
    const updatedBudget = await budgetsService.update(id, data);
    setBudgets((prev) => prev.map((b) => (b.id === id ? updatedBudget : b)));
    return updatedBudget;
  };

  const deleteBudget = async (id: string) => {
    await budgetsService.delete(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    budgets,
    isLoading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}
