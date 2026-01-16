import { useState, useEffect, useCallback } from 'react';
import { categoriesService } from '../services/categories';
import type { Category, CategoryType } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (data: { name: string; type: CategoryType }) => {
    const newCategory = await categoriesService.create(data);
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = async (id: string, data: { name?: string; type?: CategoryType }) => {
    const updatedCategory = await categoriesService.update(id, data);
    setCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));
    return updatedCategory;
  };

  const deleteCategory = async (id: string) => {
    await categoriesService.delete(id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const incomeCategories = categories.filter((cat) => cat.type === 'INCOME');
  const expenseCategories = categories.filter((cat) => cat.type === 'EXPENSE');

  return {
    categories,
    incomeCategories,
    expenseCategories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
