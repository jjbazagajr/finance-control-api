import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { prisma } from '../prisma/client';
import { BcryptHashService, JwtTokenService } from '../auth';
import {
  PrismaUserRepository,
  PrismaAccountRepository,
  PrismaCategoryRepository,
  PrismaTransactionRepository,
  PrismaBudgetRepository,
  PrismaTransferRepository,
} from '../repositories';
import {
  createAuthRoutes,
  createAccountRoutes,
  createCategoryRoutes,
  createTransactionRoutes,
  createTransferRoutes,
  createBudgetRoutes,
  createSummaryRoutes,
} from '@interfaces/http/routes';
import { requestIdMiddleware, errorHandler } from '@interfaces/http/middlewares';
import { config } from '@shared/config';
import { logger } from '@shared/logger';
import { swaggerDocument } from './swagger';

export const createServer = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestIdMiddleware);

  const userRepository = new PrismaUserRepository(prisma);
  const accountRepository = new PrismaAccountRepository(prisma);
  const categoryRepository = new PrismaCategoryRepository(prisma);
  const transactionRepository = new PrismaTransactionRepository(prisma);
  const budgetRepository = new PrismaBudgetRepository(prisma);
  const transferRepository = new PrismaTransferRepository(prisma);

  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService(config.jwt.secret, config.jwt.expiresIn);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/auth', createAuthRoutes(userRepository, hashService, tokenService));
  app.get('/me', createAuthRoutes(userRepository, hashService, tokenService));
  app.use('/accounts', createAccountRoutes(accountRepository));
  app.use('/categories', createCategoryRoutes(categoryRepository));
  app.use(
    '/transactions',
    createTransactionRoutes(transactionRepository, accountRepository, categoryRepository)
  );
  app.use(
    '/transfers',
    createTransferRoutes(
      transferRepository,
      transactionRepository,
      accountRepository,
      categoryRepository
    )
  );
  app.use(
    '/budgets',
    createBudgetRoutes(budgetRepository, categoryRepository, transactionRepository)
  );
  app.use('/summary', createSummaryRoutes(transactionRepository, categoryRepository));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(errorHandler);

  return app;
};

export const startServer = (): void => {
  const app = createServer();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
    logger.info(`Swagger docs available at http://localhost:${config.port}/docs`);
  });
};
