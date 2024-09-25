const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bcrypt = require('bcrypt');

const indexRouter = require('./routes/index');
const logInRouter = require('./routes/login');
const newAdRouter = require('./routes/newAd');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const outRouter = require('./routes/logout');
const searchRouter = require('./routes/search');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:"somesecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 10 * 60 * 1000}
}));

// middleware
username = function (req, res, next)  {
    next();
}


app.use('/', indexRouter);
app.use('/login', logInRouter);
app.use('/new-ad', newAdRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/logout', outRouter);
app.use('/search', searchRouter);

const db = require('./models/index');
db.sequelize.sync().then(() => {
      console.log('Database Synced');
      return Promise.all([
        db.User.findOrCreate({
          where: {login: 'admin'},
          defaults: {login: 'admin', password: 'admin'}
        }),
        db.User.findOrCreate({
          where: {login: 'admin2'},
          defaults: {login: 'admin2', password: 'admin2'}
        })
      ]);
    }).then(() => {
  console.log('Admin user created');
}).catch((err) => {
  console.log('Error syncing database or creating admin users');
  console.log(err);
});


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

    res.render('error', {
        title: 'error', logout: (req.session.username),
        error: err, msg: ""});
});


module.exports = app;
