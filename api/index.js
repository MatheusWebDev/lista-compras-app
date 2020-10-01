const express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    helper = require('../helpers/geral.helper'),
    User = require("../models/user");

// Rotas LOGIN
router.get('/', helper.checkIsLoggedApi, (req, res, next) => {
    res.json({ message: `Bem vindo(a), ${req.user.name}`, userLogged: req.user });
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.json({ message: `Login efetuado com sucesso! Bem vindo(a), ${req.user.name}.` });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.json({ message: 'Você foi deslogado com sucesso!' });
});

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user)
            return done(null, false, { message: 'O username ou senha está incorreto!' });

        User.comparePassword(password, user.password, isMatch => {
            return isMatch ? done(null, user) :
                done(null, false, { message: 'O username ou senha está incorreto!' });
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
