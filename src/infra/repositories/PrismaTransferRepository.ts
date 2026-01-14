import { PrismaClient } from '@prisma/client';
import { Transfer } from '@domain/entities';
import { ITransferRepository } from '@application/ports';

export class PrismaTransferRepository implements ITransferRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Transfer | null> {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
    });

    if (!transfer) {
      return null;
    }

    return Transfer.create({
      id: transfer.id,
      userId: transfer.userId,
      fromAccountId: transfer.fromAccountId,
      toAccountId: transfer.toAccountId,
      amount: transfer.amount.toNumber(),
      description: transfer.description || undefined,
      date: transfer.date,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Transfer[]> {
    const transfers = await this.prisma.transfer.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return transfers.map((transfer) =>
      Transfer.create({
        id: transfer.id,
        userId: transfer.userId,
        fromAccountId: transfer.fromAccountId,
        toAccountId: transfer.toAccountId,
        amount: transfer.amount.toNumber(),
        description: transfer.description || undefined,
        date: transfer.date,
        createdAt: transfer.createdAt,
        updatedAt: transfer.updatedAt,
      })
    );
  }

  async create(transfer: Transfer): Promise<Transfer> {
    const created = await this.prisma.transfer.create({
      data: {
        id: transfer.id.getValue(),
        userId: transfer.userId.getValue(),
        fromAccountId: transfer.fromAccountId.getValue(),
        toAccountId: transfer.toAccountId.getValue(),
        amount: transfer.amount.getAmount(),
        description: transfer.description,
        date: transfer.date,
      },
    });

    return Transfer.create({
      id: created.id,
      userId: created.userId,
      fromAccountId: created.fromAccountId,
      toAccountId: created.toAccountId,
      amount: created.amount.toNumber(),
      description: created.description || undefined,
      date: created.date,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(transfer: Transfer): Promise<Transfer> {
    const updated = await this.prisma.transfer.update({
      where: { id: transfer.id.getValue() },
      data: {
        amount: transfer.amount.getAmount(),
        description: transfer.description,
        date: transfer.date,
      },
    });

    return Transfer.create({
      id: updated.id,
      userId: updated.userId,
      fromAccountId: updated.fromAccountId,
      toAccountId: updated.toAccountId,
      amount: updated.amount.toNumber(),
      description: updated.description || undefined,
      date: updated.date,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transfer.delete({
      where: { id },
    });
  }
}
