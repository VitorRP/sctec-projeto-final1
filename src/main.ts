import 'dotenv/config'
import { initDatabase, pool } from './@common/database/database'
import { AutorRepository } from './infra/repositories/autor.repository'
import { EditoraRepository } from './infra/repositories/editora.repository'
import { EmprestimoRepository } from './infra/repositories/emprestimo.repository'
import { LivroRepository } from './infra/repositories/livro.repository'
import { RelatorioRepository } from './infra/repositories/relatorio.repository'
import { UserRepository } from './infra/repositories/user.repository'
import { AddExemplaresLivroUseCase } from './usecase/add-livros.uc'
import { CheckUserUseCase } from './usecase/check-user.uc'
import { CreateAutorUseCase } from './usecase/create-autor.uc'
import { CreateEditoraUseCase } from './usecase/create-editora.uc'
import { CreateEmprestimoUseCase } from './usecase/create-emprestimo.uc'
import { CreateLivroUseCase } from './usecase/create-livro.uc'
import { CreateUserUseCase } from './usecase/create-user.uc'
import { DeleteAutorUseCase } from './usecase/delete-autor.uc'
import { DeleteEditoraUseCase } from './usecase/delete-editora.uc'
import { DeleteUserUseCase } from './usecase/delete-user.uc'
import { DevolverEmprestimoUseCase } from './usecase/devolver-emprestimo.uc'
import { FindAutorUseCase } from './usecase/find-autor.uc'
import { FindEditoraUseCase } from './usecase/find-editora.uc'
import { FindLivroUseCase } from './usecase/find-livro.uc'
import { FindUserUseCase } from './usecase/find-user.uc'
import { ListAllAutorsUseCase } from './usecase/list-autor.uc'
import { ListAllEditorasUseCase } from './usecase/list-editora.uc'
import { ListEmprestimosUseCase } from './usecase/list-emprestimo.uc'
import { ListAllLivrosUseCase } from './usecase/list-livro.uc'
import { ListAllUsersUseCase } from './usecase/list-user.uc'
import { RelatorioUseCase } from './usecase/relatorio.uc'
import { RemoveExemplaresLivroUseCase } from './usecase/remove-livros.uc'
import { UpdateAutorUseCase } from './usecase/update-autor.uc'
import { UpdateEditoraUseCase } from './usecase/update-editora.uc'
import { UpdateUserUseCase } from './usecase/update-user.uc'
import { AutorView } from './view/autor.view'
import { EditoraView } from './view/editora.view'
import { EmprestimoView } from './view/emprestimo.view'
import { LivroView } from './view/livro.view'
import { MainView } from './view/main.view'
import { RelatorioView } from './view/relatorio.view'
import { UsersView } from './view/user.view'

async function bootstrap() {
  await initDatabase()

  const checkUserUc = new CheckUserUseCase(new UserRepository(pool))
  const createUserUc = new CreateUserUseCase(new UserRepository(pool))

  const createAutorUc = new CreateAutorUseCase(new AutorRepository(pool))
  const listAllAutorsUc = new ListAllAutorsUseCase(new AutorRepository(pool))
  const findAutorUc = new FindAutorUseCase(new AutorRepository(pool))
  const updateAutorUc = new UpdateAutorUseCase(new AutorRepository(pool))
  const deleteAutorUc = new DeleteAutorUseCase(new AutorRepository(pool))

  const findUserUc = new FindUserUseCase(new UserRepository(pool))
  const listAllUsersUc = new ListAllUsersUseCase(new UserRepository(pool))
  const updateUserUc = new UpdateUserUseCase(new UserRepository(pool))
  const deleteUserUc = new DeleteUserUseCase(new UserRepository(pool))

  const findLivroUc = new FindLivroUseCase(new LivroRepository(pool))
  const listAllLivrosUc = new ListAllLivrosUseCase(new LivroRepository(pool))
  const createLivroUc = new CreateLivroUseCase(new LivroRepository(pool))
  const addLivrosUc = new AddExemplaresLivroUseCase(new LivroRepository(pool))
  const removeLivrosUc = new RemoveExemplaresLivroUseCase(
    new LivroRepository(pool)
  )

  const createEmprestimoUc = new CreateEmprestimoUseCase(
    new EmprestimoRepository(pool)
  )
  const listAllEmprestimosUc = new ListEmprestimosUseCase(
    new EmprestimoRepository(pool)
  )
  const devolverEmprestimoUc = new DevolverEmprestimoUseCase(
    new EmprestimoRepository(pool)
  )

  const createEditoraUc = new CreateEditoraUseCase(new EditoraRepository(pool))
  const listAllEditorasUc = new ListAllEditorasUseCase(
    new EditoraRepository(pool)
  )
  const findEditoraUc = new FindEditoraUseCase(new EditoraRepository(pool))
  const updateEditoraUc = new UpdateEditoraUseCase(new EditoraRepository(pool))
  const deleteEditoraUc = new DeleteEditoraUseCase(new EditoraRepository(pool))

  const relatorioUc = new RelatorioUseCase(new RelatorioRepository(pool))

  const relatorioView = new RelatorioView(relatorioUc)

  const autorView = new AutorView(
    listAllAutorsUc,
    createAutorUc,
    findAutorUc,
    updateAutorUc,
    deleteAutorUc
  )
  const userView = new UsersView(
    createUserUc,
    listAllUsersUc,
    findUserUc,
    deleteUserUc,
    updateUserUc
  )
  const editoraView = new EditoraView(
    listAllEditorasUc,
    createEditoraUc,
    findEditoraUc,
    updateEditoraUc,
    deleteEditoraUc
  )
  const livroView = new LivroView(
    listAllLivrosUc,
    createLivroUc,
    findLivroUc,
    addLivrosUc,
    removeLivrosUc
  )

  const emprestimoView = new EmprestimoView(
    createEmprestimoUc,
    listAllEmprestimosUc,
    devolverEmprestimoUc
  )

  const mainView = new MainView(
    checkUserUc,
    createUserUc,
    autorView,
    userView,
    editoraView,
    livroView,
    emprestimoView,
    relatorioView
  )

  await mainView.start()
}

bootstrap()
  .then(() => {
    process.exit(0)
  })
  .catch((e: unknown) => {
    console.log('UNHANDLED REJECTION')
    console.error(e)
    process.exit(1)
  })
