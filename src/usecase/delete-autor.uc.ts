import { AutorRepository } from '../infra/repositories/autor.repository'
import { Autor } from '../model/autor'

export class DeleteAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(id: string): Promise<Autor> {
    const idConvertido = Number(id)

    if (!Number.isInteger(idConvertido) || idConvertido <= 0) {
      throw new Error('ID do autor inválido')
    }

    return this.repository.delete(idConvertido)
  }
}
