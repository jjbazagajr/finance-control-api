import { Router } from 'express';
import { CategoryController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { ICategoryRepository } from '@application/ports';

export const createCategoryRoutes = (categoryRepository: ICategoryRepository): Router => {
  const router = Router();
  const controller = new CategoryController(categoryRepository);

  router.use(authMiddleware);
  router.get('/', controller.getAll);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
