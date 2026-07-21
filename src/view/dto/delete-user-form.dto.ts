import { ConsoleFormSchema } from '../../@common/view/console.view'

export class DeleteUserDto {
  constructor(public id: string) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'string', required: true }
    }
  }
}
