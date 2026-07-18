import { AutorView } from './autor.view'
import { UsersView } from './users.view'
import { ConsoleView } from '../../@common/view/console.view'
import { Usuario } from '../../model/user'

export class MenuView extends ConsoleView {
  constructor(
    private readonly user: Usuario,
    private readonly autorView: AutorView,
    private readonly userView: UsersView
  ) {
    super()
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display(
      `   Bem-vindo, ${this.user.nome} ${this.user.sobrenome}              `
    )
    this.display('   Sistema de Gestão de Biblioteca      ')
    this.display('========================================')
    this.display('')
    this.display('1 - Autores')
    this.display('2 - Livros')
    this.display('3 - Editoras')
    this.display('4 - Empréstimos')
    this.display('5 - Usuários')
    this.display('6 - Relatórios')
    this.display('7 - Sair')

    const option = await this.prompt('\nEscolha uma opção: ')

    switch (option) {
      case '1':
        await this.autorView.start()
        break
      case '2':
        this.display('Opção Livros selecionada.')
        break
      case '3':
        this.display('Opção Editoras selecionada.')
        break
      case '4':
        this.display('Opção Empréstimos selecionada.')
        break
      case '5':
        await this.userView.start()
        break
      case '6':
        this.display('Opção Relatórios selecionada.')
        break
      case '7':
        this.exit()
        break
      default:
        this.display('Opção inválida. Tente novamente.')
    }
  }
}
