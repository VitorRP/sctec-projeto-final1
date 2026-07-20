import { LivroRepository } from '../infra/repositories/livro.repository'
import { Livro } from '../model/livro'
import { UpdateQuantidadeLivroDto } from '../view/dto/update-quantidade-livro-form.dto'

export class AddExemplaresLivroUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(livro: UpdateQuantidadeLivroDto): Promise<Livro> {
    if (!Number.isInteger(livro.id) || livro.id <= 0) {
      throw new Error('ID do livro inválido')
    }

    if (!Number.isInteger(livro.quantidade) || livro.quantidade <= 0) {
      throw new Error('A quantidade deve ser maior que zero')
    }

    return this.repository.addExemplares(livro.id, livro.quantidade)
  }
}
