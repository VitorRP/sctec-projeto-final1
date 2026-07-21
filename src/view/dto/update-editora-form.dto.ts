import { ConsoleFormSchema } from '../../@common/view/console.view'

export class UpdateEditoraDto {
  constructor(
    public id: number,
    public cnpj: string,
    public razao_social: string,
    public nome_fantasia: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'number', required: true },
      cnpj: { type: 'string', required: true },
      razao_social: { type: 'string', required: true },
      nome_fantasia: { type: 'string', required: true }
    }
  }
}
