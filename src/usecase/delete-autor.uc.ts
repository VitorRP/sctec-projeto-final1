import { AutorRepository } from '../infra/repositories/autor.repository'
import { Autor } from '../model/autor'

export class DeleteAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(id: number): Promise<Autor> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID do autor inválido')
    }

    return this.repository.delete(id)
  }
}
