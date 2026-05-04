-- ============================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - GESTÃO ESCOLAR
-- Execute este arquivo no MySQL antes de iniciar o backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS gestao_escolar;
USE gestao_escolar;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil ENUM('admin', 'professor', 'secretaria') DEFAULT 'secretaria',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS professores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  formacao VARCHAR(100),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  serie VARCHAR(50) NOT NULL,
  turno ENUM('manha', 'tarde', 'noturno') NOT NULL,
  ano_letivo INT NOT NULL,
  professor_id INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  data_nascimento DATE NOT NULL,
  email VARCHAR(100),
  responsavel VARCHAR(100),
  turma_id INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  carga_horaria INT,
  turma_id INT,
  professor_id INT,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  disciplina_id INT NOT NULL,
  bimestre INT NOT NULL CHECK (bimestre BETWEEN 1 AND 4),
  tipo ENUM('prova', 'trabalho', 'atividade') NOT NULL,
  valor DECIMAL(4,2) NOT NULL CHECK (valor BETWEEN 0 AND 10),
  data_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE
);

-- ============================================================
-- DADOS INICIAIS PARA TESTE
-- ============================================================

-- Senha para todos os usuários abaixo: 123456
INSERT INTO usuarios (nome, email, senha, perfil) VALUES
('Administrador', 'admin@escola.com', '1234', 'admin'),
('Secretaria', 'secretaria@escola.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'secretaria');

INSERT INTO professores (nome, cpf, email, formacao) VALUES
('Carlos Souza', '111.222.333-44', 'carlos@escola.com', 'Licenciatura em Matemática'),
('Ana Lima', '222.333.444-55', 'ana@escola.com', 'Licenciatura em Português');

INSERT INTO turmas (nome, serie, turno, ano_letivo, professor_id) VALUES
('3º Ano A', '3º Ano', 'manha', 2025, 1),
('2º Ano B', '2º Ano', 'tarde', 2025, 2);

INSERT INTO alunos (nome, cpf, data_nascimento, email, responsavel, turma_id) VALUES
('João Silva', '333.444.555-66', '2008-05-10', 'joao@email.com', 'Maria Silva', 1),
('Beatriz Costa', '444.555.666-77', '2009-03-22', 'beatriz@email.com', 'José Costa', 1),
('Lucas Mendes', '555.666.777-88', '2010-07-15', 'lucas@email.com', 'Paula Mendes', 2);

INSERT INTO disciplinas (nome, carga_horaria, turma_id, professor_id) VALUES
('Matemática', 80, 1, 1),
('Português', 80, 1, 2),
('Matemática', 80, 2, 1);
