const express = require('express');
const router = express.Router();
const helper = require('../helpers/geral.helper');
const db = require("../models");

router.route('/')
    // Lista as LISTAS DE COMPRAS
    .get((req, res) => {
        db.Lista.find({}, null, (err, listas) => {
            if (err) return res.send(err);
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
            res.render('listas/form-add-item', { title: 'Add Itens na Lista: ', lista, itens });
        });
    });
});

// Rota que adiciona os ITENS na LISTA DE COMPRAS
router.post('/:id/itens', (req, res) => {
    db.Lista.findOne({ _id: req.params.id }, null, (err, lista) => {
        if (err) return res.send(err);
        const size = Object.getOwnPropertyNames(req.body.selectedItens);
        if (size.length > 60) {
            // Extract Name ID e Category do ITEM | & | Adiciona na LISTA DE COMPRAS
            helper.addItemToList(req.body.selectedItens, lista);
            res.redirect('/listas');
        } else {
            req.body.selectedItens.forEach(select => {
                // Extract Name ID e Category do ITEM | & | Adiciona na LISTA DE COMPRAS
                helper.addItemToList(select, lista);
            });
            res.redirect('/listas');
        }
    });
});

// Rota que deleta TODOS os ITENS na LISTA DE COMPRAS
router.delete('/:id/itens', (req, res) => {
    db.Lista.findOne({ _id: req.params.id }, null, (err, lista) => {
        if (err) return res.send(err);
        lista.itens = [];
        lista.save(err => {
            err ? console.log(err) : req.flash('success_msg', 'Itens deletados com sucesso');
        });
        res.redirect('/listas');
    });
});

// Rota que deleta ITENS na LISTA DE COMPRAS
router.delete('/:id/itens/:name', (req, res) => {
    db.Lista.findOne({ _id: req.params.id }, null, (err, lista) => {
        if (err) return res.send(err);
        lista.itens = lista.itens.filter(item => {
            if (item.name !== req.params.name) {
                return item;
            }
        });
        lista.save(err => {
            if (!err) res.redirect('/listas');
        });
    });
});

// Formulário para ADD preço/qtd no ITEM da LISTA DE COMPRAS
router.get('/:id/item/:name/edit', (req, res) => {
    db.Lista.findOne({ _id: req.params.id }, null, (err, lista) => {
        if (err) return res.send(err);
        const itemEdit = lista.itens.filter(item => {
            //let idItemObj = helper.toObjId(req.params.iditem);
            if (item.name === req.params.name) {
                console.log("entrou")
                return item;
            }
        });
        console.log(itemEdit);
        res.render('listas/form-add-price-item', { title: 'Editar Item da Lista de Compra', itemEdit: itemEdit[0], lista });
    });
});

// Rota que salva preço/qtd do ITEM da LISTA DE COMPRAS
router.put('/:id/item/:name', (req, res) => {
    db.Lista.findOne({ _id: req.params.id }, null, (err, lista) => {
        if (err) return res.send(err);
        lista.itens = lista.itens.map(item => {
            if (item.name === req.params.name) {
                item.price = req.body.price.replace(',', '.');
                item.amount = req.body.amount;
                return item;
            } else {
                return item;
            }
        });
        lista.save(err => {
            if (err) return res.send(err);
            req.flash('success_msg', 'Item editado com sucesso');
            res.redirect('/listas');
        });
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
