import { IAccountRepository } from '../../ports';

export interface GetAccountsInput {
  userId: string;
}

export interface AccountOutput {
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

export class GetAccountsUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(input: GetAccountsInput): Promise<AccountOutput[]> {
    const accounts = await this.accountRepository.findByUserId(input.userId);

    return accounts.map((account) => ({
      id: account.id.getValue(),
      userId: account.userId.getValue(),
      name: account.name,
      type: account.type,
      currency: account.currency,
      initialBalance: account.initialBalance.getAmount(),
      currentBalance: account.currentBalance.getAmount(),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }));
  }
}
