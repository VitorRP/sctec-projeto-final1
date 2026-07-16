import { AutorRepository } from '../infra/repositories/autor.repository'
import { Autor } from '../model/autor'
import { CreateAutorDto } from '../view/dto/create-autor-form.dto'

export class CreateAutorUseCase {
  constructor(private readonly repository: AutorRepository) {}

  async execute(autor: CreateAutorDto): Promise<Autor> {
    const existingAutor = await this.repository.findAutorByCpf(autor.cpf)

    if (existingAutor) {
      throw new Error('Autor já cadastrado')
    }

    return await this.repository.create(autor)
  }
}
