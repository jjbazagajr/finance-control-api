import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID'),
  categoryId: z.string().uuid('Invalid category ID'),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Invalid transaction type' }),
  amount: z.number().positive('Amount must be greater than zero'),
  description: z.string().optional(),
  date: z
    .string()
    .datetime({ message: 'Invalid date format' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export const updateTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Invalid transaction type' }).optional(),
  amount: z.number().positive('Amount must be greater than zero').optional(),
  description: z.string().optional(),
  date: z
    .string()
    .datetime({ message: 'Invalid date format' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
});

export const getTransactionsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  accountId: z.string().uuid('Invalid account ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;
