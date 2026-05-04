const db = require('../database');

async function listar(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM professores ORDER BY nome');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar professores.' });
  }
}

async function buscarPorId(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM professores WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar professor.' });
  }
}

async function criar(req, res) {
  const { nome, cpf, email, formacao } = req.body;
  if (!nome || !cpf || !email) {
    return res.status(400).json({ erro: 'Nome, CPF e e-mail são obrigatórios.' });
  }

  try {
    const [existe] = await db.query('SELECT id FROM professores WHERE cpf = ? OR email = ?', [cpf, email]);
    if (existe.length > 0) {
      return res.status(409).json({ erro: 'CPF ou e-mail já cadastrado.' });
    }

    const [result] = await db.query(
      'INSERT INTO professores (nome, cpf, email, formacao) VALUES (?, ?, ?, ?)',
      [nome, cpf, email, formacao || null]
    );
    res.status(201).json({ id: result.insertId, nome, cpf, email });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar professor.' });
  }
}

async function atualizar(req, res) {
  const { nome, cpf, email, formacao } = req.body;
  try {
    const [existe] = await db.query('SELECT id FROM professores WHERE id = ?', [req.params.id]);
    if (existe.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });

    await db.query(
      'UPDATE professores SET nome=?, cpf=?, email=?, formacao=? WHERE id=?',
      [nome, cpf, email, formacao || null, req.params.id]
    );
    res.json({ mensagem: 'Professor atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar professor.' });
  }
}

async function deletar(req, res) {
  try {
    await db.query('DELETE FROM professores WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Professor excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir professor.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
