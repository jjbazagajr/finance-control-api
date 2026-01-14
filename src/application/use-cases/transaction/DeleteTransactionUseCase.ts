import { TransactionType } from '@domain/entities';
import {
  TransactionNotFoundError,
  AccountNotFoundError,
  ForbiddenError,
  ValidationError,
} from '@domain/errors';
import { ITransactionRepository, IAccountRepository } from '../../ports';

export interface DeleteTransactionInput {
  id: string;
  userId: string;
}

export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(input: DeleteTransactionInput): Promise<void> {
    const transaction = await this.transactionRepository.findById(input.id);
    if (!transaction) {
      throw new TransactionNotFoundError(input.id);
    }

    if (transaction.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to delete this transaction');
    }

    if (transaction.isTransfer()) {
      throw new ValidationError(
        'Cannot delete a transfer transaction directly. Delete the transfer instead.'
      );
    }

    const account = await this.accountRepository.findById(transaction.accountId.getValue());
    if (!account) {
      throw new AccountNotFoundError(transaction.accountId.getValue());
    }

    const amount = transaction.amount;
    if (transaction.type === TransactionType.INCOME) {
      account.debit(amount);
    } else {
      account.credit(amount);
    }

    await this.accountRepository.update(account);
    await this.transactionRepository.delete(input.id);
  }
}
