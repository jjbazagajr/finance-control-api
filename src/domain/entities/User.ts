import { UniqueId } from '../value-objects';

export interface UserProps {
  id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly _id: UniqueId;
  private _email: string;
  private _password: string;
  private _name: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = UniqueId.create(props.id);
    this._email = props.email;
    this._password = props.password;
    this._name = props.name;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  static create(props: UserProps): User {
    if (!props.email || !props.email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (!props.password || props.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Name is required');
    }
    return new User(props);
  }

  get id(): UniqueId {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  updateEmail(email: string): void {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
    this._email = email;
    this._updatedAt = new Date();
  }

  updatePassword(password: string): void {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    this._password = password;
    this._updatedAt = new Date();
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id.getValue(),
      email: this._email,
      name: this._name,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
