import { TransactionType } from '@domain/entities';
import { ITransactionRepository, ICategoryRepository } from '../../ports';

export interface GetMonthlySummaryInput {
  userId: string;
  year: number;
  month: number;
}

export interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  total: number;
}

export interface DailyTotal {
  date: string;
  income: number;
  expense: number;
}

export interface GetMonthlySummaryOutput {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  topExpenseCategories: CategoryExpense[];
  dailyTotals: DailyTotal[];
}

export class GetMonthlySummaryUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: GetMonthlySummaryInput): Promise<GetMonthlySummaryOutput> {
    const startDate = new Date(input.year, input.month - 1, 1);
    const endDate = new Date(input.year, input.month, 0, 23, 59, 59, 999);

    const totalIncome = await this.transactionRepository.sumByUserIdAndTypeAndPeriod(
      input.userId,
      TransactionType.INCOME,
      startDate,
      endDate
    );

    const totalExpense = await this.transactionRepository.sumByUserIdAndTypeAndPeriod(
      input.userId,
      TransactionType.EXPENSE,
      startDate,
      endDate
    );

    const balance = totalIncome - totalExpense;

    const topCategories = await this.transactionRepository.getTopCategoriesByExpense(
      input.userId,
      startDate,
      endDate,
      5
    );

    const topExpenseCategories: CategoryExpense[] = [];
    for (const cat of topCategories) {
      const category = await this.categoryRepository.findById(cat.categoryId);
      topExpenseCategories.push({
        categoryId: cat.categoryId,
        categoryName: category?.name || 'Unknown',
        total: cat.total,
      });
    }

    const dailyTotalsRaw = await this.transactionRepository.getDailyTotals(
      input.userId,
      startDate,
      endDate
    );

    const dailyTotals: DailyTotal[] = dailyTotalsRaw.map((dt) => ({
      date: dt.date.toISOString().split('T')[0],
      income: dt.income,
      expense: dt.expense,
    }));

    return {
      year: input.year,
      month: input.month,
      totalIncome,
      totalExpense,
      balance,
      topExpenseCategories,
      dailyTotals,
    };
  }
}
