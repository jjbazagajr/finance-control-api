import { api } from './api';
import type { Budget } from '../types';

interface CreateBudgetData {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

interface UpdateBudgetData {
  amount?: number;
}

export const budgetsService = {
  async getAll(): Promise<Budget[]> {
    return api.get<Budget[]>('/budgets');
  },

  async getById(id: string): Promise<Budget> {
    return api.get<Budget>(`/budgets/${id}`);
  },

  async create(data: CreateBudgetData): Promise<Budget> {
    return api.post<Budget>('/budgets', data);
  },

  async update(id: string, data: UpdateBudgetData): Promise<Budget> {
    return api.put<Budget>(`/budgets/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/budgets/${id}`);
  },
};
