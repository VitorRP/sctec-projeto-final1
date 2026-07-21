import { ConsoleFormSchema } from '../../@common/view/console.view'

export class CreateEmprestimoDto {
  constructor(
    public id_usuario: number,
    public id_livro: number
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      id_usuario: { type: 'number', required: true },
      id_livro: { type: 'number', required: true }
    }
  }
}
