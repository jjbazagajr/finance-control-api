import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class UniqueId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value?: string): UniqueId {
    if (value) {
      if (!uuidValidate(value)) {
        throw new Error(`Invalid UUID: ${value}`);
      }
      return new UniqueId(value);
    }
    return new UniqueId(uuidv4());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UniqueId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
