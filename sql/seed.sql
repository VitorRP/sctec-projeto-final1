BEGIN;

-- ============================================================
-- AUTORES
-- CPFs ficticios para ambiente de desenvolvimento
-- ============================================================
INSERT INTO autor (nome, sobrenome, cpf)
VALUES
    ('Machado', 'de Assis', '11111111111'),
    ('Clarice', 'Lispector', '22222222222'),
    ('Carlos', 'Drummond de Andrade', '33333333333')
ON CONFLICT DO NOTHING;

-- ============================================================
-- EDITORAS
-- CNPJs ficticios para ambiente de desenvolvimento
-- ============================================================
INSERT INTO editora (cnpj, razao_social, nome_fantasia)
VALUES
    ('11111111000111', 'Editora Aurora Ltda.', 'Aurora'),
    ('22222222000122', 'Editora Horizonte Ltda.', 'Horizonte'),
    ('33333333000133', 'Acervo Academico Ltda.', 'Acervo')
ON CONFLICT DO NOTHING;

-- ============================================================
-- LIVROS
-- ISBNs demonstrativos
-- ============================================================
INSERT INTO livro (
    titulo,
    ano_publicacao,
    codigo_isbn,
    quantidade_total,
    quantidade_emprestimos
)
VALUES
    (
        'Dom Casmurro',
        DATE '1899-01-01',
        '9780000000001',
        5,
        1
    ),
    (
        'A Hora da Estrela',
        DATE '1977-01-01',
        '9780000000002',
        4,
        0
    ),
    (
        'Alguma Poesia',
        DATE '1930-01-01',
        '9780000000003',
        3,
        0
    ),
    (
        'Contos Brasileiros',
        DATE '2020-01-01',
        '9780000000004',
        2,
        0
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- RELACIONAMENTO AUTOR <-> LIVRO
-- ============================================================
INSERT INTO autor_livro (id_autor, id_livro)
SELECT autor.id, livro.id
FROM (
    VALUES
        ('11111111111', '9780000000001'),
        ('22222222222', '9780000000002'),
        ('33333333333', '9780000000003'),
        ('11111111111', '9780000000004'),
        ('22222222222', '9780000000004')
) AS relacionamento(cpf, isbn)
JOIN autor
    ON autor.cpf::text = relacionamento.cpf
JOIN livro
    ON livro.codigo_isbn = relacionamento.isbn
ON CONFLICT DO NOTHING;

-- ============================================================
-- RELACIONAMENTO LIVRO <-> EDITORA
-- ============================================================
INSERT INTO livro_editora (id_livro, id_editora)
SELECT livro.id, editora.id
FROM (
    VALUES
        ('9780000000001', '11111111000111'),
        ('9780000000002', '22222222000122'),
        ('9780000000003', '33333333000133'),
        ('9780000000004', '11111111000111'),
        ('9780000000004', '33333333000133')
) AS relacionamento(isbn, cnpj)
JOIN livro
    ON livro.codigo_isbn = relacionamento.isbn
JOIN editora
    ON editora.cnpj::text = relacionamento.cnpj
ON CONFLICT DO NOTHING;

-- ============================================================
-- USUARIOS
-- Senhas destinadas apenas ao ambiente de desenvolvimento
-- ============================================================
INSERT INTO usuario (
    cpf,
    nome,
    sobrenome,
    email,
    login,
    password
)
VALUES
    (
        '44444444444',
        'Administrador',
        'do Sistema',
        'admin@example.com',
        'admin',
        'password123'
    ),
    (
        '55555555555',
        'Maria',
        'Bibliotecaria',
        'maria@example.com',
        'maria',
        'password123'
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- EMPRESTIMO ATIVO
-- ============================================================
INSERT INTO emprestimo_usuario (
    id_usuario,
    id_livro,
    data_emprestimo,
    status,
    data_devolucao
)
SELECT
    usuario.id,
    livro.id,
    TIMESTAMP '2026-07-15 10:00:00',
    'ativo'::status_emprestimo,
    NULL
FROM usuario
JOIN livro
    ON livro.codigo_isbn = '9780000000001'
WHERE usuario.login = 'maria'
  AND NOT EXISTS (
      SELECT 1
      FROM emprestimo_usuario
      WHERE id_usuario = usuario.id
        AND id_livro = livro.id
        AND data_emprestimo = TIMESTAMP '2026-07-15 10:00:00'
  );

-- ============================================================
-- EMPRESTIMO DEVOLVIDO
-- ============================================================
INSERT INTO emprestimo_usuario (
    id_usuario,
    id_livro,
    data_emprestimo,
    status,
    data_devolucao
)
SELECT
    usuario.id,
    livro.id,
    TIMESTAMP '2026-07-01 09:00:00',
    'devolvido'::status_emprestimo,
    TIMESTAMP '2026-07-10 14:30:00'
FROM usuario
JOIN livro
    ON livro.codigo_isbn = '9780000000002'
WHERE usuario.login = 'admin'
  AND NOT EXISTS (
      SELECT 1
      FROM emprestimo_usuario
      WHERE id_usuario = usuario.id
        AND id_livro = livro.id
        AND data_emprestimo = TIMESTAMP '2026-07-01 09:00:00'
  );

COMMIT;