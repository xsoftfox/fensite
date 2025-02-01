var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var http2 = require('http2');
var https = require('https');
require('dotenv').config()
var expressSession = require('express-session');
var expressVisitorCounter = require('express-visitor-counter');
var { MongoClient } = require('mongodb');

(async () => {
  var dbConnection = await MongoClient.connect('mongodb://127.0.0.1:27017/stats');
  var coll = dbConnection.db().collection('visits');

  var app = express();
  app.enable('trust proxy');
  app.use(expressSession({ secret: 'fat balls', resave: false, saveUninitialized: true }));
  app.use(expressVisitorCounter({ collection: coll }));
  var server = app.listen(80, "::");

var io = require('socket.io')(server, { path: '/chat/socket.io'});
global.io = io;

var apiRouter = require('./routes/api');
var chatRouter = require('./routes/chat');
var testRouter = require('./routes/test');
var filesRouter = require('./routes/files');
var streamRouter = require('./routes/stream');
var statsRouter = require('./routes/stats');
var homepageRouter = require('./routes/homepage');

//disabled - ssl handled by proxy
//var sslOptions = {
//  'key' : fs.readFileSync(process.env.SSL_KEY),
//  'cert' : fs.readFileSync(process.env.SSL_CERT)
//}

//https.createServer(sslOptions, app)
//  .listen(443, () => {
//    console.log("https started on port 443");
//  });
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', '10.10.10.1');

app.disable('x-powered-by');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, 'static')));

//redirect http - handled by proxy
//app.use((req, res, next) => {
//  if (req.protocol === 'http') {
//      return res.redirect(301, `https://${req.headers.host}${req.url}`);
//  }
//  next();
//});

app.get('/', function(req, res) {
  res.render('pages/index');
});

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
})();