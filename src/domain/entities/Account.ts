import { UniqueId, Money } from '../value-objects';

export enum AccountType {
  CASH = 'CASH',
  BANK = 'BANK',
  CREDIT = 'CREDIT',
}

export interface AccountProps {
  id?: string;
  userId: string;
  name: string;
  type: AccountType;
  currency?: string;
  initialBalance: number;
  currentBalance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Account {
  private readonly _id: UniqueId;
  private readonly _userId: UniqueId;
  private _name: string;
  private _type: AccountType;
  private readonly _currency: string;
  private readonly _initialBalance: Money;
  private _currentBalance: Money;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: AccountProps) {
    this._id = UniqueId.create(props.id);
    this._userId = UniqueId.create(props.userId);
    this._name = props.name;
    this._type = props.type;
    this._currency = props.currency || 'BRL';
    this._initialBalance = Money.createPositive(props.initialBalance, this._currency);
    this._currentBalance = Money.create(
      props.currentBalance ?? props.initialBalance,
      this._currency
    );
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  static create(props: AccountProps): Account {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Account name is required');
    }
    if (!Object.values(AccountType).includes(props.type)) {
      throw new Error('Invalid account type');
    }
    if (props.initialBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }
    return new Account(props);
  }

  get id(): UniqueId {
    return this._id;
  }

  get userId(): UniqueId {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  get type(): AccountType {
    return this._type;
  }

  get currency(): string {
    return this._currency;
  }

  get initialBalance(): Money {
    return this._initialBalance;
  }

  get currentBalance(): Money {
    return this._currentBalance;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Account name is required');
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  updateType(type: AccountType): void {
    if (!Object.values(AccountType).includes(type)) {
      throw new Error('Invalid account type');
    }
    this._type = type;
    this._updatedAt = new Date();
  }

  credit(amount: Money): void {
    this._currentBalance = this._currentBalance.add(amount);
    this._updatedAt = new Date();
  }

  debit(amount: Money): void {
    this._currentBalance = this._currentBalance.subtract(amount);
    this._updatedAt = new Date();
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id.getValue(),
      userId: this._userId.getValue(),
      name: this._name,
      type: this._type,
      currency: this._currency,
      initialBalance: this._initialBalance.getAmount(),
      currentBalance: this._currentBalance.getAmount(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
