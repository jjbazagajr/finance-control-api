import { Router } from 'express';
import { AuthController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { IUserRepository, IHashService, ITokenService } from '@application/ports';

export const createAuthRoutes = (
  userRepository: IUserRepository,
  hashService: IHashService,
  tokenService: ITokenService
): Router => {
  const router = Router();
  const controller = new AuthController(userRepository, hashService, tokenService);

  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', authMiddleware, controller.getProfile);

  return router;
};
