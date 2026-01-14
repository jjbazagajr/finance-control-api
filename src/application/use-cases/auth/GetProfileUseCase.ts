import { UserNotFoundError } from '@domain/errors';
import { IUserRepository } from '../../ports';

export interface GetProfileInput {
  userId: string;
}

export interface GetProfileOutput {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetProfileInput): Promise<GetProfileOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    return {
      id: user.id.getValue(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
