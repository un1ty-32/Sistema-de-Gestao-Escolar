const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', require('./routes/auth'));
app.use('/turmas', require('./routes/turmas'));
app.use('/alunos', require('./routes/alunos'));
app.use('/professores', require('./routes/professores'));
app.use('/notas', require('./routes/notas'));

app.get('/', (req, res) => {
  res.json({ message: 'API Gestão Escolar funcionando! 🎓' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});