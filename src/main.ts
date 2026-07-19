import 'dotenv/config'
import { initDatabase, pool } from './@common/database/database'
import { AutorRepository } from './infra/repositories/autor.repository'
import { EditoraRepository } from './infra/repositories/editora.repository'
import { LivroRepository } from './infra/repositories/livro.repository'
import { UserRepository } from './infra/repositories/user.repository'
import { CheckUserUseCase } from './usecase/check-user.uc'
import { CreateAutorUseCase } from './usecase/create-autor.uc'
import { CreateEditoraUseCase } from './usecase/create-editora.uc'
import { CreateLivroUseCase } from './usecase/create-livro.uc'
import { CreateUserUseCase } from './usecase/create-user.uc'
import { FindAutorUseCase } from './usecase/find-autor.uc'
import { FindEditoraUseCase } from './usecase/find-editora.uc'
import { FindLivroUseCase } from './usecase/find-livro.uc'
import { FindUserUseCase } from './usecase/find-user.uc'
import { ListAllAutorsUseCase } from './usecase/list-autor.uc'
import { ListAllEditorasUseCase } from './usecase/list-editora.uc'
import { ListAllLivrosUseCase } from './usecase/list-livro.uc'
import { ListAllUsersUseCase } from './usecase/list-user.uc'
import { AutorView } from './view/autor.view'
import { EditoraView } from './view/editora.view'
import { LivroView } from './view/livro.view'
import { MainView } from './view/main.view'
import { UsersView } from './view/user.view'

async function bootstrap() {
  await initDatabase()

  const checkUserUc = new CheckUserUseCase(new UserRepository(pool))
  const createUserUc = new CreateUserUseCase(new UserRepository(pool))

  const createAutorUc = new CreateAutorUseCase(new AutorRepository(pool))
  const listAllAutorsUc = new ListAllAutorsUseCase(new AutorRepository(pool))
  const findAutorUc = new FindAutorUseCase(new AutorRepository(pool))

  const findUserUc = new FindUserUseCase(new UserRepository(pool))
  const listAllUsersUc = new ListAllUsersUseCase(new UserRepository(pool))

  const findLivroUc = new FindLivroUseCase(new LivroRepository(pool))
  const listAllLivrosUc = new ListAllLivrosUseCase(new LivroRepository(pool))
  const createLivroUc = new CreateLivroUseCase(new LivroRepository(pool))

  const createEditoraUc = new CreateEditoraUseCase(new EditoraRepository(pool))
  const listAllEditorasUc = new ListAllEditorasUseCase(
    new EditoraRepository(pool)
  )
  const findEditoraUc = new FindEditoraUseCase(new EditoraRepository(pool))

  const autorView = new AutorView(listAllAutorsUc, createAutorUc, findAutorUc)
  const userView = new UsersView(createUserUc, listAllUsersUc, findUserUc)
  const editoraView = new EditoraView(
    listAllEditorasUc,
    createEditoraUc,
    findEditoraUc
  )
  const livroView = new LivroView(listAllLivrosUc, createLivroUc, findLivroUc)

  const mainView = new MainView(
    checkUserUc,
    createUserUc,
    autorView,
    userView,
    editoraView,
    livroView
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
