import { PrismaClient } from '@prisma/client';
import { Budget } from '@domain/entities';
import { IBudgetRepository } from '@application/ports';

export class PrismaBudgetRepository implements IBudgetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Budget | null> {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
    });

    if (!budget) {
      return null;
    }

    return Budget.create({
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      amount: budget.amount.toNumber(),
      month: budget.month,
      year: budget.year,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Budget[]> {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return budgets.map((budget) =>
      Budget.create({
        id: budget.id,
        userId: budget.userId,
        categoryId: budget.categoryId,
        amount: budget.amount.toNumber(),
        month: budget.month,
        year: budget.year,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      })
    );
  }

  async findByUserIdAndCategoryAndPeriod(
    userId: string,
    categoryId: string,
    month: number,
    year: number
  ): Promise<Budget | null> {
    const budget = await this.prisma.budget.findFirst({
      where: { userId, categoryId, month, year },
    });

    if (!budget) {
      return null;
    }

    return Budget.create({
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      amount: budget.amount.toNumber(),
      month: budget.month,
      year: budget.year,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    });
  }

  async findByUserIdAndPeriod(userId: string, month: number, year: number): Promise<Budget[]> {
    const budgets = await this.prisma.budget.findMany({
      where: { userId, month, year },
    });

    return budgets.map((budget) =>
      Budget.create({
        id: budget.id,
        userId: budget.userId,
        categoryId: budget.categoryId,
        amount: budget.amount.toNumber(),
        month: budget.month,
        year: budget.year,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      })
    );
  }

  async create(budget: Budget): Promise<Budget> {
    const created = await this.prisma.budget.create({
      data: {
        id: budget.id.getValue(),
        userId: budget.userId.getValue(),
        categoryId: budget.categoryId.getValue(),
        amount: budget.amount.getAmount(),
        month: budget.month,
        year: budget.year,
      },
    });

    return Budget.create({
      id: created.id,
      userId: created.userId,
      categoryId: created.categoryId,
      amount: created.amount.toNumber(),
      month: created.month,
      year: created.year,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(budget: Budget): Promise<Budget> {
    const updated = await this.prisma.budget.update({
      where: { id: budget.id.getValue() },
      data: {
        amount: budget.amount.getAmount(),
        month: budget.month,
        year: budget.year,
      },
    });

    return Budget.create({
      id: updated.id,
      userId: updated.userId,
      categoryId: updated.categoryId,
      amount: updated.amount.toNumber(),
      month: updated.month,
      year: updated.year,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.budget.delete({
      where: { id },
    });
  }
}
