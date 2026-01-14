import { Response, NextFunction } from 'express';
import {
  CreateTransactionUseCase,
  GetTransactionsUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
} from '@application/use-cases';
import {
  ITransactionRepository,
  IAccountRepository,
  ICategoryRepository,
} from '@application/ports';
import { TransactionType } from '@domain/entities';
import {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsQuerySchema,
} from '../validators';
import { AuthenticatedRequest } from '../middlewares';

export class TransactionController {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const data = createTransactionSchema.parse(req.body);
      const useCase = new CreateTransactionUseCase(
        this.transactionRepository,
        this.accountRepository,
        this.categoryRepository
      );
      const result = await useCase.execute({
        userId,
        accountId: data.accountId,
        categoryId: data.categoryId,
        type: data.type as TransactionType,
        amount: data.amount,
        description: data.description,
        date: new Date(data.date),
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const query = getTransactionsQuerySchema.parse(req.query);
      const useCase = new GetTransactionsUseCase(this.transactionRepository);
      const result = await useCase.execute({
        userId,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        accountId: query.accountId,
        categoryId: query.categoryId,
        type: query.type as TransactionType | undefined,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const id = req.params.id as string;
      const data = updateTransactionSchema.parse(req.body);
      const useCase = new UpdateTransactionUseCase(
        this.transactionRepository,
        this.accountRepository,
        this.categoryRepository
      );
      const result = await useCase.execute({
        id,
        userId,
        accountId: data.accountId,
        categoryId: data.categoryId,
        type: data.type as TransactionType | undefined,
        amount: data.amount,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
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
      const useCase = new DeleteTransactionUseCase(
        this.transactionRepository,
        this.accountRepository
      );
      await useCase.execute({ id, userId });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
