import { ConsoleView } from '../@common/view/console.view'
import { CreateEmprestimoUseCase } from '../usecase/create-emprestimo.uc'
import { DevolverEmprestimoUseCase } from '../usecase/devolver-emprestimo.uc'
import { ListEmprestimosUseCase } from '../usecase/list-emprestimo.uc'
import { CreateEmprestimoDto } from './dto/create-emprestimo-form.dto'
import { DevolverEmprestimoDto } from './dto/devolver-emprestimo-form.dto'

export class EmprestimoView extends ConsoleView {
  constructor(
    private readonly createEmprestimoUc: CreateEmprestimoUseCase,
    private readonly listEmprestimosUc: ListEmprestimosUseCase,
    private readonly devolverEmprestimoUc: DevolverEmprestimoUseCase
  ) {
    super()
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display('Você está no menu de Empréstimos!')
    this.display('========================================')
    this.display('')
    this.display('1 - Cadastrar Empréstimo')
    this.display('2 - Listar Empréstimos')
    this.display('3 - Devolver Livro')
    this.display('4 - Voltar ao Menu Principal')

    const option = await this.prompt('\nEscolha uma opção: ')

    switch (option) {
      case '1': {
        this.clear()

        const dto = await this.promptInteractiveForm(
          'Informe os dados do empréstimo',
          CreateEmprestimoDto.schema(),
          CreateEmprestimoDto
        )

        const emprestimoOrError = await this.createEmprestimoUc
          .execute(dto)
          .catch((error: unknown) => error as Error)

        if (emprestimoOrError instanceof Error) {
          this.display(`Erro: ${emprestimoOrError.message}`)
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        this.display(
          `Empréstimo ${emprestimoOrError.id.toString()} cadastrado com sucesso!`
        )
        await this.prompt('Pressione ENTER para continuar...')
        break
      }

      case '2': {
        this.clear()
        this.display('========================================')
        this.display('Listagem de Empréstimos:')
        this.display('========================================')

        const emprestimosOrError = await this.listEmprestimosUc
          .execute()
          .catch((error: unknown) => error as Error)

        if (emprestimosOrError instanceof Error) {
          this.display(`Erro: ${emprestimosOrError.message}`)
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        if (emprestimosOrError === null || emprestimosOrError.length === 0) {
          this.display('Nenhum empréstimo encontrado.')
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        emprestimosOrError.forEach((emprestimo) => {
          this.display(
            `ID: ${emprestimo.id.toString()}\nUsuário: ${emprestimo.id_usuario.toString()}\nLivro: ${emprestimo.id_livro.toString()}\nData do empréstimo: ${emprestimo.data_emprestimo.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}\nStatus: ${emprestimo.status}\nData da devolução: ${emprestimo.data_devolucao?.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) ?? 'Não devolvido'}\n========================================`
          )
        })

        await this.prompt('Pressione ENTER para continuar...')
        break
      }

      case '3': {
        this.clear()

        const dto = await this.promptInteractiveForm(
          'Informe o empréstimo que será devolvido',
          DevolverEmprestimoDto.schema(),
          DevolverEmprestimoDto
        )

        const emprestimoOrError = await this.devolverEmprestimoUc
          .execute(dto.id)
          .catch((error: unknown) => error as Error)

        if (emprestimoOrError instanceof Error) {
          this.display(`Erro: ${emprestimoOrError.message}`)
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        this.display(
          `Empréstimo ${emprestimoOrError.id.toString()} devolvido com sucesso!`
        )
        await this.prompt('Pressione ENTER para continuar...')
        break
      }

      case '4':
        this.exit()
        break

      default:
        this.display('Opção inválida. Tente novamente.')
        await this.prompt('Pressione ENTER para continuar...')
    }
  }
}
