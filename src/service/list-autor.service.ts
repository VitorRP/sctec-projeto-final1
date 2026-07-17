import { AutorRepository } from '../infra/repositories/autor.repository'
import { Autor } from '../model/autor'

export class ListAllAutorsUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(): Promise<Autor[] | null> {
    return await this.repository.findAllAutors()
  }
}

export class ListAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(entry: string): Promise<Autor[] | null> {
    return await this.repository.findAutor(entry)
  }
}
