import { EditoraRepository } from '../infra/repositories/editora.repository'
import { Editora } from '../model/editora'

export class DeleteEditoraUseCase {
  constructor(private readonly repository: EditoraRepository) {}

  async execute(id: string): Promise<Editora> {
    const idConvertido = Number(id)

    if (!Number.isInteger(idConvertido) || idConvertido <= 0) {
      throw new Error('ID da editora inválido')
    }

    return this.repository.delete(idConvertido)
  }
}
