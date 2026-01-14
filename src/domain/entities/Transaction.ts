import { UniqueId, Money } from '../value-objects';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface TransactionProps {
  id?: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  date: Date;
  transferId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Transaction {
  private readonly _id: UniqueId;
  private readonly _userId: UniqueId;
  private _accountId: UniqueId;
  private _categoryId: UniqueId;
  private _type: TransactionType;
  private _amount: Money;
  private _description: string | null;
  private _date: Date;
  private _transferId: UniqueId | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: TransactionProps) {
    this._id = UniqueId.create(props.id);
    this._userId = UniqueId.create(props.userId);
    this._accountId = UniqueId.create(props.accountId);
    this._categoryId = UniqueId.create(props.categoryId);
    this._type = props.type;
    this._amount = Money.createStrictlyPositive(props.amount);
    this._description = props.description || null;
    this._date = props.date;
    this._transferId = props.transferId ? UniqueId.create(props.transferId) : null;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  static create(props: TransactionProps): Transaction {
    if (!Object.values(TransactionType).includes(props.type)) {
      throw new Error('Invalid transaction type');
    }
    if (props.amount <= 0) {
      throw new Error('Transaction amount must be greater than zero');
    }
    if (!props.date) {
      throw new Error('Transaction date is required');
    }
    return new Transaction(props);
  }

  get id(): UniqueId {
    return this._id;
  }

  get userId(): UniqueId {
    return this._userId;
  }

  get accountId(): UniqueId {
    return this._accountId;
  }

  get categoryId(): UniqueId {
    return this._categoryId;
  }

  get type(): TransactionType {
    return this._type;
  }

  get amount(): Money {
    return this._amount;
  }

  get description(): string | null {
    return this._description;
  }

  get date(): Date {
    return this._date;
  }

  get transferId(): UniqueId | null {
    return this._transferId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isTransfer(): boolean {
    return this._transferId !== null;
  }

  updateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('Transaction amount must be greater than zero');
    }
    this._amount = Money.createStrictlyPositive(amount);
    this._updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateDate(date: Date): void {
    if (!date) {
      throw new Error('Transaction date is required');
    }
    this._date = date;
    this._updatedAt = new Date();
  }

  updateCategory(categoryId: string): void {
    this._categoryId = UniqueId.create(categoryId);
    this._updatedAt = new Date();
  }

  updateAccount(accountId: string): void {
    this._accountId = UniqueId.create(accountId);
    this._updatedAt = new Date();
  }

  updateType(type: TransactionType): void {
    if (!Object.values(TransactionType).includes(type)) {
      throw new Error('Invalid transaction type');
    }
    this._type = type;
    this._updatedAt = new Date();
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id.getValue(),
      userId: this._userId.getValue(),
      accountId: this._accountId.getValue(),
      categoryId: this._categoryId.getValue(),
      type: this._type,
      amount: this._amount.getAmount(),
      description: this._description,
      date: this._date,
      transferId: this._transferId?.getValue() || null,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
