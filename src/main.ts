import 'dotenv/config'
import { initDatabase, pool } from './@common/database/database'
import { UserRepository } from './infra/repositories/user.repository'
import { CheckUserUseCase } from './usecase/check-user.uc'
import { CreateUserUseCase } from './usecase/create-user.uc'
import { MainView } from './view/main.view'

async function bootstrap() {
  await initDatabase()

  const checkUserUc = new CheckUserUseCase(new UserRepository(pool))
  const createUserUc = new CreateUserUseCase(new UserRepository(pool))
  const mainView = new MainView(checkUserUc, createUserUc)

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
