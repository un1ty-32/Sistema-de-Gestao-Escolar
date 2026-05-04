const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /auth/login
async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const usuario = rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha); // ✅ corrigido

    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil }, // ✅ corrigido
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,       // ✅ corrigido
        nome: usuario.nome,
        email: usuario.email, // ✅ corrigido
        perfil: usuario.perfil
      }
    });

  } catch (err) {
    console.error('ERRO LOGIN:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

// POST /auth/registrar
async function registrar(req, res) {
  const { nome, email, senha, perfil } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);

    if (existe.length > 0) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, hash, perfil || 'secretaria']
    );

    res.status(201).json({ id: result.insertId, nome, email });

  } catch (err) {
    console.error('ERRO REGISTRAR:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

module.exports = { login, registrar };