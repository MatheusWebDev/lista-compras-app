var express = require('express'),
   router = express.Router(),
   helper = require('../helpers/geral.helper'),
   db = require("../models");

router.get('/', (req, res) => {
  db.Item.getItems((err, items) => {
	 if (err) return res.send(err);
	  res.render('items/listar', {
		title: 'Lista Itens',
		items: items
	});
  });
});

router.route('/add')
	.get((req, res) => {
		res.render('items/cadastrar', { title: 'Add Item' });
	})
	.post((req, res) => {
	  req.checkBody('name', 'Campo NOME é obrigatorio').notEmpty();
	
	  let errors = req.validationErrors();
	  
	  if (errors) {
		  res.render('items/cadastrar', { title: 'Add Item', errors: errors });
	  } else {
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
	

router.get('/edit/:id', (req, res, next) => {
  const query = {_id: req.params.id}
  const updateItem = {
    title: req.body.name
  }
  db.Item.update(query, updateItem, (err, item) => {
    if(err){
      res.send(err);
    }
    res.redirect('/itens');
  });
});

router.post('/edit/:id', (req, res, next) => {
  const query = {_id: req.params.id}
  const updateItem = {
    title: req.body.name
  }
  db.Item.update(query, updateItem, (err, item) => {
    if(err){
      res.send(err);
    }
    res.redirect('/itens');
  });
});

router.delete('/del/:id', (req, res) => {
	const query = { _id: req.params.id };
	
	db.Item.delete(query, (err) => {
		if (err) return res.send(err);
		req.flash('success_msg', 'Item deletado com sucesso');
		res.redirect('/itens');
	});	
});

module.exports = router;