import { z } from 'zod';

export const createTransferSchema = z.object({
  fromAccountId: z.string().uuid('Invalid source account ID'),
  toAccountId: z.string().uuid('Invalid destination account ID'),
  amount: z.number().positive('Amount must be greater than zero'),
  description: z.string().optional(),
  date: z
    .string()
    .datetime({ message: 'Invalid date format' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
