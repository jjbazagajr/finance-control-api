import { AccountType } from '@domain/entities';
import {
  AccountNotFoundError,
  AccountNameAlreadyExistsError,
  ForbiddenError,
} from '@domain/errors';
import { IAccountRepository } from '../../ports';

export interface UpdateAccountInput {
  id: string;
  userId: string;
  name?: string;
  type?: AccountType;
}

export interface UpdateAccountOutput {
  id: string;
  userId: string;
  name: string;
  type: string;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(input: UpdateAccountInput): Promise<UpdateAccountOutput> {
    const account = await this.accountRepository.findById(input.id);
    if (!account) {
      throw new AccountNotFoundError(input.id);
    }

    if (account.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to update this account');
    }

    if (input.name && input.name !== account.name) {
      const existingAccount = await this.accountRepository.findByUserIdAndName(
        input.userId,
        input.name
      );
      if (existingAccount) {
        throw new AccountNameAlreadyExistsError(input.name);
      }
      account.updateName(input.name);
    }

    if (input.type) {
      account.updateType(input.type);
    }

    const updatedAccount = await this.accountRepository.update(account);

    return {
      id: updatedAccount.id.getValue(),
      userId: updatedAccount.userId.getValue(),
      name: updatedAccount.name,
      type: updatedAccount.type,
      currency: updatedAccount.currency,
      initialBalance: updatedAccount.initialBalance.getAmount(),
      currentBalance: updatedAccount.currentBalance.getAmount(),
      createdAt: updatedAccount.createdAt,
      updatedAt: updatedAccount.updatedAt,
    };
  }
}
