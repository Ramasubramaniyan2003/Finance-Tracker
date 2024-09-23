var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
let models = require('./models/index')


const passport = require('passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
require('./config/password-setup'); // Passport Google OAuth configuration
require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // Optional, only if you want to use sessions

// Google OAuth login route
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback route
app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/' }),
async (req, res) => {
  try {
    // Extract profile information from Google
    const googleUser = {
      googleId: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };

    // Check if the user already exists in the database
    let user = await models.User.findOne({ where: { email: googleUser.email } });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = await models.User.create({
        // googleId: googleUser.googleId,
        username: googleUser.name,
        email: googleUser.email,
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email },'secret', { expiresIn: '1h' });

    // Redirect to the client with the JWT token (this should be your frontend URL)
    res.redirect(`https://finance-manager-i7w2.onrender.com?token=${token}&email=${user.email}&id=${user.id}`);

  } catch (error) {
    console.error('Error during Google signup:', error);
    res.redirect('/');
  }
}
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', require('./routes/api/user'))
app.use('/transaction', require('./routes/api/transaction'));
app.use('/category', require('./routes/api/category'));
app.use('/dashboard', require('./routes/api/dashboard'))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
