import { ConsoleView } from '../@common/view/console.view'
import { CreateUserUseCase } from '../usecase/create-user.uc'
import { DeleteUserUseCase } from '../usecase/delete-user.uc'
import { FindUserUseCase } from '../usecase/find-user.uc'
import { ListAllUsersUseCase } from '../usecase/list-user.uc'
import { CreateUserDto } from './dto/create-user-form.dto'
import { DeleteUserDto } from './dto/delete-user-form.dto'
import { UpdateUserUseCase } from '../usecase/update-user.uc'
import { UpdateUserDto } from './dto/update-user-form.dto'

export class UsersView extends ConsoleView {
  constructor(
    private readonly createUserUc: CreateUserUseCase,
    private readonly listAllUsersUc: ListAllUsersUseCase,
    private readonly findUserUc: FindUserUseCase,
    private readonly deleteUserUc: DeleteUserUseCase,
    private readonly updateUserUc: UpdateUserUseCase
  ) {
    super()
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display('Você está no menu de Usuários!')
    this.display('========================================')
    this.display('')
    this.display('1 - Cadastrar Usuário')
    this.display('2 - Listar Usuários')
    this.display('3 - Buscar Usuário')
    this.display('4 - Atualizar Usuário')
    this.display('5 - Desativar Usuário')
    this.display('6 - Voltar ao Menu Principal')

    const option = await this.prompt('\nEscolha uma opção: ')

    switch (option) {
      case '1': {
        const createUserDto = await this.promptInteractiveForm(
          `Informe os dados do usuário`,
          CreateUserDto.schema(),
          CreateUserDto
        )

        const userOrError = await this.createUserUc
          .execute(createUserDto)
          .catch((error: unknown) => error as Error)

        if (userOrError instanceof Error) {
          this.reportTechnicalError(
            `Erro ao realizar o cadastro, ${userOrError.message}!!!`
          )
          await this.prompt('Pressione ENTER para sair...')
          return
        }

        this.display(
          `Usuário ${JSON.stringify(userOrError)} cadastrado com sucesso!`
        )
        await this.prompt('Pressione ENTER para continuar...')
        break
      }
      case '2': {
        this.clear()
        this.display('========================================')
        this.display(`Listagem de Usuários:`)
        this.display('========================================')

        const listUsersOrError = await this.listAllUsersUc
          .execute()
          .catch((error: unknown) => error as Error)

        if (listUsersOrError instanceof Error) {
          this.reportTechnicalError(
            `Erro ao realizar a listagem, ${listUsersOrError.message}!`
          )
          await this.prompt('Pressione ENTER para sair...')
          return
        }

        if (!listUsersOrError || listUsersOrError.length === 0) {
          this.display('Nenhum usuário encontrado.')
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        listUsersOrError.map((user) => {
          this.display(
            `ID: ${user.id.toString()}\nNome completo: ${user.nome} ${user.sobrenome}\nEmail: ${user.email}\nLogin: ${user.login}\nCPF: ${user.cpf}\n========================================`
          )
        })

        await this.prompt('Pressione ENTER para continuar...')
        break
      }

      case '3': {
        this.clear()
        this.display('========================================')
        this.display(`Busca de Usuários:`)
        this.display('========================================')

        const entry = await this.prompt(
          '\nDigite o ID, CPF ou nome e/ou sobrenome do usuário que deseja buscar: '
        )
        this.display('\n========================================')

        const findUserOrError = await this.findUserUc
          .execute(entry)
          .catch((error: unknown) => error as Error)

        if (findUserOrError instanceof Error) {
          this.reportTechnicalError(
            `Erro ao realizar a busca, ${findUserOrError.message}!`
          )
          await this.prompt('Pressione ENTER para sair...')
          return
        }

        if (!findUserOrError || findUserOrError.length === 0) {
          this.display('Nenhum usuário encontrado.')
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        findUserOrError.map((user) => {
          this.display(
            `ID: ${user.id.toString()}\nNome completo: ${user.nome} ${user.sobrenome}\nEmail: ${user.email}\nLogin: ${user.login}\nCPF: ${user.cpf}\n========================================`
          )
        })

        await this.prompt('Pressione ENTER para continuar...')
        break
      }

      case '4': {
        const dto = await this.promptInteractiveForm(
          'Informe todos os dados atualizados do usuário',
          UpdateUserDto.schema(),
          UpdateUserDto
        )

        const result = await this.updateUserUc
          .execute(dto)
          .catch((error: unknown) => error as Error)

        if (result instanceof Error) {
          this.display(`Erro: ${result.message}`)
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        this.display(`Usuário ${result.nome} atualizado com sucesso!`)
        await this.prompt('Pressione ENTER para continuar...')
        break
      }

      case '5': {
        const dto = await this.promptInteractiveForm(
          'Informe o usuário que será desativado',
          DeleteUserDto.schema(),
          DeleteUserDto
        )

        const userOrError = await this.deleteUserUc
          .execute(dto.id)
          .catch((error: unknown) => error as Error)

        if (userOrError instanceof Error) {
          this.display(`Erro: ${userOrError.message}`)
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        this.display(`Usuário ${userOrError.nome} desativado com sucesso!`)
        await this.prompt('Pressione ENTER para continuar...')
        break
      }

      case '6': {
        this.exit()
        break
      }

      default: {
        this.display('Opção inválida. Tente novamente.')
        await this.prompt('Pressione ENTER para continuar...')
        break
      }
    }
  }
}
