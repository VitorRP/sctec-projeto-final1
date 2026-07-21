import { CadastroStatus } from './status-cadastro'

export interface Autor {
  id: number

  nome: string

  sobrenome: string

  cpf: string

  status: CadastroStatus
}
