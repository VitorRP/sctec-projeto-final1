import { ConsoleFormSchema } from '../../@common/view/console.view'

export class UpdateUserDto {
  constructor(
    public id: number,
    public nome: string,
    public sobrenome: string,
    public cpf: string,
    public email: string,
    public login: string,
    public password: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'number', required: true },
      nome: { type: 'string', required: true },
      sobrenome: { type: 'string', required: true },
      cpf: { type: 'string', required: true },
      email: { type: 'string', required: true },
      login: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }
  }
}
