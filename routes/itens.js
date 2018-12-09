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

router.route('/add')
	.get((req, res) => {
		res.render('items/form', { title: 'Add Item' });
	})
	.post((req, res) => {
		req.checkBody('name', 'Campo NOME é obrigatorio').notEmpty();

		let errors = req.validationErrors();

		if (errors) {
			res.render('items/form', { title: 'Add Item', errors });
		}
		else {
			let newItem = new db.Item({
				name: req.body.name
			});
			if (req.body.category) newItem.category = req.body.category;

			db.Item.create(newItem, (err, item) => {
				if (err) return res.send(err);
				req.flash('success_msg', 'Item salvo com sucesso');
				res.redirect('/itens');
			});
		}
	});


router.route('/edit/:id')
	.get((req, res, next) => {
		db.Item.findById(req.params.id, (err, item) => {
			if (err) {
				res.send(err);
			}
			res.render('items/form', { title: 'Editar Item', item });
		});
	})
	.put((req, res, next) => {
		const update = {
			name: req.body.name,
			category: req.body.category
		};
		db.Item.findOneAndUpdate(req.params.id, update, (err, item) => {
			if (err) {
				res.send(err);
			}
			res.redirect('/itens');
		});
	});


router.delete('/del/:id', (req, res) => {
	db.Item.findOneAndDelete(req.params.id, (err) => {
		if (err) return res.send(err);
		req.flash('success_msg', 'Item deletado com sucesso');
		res.redirect('/itens');
	});
});

module.exports = router;
