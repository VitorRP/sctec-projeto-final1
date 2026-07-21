import { Pool } from 'pg'

import {
  ClienteEmprestimoAtivoRelatorio,
  EmprestimosPorLivroRelatorio,
  LivroDisponivelRelatorio,
  LivroEmprestadoRelatorio,
  LivrosPorAutorRelatorio,
  LivrosPorEditoraRelatorio
} from '../../model/relatorio'

export class RelatorioRepository {
  constructor(private readonly pool: Pool) {}

  async livrosDisponiveis(): Promise<LivroDisponivelRelatorio[]> {
    const { rows } = await this.pool.query<LivroDisponivelRelatorio>(
      `SELECT
      id,
      titulo,
      codigo_isbn,
      quantidade_total - quantidade_emprestimos AS quantidade_disponivel
      FROM livro
      WHERE quantidade_total > quantidade_emprestimos
      ORDER BY quantidade_disponivel DESC, titulo
      LIMIT 20`
    )

    return rows
  }

  async livrosEmprestados(): Promise<LivroEmprestadoRelatorio[]> {
    const { rows } = await this.pool.query<LivroEmprestadoRelatorio>(
      `SELECT
      emprestimo.id AS emprestimo_id,
      livro.titulo,
      usuario.nome AS cliente,
      emprestimo.data_emprestimo
      FROM emprestimo_usuario AS emprestimo
      INNER JOIN livro
      ON livro.id = emprestimo.id_livro
      INNER JOIN usuario
      ON usuario.id = emprestimo.id_usuario
      WHERE emprestimo.status = 'ativo'
      ORDER BY emprestimo.data_emprestimo DESC
      LIMIT 20`
    )

    return rows
  }

  async livrosPorAutor(): Promise<LivrosPorAutorRelatorio[]> {
    const { rows } = await this.pool.query<LivrosPorAutorRelatorio>(
      `SELECT
      autor.id AS autor_id,
      autor.nome AS autor,
      CAST(COUNT(livro.id) AS INTEGER) AS quantidade_livros,
      STRING_AGG(livro.titulo, ', ') AS livros
      FROM autor
      INNER JOIN autor_livro
      ON autor_livro.id_autor = autor.id
      INNER JOIN livro
      ON livro.id = autor_livro.id_livro
      GROUP BY autor.id, autor.nome
      ORDER BY quantidade_livros DESC, autor.nome
      LIMIT 20`
    )

    return rows
  }

  async emprestimosPorLivro(): Promise<EmprestimosPorLivroRelatorio[]> {
    const { rows } = await this.pool.query<EmprestimosPorLivroRelatorio>(
      `SELECT
      livro.id AS livro_id,
      livro.titulo,
      CAST(COUNT(emprestimo.id) AS INTEGER) AS quantidade_emprestimos
      FROM livro
      LEFT JOIN emprestimo_usuario AS emprestimo
      ON emprestimo.id_livro = livro.id
      GROUP BY livro.id, livro.titulo
      ORDER BY quantidade_emprestimos DESC, livro.titulo
      LIMIT 20`
    )

    return rows
  }

  async clientesComEmprestimoAtivo(): Promise<
    ClienteEmprestimoAtivoRelatorio[]
  > {
    const { rows } = await this.pool.query<ClienteEmprestimoAtivoRelatorio>(
      `SELECT
      usuario.id AS usuario_id,
      usuario.nome AS cliente,
      CAST(COUNT(emprestimo.id) AS INTEGER) AS quantidade_ativos,
      STRING_AGG(livro.titulo, ', ') AS livros
      FROM usuario
      INNER JOIN emprestimo_usuario AS emprestimo
      ON emprestimo.id_usuario = usuario.id
      INNER JOIN livro
      ON livro.id = emprestimo.id_livro
      WHERE emprestimo.status = 'ativo'
      GROUP BY usuario.id, usuario.nome
      ORDER BY quantidade_ativos DESC, usuario.nome
      LIMIT 20`
    )

    return rows
  }

  async livrosPorEditora(): Promise<LivrosPorEditoraRelatorio[]> {
    const { rows } = await this.pool.query<LivrosPorEditoraRelatorio>(
      `SELECT
      editora.id AS editora_id,
      editora.razao_social AS editora,
      CAST(COUNT(livro.id) AS INTEGER) AS quantidade_livros,
      STRING_AGG(livro.titulo, ', ') AS livros
      FROM editora
      INNER JOIN livro_editora
      ON livro_editora.id_editora = editora.id
      INNER JOIN livro
      ON livro.id = livro_editora.id_livro
      GROUP BY editora.id, editora.razao_social
      ORDER BY quantidade_livros DESC, editora.razao_social
      LIMIT 20`
    )

    return rows
  }
}
