import { Router } from 'express';
import { BudgetController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { IBudgetRepository, ICategoryRepository, ITransactionRepository } from '@application/ports';

export const createBudgetRoutes = (
  budgetRepository: IBudgetRepository,
  categoryRepository: ICategoryRepository,
  transactionRepository: ITransactionRepository
): Router => {
  const router = Router();
  const controller = new BudgetController(
    budgetRepository,
    categoryRepository,
    transactionRepository
  );

  router.use(authMiddleware);
  router.get('/', controller.getAll);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
