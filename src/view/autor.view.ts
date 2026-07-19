import { ConsoleView } from '../@common/view/console.view'
import { CreateAutorUseCase } from '../usecase/create-autor.uc'
import { FindAutorUseCase } from '../usecase/find-autor.uc'
import { ListAllAutorsUseCase } from '../usecase/list-autor.uc'
import { CreateAutorDto } from './dto/create-autor-form.dto'

export class AutorView extends ConsoleView {
  constructor(
    private readonly listAllAutorsUc: ListAllAutorsUseCase,
    private readonly createAutorUc: CreateAutorUseCase,
    private readonly findAutorUc: FindAutorUseCase
  ) {
    super()
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display(`Você está no menu de Autores!`)
    this.display('========================================')
    this.display('')
    this.display('1 - Cadastrar Autor')
    this.display('2 - Listar Autores')
    this.display('3 - Buscar Autor')
    this.display('4 - Voltar ao Menu Principal')

    const option = await this.prompt('\nEscolha uma opção: ')

    switch (option) {
      case '1': {
        this.clear()
        const createAutorDto = await this.promptInteractiveForm(
          `Informe os dados do autor`,
          CreateAutorDto.schema(),
          CreateAutorDto
        )

        const autorOrError = await this.createAutorUc
          .execute(createAutorDto)
          .catch((error: unknown) => error as Error)

        if (autorOrError instanceof Error) {
          this.reportTechnicalError(
            `Erro ao realizar o cadastro, ${autorOrError.message}!!!`
          )
          await this.prompt('Pressione ENTER para sair...')
          return
        }

        this.display(
          `Autor ${JSON.stringify(autorOrError)} cadastrado com sucesso!`
        )
        await this.prompt('Pressione ENTER para continuar...')
        break
      }
      case '2': {
        this.clear()

        this.display('========================================')
        this.display(`Listagem de Autores:`)
        this.display('========================================')

        const listAutorsOrError = await this.listAllAutorsUc
          .execute()
          .catch((error: unknown) => error as Error)

        if (listAutorsOrError instanceof Error) {
          this.display(`Erro ao listar autores: ${listAutorsOrError.message}!`)
          await this.prompt('Pressione ENTER para continuar...')

          return
        }

        if (listAutorsOrError === null || listAutorsOrError.length === 0) {
          this.display('Nenhum autor encontrado.')
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        listAutorsOrError.map((autor) => {
          this.display(
            `ID: ${autor.id.toString()}\nNome Completo: ${autor.nome} ${autor.sobrenome}\nCPF: ${autor.cpf}\n========================================`
          )
        })

        await this.prompt('Pressione ENTER para continuar...')

        break
      }
      case '3': {
        this.clear()
        this.display('========================================')
        this.display(`Busca de Autores:`)
        this.display('========================================')
        const entry = await this.prompt(
          '\nDigite o ID, CPF ou nome e/ou sobrenome do autor que deseja buscar: '
        )
        this.display('\n========================================')

        const findAutorOrError = await this.findAutorUc
          .execute(entry)
          .catch((error: unknown) => error as Error)

        if (findAutorOrError instanceof Error) {
          this.display(`Erro ao buscar autor: ${findAutorOrError.message}`)
          await this.prompt('Pressione ENTER para continuar...')

          return
        }

        if (findAutorOrError === null || findAutorOrError.length === 0) {
          this.display('Nenhum autor encontrado.')
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        findAutorOrError.map((autor) => {
          this.display(
            `ID: ${autor.id.toString()}\nNome Completo: ${autor.nome} ${autor.sobrenome}\nCPF: ${autor.cpf}\n========================================`
          )
        })
        await this.prompt('Pressione ENTER para continuar...')
        break
      }
      case '4':
        this.display('Voltando ao Menu Principal...')
        this.exit()
        break
      default:
        this.display('Opção inválida. Tente novamente.')
        await this.prompt('Pressione ENTER para continuar...')
    }
  }
}
