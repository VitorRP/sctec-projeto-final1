import { ConsoleFormSchema } from '../../@common/view/console.view'

export class DevolverEmprestimoDto {
  constructor(public id: string) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'string', required: true }
    }
  }
}
