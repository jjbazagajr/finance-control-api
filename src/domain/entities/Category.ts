import { UniqueId } from '../value-objects';

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface CategoryProps {
  id?: string;
  userId: string;
  name: string;
  type: CategoryType;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  private readonly _id: UniqueId;
  private readonly _userId: UniqueId;
  private _name: string;
  private _type: CategoryType;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CategoryProps) {
    this._id = UniqueId.create(props.id);
    this._userId = UniqueId.create(props.userId);
    this._name = props.name;
    this._type = props.type;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  static create(props: CategoryProps): Category {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Category name is required');
    }
    if (!Object.values(CategoryType).includes(props.type)) {
      throw new Error('Invalid category type');
    }
    return new Category(props);
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

  get type(): CategoryType {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Category name is required');
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  updateType(type: CategoryType): void {
    if (!Object.values(CategoryType).includes(type)) {
      throw new Error('Invalid category type');
    }
    this._type = type;
    this._updatedAt = new Date();
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id.getValue(),
      userId: this._userId.getValue(),
      name: this._name,
      type: this._type,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
