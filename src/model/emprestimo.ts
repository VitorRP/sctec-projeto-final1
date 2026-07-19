export type EmprestimoStatus = 'ativo' | 'devolvido'

export interface Emprestimo {
  id: number

  id_usuario: number

  id_livro: number

  data_emprestimo: Date

  status: EmprestimoStatus

  data_devolucao: Date | null
}
