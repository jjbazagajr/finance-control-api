import { CategoryNotFoundError, ForbiddenError } from '@domain/errors';
import { ICategoryRepository } from '../../ports';

export interface DeleteCategoryInput {
  id: string;
  userId: string;
}

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    const category = await this.categoryRepository.findById(input.id);
    if (!category) {
      throw new CategoryNotFoundError(input.id);
    }

    if (category.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to delete this category');
    }

    await this.categoryRepository.delete(input.id);
  }
}
