import { EmprestimoRepository } from '../infra/repositories/emprestimo.repository'
import { Emprestimo } from '../model/emprestimo'

export class DevolverEmprestimoUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async execute(id: string): Promise<Emprestimo> {
    const idConvertido = Number(id)

    if (!Number.isInteger(idConvertido) || idConvertido <= 0) {
      throw new Error('ID do empréstimo inválido')
    }

    return this.repository.devolver(idConvertido)
  }
}
