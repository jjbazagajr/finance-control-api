import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@domain/errors';
import { JwtTokenService } from '@infra/auth';
import { config } from '@shared/config';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

const tokenService = new JwtTokenService(config.jwt.secret, config.jwt.expiresIn);

export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('No token provided');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Token malformed');
  }

  const token = parts[1];

  try {
    const payload = tokenService.verify(token);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
