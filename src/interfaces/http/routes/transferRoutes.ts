import { Router } from 'express';
import { TransferController } from '../controllers';
import { authMiddleware } from '../middlewares';
import {
  ITransferRepository,
  ITransactionRepository,
  IAccountRepository,
  ICategoryRepository,
} from '@application/ports';

export const createTransferRoutes = (
  transferRepository: ITransferRepository,
  transactionRepository: ITransactionRepository,
  accountRepository: IAccountRepository,
  categoryRepository: ICategoryRepository
): Router => {
  const router = Router();
  const controller = new TransferController(
    transferRepository,
    transactionRepository,
    accountRepository,
    categoryRepository
  );

  router.use(authMiddleware);
  router.post('/', controller.create);

  return router;
};
