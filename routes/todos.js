var express = require('express'),
   router = express.Router(),
   db = require("../models");

router.route('/')
   .get((req, res) => {
      db.Todo.getTodos((err, todos) => {
         res.render('index', { nome: "teste" });
       }, 10);
   });

module.exports = router;