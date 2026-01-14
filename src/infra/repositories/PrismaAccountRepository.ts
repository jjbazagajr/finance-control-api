import { PrismaClient } from '@prisma/client';
import { Account, AccountType } from '@domain/entities';
import { IAccountRepository } from '@application/ports';

export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      return null;
    }

    return Account.create({
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type as AccountType,
      currency: account.currency,
      initialBalance: account.initialBalance.toNumber(),
      currentBalance: account.currentBalance.toNumber(),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return accounts.map((account) =>
      Account.create({
        id: account.id,
        userId: account.userId,
        name: account.name,
        type: account.type as AccountType,
        currency: account.currency,
        initialBalance: account.initialBalance.toNumber(),
        currentBalance: account.currentBalance.toNumber(),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })
    );
  }

  async findByUserIdAndName(userId: string, name: string): Promise<Account | null> {
    const account = await this.prisma.account.findFirst({
      where: { userId, name },
    });

    if (!account) {
      return null;
    }

    return Account.create({
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type as AccountType,
      currency: account.currency,
      initialBalance: account.initialBalance.toNumber(),
      currentBalance: account.currentBalance.toNumber(),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  }

  async create(account: Account): Promise<Account> {
    const created = await this.prisma.account.create({
      data: {
        id: account.id.getValue(),
        userId: account.userId.getValue(),
        name: account.name,
        type: account.type,
        currency: account.currency,
        initialBalance: account.initialBalance.getAmount(),
        currentBalance: account.currentBalance.getAmount(),
      },
    });

    return Account.create({
      id: created.id,
      userId: created.userId,
      name: created.name,
      type: created.type as AccountType,
      currency: created.currency,
      initialBalance: created.initialBalance.toNumber(),
      currentBalance: created.currentBalance.toNumber(),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(account: Account): Promise<Account> {
    const updated = await this.prisma.account.update({
      where: { id: account.id.getValue() },
      data: {
        name: account.name,
        type: account.type,
        currentBalance: account.currentBalance.getAmount(),
      },
    });

    return Account.create({
      id: updated.id,
      userId: updated.userId,
      name: updated.name,
      type: updated.type as AccountType,
      currency: updated.currency,
      initialBalance: updated.initialBalance.toNumber(),
      currentBalance: updated.currentBalance.toNumber(),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({
      where: { id },
    });
  }
}
