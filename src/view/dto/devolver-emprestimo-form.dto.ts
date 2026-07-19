import { ConsoleFormSchema } from '../../@common/view/console.view'

export class DevolverEmprestimoDto {
  constructor(public id: number) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'number', required: true }
    }
  }
}
