var db = require('../controllers/db.js').db;
var path = require('path');
var ref;

module.exports = async function visitCount(req, res, next) {

    //i cant be botherd to set up a waf
    //the ^.{0,1}$ checks for a lenght of 1 to match / it doesnt work if i just use \/\\ for some reason
    var regex = /(^.{0,1}$|^\/about|^\/api|^\/bg|^\/boxes|^\/chat|^\/credits|^\/ears|^\/favicon|^\/fen|^\/files|^\/honk|^\/icons|^\/ip|^\/mochi|^\/monke|^\/oneko|^\/robots|^\/shart|^\/scripts|^\/stats|^\/styles|^\/test|^\/:3|^\/x3)/i;
    if (!req.path.match(regex)) {
        res.status(404);
        res.render(path.resolve('./views/errors/404'));
        return;
    }

    if (req.get('user-agent') == "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36") {
        res.send("kys");
        return;
    }

    if (req.header('referrer') && req.header('referrer').endsWith('/')) {
        var ref = req.header('referrer').slice(0,-1);
    } else {
        var ref = req.header('referrer') ?? null;
    }
    
    var dbget = await db`
        select
            session
        from stats
        where session = ${req.session.id}
    `
  
//console.log(JSON.stringify(dbget.length));

//it still increments by 1 if i restart the server idk why
//prob cause it gives a new cookie
//i prob need to use a session store or ehatever the docs said but im too lazy
//the cookie expires in an hour anyway it doesnt matter

    var visited = true;

    if (dbget.length != 0) {
        var visited = true;
    } else {
        var visited = false;
    }

    //console.log(visited);
    
    if (!visited) {

        var data = {
            session: req.session.id ?? null,
            path: req.path ?? null,
            useragent: req.get('user-agent') ?? null,
            referrer: ref,
            params: JSON.stringify(req.query) ?? null,
        }

        await db `
        insert into stats ${
            db(data, 'session', 'path', 'useragent', 'referrer', 'params')
        }
        `
    }

    //console.log("AAAAAAA" + JSON.stringify(req.query) + req.session.id + req.session.views);
    
    next();
};