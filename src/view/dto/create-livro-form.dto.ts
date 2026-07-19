import { ConsoleFormSchema } from '../../@common/view/console.view'

export class CreateLivroDto {
  constructor(
    public titulo: string,
    public ano_publicacao: string,
    public codigo_isbn: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      titulo: { type: 'string', required: true },
      ano_publicacao: { type: 'string', required: true },
      codigo_isbn: { type: 'string', required: true }
    }
  }
}
