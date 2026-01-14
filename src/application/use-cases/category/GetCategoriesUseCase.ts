import { ICategoryRepository } from '../../ports';

export interface GetCategoriesInput {
  userId: string;
  type?: string;
}

export interface CategoryOutput {
  id: string;
  userId: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: GetCategoriesInput): Promise<CategoryOutput[]> {
    let categories;
    if (input.type) {
      categories = await this.categoryRepository.findByUserIdAndType(input.userId, input.type);
    } else {
      categories = await this.categoryRepository.findByUserId(input.userId);
    }

    return categories.map((category) => ({
      id: category.id.getValue(),
      userId: category.userId.getValue(),
      name: category.name,
      type: category.type,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }
}
