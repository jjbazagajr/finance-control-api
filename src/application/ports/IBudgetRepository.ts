import { Budget } from '@domain/entities';

export interface IBudgetRepository {
  findById(id: string): Promise<Budget | null>;
  findByUserId(userId: string): Promise<Budget[]>;
  findByUserIdAndCategoryAndPeriod(
    userId: string,
    categoryId: string,
    month: number,
    year: number
  ): Promise<Budget | null>;
  findByUserIdAndPeriod(userId: string, month: number, year: number): Promise<Budget[]>;
  create(budget: Budget): Promise<Budget>;
  update(budget: Budget): Promise<Budget>;
  delete(id: string): Promise<void>;
}
