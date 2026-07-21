import { EditoraRepository } from '../infra/repositories/editora.repository'
import { Editora } from '../model/editora'
import { UpdateEditoraDto } from '../view/dto/update-editora-form.dto'

export class UpdateEditoraUseCase {
  constructor(private readonly repository: EditoraRepository) {}

  async execute(editora: UpdateEditoraDto): Promise<Editora> {
    if (!Number.isInteger(editora.id) || editora.id <= 0) {
      throw new Error('ID da editora inválido')
    }

    const conflict = await this.repository.findUpdateConflict(
      editora.id,
      editora.cnpj
    )

    if (conflict) {
      throw new Error('CNPJ já utilizado por outra editora')
    }

    return this.repository.update(editora)
  }
}
