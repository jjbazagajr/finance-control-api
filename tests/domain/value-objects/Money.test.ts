import { describe, it, expect } from 'vitest';
import { Money } from '@domain/value-objects';

describe('Money Value Object', () => {
  describe('create', () => {
    it('should create a Money instance with valid amount', () => {
      const money = Money.create(100);
      expect(money.getAmount()).toBe(100);
    });

    it('should create a Money instance with zero amount', () => {
      const money = Money.create(0);
      expect(money.getAmount()).toBe(0);
    });

    it('should create a Money instance with decimal amount', () => {
      const money = Money.create(99.99);
      expect(money.getAmount()).toBe(99.99);
    });

    it('should throw error for negative amount when using createPositive', () => {
      expect(() => Money.createPositive(-100)).toThrow('Amount cannot be negative');
    });

    it('should throw error for zero amount when using createStrictlyPositive', () => {
      expect(() => Money.createStrictlyPositive(0)).toThrow('Amount must be greater than zero');
    });

    it('should throw error for negative amount when using createStrictlyPositive', () => {
      expect(() => Money.createStrictlyPositive(-100)).toThrow('Amount must be greater than zero');
    });
  });

  describe('arithmetic operations', () => {
    it('should add two Money instances', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);
      const result = money1.add(money2);
      expect(result.getAmount()).toBe(150);
    });

    it('should subtract two Money instances', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(30);
      const result = money1.subtract(money2);
      expect(result.getAmount()).toBe(70);
    });

    it('should allow negative result from subtraction', () => {
      const money1 = Money.create(30);
      const money2 = Money.create(100);
      const result = money1.subtract(money2);
      expect(result.getAmount()).toBe(-70);
    });

    it('should multiply Money by a factor', () => {
      const money = Money.create(100);
      const result = money.multiply(2.5);
      expect(result.getAmount()).toBe(250);
    });
  });

  describe('comparison operations', () => {
    it('should return true for isPositive when amount is positive', () => {
      const money = Money.create(100);
      expect(money.isPositive()).toBe(true);
    });

    it('should return false for isPositive when amount is zero', () => {
      const money = Money.create(0);
      expect(money.isPositive()).toBe(false);
    });

    it('should return false for isPositive when amount is negative', () => {
      const money = Money.create(-100);
      expect(money.isPositive()).toBe(false);
    });

    it('should return true for isNegative when amount is negative', () => {
      const money = Money.create(-100);
      expect(money.isNegative()).toBe(true);
    });

    it('should return true for isZero when amount is zero', () => {
      const money = Money.create(0);
      expect(money.isZero()).toBe(true);
    });

    it('should correctly compare two Money instances with isGreaterThan', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);
      expect(money1.isGreaterThan(money2)).toBe(true);
      expect(money2.isGreaterThan(money1)).toBe(false);
    });

    it('should correctly compare two Money instances with isLessThan', () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);
      expect(money1.isLessThan(money2)).toBe(true);
      expect(money2.isLessThan(money1)).toBe(false);
    });

    it('should correctly compare two Money instances with isGreaterThanOrEqual', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);
      const money3 = Money.create(50);
      expect(money1.isGreaterThanOrEqual(money2)).toBe(true);
      expect(money1.isGreaterThanOrEqual(money3)).toBe(true);
      expect(money3.isGreaterThanOrEqual(money1)).toBe(false);
    });

    it('should correctly compare two Money instances with isLessThanOrEqual', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);
      const money3 = Money.create(150);
      expect(money1.isLessThanOrEqual(money2)).toBe(true);
      expect(money1.isLessThanOrEqual(money3)).toBe(true);
      expect(money3.isLessThanOrEqual(money1)).toBe(false);
    });
  });

  describe('equality', () => {
    it('should return true for equal amounts', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);
      expect(money1.equals(money2)).toBe(false);
    });
  });

  describe('formatting', () => {
    it('should format money with default currency', () => {
      const money = Money.create(1234.56);
      const formatted = money.format();
      expect(formatted).toContain('1');
      expect(formatted).toContain('234');
    });

    it('should convert to string', () => {
      const money = Money.create(100.5);
      expect(money.toString()).toBe('BRL 100.50');
    });
  });
});
