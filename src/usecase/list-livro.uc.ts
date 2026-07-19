import { LivroRepository } from '../infra/repositories/livro.repository'
import { Livro } from '../model/livro'

export class ListAllLivrosUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(): Promise<Livro[] | null> {
    return await this.repository.findAllLivros()
  }
}
