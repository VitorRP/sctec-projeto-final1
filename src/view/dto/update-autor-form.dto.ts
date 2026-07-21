import { ConsoleFormSchema } from '../../@common/view/console.view'

export class UpdateAutorDto {
  constructor(
    public id: number,
    public nome: string,
    public sobrenome: string,
    public cpf: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'number', required: true },
      nome: { type: 'string', required: true },
      sobrenome: { type: 'string', required: true },
      cpf: { type: 'string', required: true }
    }
  }
}
