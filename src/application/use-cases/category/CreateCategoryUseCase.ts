import { Category, CategoryType } from '@domain/entities';
import { CategoryNameAlreadyExistsError } from '@domain/errors';
import { ICategoryRepository } from '../../ports';

export interface CreateCategoryInput {
  userId: string;
  name: string;
  type: CategoryType;
}

export interface CreateCategoryOutput {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const existingCategory = await this.categoryRepository.findByUserIdAndName(
      input.userId,
      input.name
    );
    if (existingCategory) {
      throw new CategoryNameAlreadyExistsError(input.name);
    }

    const category = Category.create({
      userId: input.userId,
      name: input.name,
      type: input.type,
    });

    const createdCategory = await this.categoryRepository.create(category);

    return {
      id: createdCategory.id.getValue(),
      userId: createdCategory.userId.getValue(),
      name: createdCategory.name,
      type: createdCategory.type,
      createdAt: createdCategory.createdAt,
      updatedAt: createdCategory.updatedAt,
    };
  }
}
