import { Transaction, TransactionType } from '@domain/entities';

export interface TransactionFilters {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
}

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByUserId(userId: string): Promise<Transaction[]>;
  findByFilters(filters: TransactionFilters): Promise<Transaction[]>;
  findByTransferId(transferId: string): Promise<Transaction[]>;
  create(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
  deleteByTransferId(transferId: string): Promise<void>;
  sumByUserIdAndTypeAndPeriod(
    userId: string,
    type: TransactionType,
    startDate: Date,
    endDate: Date
  ): Promise<number>;
  sumByCategoryAndPeriod(
    userId: string,
    categoryId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number>;
  getTopCategoriesByExpense(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<{ categoryId: string; total: number }[]>;
  getDailyTotals(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ date: Date; income: number; expense: number }[]>;
}
