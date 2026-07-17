import 'dotenv/config'
import { initDatabase, pool } from './@common/database/database'
import { AutorRepository } from './infra/repositories/autor.repository'
import { UserRepository } from './infra/repositories/user.repository'
import { CheckUserUseCase } from './usecase/check-user.uc'
import { CreateAutorUseCase } from './usecase/create-autor.uc'
import { CreateUserUseCase } from './usecase/create-user.uc'
import { ListAllAutorsUseCase } from './usecase/list-autor.uc'
import { MainView } from './view/main.view'
import { AutorView } from './view/screens/autor.view'

async function bootstrap() {
  await initDatabase()

  const checkUserUc = new CheckUserUseCase(new UserRepository(pool))
  const createUserUc = new CreateUserUseCase(new UserRepository(pool))

  const createAutorUc = new CreateAutorUseCase(new AutorRepository(pool))
  const listAllAutors = new ListAllAutorsUseCase(new AutorRepository(pool))
  const autorView = new AutorView(listAllAutors, createAutorUc)

  const mainView = new MainView(checkUserUc, createUserUc, autorView)

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
