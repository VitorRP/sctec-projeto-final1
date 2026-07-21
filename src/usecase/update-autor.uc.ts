import { AutorRepository } from '../infra/repositories/autor.repository'
import { Autor } from '../model/autor'
import { UpdateAutorDto } from '../view/dto/update-autor-form.dto'

export class UpdateAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(autor: UpdateAutorDto): Promise<Autor> {
    if (!Number.isInteger(autor.id) || autor.id <= 0) {
      throw new Error('ID do autor inválido')
    }

    const conflict = await this.repository.findUpdateConflict(
      autor.id,
      autor.cpf
    )

    if (conflict) {
      throw new Error('CPF já utilizado por outro autor')
    }

    return this.repository.update(autor)
  }
}
