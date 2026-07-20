import { CadastroStatus } from './status-cadastro'

export interface Usuario {
  id: number

  nome: string

  sobrenome: string

  cpf: string

  email: string

  login: string

  password: string

  status: CadastroStatus
}
