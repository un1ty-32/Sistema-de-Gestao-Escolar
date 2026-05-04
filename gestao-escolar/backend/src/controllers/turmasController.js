const db = require('../database');

// GET /turmas
async function listar(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT t.*, p.nome AS professor_nome
      FROM turmas t
      LEFT JOIN professores p ON t.professor_id = p.id
      ORDER BY t.ano_letivo DESC, t.nome
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar turmas.' });
  }
}

// GET /turmas/:id
async function buscarPorId(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT t.*, p.nome AS professor_nome
      FROM turmas t
      LEFT JOIN professores p ON t.professor_id = p.id
      WHERE t.id = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar turma.' });
  }
}

// POST /turmas
async function criar(req, res) {
  const { nome, serie, turno, ano_letivo, professor_id } = req.body;
  if (!nome || !serie || !turno || !ano_letivo) {
    return res.status(400).json({ erro: 'Nome, série, turno e ano letivo são obrigatórios.' });
  }

  try {
    const [existe] = await db.query(
      'SELECT id FROM turmas WHERE nome = ? AND ano_letivo = ?',
      [nome, ano_letivo]
    );
    if (existe.length > 0) {
      return res.status(409).json({ erro: 'Já existe uma turma com esse nome neste ano letivo.' });
    }

    const [result] = await db.query(
      'INSERT INTO turmas (nome, serie, turno, ano_letivo, professor_id) VALUES (?, ?, ?, ?, ?)',
      [nome, serie, turno, ano_letivo, professor_id || null]
    );
    res.status(201).json({ id: result.insertId, nome, serie, turno, ano_letivo });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar turma.' });
  }
}

// PUT /turmas/:id
async function atualizar(req, res) {
  const { nome, serie, turno, ano_letivo, professor_id } = req.body;
  try {
    const [existe] = await db.query('SELECT id FROM turmas WHERE id = ?', [req.params.id]);
    if (existe.length === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });

    await db.query(
      'UPDATE turmas SET nome=?, serie=?, turno=?, ano_letivo=?, professor_id=? WHERE id=?',
      [nome, serie, turno, ano_letivo, professor_id || null, req.params.id]
    );
    res.json({ mensagem: 'Turma atualizada com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar turma.' });
  }
}

// DELETE /turmas/:id
async function deletar(req, res) {
  try {
    const [alunos] = await db.query('SELECT id FROM alunos WHERE turma_id = ?', [req.params.id]);
    if (alunos.length > 0) {
      return res.status(400).json({ erro: 'Não é possível excluir uma turma com alunos vinculados.' });
    }

    await db.query('DELETE FROM turmas WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Turma excluída com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir turma.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
