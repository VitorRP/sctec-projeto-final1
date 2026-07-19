import { Pool } from 'pg'

import { Emprestimo } from '../../model/emprestimo'
import { Livro } from '../../model/livro'
import { Usuario } from '../../model/user'

export class EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

  async listAllEmprestimos(): Promise<Emprestimo[] | null> {
    const { rows } = await this.pool.query<Emprestimo>(
      `SELECT * FROM emprestimo_usuario 
            ORDER BY data_emprestimo DESC`
    )

    return rows
  }

  async create(id_usuario: number, id_livro: number): Promise<Emprestimo> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const userResult = await client.query<Usuario>(
        'SELECT id FROM usuario WHERE id = $1',
        [id_usuario]
      )

      if (userResult.rows.length === 0) {
        throw new Error('Usuário não encontrado')
      }

      const livroResult = await client.query<Livro>(
        `SELECT id, quantidade_total, quantidade_emprestimos
                FROM livro
                WHERE id = $1
                FOR UPDATE`,
        [id_livro]
      )
      if (livroResult.rows.length === 0) {
        throw new Error('Livro não encontrado')
      }

      const livro = livroResult.rows[0]

      if (livro.quantidade_emprestimos >= livro.quantidade_total) {
        throw new Error('Livro indisponível')
      }

      const { rows: emprestimosAtivos } = await client.query(
        `SELECT id FROM emprestimo_usuario
                WHERE id_usuario = $1
                AND id_livro = $2
                AND status = 'ativo'`,
        [id_usuario, id_livro]
      )

      if (emprestimosAtivos.length > 0) {
        throw new Error('Usuário já possui empréstimo ativo deste livro')
      }

      const {
        rows: [emprestimo]
      } = await client.query<Emprestimo>(
        `INSERT INTO emprestimo_usuario (id_usuario, id_livro)
                VALUES ($1, $2)
                RETURNING *`,
        [id_usuario, id_livro]
      )

      await client.query(
        `UPDATE livro
        SET quantidade_emprestimos = quantidade_emprestimos + 1
                WHERE id = $1`,
        [id_livro]
      )

      await client.query('COMMIT')

      return emprestimo
    } catch (error) {
      await client.query('ROLLBACK')

      throw error
    } finally {
      client.release()
    }
  }

  async devolver(id: number): Promise<Emprestimo> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const { rows } = await client.query<Emprestimo>(
        `SELECT *
            FROM emprestimo_usuario
            WHERE id = $1
            FOR UPDATE`,
        [id]
      )

      if (rows.length === 0) {
        throw new Error('Empréstimo não encontrado')
      }

      const emprestimo = rows[0]

      if (emprestimo.status === 'devolvido') {
        throw new Error('Empréstimo já devolvido')
      }

      const {
        rows: [devolvido]
      } = await client.query<Emprestimo>(
        `UPDATE emprestimo_usuario
            SET status = 'devolvido',
            data_devolucao = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`,
        [id]
      )

      const livroAtualizado = await client.query(
        `UPDATE livro
            SET quantidade_emprestimos = quantidade_emprestimos - 1
            WHERE id = $1
            AND quantidade_emprestimos > 0
            RETURNING id`,
        [emprestimo.id_livro]
      )

      if (livroAtualizado.rows.length === 0) {
        throw new Error('Quantidade de empréstimos inconsistente')
      }

      await client.query('COMMIT')
      return devolvido
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
