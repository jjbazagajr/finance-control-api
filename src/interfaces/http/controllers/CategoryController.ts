import { Response, NextFunction } from 'express';
import {
  CreateCategoryUseCase,
  GetCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '@application/use-cases';
import { ICategoryRepository } from '@application/ports';
import { CategoryType } from '@domain/entities';
import { createCategorySchema, updateCategorySchema } from '../validators';
import { AuthenticatedRequest } from '../middlewares';

export class CategoryController {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const data = createCategorySchema.parse(req.body);
      const useCase = new CreateCategoryUseCase(this.categoryRepository);
      const result = await useCase.execute({
        userId,
        name: data.name,
        type: data.type as CategoryType,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const type = req.query.type as string | undefined;
      const useCase = new GetCategoriesUseCase(this.categoryRepository);
      const result = await useCase.execute({ userId, type });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const id = req.params.id as string;
      const data = updateCategorySchema.parse(req.body);
      const useCase = new UpdateCategoryUseCase(this.categoryRepository);
      const result = await useCase.execute({
        id,
        userId,
        name: data.name,
        type: data.type as CategoryType | undefined,
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
      const useCase = new DeleteCategoryUseCase(this.categoryRepository);
      await useCase.execute({ id, userId });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
