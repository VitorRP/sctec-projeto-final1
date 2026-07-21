import { ConsoleFormSchema } from '../../@common/view/console.view'

export class UpdateQuantidadeLivroDto {
  constructor(
    public id: number,
    public quantidade: number
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'number', required: true },
      quantidade: { type: 'number', required: true }
    }
  }
}
