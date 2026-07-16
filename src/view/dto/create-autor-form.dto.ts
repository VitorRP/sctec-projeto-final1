import { ConsoleFormSchema } from '../../@common/view/console.view'

export class CreateAutorDto {
  constructor(
    public nome: string,
    public sobrenome: string,
    public cpf: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      nome: { type: 'string', required: true },
      sobrenome: { type: 'string', required: true },
      cpf: { type: 'string', required: true }
    }
  }
}
