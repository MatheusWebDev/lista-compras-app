const express = require('express');
passport = require("passport"),
LocalStrategy = require('passport-local').Strategy,
router = express.Router();

let User = require('../models/user');

// Home Page - Dashboard
router.get('/', checkIsLogged, (req, res, next) => {
   res.render('index');
});

// Login Form
router.get('/login', (req, res, next) => {
   res.render('login');
});

// Login Processing
router.post('/login', (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
   })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
   req.logout();
   req.flash('success_msg', 'Você foi deslogado');
   res.redirect('/login');
});

// Register Form
router.get('/register', (req, res, next) => {
   res.render('register');
});

// Process Register
router.post('/register', (req, res, next) => {
   console.log(req.body);
   req.checkBody('name', 'Campo NOME é obrigatorio').notEmpty();
   req.checkBody('email', 'Campo E-MAIL é obrigatorio').notEmpty();
   req.checkBody('email', 'Preencha com um endereço de E-MAIL valido').isEmail();
   req.checkBody('username', 'Campo USERNAME é obrigatorio').notEmpty();
   req.checkBody('password', 'Campo SENHA é obrigatorio').notEmpty();
   req.checkBody('password2', 'Senhas não são iguais').equals(req.body.password);

   let errors = req.validationErrors();

   if (errors) {
      res.render('register', {
         errors
      });
   } else {
      const newUser = new User({
         name: req.body.name,
         username: req.body.username,
         email: req.body.email,
         password: req.body.password
      });

      User.registerUser(newUser, (err, user) => {
         if (err) throw err;
         req.flash('success_msg', 'Você está registrado. Pode fazer Login.');
         res.redirect('/login');
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

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
   User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
         return done(null, false, {
            message: 'Usuario não encontrado'
         });
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
         if (err) throw err;
         if (isMatch) {
            return done(null, user);
         } else {
            return done(null, false, {
               message: 'Senha incorreta'
            });
         }
      });
   });
}));

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
   User.getUserById(id, (err, user) => {
      done(err, user);
   });
});


module.exports = router;