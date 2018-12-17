const express = require('express');
const router = express.Router();
const helper = require('../helpers/geral.helper');
const db = require("../models");

router.route('/')
	// Rotas que Lista os ITENS (usuario comum)
	.get((req, res) => {
		db.Item.find({}, null, { sort: { 'category': -1 } }, (err, items) => { // Pega todos itens ordenados pela categoria
			if (err) return res.send(err);
			res.render('items/list', {
				title: 'Lista Itens',
				items
			});
		});
	})
	// Rota que ADICIONA um novo ITEM
	.post((req, res) => {
		req.checkBody('name', 'Campo NOME é obrigatorio').notEmpty();
		req.checkBody('category', 'Campo Categoria é obrigatorio').notEmpty();
		let errors = req.validationErrors();

		if (errors) { // Caso haver ERRO, renderiza o formulário novamente com os erros (find categorias para o select)
			db.Category.find({}, (err, categories) => {
				res.render('items/form', { title: 'Add Item', errors, categories });
			});
		} else {
			let newItem = new db.Item({ name: req.body.name, category: req.body.category });

			db.Item.create(newItem, (err, item) => {
				if (err) return res.send(err);
				req.flash('success_msg', 'Item salvo com sucesso');
				res.redirect('/itens/gerenciar');
			});
		}
	});

// Lista os ITENS para gerenciar (ADMIN -> edit e delete)
router.get('/gerenciar', (req, res) => {
	db.Item.find((err, items) => {
		if (err) return res.send(err);
		res.render('items/list-gerec', {
			title: 'Gerenciar Itens',
			items
		});
	});
});

// Lista os Itens pela CATEGORIA
router.get('/categoria/:category', (req, res) => {
	const cat = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
	db.Item.find({ category: cat }, (err, items) => {
		if (err) return res.send(err);
		res.render('items/list', {
			title: 'Lista Itens',
			items
		});
	});
});

// Formulário para ADICIONAR novo ITEM
router.get('/new', (req, res) => {
	db.Category.find((err, categories) => {
		if (err) return res.send(err);
		res.render('items/form', { title: 'Add Item', categories });
	});
});

// Formulário para EDITAR um ITEM
router.get('/:id/edit', (req, res, next) => {
	db.Item.findOne({ _id: req.params.id }, null, (err, item) => {
		if (err) return res.send(err);

		db.Category.find((err, categories) => {
			if (err) return res.send(err);
			res.render('items/form', { title: 'Editar Item', categories, item });
		});
	});
});

// Rotas de EDITAR e DELETAR um ITEM
router.route('/:id')
	// EDITAR
	.put((req, res, next) => {
		const update = {
			name: req.body.name,
			category: req.body.category
		};
		db.Item.findOneAndUpdate({ _id: req.params.id }, update, null, (err, item) => {
			if (err) return res.send(err);
			req.flash('success_msg', 'Item editado com sucesso');
			res.redirect('/itens/gerenciar');
		});
	})
	// DELETAR
	.delete((req, res) => {
		db.Item.findOneAndDelete({ _id: req.params.id }, null, (err, item) => {
			if (err) return res.send(err);
			req.flash('success_msg', 'Item deletado com sucesso');
			res.redirect('/itens/gerenciar');
		});
	});

module.exports = router;
