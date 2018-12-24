const express = require("express"),
    expressValidator = require('express-validator'),
    methodOverride = require('method-override'),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    session = require('express-session'),
    morgan = require('morgan'),
    moment = require('moment'),
    helper = require('./helpers/geral.helper'),
    flash = require('connect-flash'),
    path = require('path'),
    app = express();
const PORT = process.env.PORT || 3000;

// Requiring routes
const indexRoutes = require("./routes/index");
const itemRoutes = require("./routes/itens");
const catRoutes = require("./routes/categorias");
const listRoutes = require("./routes/listas");

// View Engine
app.set('view engine', 'ejs');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Method-Override Middleware => override HTTP verbs having '?_method=DELETE'
app.use(methodOverride('_method'));

// Morgam - Logger
app.use(morgan('dev'));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Express messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.isEmpty = helper.isEmpty;
    res.locals.moment = moment;
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


app.use('/', indexRoutes);
app.use('/itens', helper.checkIsLogged, itemRoutes);
app.use('/categorias', helper.checkIsLogged, catRoutes);
app.use('/listas', helper.checkIsLogged, listRoutes);


app.listen(PORT, () => {
    console.log(`App rodando na porta ${PORT}`);
});
