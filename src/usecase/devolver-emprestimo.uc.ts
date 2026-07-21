import { EmprestimoRepository } from '../infra/repositories/emprestimo.repository'
import { Emprestimo } from '../model/emprestimo'

export class DevolverEmprestimoUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async execute(id: number): Promise<Emprestimo> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID do empréstimo inválido')
    }

    return this.repository.devolver(id)
  }
}
