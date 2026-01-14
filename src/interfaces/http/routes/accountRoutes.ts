import { Router } from 'express';
import { AccountController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { IAccountRepository } from '@application/ports';

export const createAccountRoutes = (accountRepository: IAccountRepository): Router => {
  const router = Router();
  const controller = new AccountController(accountRepository);

  router.use(authMiddleware);
  router.get('/', controller.getAll);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
