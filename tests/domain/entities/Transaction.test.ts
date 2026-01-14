import { describe, it, expect } from 'vitest';
import { Transaction, TransactionType } from '@domain/entities';

describe('Transaction Entity', () => {
  const validTransactionData = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    accountId: '550e8400-e29b-41d4-a716-446655440001',
    categoryId: '550e8400-e29b-41d4-a716-446655440002',
    type: TransactionType.EXPENSE,
    amount: 100,
    description: 'Test transaction',
    date: new Date('2024-01-15'),
  };

  describe('create', () => {
    it('should create a valid transaction', () => {
      const transaction = Transaction.create(validTransactionData);
      expect(transaction.userId.getValue()).toBe(validTransactionData.userId);
      expect(transaction.accountId.getValue()).toBe(validTransactionData.accountId);
      expect(transaction.categoryId.getValue()).toBe(validTransactionData.categoryId);
      expect(transaction.type).toBe(TransactionType.EXPENSE);
      expect(transaction.amount.getAmount()).toBe(100);
      expect(transaction.description).toBe('Test transaction');
    });

    it('should create a transaction with INCOME type', () => {
      const transaction = Transaction.create({
        ...validTransactionData,
        type: TransactionType.INCOME,
      });
      expect(transaction.type).toBe(TransactionType.INCOME);
    });

    it('should throw error for invalid transaction type', () => {
      expect(() =>
        Transaction.create({
          ...validTransactionData,
          type: 'INVALID' as TransactionType,
        })
      ).toThrow('Invalid transaction type');
    });

    it('should throw error for zero amount', () => {
      expect(() =>
        Transaction.create({
          ...validTransactionData,
          amount: 0,
        })
      ).toThrow('Transaction amount must be greater than zero');
    });

    it('should throw error for negative amount', () => {
      expect(() =>
        Transaction.create({
          ...validTransactionData,
          amount: -100,
        })
      ).toThrow('Transaction amount must be greater than zero');
    });

    it('should throw error for missing date', () => {
      expect(() =>
        Transaction.create({
          ...validTransactionData,
          date: undefined as unknown as Date,
        })
      ).toThrow('Transaction date is required');
    });

    it('should create transaction without description', () => {
      const transaction = Transaction.create({
        ...validTransactionData,
        description: undefined,
      });
      expect(transaction.description).toBeNull();
    });

    it('should create transaction with transferId', () => {
      const transferId = '550e8400-e29b-41d4-a716-446655440003';
      const transaction = Transaction.create({
        ...validTransactionData,
        transferId,
      });
      expect(transaction.transferId?.getValue()).toBe(transferId);
      expect(transaction.isTransfer()).toBe(true);
    });
  });

  describe('update methods', () => {
    it('should update amount', () => {
      const transaction = Transaction.create(validTransactionData);
      transaction.updateAmount(200);
      expect(transaction.amount.getAmount()).toBe(200);
    });

    it('should throw error when updating to zero amount', () => {
      const transaction = Transaction.create(validTransactionData);
      expect(() => transaction.updateAmount(0)).toThrow(
        'Transaction amount must be greater than zero'
      );
    });

    it('should update description', () => {
      const transaction = Transaction.create(validTransactionData);
      transaction.updateDescription('Updated description');
      expect(transaction.description).toBe('Updated description');
    });

    it('should update date', () => {
      const transaction = Transaction.create(validTransactionData);
      const newDate = new Date('2024-02-20');
      transaction.updateDate(newDate);
      expect(transaction.date).toEqual(newDate);
    });

    it('should update category', () => {
      const transaction = Transaction.create(validTransactionData);
      const newCategoryId = '550e8400-e29b-41d4-a716-446655440005';
      transaction.updateCategory(newCategoryId);
      expect(transaction.categoryId.getValue()).toBe(newCategoryId);
    });

    it('should update account', () => {
      const transaction = Transaction.create(validTransactionData);
      const newAccountId = '550e8400-e29b-41d4-a716-446655440006';
      transaction.updateAccount(newAccountId);
      expect(transaction.accountId.getValue()).toBe(newAccountId);
    });

    it('should update type', () => {
      const transaction = Transaction.create(validTransactionData);
      transaction.updateType(TransactionType.INCOME);
      expect(transaction.type).toBe(TransactionType.INCOME);
    });

    it('should throw error when updating to invalid type', () => {
      const transaction = Transaction.create(validTransactionData);
      expect(() => transaction.updateType('INVALID' as TransactionType)).toThrow(
        'Invalid transaction type'
      );
    });
  });

  describe('isTransfer', () => {
    it('should return false when no transferId', () => {
      const transaction = Transaction.create(validTransactionData);
      expect(transaction.isTransfer()).toBe(false);
    });

    it('should return true when transferId is set', () => {
      const transaction = Transaction.create({
        ...validTransactionData,
        transferId: '550e8400-e29b-41d4-a716-446655440003',
      });
      expect(transaction.isTransfer()).toBe(true);
    });
  });
});
