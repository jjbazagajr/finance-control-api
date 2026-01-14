import { Account, AccountType } from '@domain/entities';
import { AccountNameAlreadyExistsError } from '@domain/errors';
import { IAccountRepository } from '../../ports';

export interface CreateAccountInput {
  userId: string;
  name: string;
  type: AccountType;
  currency?: string;
  initialBalance: number;
}

export interface CreateAccountOutput {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(input: CreateAccountInput): Promise<CreateAccountOutput> {
    const existingAccount = await this.accountRepository.findByUserIdAndName(
      input.userId,
      input.name
    );
    if (existingAccount) {
      throw new AccountNameAlreadyExistsError(input.name);
    }

    const account = Account.create({
      userId: input.userId,
      name: input.name,
      type: input.type,
      currency: input.currency,
      initialBalance: input.initialBalance,
    });

    const createdAccount = await this.accountRepository.create(account);

    return {
      id: createdAccount.id.getValue(),
      userId: createdAccount.userId.getValue(),
      name: createdAccount.name,
      type: createdAccount.type,
      currency: createdAccount.currency,
      initialBalance: createdAccount.initialBalance.getAmount(),
      currentBalance: createdAccount.currentBalance.getAmount(),
      createdAt: createdAccount.createdAt,
      updatedAt: createdAccount.updatedAt,
    };
  }
}
