var express = require('express');
var router = express.Router();


var links = {"https://e621.net":"e621", "https://fennec.lol":"fenc", "https://balls.com":"balls !!!", "https://fart.com":"ass", "":""};
var css = "696969";


router.get('/', function(req, res) {
  res.render('pages/homepage', {links: links, css: css});
});


module.exports = router;
