import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  type: z.enum(['CASH', 'BANK', 'CREDIT'], { message: 'Invalid account type' }),
  currency: z.string().length(3, 'Currency must be 3 characters').default('BRL'),
  initialBalance: z.number().min(0, 'Initial balance cannot be negative'),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').optional(),
  type: z.enum(['CASH', 'BANK', 'CREDIT'], { message: 'Invalid account type' }).optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
