import { Response, NextFunction } from 'express';
import { CreateTransferUseCase } from '@application/use-cases';
import {
  ITransferRepository,
  ITransactionRepository,
  IAccountRepository,
  ICategoryRepository,
} from '@application/ports';
import { createTransferSchema } from '../validators';
import { AuthenticatedRequest } from '../middlewares';

export class TransferController {
  constructor(
    private readonly transferRepository: ITransferRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const data = createTransferSchema.parse(req.body);
      const useCase = new CreateTransferUseCase(
        this.transferRepository,
        this.transactionRepository,
        this.accountRepository,
        this.categoryRepository
      );
      const result = await useCase.execute({
        userId,
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        amount: data.amount,
        description: data.description,
        date: new Date(data.date),
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}
