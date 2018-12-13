const express = require('express');
const router = express.Router();
const helper = require('../helpers/geral.helper');
const db = require("../models");

router.get('/', (req, res) => {
	db.Item.find((err, items) => {
		if (err) return res.send(err);
		res.render('items/list', {
			title: 'Lista Itens',
			items
		});
	});
});

router.get('/gerenciar', (req, res) => {
	db.Item.find((err, items) => {
		if (err) return res.send(err);
		res.render('items/list-gerec', {
			title: 'Gerenciar Itens',
			items
		});
	});
});

router.route('/add')
	.get((req, res) => {
		db.Category.find((err, categories) => {
			if (err) return res.send(err);
			res.render('items/form', { title: 'Add Item', categories });
		});
	})
	.post((req, res) => {
		req.checkBody('name', 'Campo NOME é obrigatorio').notEmpty();
		req.checkBody('category', 'Campo Categoria é obrigatorio').notEmpty();
		let errors = req.validationErrors();

		if (errors) {
			db.Category.find({}, (err, allCats) => {
				res.render('items/form', { title: 'Add Item', errors, categories: allCats });
			});
		} else {
			let newItem = new db.Item({
				name: req.body.name
			});

			if (req.body.category) {
				newItem.category = req.body.category;
			}

			db.Item.create(newItem, (err, item) => {
				if (err) return res.send(err);
				req.flash('success_msg', 'Item salvo com sucesso');
				res.redirect('/itens');
			});
		}
	});


router.route('/edit/:id')
	.get((req, res, next) => {
		db.Item.findOne({ _id: req.params.id }, null, (err, item) => {
			if (err) {
				res.send(err);
			}
			db.Category.find((err, categories) => {
				if (err) return res.send(err);
				res.render('items/form', { title: 'Editar Item', categories, item });
			});
		});
	})
	.put((req, res, next) => {
		const update = {
			name: req.body.name,
			category: req.body.category
		};
		db.Item.findOneAndUpdate({ _id: req.params.id }, update, null, (err, item) => {
			if (err) {
				res.send(err);
			}
			req.flash('success_msg', 'Item editado com sucesso');
			res.redirect('/itens');
		});
	});


router.delete('/del/:id', (req, res) => {
	db.Item.findOneAndDelete({ _id: req.params.id }, null, (err, item) => {
		if (err) return res.send(err);
		req.flash('success_msg', 'Item deletado com sucesso');
		res.redirect('/itens');
	});
});

module.exports = router;
