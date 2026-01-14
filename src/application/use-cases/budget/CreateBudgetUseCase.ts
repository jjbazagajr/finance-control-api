import { Budget } from '@domain/entities';
import { CategoryNotFoundError, ForbiddenError, BudgetAlreadyExistsError } from '@domain/errors';
import { IBudgetRepository, ICategoryRepository } from '../../ports';

export interface CreateBudgetInput {
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export interface CreateBudgetOutput {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateBudgetUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: CreateBudgetInput): Promise<CreateBudgetOutput> {
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new CategoryNotFoundError(input.categoryId);
    }
    if (category.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to use this category');
    }

    const existingBudget = await this.budgetRepository.findByUserIdAndCategoryAndPeriod(
      input.userId,
      input.categoryId,
      input.month,
      input.year
    );
    if (existingBudget) {
      throw new BudgetAlreadyExistsError(input.categoryId, input.month, input.year);
    }

    const budget = Budget.create({
      userId: input.userId,
      categoryId: input.categoryId,
      amount: input.amount,
      month: input.month,
      year: input.year,
    });

    const createdBudget = await this.budgetRepository.create(budget);

    return {
      id: createdBudget.id.getValue(),
      userId: createdBudget.userId.getValue(),
      categoryId: createdBudget.categoryId.getValue(),
      amount: createdBudget.amount.getAmount(),
      month: createdBudget.month,
      year: createdBudget.year,
      createdAt: createdBudget.createdAt,
      updatedAt: createdBudget.updatedAt,
    };
  }
}
