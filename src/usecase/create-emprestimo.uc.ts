import { EmprestimoRepository } from '../infra/repositories/emprestimo.repository'
import { Emprestimo } from '../model/emprestimo'
import { CreateEmprestimoDto } from '../view/dto/create-emprestimo-form.dto'

export class CreateEmprestimoUseCase {
  constructor(private readonly repository: EmprestimoRepository) {}

  async execute(emprestimo: CreateEmprestimoDto): Promise<Emprestimo> {
    const idUsuario = Number(emprestimo.id_usuario)
    const idLivro = Number(emprestimo.id_livro)

    if (
      !Number.isInteger(idUsuario) ||
      idUsuario <= 0 ||
      !Number.isInteger(idLivro) ||
      idLivro <= 0
    ) {
      throw new Error('Os IDs devem ser números inteiros maiores que zero')
    }

    return this.repository.create(idUsuario, idLivro)
  }
}
