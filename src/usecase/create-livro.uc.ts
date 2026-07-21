import { LivroRepository } from '../infra/repositories/livro.repository'
import { Livro } from '../model/livro'
import { CreateLivroDto } from '../view/dto/create-livro-form.dto'

export class CreateLivroUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(livro: CreateLivroDto): Promise<Livro> {
    if (!Number.isInteger(livro.id_autor) || livro.id_autor <= 0) {
      throw new Error('ID do autor inválido')
    }

    if (!Number.isInteger(livro.id_editora) || livro.id_editora <= 0) {
      throw new Error('ID da editora inválido')
    }

    const existingLivro = await this.repository.findLivroByIsbn(
      livro.codigo_isbn
    )

    if (existingLivro) {
      throw new Error('Livro já cadastrado')
    }

    return this.repository.create(livro, livro.id_autor, livro.id_editora)
  }
}
