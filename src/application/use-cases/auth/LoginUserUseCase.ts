import { InvalidCredentialsError } from '@domain/errors';
import { IUserRepository, IHashService, ITokenService } from '../../ports';

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.hashService.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenService.generate({
      userId: user.id.getValue(),
      email: user.email,
    });

    return {
      user: {
        id: user.id.getValue(),
        email: user.email,
        name: user.name,
      },
      token,
    };
  }
}
