export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

export type AccountType = 'CASH' | 'BANK' | 'CREDIT';

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  createdAt: string;
  updatedAt: string;
}

export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  date: string;
  transferId: string | null;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  category?: Category;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transfer {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  fromAccount?: Account;
  toAccount?: Account;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  spent?: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  topCategories: {
    categoryId: string;
    categoryName: string;
    total: number;
  }[];
  dailyEvolution: {
    date: string;
    income: number;
    expense: number;
  }[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
}
