import { UserRepository } from '../infra/repositories/user.repository'
import { Usuario } from '../model/user'
import { CreateUserDto } from '../view/dto/create-user-form.dto'

export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(user: CreateUserDto): Promise<Usuario> {
    const existingUser = await this.repository.findByUser(user.cpf)

    if (existingUser?.status === 'desativado') {
      throw new Error(
        'Já existe um usuário desativado com este CPF, email ou login'
      )
    }

    if (existingUser) {
      throw new Error('CPF, email ou login já cadastrado')
    }

    return this.repository.create(user)
  }
}
