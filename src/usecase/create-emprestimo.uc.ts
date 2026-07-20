import { EmprestimoRepository } from '../infra/repositories/emprestimo.repository'
import { Emprestimo } from '../model/emprestimo'
import { CreateEmprestimoDto } from '../view/dto/create-emprestimo-form.dto'

export class CreateEmprestimoUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async execute(emprestimo: CreateEmprestimoDto): Promise<Emprestimo> {
    if (
      !Number.isInteger(emprestimo.id_usuario) ||
      emprestimo.id_usuario <= 0 ||
      !Number.isInteger(emprestimo.id_livro) ||
      emprestimo.id_livro <= 0
    ) {
      throw new Error('Os IDs devem ser números inteiros maiores que zero')
    }

    return this.repository.create(emprestimo.id_usuario, emprestimo.id_livro)
  }
}
