import { TransactionType } from '@domain/entities';
import { ITransactionRepository, TransactionFilters } from '../../ports';

export interface GetTransactionsInput {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
}

export interface TransactionOutput {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  date: Date;
  transferId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(input: GetTransactionsInput): Promise<TransactionOutput[]> {
    const filters: TransactionFilters = {
      userId: input.userId,
      startDate: input.startDate,
      endDate: input.endDate,
      accountId: input.accountId,
      categoryId: input.categoryId,
      type: input.type,
    };

    const transactions = await this.transactionRepository.findByFilters(filters);

    return transactions.map((transaction) => ({
      id: transaction.id.getValue(),
      userId: transaction.userId.getValue(),
      accountId: transaction.accountId.getValue(),
      categoryId: transaction.categoryId.getValue(),
      type: transaction.type,
      amount: transaction.amount.getAmount(),
      description: transaction.description,
      date: transaction.date,
      transferId: transaction.transferId?.getValue() || null,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));
  }
}
