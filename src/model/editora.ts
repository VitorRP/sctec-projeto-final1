import { CadastroStatus } from './status-cadastro'

export interface Editora {
  id: number

  cnpj: string

  razao_social: string

  nome_fantasia: string

  status: CadastroStatus
}
