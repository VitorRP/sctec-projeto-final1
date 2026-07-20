import { Pool } from 'pg'

import { Autor } from '../../model/autor'

export class AutorRepository {
  constructor(private readonly pool: Pool) {}

  async findAllAutors(): Promise<Autor[] | null> {
    const { rows } = await this.pool.query<Autor>(
      `SELECT * FROM autor WHERE status = 'ativo'`
    )

    if (rows.length === 0) {
      return null
    }

    return rows
  }

  async findAutorByCpf(cpf: string): Promise<Autor | null> {
    const { rows } = await this.pool.query<Autor>(
      'SELECT * FROM autor WHERE cpf = $1',
      [cpf]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async findAutor(entry: string): Promise<Autor[] | null> {
    const { rows } = await this.pool.query<Autor>(
      `SELECT *
      FROM autor
      WHERE status = 'ativo'
      AND (
      id::text = $1
      OR cpf = $1
      OR CONCAT_WS(' ', nome, sobrenome) ILIKE $2)`,
      [entry, `%${entry}%`]
    )
    return rows
  }

  async create(autor: Omit<Autor, 'id' | 'status'>): Promise<Autor> {
    const {
      rows: [row]
    } = await this.pool.query<Autor>(
      `INSERT INTO autor (nome, sobrenome, cpf) 
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [autor.nome, autor.sobrenome, autor.cpf]
    )

    return row
  }

  async delete(id: number): Promise<Autor> {
    const { rows } = await this.pool.query<Autor>(
      `UPDATE autor
    SET status = 'desativado'
    WHERE id = $1
    AND status = 'ativo'
    RETURNING *`,
      [id]
    )

    if (rows.length > 0) {
      return rows[0]
    }

    const { rows: existing } = await this.pool.query<Autor>(
      `SELECT *
    FROM autor
    WHERE id = $1`,
      [id]
    )

    if (existing.length === 0) {
      throw new Error('Autor não encontrado')
    }

    throw new Error('Autor já está desativado')
  }

  async findUpdateConflict(id: number, cpf: string): Promise<Autor | null> {
    const { rows } = await this.pool.query<Autor>(
      `SELECT *
    FROM autor
    WHERE cpf = $1
    AND id <> $2
    LIMIT 1`,
      [cpf, id]
    )

    return rows[0] ?? null
  }

  async update(autor: Omit<Autor, 'status'>): Promise<Autor> {
    const { rows } = await this.pool.query<Autor>(
      `UPDATE autor
    SET nome = $2,
        sobrenome = $3,
        cpf = $4
    WHERE id = $1
    AND status = 'ativo'
    RETURNING *`,
      [autor.id, autor.nome, autor.sobrenome, autor.cpf]
    )

    if (rows.length === 0) {
      throw new Error('Autor não encontrado ou desativado')
    }

    return rows[0]
  }
}
