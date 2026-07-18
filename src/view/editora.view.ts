import { ConsoleView } from '../@common/view/console.view'
import { CreateEditoraUseCase } from '../usecase/create-editora.uc'
import { FindEditoraUseCase } from '../usecase/find-editora.uc'
import { ListAllEditorasUseCase } from '../usecase/list-editora.uc'
import { CreateEditoraDto } from './dto/create-editora-form.dto'

export class EditoraView extends ConsoleView {
  constructor(
    private readonly listAllEditorasUc: ListAllEditorasUseCase,
    private readonly createEditoraUc: CreateEditoraUseCase,
    private readonly findEditoraUc: FindEditoraUseCase
  ) {
    super()
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display(`Você está no menu de Editoras!`)
    this.display('========================================')
    this.display('')
    this.display('1 - Cadastrar Editora')
    this.display('2 - Listar Editoras')
    this.display('3 - Buscar Editora')
    this.display('4 - Voltar ao Menu Principal')

    const option = await this.prompt('\nEscolha uma opção: ')

    switch (option) {
      case '1': {
        this.clear()
        const createEditoraDto = await this.promptInteractiveForm(
          `Informe os dados da editora`,
          CreateEditoraDto.schema(),
          CreateEditoraDto
        )

        const editoraOrError = await this.createEditoraUc
          .execute(createEditoraDto)
          .catch((error: unknown) => error as Error)

        if (editoraOrError instanceof Error) {
          this.reportTechnicalError(
            `Erro ao realizar cadastro, ${editoraOrError.message}!!!`
          )
          await this.prompt('Pressione ENTER para sair...')
          return
        }

        this.display(
          `Editora ${JSON.stringify(editoraOrError)} cadastrada com sucesso!`
        )
        await this.prompt('Pressione ENTER para sair...')
        break
      }

      case '2': {
        this.clear()

        this.display('========================================')
        this.display(`Listagem de editoras:`)
        this.display('========================================')

        const listEditorasOrError = await this.listAllEditorasUc
          .execute()
          .catch((error: unknown) => error as Error)

        if (listEditorasOrError instanceof Error) {
          this.display(
            `Erro ao listar editoras: ${listEditorasOrError.message}`
          )
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        if (listEditorasOrError === null || listEditorasOrError.length === 0) {
          this.display('Nenhuma editora encontrada.')
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        listEditorasOrError.map((editora) => {
          this.display(
            `ID: ${editora.id.toString()}\nCNPJ: ${editora.cnpj}\nRazão Social: ${editora.razao_social}\nNome Fantasia: ${editora.nome_fantasia}\n========================================`
          )
        })

        await this.prompt('Pressione ENTER para continuar...')

        break
      }

      case '3': {
        this.clear()
        this.display('========================================')
        this.display(`Busca de Editoras:`)
        this.display('========================================')

        const entry = await this.prompt(
          '\nDigite o ID, CNPJ, Nome Fantasia ou Razão Social da editora que deseja buscar: '
        )
        this.display('\n========================================')

        const findEditoraOrError = await this.findEditoraUc
          .execute(entry)
          .catch((error: unknown) => error as Error)

        if (findEditoraOrError instanceof Error) {
          this.display(`Erro ao buscar editora: ${findEditoraOrError.message}`)
          await this.prompt('Pressione ENTER para continuar...')

          return
        }

        if (findEditoraOrError === null || findEditoraOrError.length === 0) {
          this.display('Nenhuma editora encontrada.')
          await this.prompt('Pressione ENTER para continuar...')

          return
        }

        findEditoraOrError.map((editora) => {
          this.display(
            `ID: ${editora.id.toString()}\nCNPJ: ${editora.cnpj}\nRazão Social: ${editora.razao_social}\nNome Fantasia: ${editora.nome_fantasia}\n========================================`
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
