import { ConsoleFormSchema } from '../../@common/view/console.view'

export class DeleteEditoraDto {
  constructor(public id: string) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'string', required: true }
    }
  }
}
