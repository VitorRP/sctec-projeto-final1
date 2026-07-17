import { Pool } from 'pg'

import { Autor } from '../../model/autor'

export class AutorRepository {
  constructor(private readonly pool: Pool) {}

  async findAllAutors(): Promise<Autor[] | null> {
    const { rows } = await this.pool.query<Autor>('SELECT * FROM autor')

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
      `SELECT * FROM autor 
      WHERE CONCAT_WS(' ', nome, sobrenome) ILIKE $1 
      OR cpf ILIKE $1 
      OR id::text ILIKE $1`,
      [`%${entry}%`]
    )
    return rows
  }

  async create(autor: Omit<Autor, 'id'>): Promise<Autor> {
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
}
