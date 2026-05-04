const db = require('../database');

// GET /notas/aluno/:alunoId  — boletim completo
async function boletim(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT n.*, d.nome AS disciplina_nome
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE n.aluno_id = ?
      ORDER BY d.nome, n.bimestre
    `, [req.params.alunoId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar boletim.' });
  }
}

// GET /notas/turma/:turmaId/disciplina/:disciplinaId
async function listarPorTurmaEDisciplina(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT n.*, a.nome AS aluno_nome
      FROM notas n
      JOIN alunos a ON n.aluno_id = a.id
      WHERE a.turma_id = ? AND n.disciplina_id = ?
      ORDER BY a.nome, n.bimestre
    `, [req.params.turmaId, req.params.disciplinaId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar notas.' });
  }
}

// POST /notas
async function lancar(req, res) {
  const { aluno_id, disciplina_id, bimestre, tipo, valor } = req.body;
  if (!aluno_id || !disciplina_id || !bimestre || !tipo || valor === undefined) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }
  if (valor < 0 || valor > 10) {
    return res.status(400).json({ erro: 'A nota deve ser entre 0 e 10.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO notas (aluno_id, disciplina_id, bimestre, tipo, valor) VALUES (?, ?, ?, ?, ?)',
      [aluno_id, disciplina_id, bimestre, tipo, valor]
    );
    res.status(201).json({ id: result.insertId, mensagem: 'Nota lançada com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao lançar nota.' });
  }
}

// PUT /notas/:id
async function atualizar(req, res) {
  const { valor, tipo } = req.body;
  if (valor < 0 || valor > 10) {
    return res.status(400).json({ erro: 'A nota deve ser entre 0 e 10.' });
  }
  try {
    await db.query('UPDATE notas SET valor=?, tipo=? WHERE id=?', [valor, tipo, req.params.id]);
    res.json({ mensagem: 'Nota atualizada com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar nota.' });
  }
}

// DELETE /notas/:id
async function deletar(req, res) {
  try {
    await db.query('DELETE FROM notas WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Nota excluída.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir nota.' });
  }
}

module.exports = { boletim, listarPorTurmaEDisciplina, lancar, atualizar, deletar };
