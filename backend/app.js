var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); // This now includes google-login and getUserDetails

var app = express();

// Add this middleware before defining routes
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// Mount routers
app.use('/', indexRouter);
app.use('/users', usersRouter); // All user-related routes, including google-login

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // For API endpoints, send JSON 404
  if (req.originalUrl.startsWith('/users')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // If the request is for an API endpoint, send JSON
  if (req.originalUrl.startsWith('/users')) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  } else {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
