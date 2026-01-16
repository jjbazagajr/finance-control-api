import { api } from './api';
import type { MonthlySummary } from '../types';

export const summaryService = {
  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    return api.get<MonthlySummary>(`/summary/monthly?year=${year}&month=${month}`);
  },
};
