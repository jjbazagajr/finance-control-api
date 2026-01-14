import { PrismaClient } from '@prisma/client';
import { Category, CategoryType } from '@domain/entities';
import { ICategoryRepository } from '@application/ports';

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return Category.create({
      id: category.id,
      userId: category.userId,
      name: category.name,
      type: category.type as CategoryType,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return categories.map((category) =>
      Category.create({
        id: category.id,
        userId: category.userId,
        name: category.name,
        type: category.type as CategoryType,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })
    );
  }

  async findByUserIdAndName(userId: string, name: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: { userId, name },
    });

    if (!category) {
      return null;
    }

    return Category.create({
      id: category.id,
      userId: category.userId,
      name: category.name,
      type: category.type as CategoryType,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  async findByUserIdAndType(userId: string, type: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId, type: type as CategoryType },
      orderBy: { name: 'asc' },
    });

    return categories.map((category) =>
      Category.create({
        id: category.id,
        userId: category.userId,
        name: category.name,
        type: category.type as CategoryType,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })
    );
  }

  async create(category: Category): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        id: category.id.getValue(),
        userId: category.userId.getValue(),
        name: category.name,
        type: category.type,
      },
    });

    return Category.create({
      id: created.id,
      userId: created.userId,
      name: created.name,
      type: created.type as CategoryType,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(category: Category): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id: category.id.getValue() },
      data: {
        name: category.name,
        type: category.type,
      },
    });

    return Category.create({
      id: updated.id,
      userId: updated.userId,
      name: updated.name,
      type: updated.type as CategoryType,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
