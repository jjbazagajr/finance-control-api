import { api } from './api';
import type { Transfer } from '../types';

interface CreateTransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  date: string;
}

export const transfersService = {
  async getAll(): Promise<Transfer[]> {
    return api.get<Transfer[]>('/transfers');
  },

  async create(data: CreateTransferData): Promise<Transfer> {
    return api.post<Transfer>('/transfers', data);
  },
};
