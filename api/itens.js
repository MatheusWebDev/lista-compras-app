const express = require('express');
const router = express.Router();
const helper = require('../helpers/item.helper');

// Rotas CRUD Itens API (JSON)
router.route('/')
    .get(helper.getAll)
    .post(helper.create);

router.route('/:id')
    .get(helper.getSingle)
    .put(helper.update)
    .delete(helper.delete);

module.exports = router;
