var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/t', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/test/t.ejs'));
});

router.get('/error', function(req, res) {
  res.render('errors/general');
});

module.exports = router;
