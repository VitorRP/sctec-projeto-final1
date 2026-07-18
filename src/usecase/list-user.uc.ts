import { UserRepository } from '../infra/repositories/user.repository'
import { Usuario } from '../model/user'

export class ListAllUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(): Promise<Usuario[] | null> {
    return await this.repository.listAllUsers()
  }
}
