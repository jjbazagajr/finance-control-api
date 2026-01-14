import { describe, it, expect } from 'vitest';
import { Transfer } from '@domain/entities';

describe('Transfer Entity', () => {
  const validTransferData = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    fromAccountId: '550e8400-e29b-41d4-a716-446655440001',
    toAccountId: '550e8400-e29b-41d4-a716-446655440002',
    amount: 100,
    description: 'Test transfer',
    date: new Date('2024-01-15'),
  };

  describe('create', () => {
    it('should create a valid transfer', () => {
      const transfer = Transfer.create(validTransferData);
      expect(transfer.userId.getValue()).toBe(validTransferData.userId);
      expect(transfer.fromAccountId.getValue()).toBe(validTransferData.fromAccountId);
      expect(transfer.toAccountId.getValue()).toBe(validTransferData.toAccountId);
      expect(transfer.amount.getAmount()).toBe(100);
      expect(transfer.description).toBe('Test transfer');
    });

    it('should throw error when fromAccountId equals toAccountId', () => {
      expect(() =>
        Transfer.create({
          ...validTransferData,
          toAccountId: validTransferData.fromAccountId,
        })
      ).toThrow('Cannot transfer to the same account');
    });

    it('should throw error for zero amount', () => {
      expect(() =>
        Transfer.create({
          ...validTransferData,
          amount: 0,
        })
      ).toThrow('Transfer amount must be greater than zero');
    });

    it('should throw error for negative amount', () => {
      expect(() =>
        Transfer.create({
          ...validTransferData,
          amount: -100,
        })
      ).toThrow('Transfer amount must be greater than zero');
    });

    it('should throw error for missing date', () => {
      expect(() =>
        Transfer.create({
          ...validTransferData,
          date: undefined as unknown as Date,
        })
      ).toThrow('Transfer date is required');
    });

    it('should create transfer without description', () => {
      const transfer = Transfer.create({
        ...validTransferData,
        description: undefined,
      });
      expect(transfer.description).toBeNull();
    });

    it('should generate a unique ID', () => {
      const transfer1 = Transfer.create(validTransferData);
      const transfer2 = Transfer.create(validTransferData);
      expect(transfer1.id.getValue()).not.toBe(transfer2.id.getValue());
    });
  });

  describe('update methods', () => {
    it('should update amount', () => {
      const transfer = Transfer.create(validTransferData);
      transfer.updateAmount(200);
      expect(transfer.amount.getAmount()).toBe(200);
    });

    it('should throw error when updating to zero amount', () => {
      const transfer = Transfer.create(validTransferData);
      expect(() => transfer.updateAmount(0)).toThrow('Transfer amount must be greater than zero');
    });

    it('should throw error when updating to negative amount', () => {
      const transfer = Transfer.create(validTransferData);
      expect(() => transfer.updateAmount(-50)).toThrow('Transfer amount must be greater than zero');
    });

    it('should update description', () => {
      const transfer = Transfer.create(validTransferData);
      transfer.updateDescription('Updated description');
      expect(transfer.description).toBe('Updated description');
    });

    it('should update date', () => {
      const transfer = Transfer.create(validTransferData);
      const newDate = new Date('2024-02-20');
      transfer.updateDate(newDate);
      expect(transfer.date).toEqual(newDate);
    });

    it('should throw error when updating to invalid date', () => {
      const transfer = Transfer.create(validTransferData);
      expect(() => transfer.updateDate(undefined as unknown as Date)).toThrow(
        'Transfer date is required'
      );
    });
  });

  describe('business rules', () => {
    it('should not allow transfer between same accounts', () => {
      const sameAccountId = '550e8400-e29b-41d4-a716-446655440001';
      expect(() =>
        Transfer.create({
          ...validTransferData,
          fromAccountId: sameAccountId,
          toAccountId: sameAccountId,
        })
      ).toThrow('Cannot transfer to the same account');
    });

    it('should require positive amount', () => {
      expect(() =>
        Transfer.create({
          ...validTransferData,
          amount: 0,
        })
      ).toThrow('Transfer amount must be greater than zero');
    });

    it('should allow decimal amounts', () => {
      const transfer = Transfer.create({
        ...validTransferData,
        amount: 99.99,
      });
      expect(transfer.amount.getAmount()).toBe(99.99);
    });

    it('should allow large amounts', () => {
      const transfer = Transfer.create({
        ...validTransferData,
        amount: 1000000,
      });
      expect(transfer.amount.getAmount()).toBe(1000000);
    });
  });
});
