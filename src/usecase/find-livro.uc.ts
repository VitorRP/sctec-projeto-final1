import { LivroRepository } from '../infra/repositories/livro.repository'
import { Livro } from '../model/livro'

export class FindLivroUseCase {
  constructor(private readonly repository: LivroRepository) {}

  async execute(entry: string): Promise<Livro[] | null> {
    return await this.repository.findLivro(entry)
  }
}
