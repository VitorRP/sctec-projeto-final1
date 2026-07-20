import { Pool } from 'pg'

import { Editora } from '../../model/editora'

export class EditoraRepository {
  constructor(private readonly pool: Pool) {}

  async listAllEditoras(): Promise<Editora[] | null> {
    const { rows } = await this.pool.query<Editora>(
      `SELECT * FROM editora WHERE status = 'ativo'`
    )

    if (rows.length === 0) {
      return null
    }

    return rows
  }

  async findByCnpj(cnpj: string): Promise<Editora | null> {
    const { rows } = await this.pool.query<Editora>(
      'SELECT * FROM editora WHERE cnpj = $1',
      [cnpj]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async create(editora: Omit<Editora, 'id' | 'status'>): Promise<Editora> {
    const {
      rows: [row]
    } = await this.pool.query<Editora>(
      `INSERT INTO editora (cnpj, razao_social, nome_fantasia)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [editora.cnpj, editora.razao_social, editora.nome_fantasia]
    )

    return row
  }

  async findEditora(entry: string): Promise<Editora[] | null> {
    const { rows } = await this.pool.query<Editora>(
      `SELECT *
        FROM editora
        WHERE status = 'ativo'
        AND (
        id::text = $1
        OR cnpj = $1
        OR CONCAT_WS(' ', razao_social, nome_fantasia) ILIKE $2
        )`,
      [entry, `%${entry}%`]
    )

    if (rows.length === 0) {
      return null
    }

    return rows
  }

  async delete(id: number): Promise<Editora> {
    const { rows } = await this.pool.query<Editora>(
      `UPDATE editora
    SET status = 'desativado'
    WHERE id = $1
    AND status = 'ativo'
    RETURNING *`,
      [id]
    )

    if (rows.length > 0) {
      return rows[0]
    }

    const { rows: existing } = await this.pool.query<Editora>(
      `SELECT *
    FROM editora
    WHERE id = $1`,
      [id]
    )

    if (existing.length === 0) {
      throw new Error('Editora não encontrada')
    }

    throw new Error('Editora já está desativada')
  }

  async findUpdateConflict(id: number, cnpj: string): Promise<Editora | null> {
    const { rows } = await this.pool.query<Editora>(
      `SELECT *
    FROM editora
    WHERE cnpj = $1
    AND id <> $2
    LIMIT 1`,
      [cnpj, id]
    )

    return rows[0] ?? null
  }

  async update(editora: Omit<Editora, 'status'>): Promise<Editora> {
    const { rows } = await this.pool.query<Editora>(
      `UPDATE editora
    SET cnpj = $2,
        razao_social = $3,
        nome_fantasia = $4
    WHERE id = $1
    AND status = 'ativo'
    RETURNING *`,
      [editora.id, editora.cnpj, editora.razao_social, editora.nome_fantasia]
    )

    if (rows.length === 0) {
      throw new Error('Editora não encontrada ou desativada')
    }

    return rows[0]
  }
}
