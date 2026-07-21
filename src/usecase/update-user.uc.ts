import { UserRepository } from '../infra/repositories/user.repository'
import { Usuario } from '../model/user'
import { UpdateUserDto } from '../view/dto/update-user-form.dto'

export class UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(user: UpdateUserDto): Promise<Usuario> {
    if (!Number.isInteger(user.id) || user.id <= 0) {
      throw new Error('ID do usuário inválido')
    }

    const conflict = await this.repository.findUpdateConflict(
      user.id,
      user.cpf,
      user.email,
      user.login
    )

    if (conflict) {
      throw new Error('CPF, email ou login já utilizado por outro usuário')
    }

    return this.repository.update(user)
  }
}
