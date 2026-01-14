import { PrismaClient, Prisma } from '@prisma/client';
import { Transaction, TransactionType } from '@domain/entities';
import { ITransactionRepository, TransactionFilters } from '@application/ports';

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return null;
    }

    return Transaction.create({
      id: transaction.id,
      userId: transaction.userId,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type as TransactionType,
      amount: transaction.amount.toNumber(),
      description: transaction.description || undefined,
      date: transaction.date,
      transferId: transaction.transferId || undefined,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return transactions.map((transaction) =>
      Transaction.create({
        id: transaction.id,
        userId: transaction.userId,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        type: transaction.type as TransactionType,
        amount: transaction.amount.toNumber(),
        description: transaction.description || undefined,
        date: transaction.date,
        transferId: transaction.transferId || undefined,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      })
    );
  }

  async findByFilters(filters: TransactionFilters): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = {
      userId: filters.userId,
    };

    if (filters.startDate) {
      where.date = { ...((where.date as Prisma.DateTimeFilter) || {}), gte: filters.startDate };
    }

    if (filters.endDate) {
      where.date = { ...((where.date as Prisma.DateTimeFilter) || {}), lte: filters.endDate };
    }

    if (filters.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return transactions.map((transaction) =>
      Transaction.create({
        id: transaction.id,
        userId: transaction.userId,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        type: transaction.type as TransactionType,
        amount: transaction.amount.toNumber(),
        description: transaction.description || undefined,
        date: transaction.date,
        transferId: transaction.transferId || undefined,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      })
    );
  }

  async findByTransferId(transferId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { transferId },
    });

    return transactions.map((transaction) =>
      Transaction.create({
        id: transaction.id,
        userId: transaction.userId,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        type: transaction.type as TransactionType,
        amount: transaction.amount.toNumber(),
        description: transaction.description || undefined,
        date: transaction.date,
        transferId: transaction.transferId || undefined,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      })
    );
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const created = await this.prisma.transaction.create({
      data: {
        id: transaction.id.getValue(),
        userId: transaction.userId.getValue(),
        accountId: transaction.accountId.getValue(),
        categoryId: transaction.categoryId.getValue(),
        type: transaction.type,
        amount: transaction.amount.getAmount(),
        description: transaction.description,
        date: transaction.date,
        transferId: transaction.transferId?.getValue(),
      },
    });

    return Transaction.create({
      id: created.id,
      userId: created.userId,
      accountId: created.accountId,
      categoryId: created.categoryId,
      type: created.type as TransactionType,
      amount: created.amount.toNumber(),
      description: created.description || undefined,
      date: created.date,
      transferId: created.transferId || undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const updated = await this.prisma.transaction.update({
      where: { id: transaction.id.getValue() },
      data: {
        accountId: transaction.accountId.getValue(),
        categoryId: transaction.categoryId.getValue(),
        type: transaction.type,
        amount: transaction.amount.getAmount(),
        description: transaction.description,
        date: transaction.date,
      },
    });

    return Transaction.create({
      id: updated.id,
      userId: updated.userId,
      accountId: updated.accountId,
      categoryId: updated.categoryId,
      type: updated.type as TransactionType,
      amount: updated.amount.toNumber(),
      description: updated.description || undefined,
      date: updated.date,
      transferId: updated.transferId || undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }

  async deleteByTransferId(transferId: string): Promise<void> {
    await this.prisma.transaction.deleteMany({
      where: { transferId },
    });
  }

  async sumByUserIdAndTypeAndPeriod(
    userId: string,
    type: TransactionType,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount?.toNumber() || 0;
  }

  async sumByCategoryAndPeriod(
    userId: string,
    categoryId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        categoryId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount?.toNumber() || 0;
  }

  async getTopCategoriesByExpense(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number
  ): Promise<{ categoryId: string; total: number }[]> {
    const result = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: limit,
    });

    return result.map((r) => ({
      categoryId: r.categoryId,
      total: r._sum.amount?.toNumber() || 0,
    }));
  }

  async getDailyTotals(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ date: Date; income: number; expense: number }[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        type: true,
        amount: true,
      },
    });

    const dailyMap = new Map<string, { income: number; expense: number }>();

    for (const t of transactions) {
      const dateKey = t.date.toISOString().split('T')[0];
      const existing = dailyMap.get(dateKey) || { income: 0, expense: 0 };

      if (t.type === 'INCOME') {
        existing.income += t.amount.toNumber();
      } else {
        existing.expense += t.amount.toNumber();
      }

      dailyMap.set(dateKey, existing);
    }

    return Array.from(dailyMap.entries())
      .map(([dateStr, totals]) => ({
        date: new Date(dateStr),
        income: totals.income,
        expense: totals.expense,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
