import { Transfer, Transaction, TransactionType } from '@domain/entities';
import { AccountNotFoundError, ForbiddenError, SameAccountTransferError } from '@domain/errors';
import { Money } from '@domain/value-objects';
import {
  ITransferRepository,
  ITransactionRepository,
  IAccountRepository,
  ICategoryRepository,
} from '../../ports';

export interface CreateTransferInput {
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  date: Date;
}

export interface CreateTransferOutput {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateTransferUseCase {
  constructor(
    private readonly transferRepository: ITransferRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: CreateTransferInput): Promise<CreateTransferOutput> {
    if (input.fromAccountId === input.toAccountId) {
      throw new SameAccountTransferError();
    }

    const fromAccount = await this.accountRepository.findById(input.fromAccountId);
    if (!fromAccount) {
      throw new AccountNotFoundError(input.fromAccountId);
    }
    if (fromAccount.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to use this account');
    }

    const toAccount = await this.accountRepository.findById(input.toAccountId);
    if (!toAccount) {
      throw new AccountNotFoundError(input.toAccountId);
    }
    if (toAccount.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to use this account');
    }

    let transferCategory = await this.categoryRepository.findByUserIdAndName(
      input.userId,
      'Transfer'
    );
    if (!transferCategory) {
      const { Category, CategoryType } = await import('@domain/entities');
      transferCategory = Category.create({
        userId: input.userId,
        name: 'Transfer',
        type: CategoryType.EXPENSE,
      });
      transferCategory = await this.categoryRepository.create(transferCategory);
    }

    const transfer = Transfer.create({
      userId: input.userId,
      fromAccountId: input.fromAccountId,
      toAccountId: input.toAccountId,
      amount: input.amount,
      description: input.description,
      date: input.date,
    });

    const createdTransfer = await this.transferRepository.create(transfer);

    const expenseTransaction = Transaction.create({
      userId: input.userId,
      accountId: input.fromAccountId,
      categoryId: transferCategory.id.getValue(),
      type: TransactionType.EXPENSE,
      amount: input.amount,
      description: input.description || `Transfer to ${toAccount.name}`,
      date: input.date,
      transferId: createdTransfer.id.getValue(),
    });

    const incomeTransaction = Transaction.create({
      userId: input.userId,
      accountId: input.toAccountId,
      categoryId: transferCategory.id.getValue(),
      type: TransactionType.INCOME,
      amount: input.amount,
      description: input.description || `Transfer from ${fromAccount.name}`,
      date: input.date,
      transferId: createdTransfer.id.getValue(),
    });

    await this.transactionRepository.create(expenseTransaction);
    await this.transactionRepository.create(incomeTransaction);

    const amount = Money.createStrictlyPositive(input.amount);
    fromAccount.debit(amount);
    toAccount.credit(amount);

    await this.accountRepository.update(fromAccount);
    await this.accountRepository.update(toAccount);

    return {
      id: createdTransfer.id.getValue(),
      userId: createdTransfer.userId.getValue(),
      fromAccountId: createdTransfer.fromAccountId.getValue(),
      toAccountId: createdTransfer.toAccountId.getValue(),
      amount: createdTransfer.amount.getAmount(),
      description: createdTransfer.description,
      date: createdTransfer.date,
      createdAt: createdTransfer.createdAt,
      updatedAt: createdTransfer.updatedAt,
    };
  }
}
