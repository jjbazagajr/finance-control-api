import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase, LoginUserUseCase, GetProfileUseCase } from '@application/use-cases';
import { IUserRepository, IHashService, ITokenService } from '@application/ports';
import { registerSchema, loginSchema } from '../validators';
import { AuthenticatedRequest } from '../middlewares';

export class AuthController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body);
      const useCase = new RegisterUserUseCase(
        this.userRepository,
        this.hashService,
        this.tokenService
      );
      const result = await useCase.execute(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body);
      const useCase = new LoginUserUseCase(
        this.userRepository,
        this.hashService,
        this.tokenService
      );
      const result = await useCase.execute(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const useCase = new GetProfileUseCase(this.userRepository);
      const result = await useCase.execute({ userId });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
