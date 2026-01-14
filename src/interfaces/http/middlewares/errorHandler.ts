import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors';
import { logger } from '@shared/logger';
import { ZodError } from 'zod';

export interface ErrorResponse {
  error: string;
  code: string;
  message: string;
  details?: unknown;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.headers['x-request-id'] as string;

  if (err instanceof DomainError) {
    logger.warn({ requestId, error: err.toJSON() }, 'Domain error');
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  if (err instanceof ZodError) {
    const zodErrors = err.issues;
    logger.warn({ requestId, error: zodErrors }, 'Validation error');
    res.status(400).json({
      error: 'ValidationError',
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: zodErrors,
    });
    return;
  }

  logger.error({ requestId, error: err.message, stack: err.stack }, 'Unexpected error');
  res.status(500).json({
    error: 'InternalServerError',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};
