var createError = require('http-errors');
var express = require('express');
require('express-async-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
// 在 cookieParser 之后 require。session 是依赖于 cookie 的。
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gistsRouter = require('./routes/gists');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('Samantha'));
app.use(session({
    secret: 'Samantha', // 与cookieParser中的一致
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000 * 24
    },
    store: new FileStore({})
}));



app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/gists',

    (req, res, next) => {
        if (!req.session.user)
            return res.redirect('/users/login');
        else
            next();
    },

    gistsRouter);



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