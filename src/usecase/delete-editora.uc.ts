import { EditoraRepository } from '../infra/repositories/editora.repository'
import { Editora } from '../model/editora'

export class DeleteEditoraUseCase {
  constructor(private readonly repository: EditoraRepository) {}

  async execute(id: number): Promise<Editora> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID da editora inválido')
    }

    return this.repository.delete(id)
  }
}
