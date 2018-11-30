var express = require('express'),
   router = express.Router(),
   db = require("../models");

router.get('/', checkIsLogged, (req, res) => {
  db.Item.getItems((err, items) => {
     if (err) return res.send(err);
      res.render('index', {
        title: 'Items',
        items: items
    });
  });
});

router.post('/', (req, res, next) => {
  req.checkBody('name', 'Campo NOME é obrigatorio').notEmpty();
  req.checkBody('price', 'Campo PREÇO é obrigatorio').notEmpty();

  let errors = req.validationErrors();
  
  if (errors) {
      res.render('index', { errors: errors });
  } else {
     let newItem = new db.Item({
        name: req.body.name,
        amount: req.body.amount,
        price: req.body.price,
        category: req.body.category
     });
     db.Item.createItem(newItem, (err, item) => {
         if (err) return res.send(err);
         req.flash('success_msg', 'Item salvo');
         res.redirect('/');
     });
  }

});

// Access Control
function checkIsLogged(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   } else {
      req.flash('error_msg', 'Você não está autorizado a visualizar esta página');
      res.redirect('/login');
   }
}


module.exports = router;