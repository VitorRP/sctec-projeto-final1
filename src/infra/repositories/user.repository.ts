import { Pool } from 'pg'

import { Usuario } from '../../model/user'

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  async findByLogin(login: string, password: string): Promise<Usuario | null> {
    const { rows } = await this.pool.query<Usuario>(
      `SELECT * FROM usuario 
      WHERE login = $1 
      AND password = $2
      AND status = 'ativo'`,
      [login, password]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async findByUser(cpf: string): Promise<Usuario | null> {
    const { rows } = await this.pool.query<Usuario>(
      `SELECT * FROM usuario 
      WHERE cpf = $1 
      `,
      [cpf]
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0]
  }

  async create(user: Omit<Usuario, 'id' | 'status'>): Promise<Usuario> {
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

  async delete(id: number): Promise<Usuario> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const { rows: users } = await client.query<Usuario>(
        `SELECT *
      FROM usuario
      WHERE id = $1
      FOR UPDATE`,
        [id]
      )

      if (users.length === 0) {
        throw new Error('Usuário não encontrado')
      }

      if (users[0].status === 'desativado') {
        throw new Error('Usuário já está desativado')
      }

      const { rows: emprestimos } = await client.query(
        `SELECT id
      FROM emprestimo_usuario
      WHERE id_usuario = $1
      AND status = 'ativo'
      LIMIT 1`,
        [id]
      )

      if (emprestimos.length > 0) {
        throw new Error(
          'O usuário possui empréstimos ativos e não pode ser desativado'
        )
      }

      const {
        rows: [user]
      } = await client.query<Usuario>(
        `UPDATE usuario
      SET status = 'desativado'
      WHERE id = $1
      RETURNING *`,
        [id]
      )

      await client.query('COMMIT')
      return user
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async listAllUsers(): Promise<Usuario[] | null> {
    const { rows } = await this.pool.query<Usuario>(
      `SELECT * FROM usuario WHERE status = 'ativo' ORDER BY nome`
    )

    if (rows.length === 0) {
      return null
    }

    return rows
  }

  async findUser(entry: string): Promise<Usuario[] | null> {
    const { rows } = await this.pool.query<Usuario>(
      `SELECT *
      FROM usuario 
      WHERE status = 'ativo'
      AND (
      id::text = $1 
      OR cpf = $1 
      OR CONCAT_WS (' ', nome, sobrenome) ILIKE $2
      )`,
      [entry, `%${entry}%`]
    )

    if (rows.length === 0) {
      return null
    }

    return rows
  }

  async findUpdateConflict(
    id: number,
    cpf: string,
    email: string,
    login: string
  ): Promise<Usuario | null> {
    const { rows } = await this.pool.query<Usuario>(
      `SELECT *
      FROM usuario
      WHERE id <> $1
      AND (
      cpf = $2
      OR email = $3
      OR login = $4
      )
      LIMIT 1`,
      [id, cpf, email, login]
    )

    return rows[0] ?? null
  }

  async update(user: Omit<Usuario, 'status'>): Promise<Usuario> {
    const { rows } = await this.pool.query<Usuario>(
      `UPDATE usuario
      SET nome = $2,
        sobrenome = $3,
        cpf = $4,
        email = $5,
        login = $6,
        password = $7
      WHERE id = $1
      AND status = 'ativo'
      RETURNING *`,
      [
        user.id,
        user.nome,
        user.sobrenome,
        user.cpf,
        user.email,
        user.login,
        user.password
      ]
    )

    if (rows.length === 0) {
      throw new Error('Usuário não encontrado ou desativado')
    }

    return rows[0]
  }
}
