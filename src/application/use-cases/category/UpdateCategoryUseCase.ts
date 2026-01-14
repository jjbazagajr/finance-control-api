import { CategoryType } from '@domain/entities';
import {
  CategoryNotFoundError,
  CategoryNameAlreadyExistsError,
  ForbiddenError,
} from '@domain/errors';
import { ICategoryRepository } from '../../ports';

export interface UpdateCategoryInput {
  id: string;
  userId: string;
  name?: string;
  type?: CategoryType;
}

export interface UpdateCategoryOutput {
  id: string;
  userId: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const category = await this.categoryRepository.findById(input.id);
    if (!category) {
      throw new CategoryNotFoundError(input.id);
    }

    if (category.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to update this category');
    }

    if (input.name && input.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByUserIdAndName(
        input.userId,
        input.name
      );
      if (existingCategory) {
        throw new CategoryNameAlreadyExistsError(input.name);
      }
      category.updateName(input.name);
    }

    if (input.type) {
      category.updateType(input.type);
    }

    const updatedCategory = await this.categoryRepository.update(category);

    return {
      id: updatedCategory.id.getValue(),
      userId: updatedCategory.userId.getValue(),
      name: updatedCategory.name,
      type: updatedCategory.type,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
    };
  }
}
