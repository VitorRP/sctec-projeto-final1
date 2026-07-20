import { UserRepository } from '../infra/repositories/user.repository'
import { Usuario } from '../model/user'

export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: number): Promise<Usuario> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID do usuário inválido')
    }

    return this.repository.delete(id)
  }
}
