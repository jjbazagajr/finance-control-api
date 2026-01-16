import { api } from './api';
import type { Transaction, TransactionType, TransactionFilters } from '../types';

interface CreateTransactionData {
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  date: string;
}

interface UpdateTransactionData {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  amount?: number;
  description?: string;
  date?: string;
}

export const transactionsService = {
  async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.accountId) params.append('accountId', filters.accountId);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.type) params.append('type', filters.type);

    const queryString = params.toString();
    return api.get<Transaction[]>(`/transactions${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<Transaction> {
    return api.get<Transaction>(`/transactions/${id}`);
  },

  async create(data: CreateTransactionData): Promise<Transaction> {
    return api.post<Transaction>('/transactions', data);
  },

  async update(id: string, data: UpdateTransactionData): Promise<Transaction> {
    return api.put<Transaction>(`/transactions/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/transactions/${id}`);
  },
};
