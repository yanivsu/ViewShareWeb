var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('mongodb');
var flash = require('connect-flash');
var mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var exoressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var db = mongoose.connection;

const Handlebars = require('handlebars');


mongoose.connect('mongodb://localhost:27017/');

var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var userRouter = require('./routes/userImage');

//connect to mongodb database

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Passport init
app.use(passport.initialize());
app.use(passport.session());


//Connect Flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.login_msg = req.flash('login_msg');
  //If the user session connect or no
  res.locals.user = req.user || null;
  next();
});


//Express Validator
app.use(exoressValidator({
  errorFormatter(param, msg, value) {
    var namespace = param.split('.')
        ,root = namespace.shift()
        ,formParam = root;
    while (namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

app.use('/user',userRouter);
app.use('/', indexRouter);
app.use('/upload',uploadRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// default options
app.use(fileUpload());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message = req.flash('login_msg');
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
