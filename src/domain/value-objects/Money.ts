export class Money {
  private readonly amount: number;
  private readonly currency: string;

  private constructor(amount: number, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }

  static create(amount: number, currency: string = 'BRL'): Money {
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }

    const roundedAmount = Math.round(amount * 100) / 100;

    return new Money(roundedAmount, currency.toUpperCase());
  }

  static createPositive(amount: number, currency: string = 'BRL'): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    return Money.create(amount, currency);
  }

  static createStrictlyPositive(amount: number, currency: string = 'BRL'): Money {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    return Money.create(amount, currency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  format(locale: string = 'pt-BR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.create(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.create(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return Money.create(this.amount * factor, this.currency);
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount < other.amount;
  }

  isGreaterThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount >= other.amount;
  }

  isLessThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount <= other.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }

  toJSON(): { amount: number; currency: string } {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
