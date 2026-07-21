import { AutorRepository } from '../infra/repositories/autor.repository'
import { Autor } from '../model/autor'
import { UpdateAutorDto } from '../view/dto/update-autor-form.dto'

export class UpdateAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(autor: UpdateAutorDto): Promise<Autor> {
    const id = Number(autor.id)

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID do autor inválido')
    }

    const conflict = await this.repository.findUpdateConflict(id, autor.cpf)

    if (conflict) {
      throw new Error('CPF já utilizado por outro autor')
    }

    return this.repository.update(id, autor.nome, autor.sobrenome, autor.cpf)
  }
}
