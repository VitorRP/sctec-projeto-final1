import { EmprestimoRepository } from '../infra/repositories/emprestimo.repository'
import { Emprestimo } from '../model/emprestimo'

export class ListEmprestimosUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async execute(): Promise<Emprestimo[] | null> {
    return this.repository.listAllEmprestimos()
  }
}
