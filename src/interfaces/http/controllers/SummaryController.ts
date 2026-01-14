import { Response, NextFunction } from 'express';
import { GetMonthlySummaryUseCase } from '@application/use-cases';
import { ITransactionRepository, ICategoryRepository } from '@application/ports';
import { getMonthlySummaryQuerySchema } from '../validators';
import { AuthenticatedRequest } from '../middlewares';

export class SummaryController {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  getMonthlySummary = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const query = getMonthlySummaryQuerySchema.parse(req.query);
      const useCase = new GetMonthlySummaryUseCase(
        this.transactionRepository,
        this.categoryRepository
      );
      const result = await useCase.execute({
        userId,
        year: query.year,
        month: query.month,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
