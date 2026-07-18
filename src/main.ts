import 'dotenv/config'
import { initDatabase, pool } from './@common/database/database'
import { AutorRepository } from './infra/repositories/autor.repository'
import { UserRepository } from './infra/repositories/user.repository'
import { CheckUserUseCase } from './usecase/check-user.uc'
import { CreateAutorUseCase } from './usecase/create-autor.uc'
import { CreateUserUseCase } from './usecase/create-user.uc'
import { ListAutorUseCase } from './usecase/find-autor.uc'
import { FindUserUseCase } from './usecase/find-user.uc'
import { ListAllAutorsUseCase } from './usecase/list-autor.uc'
import { ListAllUsersUseCase } from './usecase/list-user.uc'
import { MainView } from './view/main.view'
import { AutorView } from './view/screens/autor.view'
import { UsersView } from './view/screens/users.view'

async function bootstrap() {
  await initDatabase()

  const checkUserUc = new CheckUserUseCase(new UserRepository(pool))
  const createUserUc = new CreateUserUseCase(new UserRepository(pool))

  const createAutorUc = new CreateAutorUseCase(new AutorRepository(pool))
  const listAllAutors = new ListAllAutorsUseCase(new AutorRepository(pool))
  const listAutorUc = new ListAutorUseCase(new AutorRepository(pool))

  const findUserUc = new FindUserUseCase(new UserRepository(pool))
  const listAllUsersUc = new ListAllUsersUseCase(new UserRepository(pool))

  const autorView = new AutorView(listAllAutors, createAutorUc, listAutorUc)
  const userView = new UsersView(createUserUc, listAllUsersUc, findUserUc)
  const mainView = new MainView(checkUserUc, createUserUc, autorView, userView)

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
