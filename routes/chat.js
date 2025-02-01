var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sanitize = require('sanitize-html');
var db = require('../controllers/db.js').db;


router.get('/', function(req, res) {
    res.render('pages/chat');
});


router.get("/messages", async (req, res) => {
  var messages = await db`
  select
    *
  from chat
`
  res.send(messages);
})

router.get("/messages/limit", async (req, res) => {
  var messages = await db`
  select * from 
  (select
    *
  from chat
  order by timestamp desc
  limit 10
  ) s
  order by timestamp asc
`
  res.send(messages);
})

var sanitizeOptions = {
  allowedTags: [ 'img', 'video', 'audio', 'a', 'br', 'b', 'i', 'u' ],
  allowedAttributes: {
    'a': [ 'href' ],
    'img': [ 'src', 'alt', 'width'],
    'video': [ 'src', 'alt', 'width', 'controls', 'loop',],
    'audio': [ 'src', 'alt', 'controls', 'loop',],
    'message': [ 'style' ]
  },
  transformTags: {
    'img': sanitize.simpleTransform('img', {width: '200px'}),
    'video': sanitize.simpleTransform('video', {width: '200px', controls: ''}),
    'audio': sanitize.simpleTransform('audio', {controls: ''})
  },
  disallowedTagsMode: 'recursiveEscape',
  parseStyleAttributes: false
};

var iopath = "/chat";
io = io.of(iopath);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', async (data) => {
    try {
      var saniUser = sanitize(data.user, sanitizeOptions);
      var saniMessage = sanitize(data.message, sanitizeOptions);
      var saniColor = sanitize(data.color, sanitizeOptions);
      var sanitized = {user: saniUser , message: saniMessage , color: saniColor};

      await db`
      insert into chat ${
        db(sanitized, 'user', 'message', 'color')
      }
      `

      io.emit('chat message', sanitized);
      //console.log('wrote' + JSON.stringify(sanitized));
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});
module.exports = router;