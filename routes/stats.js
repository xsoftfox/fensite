var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var conn = mongoose.createConnection("mongodb://127.0.0.1:27017/stats");
var visitSchema = new mongoose.Schema({id: String, value: Number}, {collection: "visits"});
var visitCounters = conn.model("visits", visitSchema);

var ref = {"balls.com":"69", "ass.com":"1", "goog.com":"621", "e621.net":"4358763489756"};
var ua = {"firefox":"2","chrome":"4","internet explorer":"87"};

router.get('/', async function(req, res) {
    //var tits = await visitCounters.find();
    
    var visitsTotal = await visitCounters.aggregate([
      { $match: { id: { $regex: /^v2.fennec.lol-sessions/ } } },
      {$group: { _id: null, total: { $sum: "$value" } } }
    ]);

    var day = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    var reg1 = "v2.fennec.lol-sessions-" + day;
    var visitsToday = await visitCounters.aggregate([
      { $match: { id: reg1 } }
    ]);

    var visitsAvg = await visitCounters.aggregate([
      { $match: { id: { $regex: /^v2.fennec.lol-sessions/ } } },
      {$group: { _id: null, avg: { $avg: "$value" } } }
    ]);

    var visitsTotalUnique = await visitCounters.aggregate([
      { $match: { id: { $regex: /^v2.fennec.lol-visitors/ } } },
      {$group: { _id: null, total: { $sum: "$value" } } }
    ]);

    var reg2 = "v2.fennec.lol-visitors-" + day;
    var visitsTodayUnique = await visitCounters.aggregate([
      { $match: { id: reg2 } }
    ]);

    var visits = {"total": visitsTotal[0].total, "today": visitsToday[0].value, "avg":visitsAvg[0].avg, "totalUnique":visitsTotalUnique[0].total, "todayUnique": visitsTodayUnique[0].value };
    console.log(visits);
    res.render("pages/stats", {visits: visits, ref: ref, ua: ua,});
  });
  
//this is fucking atrocious but it works

module.exports = router;