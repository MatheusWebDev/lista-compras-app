const express = require("express"),
      expressValidator = require('express-validator'),
      methodOverride = require('method-override'),
      bodyParser = require("body-parser"),
      handlebars = require('express-handlebars'),
      passport = require('passport'),
      mongoose = require("mongoose"),
      session = require('express-session'),
      flash = require('connect-flash'),
      path = require('path'),
      app = express();
const PORT = process.env.PORT || 3000;

// Requiring routes
const indexRoutes = require("./routes/index");
const itemRoutes = require("./routes/items");

// View Engine
app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

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
app.use('/items', itemRoutes);


app.listen(PORT, () => {
    console.log(`App rodando na porta ${PORT}`);
});