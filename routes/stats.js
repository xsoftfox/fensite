var express = require('express');
var router = express.Router();
var db = require('../controllers/db.js').db;

router.get('/', async function(req, res) {

  var visits = await db`
    select count(*) as count from stats
    `
  var visitstoday = await db`
    select count(date) from stats where date = CURRENT_DATE group by date
  `
  var visitsavg = await db`
  select AVG(ass.count) AS visitsavg
  from (
    select count(date)
    from stats
    group by date
  ) ass
  `
   //i didnt expect this to just work holy shit
  var visitsGraph = await db`
  select right(left(date::varchar(255), 10), -5) as date, count(date) from stats group by date order by date asc limit 30
  `
  var path = await db`
    select path, count(*) as count from stats group by path order by count desc
    `
  var useragent = await db`
    select useragent, count(*) as count from stats group by useragent order by count desc
    `
  var referrer = await db`
    select referrer, count(*) as count from stats where referrer not like '%fennec.lol%' group by referrer order by count desc
    `
  var params = await db`
    select params, count(*) as count from stats group by params order by count desc
    `

  //console.log(visitsGraph);

  res.render("pages/stats", {visits: visits[0].count, visitstoday: visitstoday[0].count, visitsavg: visitsavg[0].visitsavg, visitsGraph: visitsGraph, path: path, useragent: useragent, referrer: referrer, params: params});
  });


module.exports = router;