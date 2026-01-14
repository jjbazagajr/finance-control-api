import { z } from 'zod';

export const createBudgetSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID'),
  amount: z.number().positive('Amount must be greater than zero'),
  month: z.number().int().min(1).max(12, 'Month must be between 1 and 12'),
  year: z.number().int().min(2000).max(2100, 'Year must be between 2000 and 2100'),
});

export const updateBudgetSchema = z.object({
  amount: z.number().positive('Amount must be greater than zero').optional(),
  month: z.number().int().min(1).max(12, 'Month must be between 1 and 12').optional(),
  year: z.number().int().min(2000).max(2100, 'Year must be between 2000 and 2100').optional(),
});

export const getBudgetsQuerySchema = z.object({
  month: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(12))
    .optional(),
  year: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(2000).max(2100))
    .optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type GetBudgetsQuery = z.infer<typeof getBudgetsQuerySchema>;
