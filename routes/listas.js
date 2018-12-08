var express = require('express'),
   router = express.Router(),
   helper = require('../helpers/geral.helper'),
   db = require("../models");
   
router.get('/', helper.checkIsLogged, (req, res) => {
   res.send("GET é rota das listas de compras"); 
});

router.get('/add', (req, res) => {
   res.send("ADD rota das listas de compras"); 
});

module.exports = router;