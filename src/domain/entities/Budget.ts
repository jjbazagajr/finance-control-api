import { UniqueId, Money } from '../value-objects';

export interface BudgetProps {
  id?: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Budget {
  private readonly _id: UniqueId;
  private readonly _userId: UniqueId;
  private readonly _categoryId: UniqueId;
  private _amount: Money;
  private _month: number;
  private _year: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: BudgetProps) {
    this._id = UniqueId.create(props.id);
    this._userId = UniqueId.create(props.userId);
    this._categoryId = UniqueId.create(props.categoryId);
    this._amount = Money.createStrictlyPositive(props.amount);
    this._month = props.month;
    this._year = props.year;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  static create(props: BudgetProps): Budget {
    if (props.amount <= 0) {
      throw new Error('Budget amount must be greater than zero');
    }
    if (props.month < 1 || props.month > 12) {
      throw new Error('Month must be between 1 and 12');
    }
    if (props.year < 2000 || props.year > 2100) {
      throw new Error('Year must be between 2000 and 2100');
    }
    return new Budget(props);
  }

  get id(): UniqueId {
    return this._id;
  }

  get userId(): UniqueId {
    return this._userId;
  }

  get categoryId(): UniqueId {
    return this._categoryId;
  }

  get amount(): Money {
    return this._amount;
  }

  get month(): number {
    return this._month;
  }

  get year(): number {
    return this._year;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('Budget amount must be greater than zero');
    }
    this._amount = Money.createStrictlyPositive(amount);
    this._updatedAt = new Date();
  }

  updatePeriod(month: number, year: number): void {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }
    if (year < 2000 || year > 2100) {
      throw new Error('Year must be between 2000 and 2100');
    }
    this._month = month;
    this._year = year;
    this._updatedAt = new Date();
  }

  calculateStatus(spent: Money): {
    spent: number;
    limit: number;
    remaining: number;
    percentage: number;
  } {
    const limit = this._amount.getAmount();
    const spentAmount = spent.getAmount();
    const remaining = limit - spentAmount;
    const percentage = (spentAmount / limit) * 100;

    return {
      spent: spentAmount,
      limit,
      remaining,
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  isOverBudget(spent: Money): boolean {
    return spent.isGreaterThan(this._amount);
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id.getValue(),
      userId: this._userId.getValue(),
      categoryId: this._categoryId.getValue(),
      amount: this._amount.getAmount(),
      month: this._month,
      year: this._year,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
