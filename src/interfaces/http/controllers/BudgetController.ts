import { Response, NextFunction } from 'express';
import {
  CreateBudgetUseCase,
  GetBudgetsUseCase,
  UpdateBudgetUseCase,
  DeleteBudgetUseCase,
} from '@application/use-cases';
import { IBudgetRepository, ICategoryRepository, ITransactionRepository } from '@application/ports';
import { createBudgetSchema, updateBudgetSchema, getBudgetsQuerySchema } from '../validators';
import { AuthenticatedRequest } from '../middlewares';

export class BudgetController {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const data = createBudgetSchema.parse(req.body);
      const useCase = new CreateBudgetUseCase(this.budgetRepository, this.categoryRepository);
      const result = await useCase.execute({ userId, ...data });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const query = getBudgetsQuerySchema.parse(req.query);
      const useCase = new GetBudgetsUseCase(this.budgetRepository, this.transactionRepository);
      const result = await useCase.execute({
        userId,
        month: query.month,
        year: query.year,
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
      const data = updateBudgetSchema.parse(req.body);
      const useCase = new UpdateBudgetUseCase(this.budgetRepository);
      const result = await useCase.execute({ id, userId, ...data });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const id = req.params.id as string;
      const useCase = new DeleteBudgetUseCase(this.budgetRepository);
      await useCase.execute({ id, userId });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
