import { ConsoleFormSchema } from '../../@common/view/console.view'

export class CreateEmprestimoDto {
  constructor(
    public id_usuario: string,
    public id_livro: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      id_usuario: { type: 'string', required: true },
      id_livro: { type: 'string', required: true }
    }
  }
}
