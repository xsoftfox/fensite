var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require("path");
var db = require('../controllers/db.js').db;

var fenDir = path.resolve('./fens_test');

router.get('/', function(req, res, next) {
    res.location('/');
  });

  router.get('/random/fen', function(req, res, next) {
    //make this use a db or something later
    fens = fs.readdirSync(fenDir);
    let fen = fens[Math.floor(Math.random() * fens.length)];
    res.setHeader('Content-Type', 'image/jpeg')
    res.sendFile(fenDir + '/' + fen);
    res.end;
  });

router.get('/time', function(req, res, next) {
    let time = new Date();
    res.send(time);
});

router.post('/dbread', async (req, res) => {
  var data = await db`
  select
    text
  from fart
    where text is not null
`
  res.json(data);
});

//no error handling fuck it we ball

router.post('/dbwrite', async (req, res) => {
  var data = await db`
    insert into fart
      (text)
    values
      (${ req.body.text })
    returning text
  `
  res.json(await data);
});

//https://www.npmjs.com/package/postgres#queries

module.exports = router;