import { Router } from 'express';
import { TransactionController } from '../controllers';
import { authMiddleware } from '../middlewares';
import {
  ITransactionRepository,
  IAccountRepository,
  ICategoryRepository,
} from '@application/ports';

export const createTransactionRoutes = (
  transactionRepository: ITransactionRepository,
  accountRepository: IAccountRepository,
  categoryRepository: ICategoryRepository
): Router => {
  const router = Router();
  const controller = new TransactionController(
    transactionRepository,
    accountRepository,
    categoryRepository
  );

  router.use(authMiddleware);
  router.get('/', controller.getAll);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
