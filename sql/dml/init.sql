-- ============================================================
--  Biblioteca - Schema PostgreSQL
--  Convertido a partir do DBML
-- ============================================================

-- ENUM para status do emprestimo
CREATE TYPE status_emprestimo AS ENUM ('ativo', 'devolvido');


-- ------------------------------------------------------------
-- autor
-- ------------------------------------------------------------
CREATE TABLE autor (
    id          INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR      NOT NULL,
    sobrenome   VARCHAR,
    cpf         CHAR(11)     NOT NULL UNIQUE
);


-- ------------------------------------------------------------
-- editora
-- ------------------------------------------------------------
CREATE TABLE editora (
    id             INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cnpj           CHAR(14) UNIQUE,
    razao_social   VARCHAR  NOT NULL,
    nome_fantasia  VARCHAR
);


-- ------------------------------------------------------------
-- livro
-- Nota: autor_id mantido do DBML original (autor principal).
-- A tabela autor_livro cobre o relacionamento N:N completo.
-- ------------------------------------------------------------
CREATE TABLE livro (
    id             INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo         VARCHAR NOT NULL,
    ano_publicacao DATE,
    codigo_isbn    VARCHAR UNIQUE,
    quantidade_total INTEGER NOT NULL DEFAULT 0,
    quantidade_emprestimos INTEGER NOT NULL DEFAULT 0
);


-- ------------------------------------------------------------
-- livro_editora  (N:N livro <-> editora)
-- ------------------------------------------------------------
CREATE TABLE livro_editora (
    id_livro   INTEGER NOT NULL REFERENCES livro(id)   ON DELETE CASCADE,
    id_editora INTEGER NOT NULL REFERENCES editora(id) ON DELETE CASCADE,
    PRIMARY KEY (id_livro, id_editora)
);

-- ------------------------------------------------------------
-- autor_livro  (N:N autor <-> livro — coautores)
-- ------------------------------------------------------------
CREATE TABLE autor_livro (
    id_autor INTEGER NOT NULL REFERENCES autor(id)  ON DELETE CASCADE,
    id_livro INTEGER NOT NULL REFERENCES livro(id)  ON DELETE CASCADE,
    PRIMARY KEY (id_autor, id_livro)
);


-- ------------------------------------------------------------
-- usuario
-- ------------------------------------------------------------
CREATE TABLE usuario (
    id        INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf       CHAR(11)    UNIQUE,
    nome      VARCHAR     NOT NULL,
    sobrenome VARCHAR,
    email VARCHAR    NOT NULL UNIQUE,
    login     VARCHAR     NOT NULL UNIQUE,
    password  VARCHAR     NOT NULL
);


-- ------------------------------------------------------------
-- emprestimo_usuario
-- ------------------------------------------------------------
CREATE TABLE emprestimo_usuario (
    id               INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario       INTEGER          NOT NULL REFERENCES usuario(id),
    id_livro         INTEGER          NOT NULL REFERENCES livro(id),
    data_emprestimo  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status           status_emprestimo   NOT NULL DEFAULT 'ativo',
    data_devolucao   TIMESTAMP        NULL
);
