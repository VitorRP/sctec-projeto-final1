import { EditoraRepository } from '../infra/repositories/editora.repository'
import { Editora } from '../model/editora'

export class ListAllEditorasUseCase {
  constructor(private readonly repository: EditoraRepository) {}

  async execute(): Promise<Editora[] | null> {
    return await this.repository.listAllEditoras()
  }
}
