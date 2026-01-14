import { Money } from '@domain/value-objects';
import { IBudgetRepository, ITransactionRepository } from '../../ports';

export interface GetBudgetsInput {
  userId: string;
  month?: number;
  year?: number;
}

export interface BudgetOutput {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  spent: number;
  remaining: number;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export class GetBudgetsUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(input: GetBudgetsInput): Promise<BudgetOutput[]> {
    let budgets;
    if (input.month && input.year) {
      budgets = await this.budgetRepository.findByUserIdAndPeriod(
        input.userId,
        input.month,
        input.year
      );
    } else {
      budgets = await this.budgetRepository.findByUserId(input.userId);
    }

    const results: BudgetOutput[] = [];

    for (const budget of budgets) {
      const startDate = new Date(budget.year, budget.month - 1, 1);
      const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59, 999);

      const spent = await this.transactionRepository.sumByCategoryAndPeriod(
        input.userId,
        budget.categoryId.getValue(),
        startDate,
        endDate
      );

      const spentMoney = Money.create(spent);
      const status = budget.calculateStatus(spentMoney);

      results.push({
        id: budget.id.getValue(),
        userId: budget.userId.getValue(),
        categoryId: budget.categoryId.getValue(),
        amount: budget.amount.getAmount(),
        month: budget.month,
        year: budget.year,
        spent: status.spent,
        remaining: status.remaining,
        percentage: status.percentage,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      });
    }

    return results;
  }
}
