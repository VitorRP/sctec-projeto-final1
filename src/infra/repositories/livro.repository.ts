import { Pool } from 'pg'

import { Livro } from '../../model/livro'

export class LivroRepository {
  constructor(private readonly pool: Pool) {}

  async findAllLivros(): Promise<Livro[] | null> {
    const { rows } = await this.pool.query<Livro>(
      'SELECT * FROM livro ORDER BY titulo ASC'
    )

    if (rows.length === 0) {
      return null
    }

    return rows
  }

  async findLivroByIsbn(isbn: string): Promise<Livro | null> {
    const { rows } = await this.pool.query<Livro>(
      'SELECT * FROM livro WHERE codigo_isbn = $1',
      [isbn]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async findLivro(entry: string): Promise<Livro[] | null> {
    const { rows } = await this.pool.query<Livro>(
      `SELECT * FROM livro
        WHERE titulo ILIKE $1
        OR ano_publicacao::text ILIKE $1
        OR codigo_isbn ILIKE $1
        OR id::text ILIKE $1`,
      [`%${entry}%`]
    )

    return rows
  }

  async create(
    livro: Omit<Livro, 'id' | 'quantidade_emprestimos' | 'quantidade_total'>,
    idAutor: number,
    idEditora: number
  ): Promise<Livro> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const autorResult = await client.query(
        `SELECT id
      FROM autor
      WHERE id = $1
      AND status = 'ativo'
      FOR UPDATE`,
        [idAutor]
      )

      if (autorResult.rows.length === 0) {
        throw new Error('Autor não encontrado ou desativado')
      }

      const editoraResult = await client.query(
        `SELECT id
      FROM editora
      WHERE id = $1
      AND status = 'ativo'
      FOR UPDATE`,
        [idEditora]
      )

      if (editoraResult.rows.length === 0) {
        throw new Error('Editora não encontrada ou desativada')
      }

      const {
        rows: [livroCriado]
      } = await client.query<Livro>(
        `INSERT INTO livro (
        titulo,
        ano_publicacao,
        codigo_isbn
      )
      VALUES ($1, $2, $3)
      RETURNING *`,
        [livro.titulo, livro.ano_publicacao, livro.codigo_isbn]
      )

      await client.query(
        `INSERT INTO autor_livro (
        id_autor,
        id_livro
      )
      VALUES ($1, $2)`,
        [idAutor, livroCriado.id]
      )

      await client.query(
        `INSERT INTO livro_editora (
        id_livro,
        id_editora
      )
      VALUES ($1, $2)`,
        [livroCriado.id, idEditora]
      )

      await client.query('COMMIT')

      return livroCriado
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async findLivroById(id: number): Promise<Livro | null> {
    const { rows } = await this.pool.query<Livro>(
      `SELECT *
    FROM livro
    WHERE id = $1`,
      [id]
    )

    return rows[0] ?? null
  }

  async addExemplares(id: number, quantidade: number): Promise<Livro> {
    const { rows } = await this.pool.query<Livro>(
      `UPDATE livro
    SET quantidade_total = quantidade_total + $2
    WHERE id = $1
    RETURNING *`,
      [id, quantidade]
    )

    if (rows.length === 0) {
      throw new Error('Livro não encontrado')
    }

    return rows[0]
  }

  async removeExemplares(id: number, quantidade: number): Promise<Livro> {
    const { rows } = await this.pool.query<Livro>(
      `UPDATE livro
    SET quantidade_total = quantidade_total - $2
    WHERE id = $1
    AND quantidade_total - $2 >= quantidade_emprestimos
    RETURNING *`,
      [id, quantidade]
    )

    if (rows.length === 0) {
      throw new Error('Não foi possível remover os exemplares')
    }

    return rows[0]
  }
}
