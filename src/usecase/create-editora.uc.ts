import { EditoraRepository } from '../infra/repositories/editora.repository'
import { Editora } from '../model/editora'
import { CreateEditoraDto } from '../view/dto/create-editora-form.dto'

export class CreateEditoraUseCase {
  constructor(private readonly repository: EditoraRepository) {}

  async execute(editora: CreateEditoraDto): Promise<Editora> {
    const existingEditora = await this.repository.findByCnpj(editora.cnpj)

    if (existingEditora?.status === 'desativado') {
      throw new Error('Já existe uma editora desativada com este CNPJ')
    }

    if (existingEditora) {
      throw new Error('Editora já cadastrada!')
    }

    return await this.repository.create(editora)
  }
}
