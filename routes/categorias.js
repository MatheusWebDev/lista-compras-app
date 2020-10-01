const express = require('express');
const router = express.Router();
const db = require("../models");

router.route('/')
    // Rotas que Lista as CATEGORIAS (usuario comum)
    .get((req, res) => {
        db.Category.find((err, categories) => {
            if (err) return res.send(err);
            categories.forEach(cat => {
                db.Item.find({ category: cat.title }, "_id", (err, itens) => {
                    if (err) return res.send(err);
                    cat.qtdItens = itens.length;
                    cat.save((err) => {
                        if (err) return res.send(err);
                    });
                });
            });
            res.render('categories/list', {
                title: 'Categorias',
                categories
            });
        });
    })
    // Rota que ADICIONA uma nova CATEGORIA
    .post((req, res) => {
        req.checkBody('title', 'Campo TITULO é obrigatorio').notEmpty();
        let errors = req.validationErrors();

        if (errors) {
            res.render('categories/form', { title: 'Add Categoria', errors });
        } else {
            let newCategory = new db.Category({ title: req.body.title });
            if (req.body.desc) newCategory.desc = req.body.desc;

            db.Category.create(newCategory, (err, category) => {
                if (err) {
                    res.render('categories/form', { title: 'Editar Categoria', errors });
                }
                req.flash('sucess_msg', 'Categoria adicionada com sucesso');
                res.redirect('/categorias/gerenciar');
            });
        }
    });

// Lista as CATEGORIAS para gerenciar (ADMIN -> edit e delete)
router.get('/gerenciar', (req, res) => {
    db.Category.find((err, categories) => {
        if (err) return res.send(err);
        res.render('categories/list-gerec', {
            title: 'Gerenciar Categorias',
            categories
        });
    });
});

// Formulário para ADICIONAR nova CATEGORIA
router.get('/new', (req, res) => {
    res.render('categories/form', { title: 'Add Categoria' });
});

// Formulário para EDITAR uma CATEGORIA
router.get('/:id/edit', (req, res) => { // EDIT form
    db.Category.findById(req.params.id, (err, category) => {
        if (err) return res.send(err);
        res.render('categories/form', { title: 'Editar Categoria', category: category });
    });
});

// Rotas de EDITAR e DELETAR uma CATEGORIA
router.route('/:id')
    // EDITAR
    .put((req, res) => {
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
    })
    // DELETAR
    .delete((req, res) => {
        db.Category.findOneAndDelete({ _id: req.params.id }, null, (err, category) => {
            if (err) return res.send(err);
            req.flash('success_msg', 'Categoria deletada com sucesso');
            res.redirect('/categorias/gerenciar');
        });
    });

module.exports = router;
