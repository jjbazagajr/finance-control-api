import { api } from './api';
import type { Account, AccountType } from '../types';

interface CreateAccountData {
  name: string;
  type: AccountType;
  currency?: string;
  initialBalance: number;
}

interface UpdateAccountData {
  name?: string;
  type?: AccountType;
}

export const accountsService = {
  async getAll(): Promise<Account[]> {
    return api.get<Account[]>('/accounts');
  },

  async getById(id: string): Promise<Account> {
    return api.get<Account>(`/accounts/${id}`);
  },

  async create(data: CreateAccountData): Promise<Account> {
    return api.post<Account>('/accounts', data);
  },

  async update(id: string, data: UpdateAccountData): Promise<Account> {
    return api.put<Account>(`/accounts/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/accounts/${id}`);
  },
};
