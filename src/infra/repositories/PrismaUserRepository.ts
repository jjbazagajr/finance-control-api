import { PrismaClient } from '@prisma/client';
import { User } from '@domain/entities';
import { IUserRepository } from '@application/ports';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return User.create({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return User.create({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id.getValue(),
        email: user.email,
        password: user.password,
        name: user.name,
      },
    });

    return User.create({
      id: created.id,
      email: created.email,
      password: created.password,
      name: created.name,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id.getValue() },
      data: {
        email: user.email,
        password: user.password,
        name: user.name,
      },
    });

    return User.create({
      id: updated.id,
      email: updated.email,
      password: updated.password,
      name: updated.name,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
