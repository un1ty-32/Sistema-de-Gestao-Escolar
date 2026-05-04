# 🎓 Sistema de Gestão Escolar

Projeto full-stack: React (frontend) + Node.js/Express (backend) + MySQL (banco de dados).

---

## 📋 Pré-requisitos

Instale antes de começar:
- [Node.js LTS](https://nodejs.org)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com)

---

## 🚀 Passo a passo para rodar

### 1. Configurar o Banco de Dados

Abra o MySQL e execute o arquivo de criação:

```bash
mysql -u root -p < backend/banco.sql
```

Ou abra o MySQL Workbench, copie o conteúdo de `backend/banco.sql` e execute.

---

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Edite o arquivo `.env` com sua senha do MySQL:
```
DB_PASSWORD=sua_senha_aqui
```

Inicie o servidor:
```bash
npm run dev
```

O backend estará em: http://localhost:3001

---

### 3. Configurar o Frontend

Abra outro terminal:

```bash
cd frontend
npm install
npm start
```

O frontend abrirá automaticamente em: http://localhost:3000

---

## 🔐 Usuário padrão para login

| E-mail                    | Senha  | Perfil      |
|---------------------------|--------|-------------|
| admin@escola.com          | 123456 | admin       |
| secretaria@escola.com     | 123456 | secretaria  |

---

## 📁 Estrutura do projeto

```
gestao-escolar/
├── backend/
│   ├── src/
│   │   ├── controllers/   ← Lógica de cada recurso
│   │   ├── routes/        ← Definição das rotas da API
│   │   ├── middleware/    ← Autenticação JWT
│   │   ├── database.js    ← Conexão com MySQL
│   │   └── index.js       ← Entrada do servidor
│   ├── banco.sql          ← Script de criação do banco
│   ├── .env               ← Variáveis de ambiente
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/         ← Telas: Login, Dashboard, Turmas, Alunos...
        ├── components/    ← Layout com sidebar
        ├── services/      ← Configuração do Axios
        ├── App.js         ← Rotas do React
        └── index.js       ← Entrada do React
```

---

## 🔗 Endpoints da API

| Método | Rota                              | Descrição                  |
|--------|-----------------------------------|----------------------------|
| POST   | /auth/login                       | Login do usuário           |
| POST   | /auth/registrar                   | Cadastrar novo usuário     |
| GET    | /turmas                           | Listar turmas              |
| POST   | /turmas                           | Criar turma                |
| PUT    | /turmas/:id                       | Atualizar turma            |
| DELETE | /turmas/:id                       | Excluir turma              |
| GET    | /alunos                           | Listar alunos              |
| GET    | /alunos/turma/:turmaId            | Alunos de uma turma        |
| POST   | /alunos                           | Cadastrar aluno            |
| PUT    | /alunos/:id                       | Atualizar aluno            |
| DELETE | /alunos/:id                       | Excluir aluno              |
| GET    | /professores                      | Listar professores         |
| POST   | /professores                      | Cadastrar professor        |
| PUT    | /professores/:id                  | Atualizar professor        |
| DELETE | /professores/:id                  | Excluir professor          |
| GET    | /notas/aluno/:alunoId             | Boletim do aluno           |
| POST   | /notas                            | Lançar nota                |
| PUT    | /notas/:id                        | Atualizar nota             |
| DELETE | /notas/:id                        | Excluir nota               |
