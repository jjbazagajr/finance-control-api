import { Account } from '@domain/entities';

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  findByUserIdAndName(userId: string, name: string): Promise<Account | null>;
  create(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
  delete(id: string): Promise<void>;
}
