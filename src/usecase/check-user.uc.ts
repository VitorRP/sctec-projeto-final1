import { UserRepository } from '../infra/repositories/user.repository'
import { Usuario } from '../model/user'
import { CheckUserDto } from '../view/dto/check-user-form'

export class CheckUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(user: CheckUserDto): Promise<Usuario | null> {
    const existingUser = await this.repository.findByLogin(
      user.login,
      user.password
    )

    if (!existingUser) {
      throw new Error('Usuário não encontrado ou senha incorreta')
    }

    return existingUser
  }
}
