import { AutorRepository } from '../infra/repositories/autor.repository'
import { Autor } from '../model/autor'

export class ListAllAutorsUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(): Promise<Autor[] | null> {
    return await this.repository.findAllAutors()
  }
}
