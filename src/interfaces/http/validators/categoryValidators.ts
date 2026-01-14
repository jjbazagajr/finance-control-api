import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Invalid category type' }),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Invalid category type' }).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
