var express = require('express'),
   router = express.Router(),
   helper = require('../helpers/geral.helper'),
   db = require("../models");
   
router.get('/', (req, res) => {
   res.render('listas/listar', { title: 'Listas de Compras' }); 
});

router.get('/add', (req, res) => {
   res.send("ADD rota das listas de compras"); 
});

module.exports = router;