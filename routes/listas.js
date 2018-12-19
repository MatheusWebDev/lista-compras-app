const express = require('express');
const router = express.Router();
const helper = require('../helpers/geral.helper');
const db = require("../models");
const objId = require('mongoose').Types.ObjectId

router.route('/')
   // Lista as LISTAS DE COMPRAS
   .get((req, res) => {
      db.Lista.find({}, null, (err, listas) => {
         if (err) return res.send(err);
         console.log(listas[0]);
         res.render('listas/listar', { title: 'Listas de Compras', listas });
      });
   })
   // Rota que salva uma nova LISTA DE COMPRA
   .post((req, res) => {
      req.checkBody('name', 'Campo NOME é obrigatorio').notEmpty();
      let errors = req.validationErrors();

      if (errors) { // Caso haver ERRO, renderiza o formulário novamente com os erros
         res.render('listas/form', { title: 'Nova Lista de Compra', errors });
      } else {
         let novaLista = { name: req.body.name, store: req.body.store };

         db.Lista.create(novaLista, (err, lista) => {
            if (err) return res.send(err);
            console.log(lista);
            res.redirect('/listas');
         });
      }
   });

// Formulário para ADICIONAR nova LISTA DE COMPRAS
router.get('/new', (req, res) => {
   res.render('listas/form', { title: 'Nova Lista de Compra' });
});

// Formulário para INSERIR um ITEM na LISTA DE COMPRAS
router.get('/:id/itens/add', (req, res) => {
   db.Lista.findOne({ _id: req.params.id }, null, (err, lista) => {
      if (err) return res.send(err);
      db.Item.find({}, null, (err, itens) => {
         if (err) return res.send(err);
         res.render('listas/form-add-item', { title: 'Add Item na Lista: ', lista, itens });
      })
   });
});

// Rota que adiciona os ITENS na LISTA DE COMPRAS
router.post('/:id/itens', (req, res) => {
   db.Lista.findOne({ _id: req.params.id }, null, (err, lista) => {
      if (err) return res.send(err);
      req.body.selectedItens.forEach(select => {
         var nameStart = select.indexOf("name: \'");
         var nameEnd = select.indexOf("\',\r\n");
         var catStart = select.indexOf("category: \'");
         var catEnd = select.indexOf("\',\r\n  __v:");
         var idStart = select.indexOf("\n  _id: ");
         var idEnd = select.indexOf(",\r\n  n");

         var item = {
            _id: objId(select.slice(idStart + 8, idEnd)),
            name: select.slice(nameStart + 7, nameEnd),
            category: select.slice(catStart + 11, catEnd)
         };
         if (!lista.itens.some(i => i.name === item.name)) {
            lista.itens.push(item);
         }
         lista.save(err => {
            if (!err) console.log("success");
         });
      });
      res.redirect('/listas');
   });
});

// Formulário para EDITAR uma LISTA DE COMPRAS
router.get('/:id/edit', (req, res) => {
   db.Lista.findOne({ _id: req.params.id }, null, (err, lista) => {
      if (err) return res.send(err);
      res.render('listas/form', { title: 'Editar Lista de Compra', lista });
   });
});

// Rotas de EDITAR e DELETAR uma LISTA DE COMPRAS
router.route('/:id')
   // EDITAR
   .put((req, res, next) => {
      const update = {
         name: req.body.name,
         store: req.body.store
      };
      db.Lista.findOneAndUpdate({ _id: req.params.id }, update, null, (err, lista) => {
         if (err) return res.send(err);
         req.flash('success_msg', 'Lista editada com sucesso');
         res.redirect('/listas');
      });
   })
   // DELETAR
   .delete((req, res) => {
      db.Lista.findOneAndDelete({ _id: req.params.id }, null, (err, lista) => {
         if (err) return res.send(err);
         req.flash('success_msg', 'Lista deletada com sucesso');
         res.redirect('/listas');
      });
   });

module.exports = router;
