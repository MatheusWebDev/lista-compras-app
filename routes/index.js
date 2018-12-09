const express = require('express'),
passport = require("passport"),
LocalStrategy = require('passport-local').Strategy,
helper = require('../helpers/geral.helper'),
router = express.Router(),
db = require("../models");

// Home Page - Dashboard
router.get('/', helper.checkIsLogged, (req, res, next) => {
   res.render('index', { title: "Home"});
});

router.route('/login')
   // Login Form
   .get((req, res, next) => {
      res.render('login', { title: "Login"});
   })
   // Login Processing
   .post((req, res, next) => {
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
   res.render('register', { title: "Registrar"});
});

// Process Register
router.post('/register', (req, res, next) => {
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
      const newUser = new db.User({
         name: req.body.name,
         username: req.body.username,
         email: req.body.email,
         password: req.body.password
      });

      db.User.registerUser(newUser, (err, user) => {
         if (err) throw err;
         req.flash('success_msg', 'Você está registrado. Pode fazer Login.');
         res.redirect('/login');
      });
   }
});

// Access Control
// function checkIsLogged(req, res, next) {
//    if (req.isAuthenticated()) {
//       return next();
//    } else {
//       req.flash('error_msg', 'Você não está autorizado a visualizar esta página');
//       res.redirect('/login');
//    }
// }

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
   db.User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
         return done(null, false, {
            message: 'Usuario não encontrado'
         });
      }

      db.User.comparePassword(password, user.password, (err, isMatch) => {
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
   db.User.getUserById(id, (err, user) => {
      done(err, user);
   });
});


module.exports = router;