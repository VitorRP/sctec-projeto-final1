import { EmprestimoRepository } from '../infra/repositories/emprestimo.repository'
import { Emprestimo } from '../model/emprestimo'
import { CreateEmprestimoDto } from '../view/dto/create-emprestimo-form.dto'

export class CreateEmprestimoUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async execute(emprestimo: CreateEmprestimoDto): Promise<Emprestimo> {
    if (emprestimo.id_usuario <= 0 || emprestimo.id_livro <= 0) {
      throw new Error('ID deve ser maior que 0')
    }

    return this.repository.create(emprestimo.id_usuario, emprestimo.id_livro)
  }
}
