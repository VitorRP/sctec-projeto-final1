import { ConsoleFormSchema } from '../../@common/view/console.view'

export class CheckUserDto {
  constructor(
    public login: string,
    public password: string
  ) {}

  static schema(): ConsoleFormSchema {
    return {
      login: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }
  }
}
