var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var sanitize = require('sanitize-html');


router.get('/', function(req, res) {
    res.render('pages/chat');
});

var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/chat?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5', {
});

var Chats = conn.model("chat", {
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

router.get("/messages", async (req, res) => {
  var chats = await Chats.find();
  res.send(chats);
})

var sanitizeOptions = {
  allowedTags: [ 'img', 'video', 'audio', 'a', 'br', 'b', 'i', 'u' ],
  allowedAttributes: {
    'a': [ 'href' ],
    'img': [ 'src', 'alt', 'width'],
    'video': [ 'src', 'alt', 'width', 'controls', 'loop',],
    'audio': [ 'src', 'alt', 'controls', 'loop',]
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
      var sanitized = {user: saniUser , message: saniMessage};

      var chat = new Chats(sanitized);
      await chat.save();
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