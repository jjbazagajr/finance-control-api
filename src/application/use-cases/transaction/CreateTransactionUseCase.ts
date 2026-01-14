import { Transaction, TransactionType } from '@domain/entities';
import { AccountNotFoundError, CategoryNotFoundError, ForbiddenError } from '@domain/errors';
import { Money } from '@domain/value-objects';
import { ITransactionRepository, IAccountRepository, ICategoryRepository } from '../../ports';

export interface CreateTransactionInput {
  userId: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  date: Date;
}

export interface CreateTransactionOutput {
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

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: CreateTransactionInput): Promise<CreateTransactionOutput> {
    const account = await this.accountRepository.findById(input.accountId);
    if (!account) {
      throw new AccountNotFoundError(input.accountId);
    }
    if (account.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to use this account');
    }

    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new CategoryNotFoundError(input.categoryId);
    }
    if (category.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to use this category');
    }

    const transaction = Transaction.create({
      userId: input.userId,
      accountId: input.accountId,
      categoryId: input.categoryId,
      type: input.type,
      amount: input.amount,
      description: input.description,
      date: input.date,
    });

    const amount = Money.createStrictlyPositive(input.amount);
    if (input.type === TransactionType.INCOME) {
      account.credit(amount);
    } else {
      account.debit(amount);
    }

    await this.accountRepository.update(account);
    const createdTransaction = await this.transactionRepository.create(transaction);

    return {
      id: createdTransaction.id.getValue(),
      userId: createdTransaction.userId.getValue(),
      accountId: createdTransaction.accountId.getValue(),
      categoryId: createdTransaction.categoryId.getValue(),
      type: createdTransaction.type,
      amount: createdTransaction.amount.getAmount(),
      description: createdTransaction.description,
      date: createdTransaction.date,
      transferId: createdTransaction.transferId?.getValue() || null,
      createdAt: createdTransaction.createdAt,
      updatedAt: createdTransaction.updatedAt,
    };
  }
}
