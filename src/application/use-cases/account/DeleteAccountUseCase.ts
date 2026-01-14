import { AccountNotFoundError, ForbiddenError } from '@domain/errors';
import { IAccountRepository } from '../../ports';

export interface DeleteAccountInput {
  id: string;
  userId: string;
}

export class DeleteAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(input: DeleteAccountInput): Promise<void> {
    const account = await this.accountRepository.findById(input.id);
    if (!account) {
      throw new AccountNotFoundError(input.id);
    }

    if (account.userId.getValue() !== input.userId) {
      throw new ForbiddenError('You do not have permission to delete this account');
    }

    await this.accountRepository.delete(input.id);
  }
}
