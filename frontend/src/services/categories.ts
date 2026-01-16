import { api } from './api';
import type { Category, CategoryType } from '../types';

interface CreateCategoryData {
  name: string;
  type: CategoryType;
}

interface UpdateCategoryData {
  name?: string;
  type?: CategoryType;
}

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    return api.get<Category[]>('/categories');
  },

  async getById(id: string): Promise<Category> {
    return api.get<Category>(`/categories/${id}`);
  },

  async create(data: CreateCategoryData): Promise<Category> {
    return api.post<Category>('/categories', data);
  },

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    return api.put<Category>(`/categories/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/categories/${id}`);
  },
};
