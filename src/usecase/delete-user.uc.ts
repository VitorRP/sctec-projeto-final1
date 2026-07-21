import { UserRepository } from '../infra/repositories/user.repository'
import { Usuario } from '../model/user'

export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<Usuario> {
    const idConvertido = Number(id)

    if (!Number.isInteger(idConvertido) || idConvertido <= 0) {
      throw new Error('ID do usuário inválido')
    }

    return this.repository.delete(idConvertido)
  }
}
