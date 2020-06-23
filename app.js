const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOveride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // <~~ So we aren't constantly logged out between server restarts
const connectDB = require('./config/db');

const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/handlebars_helpers');

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;

connectDB();

// Passport Config
require('./config/passport')(passport);

const app = express();

// POST body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// HTTP Method Override
app.use(
  methodOveride(function (req, res) { // we can change POST form-action to PUT
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logger:
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Handlebars
app.engine('.hbs',
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: 'main',
    extname: '.hbs'
  })
);
app.set('view engine', '.hbs');

// Passport
app.use(session({
  secret: 'whatevs',
  resave: false, // don't save if there were no chnges
  saveUninitialized: false,// don't create a session if nothing stored
  // cookie: { secure: true } // won't work without https
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

// Set GLOBAL Var:
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth')); // also has auth-check middleware func() calls
app.use('/stories', require('./routes/stories')); // also has auth-check middleware func() calls

app.listen(PORT, () => console.log(`~~~~~~~\nServer up in ${process.env.NODE_ENV} mode on port: ${PORT}`));