var db = require('../controllers/db.js').db;
var path = require('path');
var ref;

module.exports = async function visitCount(req, res, next) {
    
    if (req.path.match(/(\/wp|\/wordpress|^\/bc|^\/bk|^\/old|^\/new|^\/main|^\/home)/i)) {
        res.sendFile(path.resolve('./funny.html'));
        return;
    }

    if (req.get('user-agent').match(/(bot|client|crawl|scan|headless)/i)) {
        res.send("begone bot");
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