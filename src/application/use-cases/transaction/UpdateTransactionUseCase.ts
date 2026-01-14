import { TransactionType } from '@domain/entities';
import {
  TransactionNotFoundError,
  AccountNotFoundError,
  CategoryNotFoundError,
  ForbiddenError,
  ValidationError,
} from '@domain/errors';
import { ITransactionRepository, IAccountRepository, ICategoryRepository } from '../../ports';

export interface UpdateTransactionInput {
  id: string;
  userId: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  amount?: number;
  description?: string;
  date?: Date;
}

export interface UpdateTransactionOutput {
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

export class UpdateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: UpdateTransactionInput): Promise<UpdateTransactionOutput> {
    const transaction = await this.transactionRepository.findById(input.id);
    if (!transaction) {
      throw new TransactionNotFoundError(input.id);
    }

    if (transaction.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to update this transaction');
    }

    if (transaction.isTransfer()) {
      throw new ValidationError('Cannot update a transfer transaction directly');
    }

    const oldAccount = await this.accountRepository.findById(transaction.accountId.getValue());
    if (!oldAccount) {
      throw new AccountNotFoundError(transaction.accountId.getValue());
    }

    const oldAmount = transaction.amount;
    if (transaction.type === TransactionType.INCOME) {
      oldAccount.debit(oldAmount);
    } else {
      oldAccount.credit(oldAmount);
    }

    if (input.accountId && input.accountId !== transaction.accountId.getValue()) {
      const newAccount = await this.accountRepository.findById(input.accountId);
      if (!newAccount) {
        throw new AccountNotFoundError(input.accountId);
      }
      if (newAccount.userId.getValue() !== input.userId) {
        throw new ForbiddenError('You do not have permission to use this account');
      }
      transaction.updateAccount(input.accountId);
    }

    if (input.categoryId && input.categoryId !== transaction.categoryId.getValue()) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new CategoryNotFoundError(input.categoryId);
      }
      if (category.userId.getValue() !== input.userId) {
        throw new ForbiddenError('You do not have permission to use this category');
      }
      transaction.updateCategory(input.categoryId);
    }

    if (input.type) {
      transaction.updateType(input.type);
    }

    if (input.amount) {
      transaction.updateAmount(input.amount);
    }

    if (input.description !== undefined) {
      transaction.updateDescription(input.description || null);
    }

    if (input.date) {
      transaction.updateDate(input.date);
    }

    const newAccount = await this.accountRepository.findById(transaction.accountId.getValue());
    if (!newAccount) {
      throw new AccountNotFoundError(transaction.accountId.getValue());
    }

    const newAmount = transaction.amount;
    if (transaction.type === TransactionType.INCOME) {
      newAccount.credit(newAmount);
    } else {
      newAccount.debit(newAmount);
    }

    if (oldAccount.id.getValue() !== newAccount.id.getValue()) {
      await this.accountRepository.update(oldAccount);
    }
    await this.accountRepository.update(newAccount);

    const updatedTransaction = await this.transactionRepository.update(transaction);

    return {
      id: updatedTransaction.id.getValue(),
      userId: updatedTransaction.userId.getValue(),
      accountId: updatedTransaction.accountId.getValue(),
      categoryId: updatedTransaction.categoryId.getValue(),
      type: updatedTransaction.type,
      amount: updatedTransaction.amount.getAmount(),
      description: updatedTransaction.description,
      date: updatedTransaction.date,
      transferId: updatedTransaction.transferId?.getValue() || null,
      createdAt: updatedTransaction.createdAt,
      updatedAt: updatedTransaction.updatedAt,
    };
  }
}
