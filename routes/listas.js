const express = require('express');
const router = express.Router();
const helper = require('../helpers/geral.helper');
const db = require("../models");

router.get('/', (req, res) => {
   res.render('listas/listar', { title: 'Listas de Compras' });
});

router.get('/add', (req, res) => {
   res.send("ADD rota das listas de compras");
});

module.exports = router;
