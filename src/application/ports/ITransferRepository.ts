import { Transfer } from '@domain/entities';

export interface ITransferRepository {
  findById(id: string): Promise<Transfer | null>;
  findByUserId(userId: string): Promise<Transfer[]>;
  create(transfer: Transfer): Promise<Transfer>;
  update(transfer: Transfer): Promise<Transfer>;
  delete(id: string): Promise<void>;
}
