import { ConsoleView } from '../../@common/view/console.view'
import { Autor } from '../../model/autor'
import { Usuario } from '../../model/user'

export class AutorView extends ConsoleView {
  constructor(private readonly user: Usuario) {
    super(true)
  }

  protected async update(): Promise<void> {
    this.display('========================================')
    this.display(`Você está no menu de Autores,${this.user.nome}!`)
    this.display('========================================')
    this.display('')
    this.display('1 - Cadastrar Autor')
    this.display('2 - Listar Autores')
    this.display('3 - Buscar Autor')
    this.display('4 - Voltar ao Menu Principal')

    const option = await this.prompt('\nEscolha uma opção: ')

    switch (option) {
      case '1':
        this.display('Opção Cadastrar Autor selecionada.')
        break
      case '2':
        this.display('Opção Listar Autores selecionada.')
        break
      case '3':
        this.display('Opção Buscar Autor selecionada.')
        break
      case '4':
        this.display('Voltando ao Menu Principal...')
        this.exit()
        break
      default:
        this.display('Opção inválida. Tente novamente.')
    }
  }
}
