import { ConsoleFormSchema } from '../../@common/view/console.view'

export class CreateUserDto {
  constructor(
    public login: string,
    public password: string,
    public email: string,
    public nome: string,
    public sobrenome: string,
    public cpf: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      nome: { type: 'string', required: true },
      sobrenome: { type: 'string', required: true },
      email: { type: 'string', required: true },
      cpf: { type: 'string', required: true },
      login: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }
  }
}
