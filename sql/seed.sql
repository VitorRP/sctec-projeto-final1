BEGIN;

-- ============================================================
-- Autores
-- ============================================================

INSERT INTO autor (nome, sobrenome, cpf)
VALUES
    ('Machado', 'de Assis', '11111111111'),
    ('Clarice', 'Lispector', '22222222222'),
    ('Carlos', 'Drummond de Andrade', '33333333333'),
    ('Jorge', 'Amado', '44444444444'),
    ('Cecilia', 'Meireles', '55555555555'),
    ('Graciliano', 'Ramos', '66666666666'),
    ('Lima', 'Barreto', '77777777777'),
    ('Rachel', 'de Queiroz', '88888888888'),
    ('Ariano', 'Suassuna', '99999999999'),
    ('Milton', 'Hatoum', '10101010101'),
    ('Paulo', 'Freire', '12121212121')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Editoras
-- ============================================================

INSERT INTO editora (cnpj, razao_social, nome_fantasia)
VALUES
    ('11111111000111', 'Editora Aurora Ltda.', 'Aurora'),
    ('22222222000122', 'Editora Horizonte Ltda.', 'Horizonte'),
    ('33333333000133', 'Acervo Academico Ltda.', 'Acervo'),
    ('44444444000144', 'Editora Saber Ltda.', 'Saber'),
    ('55555555000155', 'Livros do Brasil Ltda.', 'Livros do Brasil'),
    ('66666666000166', 'Conhecimento Universitario Ltda.', 'Universitaria')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Usuarios
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
        '40404040404',
        'Administrador',
        'do Sistema',
        'admin@email.com',
        'admin',
        'password123'
    ),
    (
        '50505050505',
        'Maria',
        'Soares',
        'maria.soares@email.com',
        'maria.soares',
        'password123'
    ),
    (
        '60606060606',
        'Joao',
        'Silva',
        'joao.silva@email.com',
        'joao.silva',
        'password123'
    ),
    (
        '70707070707',
        'Ana',
        'Oliveira',
        'ana.oliveira@email.com',
        'ana.oliveira',
        'password123'
    ),
    (
        '80808080808',
        'Pedro',
        'Santos',
        'pedro.santos@email.com',
        'pedro.santos',
        'password123'
    ),
    (
        '90909090909',
        'Lucia',
        'Ferreira',
        'lucia.ferreira@email.com',
        'lucia.ferreira',
        'password123'
    ),
    (
        '13131313131',
        'Rafael',
        'Costa',
        'rafael.costa@email.com',
        'rafael.costa',
        'password123'
    ),
    (
        '14141414141',
        'Camila',
        'Almeida',
        'camila.almeida@email.com',
        'camila.almeida',
        'password123'
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- Livros
-- ============================================================

INSERT INTO livro (
    titulo,
    ano_publicacao,
    codigo_isbn,
    quantidade_total,
    quantidade_emprestimos
)
VALUES
    ('Dom Casmurro', DATE '1899-01-01', '9780000000001', 5, 0),
    ('A Hora da Estrela', DATE '1977-01-01', '9780000000002', 4, 0),
    ('Alguma Poesia', DATE '1930-01-01', '9780000000003', 3, 0),
    ('Contos Brasileiros', DATE '2020-01-01', '9780000000004', 4, 0),
    ('Capitaes da Areia', DATE '1937-01-01', '9780000000005', 5, 0),
    ('Romanceiro da Inconfidencia', DATE '1953-01-01', '9780000000006', 3, 0),
    ('Vidas Secas', DATE '1938-01-01', '9780000000007', 4, 0),
    ('Triste Fim de Policarpo Quaresma', DATE '1915-01-01', '9780000000008', 3, 0),
    ('O Quinze', DATE '1930-01-01', '9780000000009', 4, 0),
    ('Auto da Compadecida', DATE '1955-01-01', '9780000000010', 3, 0),
    ('Dois Irmaos', DATE '2000-01-01', '9780000000011', 4, 0),
    ('Pedagogia do Oprimido', DATE '1968-01-01', '9780000000012', 5, 0),
    ('Memorias Postumas de Bras Cubas', DATE '1881-01-01', '9780000000013', 4, 0),
    ('Gabriela, Cravo e Canela', DATE '1958-01-01', '9780000000014', 3, 0),
    ('Antologia Poetica Brasileira', DATE '2018-01-01', '9780000000015', 5, 0)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Relacionamentos entre autores e livros
-- ============================================================

INSERT INTO autor_livro (id_autor, id_livro)
SELECT autor.id, livro.id
FROM (
    VALUES
        ('11111111111', '9780000000001'),
        ('22222222222', '9780000000002'),
        ('33333333333', '9780000000003'),
        ('11111111111', '9780000000004'),
        ('22222222222', '9780000000004'),
        ('44444444444', '9780000000004'),
        ('44444444444', '9780000000005'),
        ('55555555555', '9780000000006'),
        ('66666666666', '9780000000007'),
        ('77777777777', '9780000000008'),
        ('88888888888', '9780000000009'),
        ('99999999999', '9780000000010'),
        ('10101010101', '9780000000011'),
        ('12121212121', '9780000000012'),
        ('11111111111', '9780000000013'),
        ('44444444444', '9780000000014'),
        ('33333333333', '9780000000015'),
        ('55555555555', '9780000000015')
) AS relacionamento(cpf, isbn)
JOIN autor
    ON autor.cpf::text = relacionamento.cpf
    AND autor.status = 'ativo'
JOIN livro
    ON livro.codigo_isbn = relacionamento.isbn
ON CONFLICT DO NOTHING;

-- ============================================================
-- Relacionamentos entre livros e editoras
-- ============================================================

INSERT INTO livro_editora (id_livro, id_editora)
SELECT livro.id, editora.id
FROM (
    VALUES
        ('9780000000001', '11111111000111'),
        ('9780000000002', '22222222000122'),
        ('9780000000003', '33333333000133'),
        ('9780000000004', '11111111000111'),
        ('9780000000004', '33333333000133'),
        ('9780000000005', '55555555000155'),
        ('9780000000006', '22222222000122'),
        ('9780000000007', '11111111000111'),
        ('9780000000008', '55555555000155'),
        ('9780000000009', '33333333000133'),
        ('9780000000010', '44444444000144'),
        ('9780000000011', '22222222000122'),
        ('9780000000012', '66666666000166'),
        ('9780000000013', '11111111000111'),
        ('9780000000014', '55555555000155'),
        ('9780000000015', '33333333000133'),
        ('9780000000015', '66666666000166')
) AS relacionamento(isbn, cnpj)
JOIN livro
    ON livro.codigo_isbn = relacionamento.isbn
JOIN editora
    ON editora.cnpj::text = relacionamento.cnpj
    AND editora.status = 'ativo'
ON CONFLICT DO NOTHING;

-- ============================================================
-- Emprestimos ativos e devolvidos em diferentes meses
-- ============================================================

WITH dados_emprestimo (
    login,
    isbn,
    data_emprestimo,
    status,
    data_devolucao
) AS (
    VALUES
        ('admin', '9780000000001', TIMESTAMPTZ '2026-01-10 09:00:00-03', 'devolvido', TIMESTAMPTZ '2026-01-17 15:00:00-03'),
        ('maria.soares', '9780000000002', TIMESTAMPTZ '2026-01-20 14:00:00-03', 'devolvido', TIMESTAMPTZ '2026-01-28 10:30:00-03'),
        ('joao.silva', '9780000000003', TIMESTAMPTZ '2026-02-05 11:00:00-03', 'devolvido', TIMESTAMPTZ '2026-02-14 16:00:00-03'),
        ('ana.oliveira', '9780000000005', TIMESTAMPTZ '2026-02-18 08:30:00-03', 'devolvido', TIMESTAMPTZ '2026-02-27 13:00:00-03'),
        ('pedro.santos', '9780000000006', TIMESTAMPTZ '2026-03-03 10:00:00-03', 'devolvido', TIMESTAMPTZ '2026-03-12 09:00:00-03'),
        ('lucia.ferreira', '9780000000007', TIMESTAMPTZ '2026-03-15 15:30:00-03', 'devolvido', TIMESTAMPTZ '2026-03-25 11:00:00-03'),
        ('rafael.costa', '9780000000008', TIMESTAMPTZ '2026-04-02 09:15:00-03', 'devolvido', TIMESTAMPTZ '2026-04-09 14:20:00-03'),
        ('camila.almeida', '9780000000009', TIMESTAMPTZ '2026-04-16 13:00:00-03', 'devolvido', TIMESTAMPTZ '2026-04-28 17:00:00-03'),
        ('admin', '9780000000010', TIMESTAMPTZ '2026-05-04 08:00:00-03', 'devolvido', TIMESTAMPTZ '2026-05-13 10:00:00-03'),
        ('maria.soares', '9780000000011', TIMESTAMPTZ '2026-05-19 14:45:00-03', 'devolvido', TIMESTAMPTZ '2026-05-30 09:30:00-03'),
        ('joao.silva', '9780000000012', TIMESTAMPTZ '2026-06-06 10:20:00-03', 'devolvido', TIMESTAMPTZ '2026-06-16 16:10:00-03'),
        ('ana.oliveira', '9780000000013', TIMESTAMPTZ '2026-06-21 11:40:00-03', 'devolvido', TIMESTAMPTZ '2026-06-29 12:00:00-03'),
        ('maria.soares', '9780000000001', TIMESTAMPTZ '2026-07-05 10:00:00-03', 'ativo', NULL::TIMESTAMPTZ),
        ('joao.silva', '9780000000002', TIMESTAMPTZ '2026-07-07 14:00:00-03', 'ativo', NULL::TIMESTAMPTZ),
        ('ana.oliveira', '9780000000007', TIMESTAMPTZ '2026-07-09 09:30:00-03', 'ativo', NULL::TIMESTAMPTZ),
        ('pedro.santos', '9780000000010', TIMESTAMPTZ '2026-07-11 16:00:00-03', 'ativo', NULL::TIMESTAMPTZ),
        ('lucia.ferreira', '9780000000012', TIMESTAMPTZ '2026-07-14 11:00:00-03', 'ativo', NULL::TIMESTAMPTZ),
        ('rafael.costa', '9780000000011', TIMESTAMPTZ '2026-07-17 13:30:00-03', 'ativo', NULL::TIMESTAMPTZ)
)
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
    dados_emprestimo.data_emprestimo,
    dados_emprestimo.status::status_emprestimo,
    dados_emprestimo.data_devolucao
FROM dados_emprestimo
JOIN usuario
    ON usuario.login = dados_emprestimo.login
    AND usuario.status = 'ativo'
JOIN livro
    ON livro.codigo_isbn = dados_emprestimo.isbn
WHERE NOT EXISTS (
    SELECT 1
    FROM emprestimo_usuario AS emprestimo_existente
    WHERE emprestimo_existente.id_usuario = usuario.id
      AND emprestimo_existente.id_livro = livro.id
      AND emprestimo_existente.data_emprestimo = dados_emprestimo.data_emprestimo
)
AND (
    dados_emprestimo.status <> 'ativo'
    OR NOT EXISTS (
        SELECT 1
        FROM emprestimo_usuario AS emprestimo_ativo
        WHERE emprestimo_ativo.id_usuario = usuario.id
          AND emprestimo_ativo.id_livro = livro.id
          AND emprestimo_ativo.status = 'ativo'
    )
);

-- Mantem a quantidade de emprestimos igual ao total de emprestimos ativos.

UPDATE livro
SET quantidade_emprestimos = (
    SELECT COUNT(*)::INTEGER
    FROM emprestimo_usuario
    WHERE id_livro = livro.id
      AND status = 'ativo'
);

COMMIT;
