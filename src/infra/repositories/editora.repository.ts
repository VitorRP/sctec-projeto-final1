import { Pool } from 'pg'

import { Editora } from '../../model/editora'

export class EditoraRepository {
  constructor(private readonly pool: Pool) {}

  async listAllEditoras(): Promise<Editora[] | null> {
    const { rows } = await this.pool.query<Editora>(`SELECT * FROM editora`)

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

  async create(editora: Omit<Editora, 'id'>): Promise<Editora> {
    const {
      rows: [row]
    } = await this.pool.query<Editora>(
      `INSERT INTO editora (cnpj, razao_social, nome_fantasia)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [editora.cnpj, editora.nome_fantasia, editora.razao_social]
    )

    return row
  }

  async findEditora(entry: string): Promise<Editora[] | null> {
    const { rows } = await this.pool.query<Editora>(
      `SELECT *
        FROM editora
        WHERE id::text = $1
        OR cnpj = $1
        OR CONCAT_WS(' ', razao_social, nome_fantasia) ILIKE $1`,
      [`%${entry}%`]
    )

    if (rows.length === 0) {
      return null
    }

    return rows
  }
}
