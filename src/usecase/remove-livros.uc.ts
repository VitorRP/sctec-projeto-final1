import { LivroRepository } from '../infra/repositories/livro.repository'
import { Livro } from '../model/livro'
import { UpdateQuantidadeLivroDto } from '../view/dto/update-quantidade-livro-form.dto'

export class RemoveExemplaresLivroUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(dto: UpdateQuantidadeLivroDto): Promise<Livro> {
    if (!Number.isInteger(dto.id) || dto.id <= 0) {
      throw new Error('ID do livro inválido')
    }

    if (!Number.isInteger(dto.quantidade) || dto.quantidade <= 0) {
      throw new Error('A quantidade deve ser maior que zero')
    }

    const livro = await this.repository.findLivroById(dto.id)

    if (!livro) {
      throw new Error('Livro não encontrado')
    }

    const quantidadeDisponivel =
      livro.quantidade_total - livro.quantidade_emprestimos

    if (dto.quantidade > quantidadeDisponivel) {
      throw new Error(
        `Só existem ${quantidadeDisponivel.toString()} exemplares disponíveis`
      )
    }

    return this.repository.removeExemplares(dto.id, dto.quantidade)
  }
}
