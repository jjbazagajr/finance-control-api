import { BudgetNotFoundError, ForbiddenError } from '@domain/errors';
import { IBudgetRepository } from '../../ports';

export interface UpdateBudgetInput {
  id: string;
  userId: string;
  amount?: number;
  month?: number;
  year?: number;
}

export interface UpdateBudgetOutput {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateBudgetUseCase {
  constructor(private readonly budgetRepository: IBudgetRepository) {}

  async execute(input: UpdateBudgetInput): Promise<UpdateBudgetOutput> {
    const budget = await this.budgetRepository.findById(input.id);
    if (!budget) {
      throw new BudgetNotFoundError(input.id);
    }

    if (budget.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to update this budget');
    }

    if (input.amount) {
      budget.updateAmount(input.amount);
    }

    if (input.month && input.year) {
      budget.updatePeriod(input.month, input.year);
    }

    const updatedBudget = await this.budgetRepository.update(budget);

    return {
      id: updatedBudget.id.getValue(),
      userId: updatedBudget.userId.getValue(),
      categoryId: updatedBudget.categoryId.getValue(),
      amount: updatedBudget.amount.getAmount(),
      month: updatedBudget.month,
      year: updatedBudget.year,
      createdAt: updatedBudget.createdAt,
      updatedAt: updatedBudget.updatedAt,
    };
  }
}
