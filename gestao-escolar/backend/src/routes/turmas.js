const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/auth');
const { listar, buscarPorId, criar, atualizar, deletar } = require('../controllers/turmasController');

router.get('/', autenticar, listar);
router.get('/:id', autenticar, buscarPorId);
router.post('/', autenticar, criar);
router.put('/:id', autenticar, atualizar);
router.delete('/:id', autenticar, deletar);

module.exports = router;
