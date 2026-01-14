import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '@application/ports';
import { UnauthorizedError } from '@domain/errors';

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(secret: string, expiresIn: string = '7d') {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generate(payload: TokenPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}
