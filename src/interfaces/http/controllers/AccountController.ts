import { Response, NextFunction } from 'express';
import {
  CreateAccountUseCase,
  GetAccountsUseCase,
  UpdateAccountUseCase,
  DeleteAccountUseCase,
} from '@application/use-cases';
import { IAccountRepository } from '@application/ports';
import { AccountType } from '@domain/entities';
import { createAccountSchema, updateAccountSchema } from '../validators';
import { AuthenticatedRequest } from '../middlewares';

export class AccountController {
  constructor(private readonly accountRepository: IAccountRepository) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const data = createAccountSchema.parse(req.body);
      const useCase = new CreateAccountUseCase(this.accountRepository);
      const result = await useCase.execute({
        userId,
        name: data.name,
        type: data.type as AccountType,
        currency: data.currency,
        initialBalance: data.initialBalance,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const useCase = new GetAccountsUseCase(this.accountRepository);
      const result = await useCase.execute({ userId });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const id = req.params.id as string;
      const data = updateAccountSchema.parse(req.body);
      const useCase = new UpdateAccountUseCase(this.accountRepository);
      const result = await useCase.execute({
        id,
        userId,
        name: data.name,
        type: data.type as AccountType | undefined,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const id = req.params.id as string;
      const useCase = new DeleteAccountUseCase(this.accountRepository);
      await useCase.execute({ id, userId });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
