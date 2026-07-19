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
        OR ano_publicacao ILIKE $1
        OR codigo_isbn ILIKE $1
        OR id::text ILIKE $1`,
      [`%${entry}%`]
    )

    return rows
  }

  async create(
    livro: Omit<Livro, 'id' | 'quantidade_emprestimos' | 'quantidade_total'>
  ): Promise<Livro> {
    const {
      rows: [row]
    } = await this.pool.query<Livro>(
      `INSERT INTO livro (titulo, ano_publicacao, codigo_isbn)
        values ($1, $2, $3)
        RETURNING *`,
      [livro.titulo, livro.ano_publicacao, livro.codigo_isbn]
    )

    return row
  }
}
