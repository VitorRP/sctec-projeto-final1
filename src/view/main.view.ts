import { CheckUserDto } from './dto/check-user-form'
import { CreateUserDto } from './dto/create-user-form.dto'
import { AutorView } from './screens/autor.view'
import { MenuView } from './screens/menu.view'
import { ConsoleView } from '../@common/view/console.view'
import { CheckUserUseCase } from '../usecase/check-user.uc'
import { CreateUserUseCase } from '../usecase/create-user.uc'

export class MainView extends ConsoleView {
  constructor(
    private readonly checkUserUc: CheckUserUseCase,
    private readonly createUserUc: CreateUserUseCase,
    private readonly autorView: AutorView
  ) {
    super(true)
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display('   Bem-vindo ao Acervo CLI              ')
    this.display('   Sistema de Gestão de Biblioteca      ')
    this.display('========================================')
    this.display('')

    const checkUserDto = await this.promptInteractiveForm(
      `Informe os dados de login`,
      CheckUserDto.schema(),
      CheckUserDto
    )

    const userLoginOrError = await this.checkUserUc
      .execute(checkUserDto)
      .catch((error: unknown) => error as Error)

    if (userLoginOrError instanceof Error || userLoginOrError === null) {
      this.display('Usuário não encontrado ou senha incorreta.')
      const option = await this.prompt(
        '1 - Tentar novamente\n2 - Criar novo usuário\n3 - Sair\nEscolha uma opção: '
      )
      if (option === '1') {
        return
      }

      if (option === '2') {
        const createUserDto = await this.promptInteractiveForm(
          `Informe os dados do usuário`,
          CreateUserDto.schema(),
          CreateUserDto
        )
        const userOrError = await this.createUserUc
          .execute(createUserDto)
          .catch((error: unknown) => error as Error)

        if (userOrError instanceof Error) {
          this.reportTechnicalError(userOrError)
          await this.prompt('Pressione ENTER para sair...')
          return
        }

        await this.prompt(
          `Usuario ${JSON.stringify(userOrError)} criado com sucesso!\nPressione ENTER para fazer login...\n`
        )

        return
      }

      if (option === '3') {
        this.display('Pressione ENTER para sair do sistema...')
        this.exit()
        return
      }

      console.log('Opção inválida. Tente novamente.')
      await this.prompt('Pressione ENTER para sair...')

      return
    }

    const menuView = new MenuView(userLoginOrError, this.autorView)
    await menuView.start()
    this.exit()
  }
}
