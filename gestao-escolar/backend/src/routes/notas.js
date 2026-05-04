const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/auth');
const { boletim, listarPorTurmaEDisciplina, lancar, atualizar, deletar } = require('../controllers/notasController');

router.get('/aluno/:alunoId', autenticar, boletim);
router.get('/turma/:turmaId/disciplina/:disciplinaId', autenticar, listarPorTurmaEDisciplina);
router.post('/', autenticar, lancar);
router.put('/:id', autenticar, atualizar);
router.delete('/:id', autenticar, deletar);

module.exports = router;
