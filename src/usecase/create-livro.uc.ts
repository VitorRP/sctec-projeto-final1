import { LivroRepository } from '../infra/repositories/livro.repository'
import { Livro } from '../model/livro'
import { CreateLivroDto } from '../view/dto/create-livro-form.dto'

export class CreateLivroUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(livro: CreateLivroDto): Promise<Livro> {
    const existingLivro = await this.repository.findLivroByIsbn(
      livro.codigo_isbn
    )

    if (existingLivro) {
      throw new Error('Livro já cadastrado')
    }

    return await this.repository.create(livro)
  }
}
