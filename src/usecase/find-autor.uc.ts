import { AutorRepository } from '../infra/repositories/autor.repository'
import { Autor } from '../model/autor'

export class FindAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(entry: string): Promise<Autor[] | null> {
    return await this.repository.findAutor(entry)
  }
}
