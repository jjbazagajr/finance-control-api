import { BudgetNotFoundError, ForbiddenError } from '@domain/errors';
import { IBudgetRepository } from '../../ports';

export interface DeleteBudgetInput {
  id: string;
  userId: string;
}

export class DeleteBudgetUseCase {
  constructor(private readonly budgetRepository: IBudgetRepository) {}

  async execute(input: DeleteBudgetInput): Promise<void> {
    const budget = await this.budgetRepository.findById(input.id);
    if (!budget) {
      throw new BudgetNotFoundError(input.id);
    }

    if (budget.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to delete this budget');
    }

    await this.budgetRepository.delete(input.id);
  }
}
