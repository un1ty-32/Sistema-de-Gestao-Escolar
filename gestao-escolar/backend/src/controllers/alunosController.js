const db = require('../database');

// GET /alunos
async function listar(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT a.*, t.nome AS turma_nome
      FROM alunos a
      LEFT JOIN turmas t ON a.turma_id = t.id
      ORDER BY a.nome
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar alunos.' });
  }
}

// GET /alunos/:id
async function buscarPorId(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT a.*, t.nome AS turma_nome
      FROM alunos a
      LEFT JOIN turmas t ON a.turma_id = t.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar aluno.' });
  }
}

// POST /alunos
async function criar(req, res) {
  const { nome, cpf, data_nascimento, email, responsavel, turma_id } = req.body;
  if (!nome || !cpf || !data_nascimento) {
    return res.status(400).json({ erro: 'Nome, CPF e data de nascimento são obrigatórios.' });
  }

  try {
    const [existe] = await db.query('SELECT id FROM alunos WHERE cpf = ?', [cpf]);
    if (existe.length > 0) {
      return res.status(409).json({ erro: 'CPF já cadastrado.' });
    }

    const [result] = await db.query(
      'INSERT INTO alunos (nome, cpf, data_nascimento, email, responsavel, turma_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, cpf, data_nascimento, email || null, responsavel || null, turma_id || null]
    );
    res.status(201).json({ id: result.insertId, nome, cpf });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar aluno.' });
  }
}

// PUT /alunos/:id
async function atualizar(req, res) {
  const { nome, cpf, data_nascimento, email, responsavel, turma_id } = req.body;
  try {
    const [existe] = await db.query('SELECT id FROM alunos WHERE id = ?', [req.params.id]);
    if (existe.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });

    await db.query(
      'UPDATE alunos SET nome=?, cpf=?, data_nascimento=?, email=?, responsavel=?, turma_id=? WHERE id=?',
      [nome, cpf, data_nascimento, email || null, responsavel || null, turma_id || null, req.params.id]
    );
    res.json({ mensagem: 'Aluno atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar aluno.' });
  }
}

// DELETE /alunos/:id
async function deletar(req, res) {
  try {
    await db.query('DELETE FROM alunos WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Aluno excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir aluno.' });
  }
}

// GET /alunos/turma/:turmaId
async function listarPorTurma(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM alunos WHERE turma_id = ? ORDER BY nome',
      [req.params.turmaId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar alunos da turma.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar, listarPorTurma };
