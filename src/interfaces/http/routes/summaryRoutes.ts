import { Router } from 'express';
import { SummaryController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { ITransactionRepository, ICategoryRepository } from '@application/ports';

export const createSummaryRoutes = (
  transactionRepository: ITransactionRepository,
  categoryRepository: ICategoryRepository
): Router => {
  const router = Router();
  const controller = new SummaryController(transactionRepository, categoryRepository);

  router.use(authMiddleware);
  router.get('/monthly', controller.getMonthlySummary);

  return router;
};
