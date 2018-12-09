const express = require("express"),
      expressValidator = require('express-validator'),
      methodOverride = require('method-override'),
      bodyParser = require("body-parser"),
      passport = require('passport'),
      mongoose = require("mongoose"),
      session = require('express-session'),
      helper = require('./helpers/geral.helper'),
      flash = require('connect-flash'),
      path = require('path'),
      ejs = require('ejs'),
      app = express();
const PORT = process.env.PORT || 3000;

// Requiring routes
const indexRoutes = require("./routes/index");
const itemRoutes = require("./routes/items");
const listRoutes = require("./routes/listas");

// View Engine
app.set('view engine', 'ejs');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Method-Override Middleware => override HTTP verbs having '?_method=DELETE'
app.use(methodOverride('_method'));

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
  next();
});

// Express Validator
app.use(expressValidator({
   errorFormatter: (param, msg, value) => {
       let namespace = param.split('.')
       , root    = namespace.shift()
       , formParam = root;
 
     while(namespace.length) {
       formParam += '[' + namespace.shift() + ']';
     }
     return {
       param : formParam,
       msg   : msg,
       value : value
     };
   }
 }));


app.use('/', indexRoutes);
app.use('/itens', itemRoutes);
app.use('/listas', listRoutes);


app.listen(PORT, () => {
    console.log(`App rodando na porta ${PORT}`);
});