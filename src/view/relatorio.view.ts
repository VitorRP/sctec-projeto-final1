import { ConsoleView } from '../@common/view/console.view'
import { RelatorioUseCase } from '../usecase/relatorio.uc'

export class RelatorioView extends ConsoleView {
  constructor(private readonly relatorioUc: RelatorioUseCase) {
    super()
  }

  private async showReport<Report>(
    title: string,
    load: () => Promise<Report[]>,
    format: (item: Report) => string
  ): Promise<void> {
    this.clear()
    this.display('========================================')
    this.display(title)
    this.display('========================================')

    const resultOrError = await load().catch((error: unknown) => error as Error)

    if (resultOrError instanceof Error) {
      this.display(`Erro ao gerar relatório: ${resultOrError.message}`)
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    if (resultOrError.length === 0) {
      this.display('Nenhum resultado encontrado.')
      await this.prompt('Pressione ENTER para continuar...')
      return
    }

    resultOrError.map((item) => {
      this.display(format(item))
    })
    await this.prompt('Pressione ENTER para continuar...')
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display('Menu de Relatórios')
    this.display('========================================')
    this.display('1 - Livros disponíveis')
    this.display('2 - Livros emprestados')
    this.display('3 - Livros cadastrados por autor')
    this.display('4 - Quantidade de empréstimos por livro')
    this.display('5 - Clientes com empréstimos ativos')
    this.display('6 - Livros por editora')
    this.display('7 - Voltar ao Menu Principal')

    const option = await this.prompt('\nEscolha uma opção: ')

    switch (option) {
      case '1':
        await this.showReport(
          'Livros disponíveis',
          () => this.relatorioUc.livrosDisponiveis(),
          (livro) =>
            `ID: ${livro.id.toString()}\nTítulo: ${livro.titulo}\nISBN: ${livro.codigo_isbn}\nDisponíveis: ${livro.quantidade_disponivel.toString()}\n========================================`
        )
        break

      case '2':
        await this.showReport(
          'Livros emprestados',
          () => this.relatorioUc.livrosEmprestados(),
          (emprestimo) =>
            `Empréstimo: ${emprestimo.emprestimo_id.toString()}\nLivro: ${emprestimo.titulo}\nCliente: ${emprestimo.cliente}\nData: ${emprestimo.data_emprestimo.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}\n========================================`
        )
        break

      case '3':
        await this.showReport(
          'Livros cadastrados por autor',
          () => this.relatorioUc.livrosPorAutor(),
          (autor) =>
            `Autor: ${autor.autor}\nQuantidade: ${autor.quantidade_livros.toString()}\nLivros: ${autor.livros}\n========================================`
        )
        break

      case '4':
        await this.showReport(
          'Quantidade de empréstimos por livro',
          () => this.relatorioUc.emprestimosPorLivro(),
          (livro) =>
            `Livro: ${livro.titulo}\nEmpréstimos: ${livro.quantidade_emprestimos.toString()}\n========================================`
        )
        break

      case '5':
        await this.showReport(
          'Clientes com empréstimos ativos',
          () => this.relatorioUc.clientesComEmprestimoAtivo(),
          (cliente) =>
            `Cliente: ${cliente.cliente}\nEmpréstimos ativos: ${cliente.quantidade_ativos.toString()}\nLivros: ${cliente.livros}\n========================================`
        )
        break

      case '6':
        await this.showReport(
          'Livros por editora',
          () => this.relatorioUc.livrosPorEditora(),
          (item) =>
            `Editora: ${item.editora}\nQuantidade de livros: ${item.quantidade_livros.toString()}\nLivros: ${item.livros}\n========================================`
        )
        break

      case '7':
        this.exit()
        break

      default:
        this.display('Opção inválida. Tente novamente.')
        await this.prompt('Pressione ENTER para continuar...')
    }
  }
}
