import { Pool } from 'pg'

import { Usuario } from '../../model/user'

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  //TODO: Implementar verificaÃ§Ã£o de login e senha para autenticaÃ§Ã£o de usuÃ¡rio

  async findByLogin(login: string, password: string): Promise<Usuario | null> {
    const { rows } = await this.pool.query<Usuario>(
      `SELECT * FROM usuario 
      WHERE login = $1 
      AND password = $2`,
      [login, password]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async create(user: Omit<Usuario, 'id'>): Promise<Usuario> {
    const {
      rows: [row]
    } = await this.pool.query<Usuario>(
      `INSERT INTO usuario (nome, sobrenome, email, login, password, cpf) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [
        user.nome,
        user.sobrenome,
        user.email,
        user.login,
        user.password,
        user.cpf
      ]
    )

    return row
  }
}
