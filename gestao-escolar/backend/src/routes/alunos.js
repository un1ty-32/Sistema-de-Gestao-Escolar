const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/auth');
const { listar, buscarPorId, criar, atualizar, deletar, listarPorTurma } = require('../controllers/alunosController');

router.get('/', autenticar, listar);
router.get('/turma/:turmaId', autenticar, listarPorTurma);
router.get('/:id', autenticar, buscarPorId);
router.post('/', autenticar, criar);
router.put('/:id', autenticar, atualizar);
router.delete('/:id', autenticar, deletar);

module.exports = router;
