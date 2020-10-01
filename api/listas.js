const express = require('express');
const router = express.Router();
const helper = require('../helpers/lista.helper');

// Rotas CRUD Listas API (JSON)
router.route('/')
    .get(helper.getAll)
    .post(helper.create);

router.route('/:id')
    .get(helper.getSingle)
    .put(helper.update)
    .delete(helper.delete);

router.route('/:id/add-item')
    .post(helper.addItem)

router.route('/:id/del-item')
    .delete(helper.delItem);

module.exports = router;
