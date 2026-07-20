import { ConsoleFormSchema } from '../../@common/view/console.view'

export class DeleteUserDto {
  constructor(public id: number) {}

  static schema(): ConsoleFormSchema {
    return {
      id: { type: 'number', required: true }
    }
  }
}
