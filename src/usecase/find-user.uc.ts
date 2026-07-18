import { UserRepository } from '../infra/repositories/user.repository'
import { Usuario } from '../model/user'

export class FindUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(entry: string): Promise<Usuario[] | null> {
    return await this.repository.findUser(entry)
  }
}
