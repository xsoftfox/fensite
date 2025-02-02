var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');

//var conn = mongoose.createConnection("mongodb://127.0.0.1:27017/stats");
//var visitSchema = new mongoose.Schema({id: String, value: Number}, {collection: "visits"});
//var visitCounters = conn.model("visits", visitSchema);

var ref = {"balls.com":"69", "ass.com":"1", "goog.com":"621", "e621.net":"4358763489756"};
var ua = {"firefox":"2","chrome":"4","internet explorer":"87"};
var visits = {total:"349085732489057"};

router.get('/', async function(req, res) {
    res.render("pages/stats", {visits: visits, ref: ref, ua: ua,});
  });
  
//this is fucking atrocious but it works

module.exports = router;