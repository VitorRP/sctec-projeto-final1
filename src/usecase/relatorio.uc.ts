import { RelatorioRepository } from '../infra/repositories/relatorio.repository'
import {
  ClienteEmprestimoAtivoRelatorio,
  EmprestimosPorLivroRelatorio,
  LivroDisponivelRelatorio,
  LivroEmprestadoRelatorio,
  LivrosPorAutorRelatorio,
  LivrosPorEditoraRelatorio
} from '../model/relatorio'

export class RelatorioUseCase {
  constructor(private readonly repository: RelatorioRepository) {}

  async clientesComEmprestimoAtivo(): Promise<
    ClienteEmprestimoAtivoRelatorio[]
  > {
    return this.repository.clientesComEmprestimoAtivo()
  }

  async livrosDisponiveis(): Promise<LivroDisponivelRelatorio[]> {
    return this.repository.livrosDisponiveis()
  }

  async livrosEmprestados(): Promise<LivroEmprestadoRelatorio[]> {
    return this.repository.livrosEmprestados()
  }

  async livrosPorAutor(): Promise<LivrosPorAutorRelatorio[]> {
    return this.repository.livrosPorAutor()
  }

  async emprestimosPorLivro(): Promise<EmprestimosPorLivroRelatorio[]> {
    return this.repository.emprestimosPorLivro()
  }

  async livrosPorEditora(): Promise<LivrosPorEditoraRelatorio[]> {
    return this.repository.livrosPorEditora()
  }
}
