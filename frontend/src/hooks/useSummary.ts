import { useState, useEffect, useCallback } from 'react';
import { summaryService } from '../services/summary';
import type { MonthlySummary } from '../types';

export function useSummary(year?: number, month?: number) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(year || now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(month || now.getMonth() + 1);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await summaryService.getMonthlySummary(selectedYear, selectedMonth);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const setMonth = (month: number) => {
    setSelectedMonth(month);
  };

  const setYear = (year: number) => {
    setSelectedYear(year);
  };

  return {
    summary,
    selectedYear,
    selectedMonth,
    isLoading,
    error,
    fetchSummary,
    setMonth,
    setYear,
  };
}
