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
			return res.render('items/form', { title: 'Add Item', errors });
		}

		let newItem = new db.Item({
			name: req.body.name
		});

		if (req.body.category) {
			newItem.category = req.body.category;
		}

		db.Item.create(newItem, (err, item) => {
			if (err) return res.send(err);
			db.Category.findOne({ title: req.body.category }, (err, category) => {
				if (err) return res.send(err);
				category.qtdItens++;
				category.save((err, data) => {
					if (err) return res.send(err);
					req.flash('success_msg', 'Item salvo com sucesso');
					res.redirect('/itens');
				});
			});
		});
	});


router.route('/edit/:id')
	.get((req, res, next) => {
		db.Item.findById(req.params.id, (err, item) => {
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
		db.Item.findOneAndUpdate(req.params.id, update, (err, item) => {
			if (err) {
				res.send(err);
			}
			if (item.category == update.category) {
				req.flash('success_msg', 'Item editado com sucesso');
				res.redirect('/itens');
			}
			else {
				db.Category.findOne({ title: item.category }, (err, category1) => {
					if (err) return res.send(err);
					category1.qtdItens--;
					category1.save((err, data) => {
						if (err) return res.send(err);
						db.Category.findOne({ title: update.category }, (err, category2) => {
							category2.qtdItens++;
							category2.save((err, data) => {
								if (err) return res.send(err);
								req.flash('success_msg', 'Item editado com sucesso');
								res.redirect('/itens');
							});
						});
					});
				});
			}
		});
	});


router.delete('/del/:id', (req, res) => {
	db.Item.findOneAndDelete(req.params.id, (err, item) => {
		if (err) return res.send(err);
		db.Category.findOne({ title: item.category }, (err, category) => {
			if (err) return res.send(err);
			category.qtdItens--;
			category.save((err, data) => {
				if (err) return res.send(err);
				req.flash('success_msg', 'Item deletado com sucesso');
				res.redirect('/itens');
			});
		});
	});
});

module.exports = router;
