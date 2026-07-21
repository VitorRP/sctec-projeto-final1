export interface LivroDisponivelRelatorio {
  id: number

  titulo: string

  codigo_isbn: string

  quantidade_disponivel: number
}

export interface LivroEmprestadoRelatorio {
  emprestimo_id: number

  titulo: string

  cliente: string

  data_emprestimo: Date
}

export interface LivrosPorAutorRelatorio {
  autor_id: number

  autor: string

  quantidade_livros: number

  livros: string
}

export interface EmprestimosPorLivroRelatorio {
  livro_id: number

  titulo: string

  quantidade_emprestimos: number
}

export interface ClienteEmprestimoAtivoRelatorio {
  usuario_id: number

  cliente: string

  quantidade_ativos: number

  livros: string
}

export interface LivrosPorEditoraRelatorio {
  editora_id: number

  editora: string

  quantidade_livros: number

  livros: string
}
