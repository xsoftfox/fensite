var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs');
var http2 = require('http2');
var https = require('https');
require('dotenv').config();
var session = require('express-session');
var app = express();
var server = app.listen(80, "::");

app.use(session({ secret: 'big fat balls', resave: false, saveUninitialized: true, httpOnly: true, cookie: { maxAge: 3600000, sameSite: true }}))
var visitCount = require('./middleware/visitCount.js');
app.use(visitCount);

var io = require('socket.io')(server, { path: '/chat/socket.io'});
global.io = io;
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', '10.10.10.1');
app.disable('x-powered-by');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));


app.get('/', function(req, res) {
  res.render('pages/index');
});

var apiRouter = require('./routes/api');
var chatRouter = require('./routes/chat');
var testRouter = require('./routes/test');
var filesRouter = require('./routes/files');
var streamRouter = require('./routes/stream');
var statsRouter = require('./routes/stats');
var homepageRouter = require('./routes/homepage');

app.use('/api', apiRouter);
app.use('/chat', chatRouter);
app.use('/test', testRouter);
app.use('/files', filesRouter);
app.use('/live', streamRouter);
app.use('/stats', statsRouter);
app.use('/homepage', homepageRouter);

app.get('/:url', function(req, res) { 
  var title = req.params['url'];
  res.render('pages/' + title, {title, req})
})

app.get('/:url1/:url2', function(req, res) { 
  var url1 = req.params['url1'];
  var title = req.params['url2'];
  res.render('pages/' + url1 + '/' + title, {title});
})

//custom errors
app.use(function(req, res, next) {
  res.status(404).render('errors/404')
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('errors/general');
  res.render('errors/debug', {
    message: err.message,
    error: err
  });
});

module.exports = app;
