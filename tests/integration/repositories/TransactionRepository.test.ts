import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaTransactionRepository } from '@infra/repositories';
import { Transaction, TransactionType } from '@domain/entities';

describe('PrismaTransactionRepository Integration Tests', () => {
  let prisma: PrismaClient;
  let transactionRepository: PrismaTransactionRepository;
  let testUserId: string;
  let testAccountId: string;
  let testCategoryId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    transactionRepository = new PrismaTransactionRepository(prisma);

    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashedpassword',
        name: 'Test User',
      },
    });
    testUserId = user.id;

    const account = await prisma.account.create({
      data: {
        userId: testUserId,
        name: 'Test Account',
        type: 'BANK',
        currency: 'BRL',
        initialBalance: 1000,
        currentBalance: 1000,
      },
    });
    testAccountId = account.id;

    const category = await prisma.category.create({
      data: {
        userId: testUserId,
        name: 'Test Category',
        type: 'EXPENSE',
      },
    });
    testCategoryId = category.id;
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany({ where: { userId: testUserId } });
    await prisma.category.deleteMany({ where: { userId: testUserId } });
    await prisma.account.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.transaction.deleteMany({ where: { userId: testUserId } });
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transaction = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.EXPENSE,
        amount: 100,
        description: 'Test transaction',
        date: new Date('2024-01-15'),
      });

      const created = await transactionRepository.create(transaction);

      expect(created.id.getValue()).toBe(transaction.id.getValue());
      expect(created.amount.getAmount()).toBe(100);
      expect(created.type).toBe(TransactionType.EXPENSE);
    });
  });

  describe('findById', () => {
    it('should find a transaction by id', async () => {
      const transaction = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.INCOME,
        amount: 500,
        description: 'Income transaction',
        date: new Date('2024-01-20'),
      });

      await transactionRepository.create(transaction);
      const found = await transactionRepository.findById(transaction.id.getValue());

      expect(found).not.toBeNull();
      expect(found?.id.getValue()).toBe(transaction.id.getValue());
      expect(found?.amount.getAmount()).toBe(500);
    });

    it('should return null for non-existent transaction', async () => {
      const found = await transactionRepository.findById('550e8400-e29b-41d4-a716-446655440099');
      expect(found).toBeNull();
    });
  });

  describe('findByFilters', () => {
    it('should filter transactions by date range', async () => {
      const transaction1 = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.EXPENSE,
        amount: 100,
        date: new Date('2024-01-10'),
      });

      const transaction2 = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.EXPENSE,
        amount: 200,
        date: new Date('2024-01-20'),
      });

      const transaction3 = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.EXPENSE,
        amount: 300,
        date: new Date('2024-02-05'),
      });

      await transactionRepository.create(transaction1);
      await transactionRepository.create(transaction2);
      await transactionRepository.create(transaction3);

      const filtered = await transactionRepository.findByFilters({
        userId: testUserId,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-31'),
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].amount.getAmount()).toBe(200);
    });

    it('should filter transactions by type', async () => {
      const expense = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.EXPENSE,
        amount: 100,
        date: new Date('2024-01-15'),
      });

      const income = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.INCOME,
        amount: 500,
        date: new Date('2024-01-15'),
      });

      await transactionRepository.create(expense);
      await transactionRepository.create(income);

      const filtered = await transactionRepository.findByFilters({
        userId: testUserId,
        type: TransactionType.INCOME,
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].type).toBe(TransactionType.INCOME);
    });

    it('should filter transactions by account', async () => {
      const transaction = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.EXPENSE,
        amount: 100,
        date: new Date('2024-01-15'),
      });

      await transactionRepository.create(transaction);

      const filtered = await transactionRepository.findByFilters({
        userId: testUserId,
        accountId: testAccountId,
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].accountId.getValue()).toBe(testAccountId);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const transaction = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.EXPENSE,
        amount: 100,
        description: 'Original',
        date: new Date('2024-01-15'),
      });

      await transactionRepository.create(transaction);

      transaction.updateAmount(200);
      transaction.updateDescription('Updated');

      const updated = await transactionRepository.update(transaction);

      expect(updated.amount.getAmount()).toBe(200);
      expect(updated.description).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should delete a transaction', async () => {
      const transaction = Transaction.create({
        userId: testUserId,
        accountId: testAccountId,
        categoryId: testCategoryId,
        type: TransactionType.EXPENSE,
        amount: 100,
        date: new Date('2024-01-15'),
      });

      await transactionRepository.create(transaction);
      await transactionRepository.delete(transaction.id.getValue());

      const found = await transactionRepository.findById(transaction.id.getValue());
      expect(found).toBeNull();
    });
  });
});
