import { User } from '@domain/entities';
import { EmailAlreadyExistsError } from '@domain/errors';
import { IUserRepository, IHashService, ITokenService } from '../../ports';

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserOutput {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(input.email);
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = User.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });

    const createdUser = await this.userRepository.create(user);

    const token = this.tokenService.generate({
      userId: createdUser.id.getValue(),
      email: createdUser.email,
    });

    return {
      user: {
        id: createdUser.id.getValue(),
        email: createdUser.email,
        name: createdUser.name,
      },
      token,
    };
  }
}
