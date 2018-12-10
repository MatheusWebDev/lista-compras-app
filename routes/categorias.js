const express = require('express');
const router = express.Router();
const helper = require('../helpers/geral.helper');
const db = require("../models");

router.get('/', (req, res) => { // Mostrar Categorias
   db.Category.find((err, categories) => {
      if (err) return res.send(err);
      res.render('categories/list', {
         title: 'Categorias',
         categories
      });
   });
});


router.get('/gerenciar', (req, res) => { // Gerenciar categorias
   db.Category.find((err, categories) => {
      if (err) return res.send(err);
      res.render('categories/list-gerec', {
         title: 'Gerenciar Categorias',
         categories
      });
   });
});

router.route('/add')
   .get((req, res) => {
      res.render('categories/form', { title: 'Add Categoria' });
   })
   .post((req, res) => {
      req.checkBody('title', 'Campo TITULO é obrigatorio').notEmpty();
      let errors = req.validationErrors();

      let newCategory = new db.Category({ title: req.body.title });
      if (req.body.desc) newCategory.desc = req.body.desc;

      db.Category.create(newCategory, (err, category) => {
         if (err) {
            res.render('categories/form', { title: 'Editar Categoria', errors });
         }
         req.flash('sucess_msg', 'Categoria adicionada com sucesso');
         res.redirect('/categorias/gerenciar');
      });
   });

router.route('/edit/:id')
   .get((req, res) => { // EDIT form
      db.Category.findById(req.params.id, (err, category) => {
         if (err) return res.send(err);
         res.render('categories/form', { title: 'Editar Categoria', category: category });
      });
   })
   .put((req, res) => { // EDIT action
      req.checkBody('title', 'Campo TITULO é obrigatorio').notEmpty();
      let errors = req.validationErrors();

      let update = { title: req.body.title };

      if (req.body.desc) update.desc = req.body.desc;
      db.Category.findOneAndUpdate(req.params.id, update, (err, category) => {
         if (err) {
            res.render('categories/form', { title: 'Editar Categoria', errors });
         }
         req.flash('sucess_msg', 'Categoria atualizada com sucesso');
         res.redirect('/categorias/gerenciar');
      });
   });

router.delete('/del/:id', (req, res) => { // DELETE action
   db.Category.findOneAndDelete(req.params.id, (err, category) => {
      if (err) return res.send(err);
      req.flash('success_msg', 'Categoria deletada com sucesso');
      res.redirect('/categorias/gerenciar');
   });
});

module.exports = router;
