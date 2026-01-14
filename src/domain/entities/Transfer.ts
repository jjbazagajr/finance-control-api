import { UniqueId, Money } from '../value-objects';

export interface TransferProps {
  id?: string;
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Transfer {
  private readonly _id: UniqueId;
  private readonly _userId: UniqueId;
  private readonly _fromAccountId: UniqueId;
  private readonly _toAccountId: UniqueId;
  private _amount: Money;
  private _description: string | null;
  private _date: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: TransferProps) {
    this._id = UniqueId.create(props.id);
    this._userId = UniqueId.create(props.userId);
    this._fromAccountId = UniqueId.create(props.fromAccountId);
    this._toAccountId = UniqueId.create(props.toAccountId);
    this._amount = Money.createStrictlyPositive(props.amount);
    this._description = props.description || null;
    this._date = props.date;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  static create(props: TransferProps): Transfer {
    if (props.fromAccountId === props.toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }
    if (props.amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }
    if (!props.date) {
      throw new Error('Transfer date is required');
    }
    return new Transfer(props);
  }

  get id(): UniqueId {
    return this._id;
  }

  get userId(): UniqueId {
    return this._userId;
  }

  get fromAccountId(): UniqueId {
    return this._fromAccountId;
  }

  get toAccountId(): UniqueId {
    return this._toAccountId;
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
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
      throw new Error('Transfer date is required');
    }
    this._date = date;
    this._updatedAt = new Date();
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id.getValue(),
      userId: this._userId.getValue(),
      fromAccountId: this._fromAccountId.getValue(),
      toAccountId: this._toAccountId.getValue(),
      amount: this._amount.getAmount(),
      description: this._description,
      date: this._date,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
