import { EditoraRepository } from '../infra/repositories/editora.repository'
import { Editora } from '../model/editora'

export class FindEditoraUseCase {
  constructor(private readonly repository: EditoraRepository) {}

  async execute(entry: string): Promise<Editora[] | null> {
    return await this.repository.findEditora(entry)
  }
}
