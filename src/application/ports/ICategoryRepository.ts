import { Category } from '@domain/entities';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByUserId(userId: string): Promise<Category[]>;
  findByUserIdAndName(userId: string, name: string): Promise<Category | null>;
  findByUserIdAndType(userId: string, type: string): Promise<Category[]>;
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}
