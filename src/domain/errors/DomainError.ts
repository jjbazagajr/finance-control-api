export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): Record<string, unknown> {
    return {
      error: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entity: string, id?: string) {
    const message = id ? `${entity} with id ${id} not found` : `${entity} not found`;
    super(message, 'ENTITY_NOT_FOUND', 404);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS', 401);
  }
}

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} is already registered`, 'EMAIL_ALREADY_EXISTS', 409);
  }
}

export class AccountNotFoundError extends EntityNotFoundError {
  constructor(id?: string) {
    super('Account', id);
  }
}

export class CategoryNotFoundError extends EntityNotFoundError {
  constructor(id?: string) {
    super('Category', id);
  }
}

export class TransactionNotFoundError extends EntityNotFoundError {
  constructor(id?: string) {
    super('Transaction', id);
  }
}

export class BudgetNotFoundError extends EntityNotFoundError {
  constructor(id?: string) {
    super('Budget', id);
  }
}

export class TransferNotFoundError extends EntityNotFoundError {
  constructor(id?: string) {
    super('Transfer', id);
  }
}

export class UserNotFoundError extends EntityNotFoundError {
  constructor(id?: string) {
    super('User', id);
  }
}

export class SameAccountTransferError extends DomainError {
  constructor() {
    super('Cannot transfer to the same account', 'SAME_ACCOUNT_TRANSFER', 400);
  }
}

export class InsufficientBalanceError extends DomainError {
  constructor() {
    super('Insufficient balance for this operation', 'INSUFFICIENT_BALANCE', 400);
  }
}

export class InvalidAmountError extends DomainError {
  constructor(message: string = 'Amount must be greater than zero') {
    super(message, 'INVALID_AMOUNT', 400);
  }
}

export class BudgetAlreadyExistsError extends DomainError {
  constructor(categoryId: string, month: number, year: number) {
    super(
      `Budget for category ${categoryId} already exists for ${month}/${year}`,
      'BUDGET_ALREADY_EXISTS',
      409
    );
  }
}

export class AccountNameAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super(`Account with name "${name}" already exists`, 'ACCOUNT_NAME_EXISTS', 409);
  }
}

export class CategoryNameAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super(`Category with name "${name}" already exists`, 'CATEGORY_NAME_EXISTS', 409);
  }
}
