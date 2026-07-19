import { ConsoleView } from '../@common/view/console.view'
// import { Livro } from '../model/livro'
import { CreateLivroUseCase } from '../usecase/create-livro.uc'
import { FindLivroUseCase } from '../usecase/find-livro.uc'
import { ListAllLivrosUseCase } from '../usecase/list-livro.uc'
import { CreateLivroDto } from './dto/create-livro-form.dto'

export class LivroView extends ConsoleView {
  constructor(
    private readonly listAllLivrosUc: ListAllLivrosUseCase,
    private readonly createLivroUc: CreateLivroUseCase,
    private readonly findLivroUc: FindLivroUseCase
  ) {
    super()
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display(`Você está no menu de Livros!`)
    this.display('========================================')
    this.display('')
    this.display('1 - Cadastrar Livro')
    this.display('2 - Listar Livros')
    this.display('3 - Buscar Livro')
    this.display('4 - Voltar ao Menu Principal')

    const option = await this.prompt('\nEscolha uma opção: ')

    switch (option) {
      case '1': {
        this.clear()
        const createLivroDto = await this.promptInteractiveForm(
          `Informe os dados do livro (Formato do ano de publicação deve ser: YYYY-MM-DD)`,
          CreateLivroDto.schema(),
          CreateLivroDto
        )

        const livroOrError = await this.createLivroUc
          .execute(createLivroDto)
          .catch((error: unknown) => error as Error)

        if (livroOrError instanceof Error) {
          this.reportTechnicalError(
            `Erro ao realizar o cadastro, ${livroOrError.message}!!!`
          )
          await this.prompt('Pressione ENTER para sair...')
          return
        }

        this.display(
          `Livro ${JSON.stringify(livroOrError)} cadastrado com sucesso!`
        )
        await this.prompt('Pressione ENTER para continuar...')
        break
      }

      case '2': {
        this.clear()

        //TODO Realizar logica de ordenamento dos livros
        // const parameter = await this.prompt(
        //   `Qual deseja ordernar por qual campo?\n1 - Titulo\n2 - Quantidade Total\n3 - Quantidade disponível\n`
        // )

        // const order = await this.prompt(
        //   `Qual a ordem desejada?\n1 - Crescente\n2 - Decrescente\n`
        // )

        this.display('========================================')
        this.display(`Listagem de Livros:`)
        this.display('========================================')

        const listLivrosOrError = await this.listAllLivrosUc
          .execute()
          .catch((error: unknown) => error as Error)

        if (listLivrosOrError instanceof Error) {
          this.display(`Erro ao listar livros: ${listLivrosOrError.message}!`)
          await this.prompt('Pressione ENTER para continaur...')
          return
        }

        if (listLivrosOrError === null || listLivrosOrError.length === 0) {
          this.display('Nenhum livro encontrado.')
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        // if(parameter === '1')
        // listLivrosOrError.sort(
        //   (a: Livro, b: Livro) => b.quantidade_total - a.quantidade_total
        // )

        listLivrosOrError.map((livro) => {
          this.display(
            `ID: ${livro.id.toString()}\nTitulo: ${livro.titulo}\nCodigo ISBN: ${livro.codigo_isbn}\nAno de Publicação: ${livro.ano_publicacao}\nQuantidade Total: ${livro.quantidade_total.toString()}\nQuantidade empréstimos: ${livro.quantidade_emprestimos.toString()}\nQuantidade disponível: ${(livro.quantidade_total - livro.quantidade_emprestimos).toString()}\n========================================`
          )
        })

        await this.prompt('Pressione ENTER para continuar...')

        break
      }

      case '3': {
        this.clear()
        this.display('========================================')
        this.display(`Busca de Livros:`)
        this.display('========================================')
        const entry = await this.prompt(
          '\nDigite o ID, Código ISBN, título, ou ano de publicação do livro que deseja buscar: '
        )
        this.display('\n========================================')

        const findLivroOrError = await this.findLivroUc
          .execute(entry)
          .catch((error: unknown) => error as Error)

        if (findLivroOrError instanceof Error) {
          this.display(`Erro ao buscar livro: ${findLivroOrError.message}`)
          await this.prompt('Pressione ENTER para continuar...')

          return
        }

        if (findLivroOrError === null || findLivroOrError.length === 0) {
          this.display('Nenhum livro encontrado.')
          await this.prompt('Pressione ENTER para continuar...')
          return
        }

        findLivroOrError.map((livro) => {
          this.display(
            `ID: ${livro.id.toString()}\nTitulo: ${livro.titulo}\nCodigo ISBN: ${livro.codigo_isbn}\nAno de Publicação: ${livro.ano_publicacao}\nQuantidade Total: ${livro.quantidade_total.toString()}\nQuantidade empréstimos: ${livro.quantidade_emprestimos.toString()}\nQuantidade disponível: ${(livro.quantidade_total - livro.quantidade_emprestimos).toString()}\n========================================`
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
